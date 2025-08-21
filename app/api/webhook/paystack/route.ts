"use server";

import { createSupabaseServerClient } from "@/app/actions/utils";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: Request) {
  const secret = process.env.PAYSTACK_SECRET_KEY!;
  const signature = request.headers.get("x-paystack-signature");
  const body = await request.text();
  const hash = crypto.createHmac("sha512", secret).update(body).digest("hex");
  if (hash !== signature)
    return new Response("Invalid signature", { status: 400 });

  const { event, data } = JSON.parse(body);
  if (event === "charge.success") {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase
      .from("wallet_fundings")
      .update({
        status: "completed",
        payment_reference: data.reference,
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.metadata.funding_id)
      .eq("user_id", data.metadata.user_id);
    if (error) return new Response(error.message, { status: 500 });
  }
  return new Response("OK", { status: 200 });
}
