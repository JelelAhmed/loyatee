"use server";

import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

const fundSchema = z.object({
  amount: z.number().min(100, "Minimum amount is ₦100"),
  paymentMethod: z.enum(["card", "bank_transfer", "ussd"]),
});

export async function fundWallet(
  _prevState: { success: boolean; error: string | null; redirectUrl?: string },
  formData: FormData
) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized" };

  const validated = fundSchema.safeParse({
    amount: Number(formData.get("amount")),
    paymentMethod: formData.get("paymentMethod"),
  });
  if (!validated.success)
    return { success: false, error: validated.error.issues[0].message };

  try {
    // Insert pending funding record
    const { data: funding, error: fundingError } = await supabase
      .from("wallet_fundings")
      .insert({
        user_id: user.id,
        amount: validated.data.amount,
        payment_method: validated.data.paymentMethod,
        status: "pending",
      })
      .select("id")
      .single();
    if (fundingError) throw new Error(fundingError.message);

    // Initiate Paystack payment
    const response = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          amount: validated.data.amount * 100, // Paystack uses kobo
          channels: [validated.data.paymentMethod],
          callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/wallet?reference=${funding.id}`,
          metadata: { user_id: user.id, funding_id: funding.id },
        }),
      }
    );
    const { data } = await response.json();
    if (!data.authorization_url)
      throw new Error("Payment initialization failed");
    return { success: true, error: null, redirectUrl: data.authorization_url };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Payment failed",
    };
  }
}

export async function getWalletBalance() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("users")
    .select("wallet_balance")
    .eq("id", user.id)
    .single();
  if (error) throw new Error(error.message);
  return data.wallet_balance;
}
