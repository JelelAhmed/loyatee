// /app/api/admin/verify-funding/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const { reference } = await req.json();

  if (!reference) {
    return NextResponse.json(
      { success: false, message: "Missing reference" },
      { status: 400 }
    );
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set({ name, value, ...options })
          );
        },
      },
    }
  );

  try {
    // 1️⃣ Verify admin session
    const {
      data: { user: admin },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !admin) {
      throw new Error("Unauthorized or invalid admin session");
    }

    // 2️⃣ Verify payment with Paystack
    const verifyRes = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
      }
    );

    const { data, status } = await verifyRes.json();

    if (!status || !data) {
      throw new Error("Unable to verify transaction with Paystack");
    }

    const paystackStatus = data.status; // "success" | "failed" | "abandoned"
    const amount = data.amount / 100; // Convert from kobo → naira

    // 3️⃣ Find the wallet funding record
    const { data: funding, error: fundingError } = await supabaseAdmin
      .from("wallet_fundings")
      .select("*")
      .eq("payment_reference", reference)
      .maybeSingle();

    if (fundingError) throw fundingError;
    if (!funding)
      throw new Error("Funding record not found for provided reference");

    // 4️⃣ Handle according to Paystack’s result
    if (paystackStatus === "success") {
      // 🟢 Successful payment

      // (a) Update funding record if pending
      const { error: updateError } = await supabaseAdmin
        .from("wallet_fundings")
        .update({
          status: "completed",
          updated_at: new Date().toISOString(),
        })
        .eq("id", funding.id)
        .eq("status", "pending");

      if (updateError) throw updateError;

      // (b) Check for existing transaction
      const { data: existingTx } = await supabaseAdmin
        .from("transactions")
        .select("id")
        .eq("vendor_transaction_id", reference)
        .maybeSingle();

      if (!existingTx) {
        // (c) Create new transaction
        const { error: txError } = await supabaseAdmin
          .from("transactions")
          .insert({
            user_id: funding.user_id,
            type: "wallet_funding",
            amount,
            status: "completed",
            vendor_transaction_id: reference,
            payment_reference: reference,
            funding_id: funding.id,
            payment_method: funding.payment_method,
            vendor_response: data,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            resolved_by: admin.id,
            resolved_at: new Date().toISOString(),
          });

        if (txError) throw txError;

        // (d) Credit wallet balance
        const { error: balanceError } = await supabaseAdmin.rpc(
          "increment_wallet_balance",
          {
            p_user_id: funding.user_id,
            p_amount: amount,
          }
        );
        if (balanceError) throw balanceError;
      }

      // (e) Log activity
      await supabaseAdmin.from("admin_activity_logs").insert({
        admin_id: admin.id,
        action: "VERIFY_FUNDING_MANUAL",
        target_table: "wallet_fundings",
        target_id: funding.id,
        details: {
          reference,
          amount,
          paystack_status: paystackStatus,
          message: data.gateway_response,
        },
      });

      return NextResponse.json({
        success: true,
        message: "Funding verified, wallet credited, and transaction recorded.",
      });
    }

    // 🔴 If failed or abandoned, mark accordingly
    if (["failed", "abandoned"].includes(paystackStatus)) {
      await supabaseAdmin
        .from("wallet_fundings")
        .update({
          status: "failed",
          updated_at: new Date().toISOString(),
        })
        .eq("id", funding.id);

      await supabaseAdmin.from("admin_activity_logs").insert({
        admin_id: admin.id,
        action: "VERIFY_FUNDING_FAILED",
        target_table: "wallet_fundings",
        target_id: funding.id,
        details: {
          reference,
          paystack_status: paystackStatus,
          message: data.gateway_response,
        },
      });

      return NextResponse.json({
        success: true,
        message: `Funding marked as ${paystackStatus}. Wallet not credited.`,
      });
    }

    // 🟡 Catch-all: unexpected states
    return NextResponse.json({
      success: false,
      message: `Unhandled Paystack status: ${paystackStatus}`,
    });
  } catch (err: any) {
    console.error("verifyFundingAdmin error:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Verification failed" },
      { status: 500 }
    );
  }
}
