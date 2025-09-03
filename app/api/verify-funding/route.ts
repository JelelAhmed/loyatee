import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const { reference } = await req.json();

  try {
    const verifyRes = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const { data, status } = await verifyRes.json();
    if (!status || data.status !== "success") {
      throw new Error("Paystack verification failed");
    }

    // ✅ Update funding row
    const supabase = await createSupabaseServerClient();
    await supabase
      .from("wallet_fundings")
      .update({ status: "success" })
      .eq("payment_reference", reference);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 400 }
    );
  }
}
