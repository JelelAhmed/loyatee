"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import crypto from "crypto";

export async function POST(request: Request) {
  const secret = process.env.PAYSTACK_SECRET_KEY!;
  const signature = request.headers.get("x-paystack-signature");
  const body = await request.text();

  const hash = crypto.createHmac("sha512", secret).update(body).digest("hex");
  if (hash !== signature) {
    return new Response("Invalid signature", { status: 400 });
  }

  const { event, data } = JSON.parse(body);

  if (event === "charge.success") {
    const supabase = supabaseAdmin;
    const reference = data.reference;
    const amount = data.amount / 100; // kobo → naira
    const payment_method = data.payment_method;

    try {
      // Step 1: Mark funding as completed (only if still pending)
      const { data: funding, error: fundingError } = await supabase
        .from("wallet_fundings")
        .update({
          status: "completed",
          updated_at: new Date().toISOString(),
        })
        .eq("payment_reference", reference)
        .eq("status", "pending")
        .select("id, user_id, amount")
        .single();

      if (fundingError) throw new Error(fundingError.message);

      // If no pending funding found → already processed
      if (!funding) {
        return new Response("Already processed or invalid reference", {
          status: 200,
        });
      }

      // Step 2: Insert transaction safely (avoid duplicates by vendor_transaction_id)
      const { error: txError } = await supabase.from("transactions").insert(
        {
          user_id: funding.user_id,
          type: "wallet_funding",
          amount,
          payment_method: payment_method,
          status: "completed",
          vendor_transaction_id: reference,
          funding_id: funding.id,
          created_at: new Date().toISOString(),
        },
        { count: "exact" }
      );

      if (txError && txError.code !== "23505") {
        // ignore unique violation, throw others
        throw new Error(txError.message);
      }

      // Step 3: Increment balance ONLY if transaction was new
      if (!txError) {
        const { error: balanceError } = await supabase.rpc(
          "increment_wallet_balance",
          {
            p_user_id: funding.user_id,
            p_amount: amount,
          }
        );
        if (balanceError) throw new Error(balanceError.message);
      }
    } catch (err) {
      console.error("Webhook error:", err);
      return new Response("Webhook failed", { status: 500 });
    }
  }

  return new Response("OK", { status: 200 });
}
