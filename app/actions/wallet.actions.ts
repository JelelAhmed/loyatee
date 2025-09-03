"use server";

import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const fundSchema = z.object({
  amount: z.number().min(100, "Minimum amount is ₦100"),
  paymentMethod: z.enum(["card", "bank_transfer", "ussd"]),
});

//Paystack redirect flow
// export async function fundWallet(
//   _prevState: { success: boolean; error: string | null; redirectUrl?: string },
//   formData: FormData
// ) {
//   const supabase = await createSupabaseServerClient();
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();
//   if (!user) return { success: false, error: "Unauthorized" };

//   const validated = fundSchema.safeParse({
//     amount: Number(formData.get("amount")),
//     paymentMethod: formData.get("paymentMethod"),
//   });
//   if (!validated.success)
//     return { success: false, error: validated.error.issues[0].message };

//   try {
//     // Step 1: Insert funding row (without reference yet)
//     const { data: funding, error: fundingError } = await supabase
//       .from("wallet_fundings")
//       .insert({
//         user_id: user.id,
//         amount: validated.data.amount,
//         payment_method: validated.data.paymentMethod,
//         status: "pending",
//       })
//       .select("id")
//       .single();
//     if (fundingError) throw new Error(fundingError.message);

//     // Step 2: Call Paystack
//     const response = await fetch(
//       "https://api.paystack.co/transaction/initialize",
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           email: "abduljelelahmed@gmail.com",
//           amount: validated.data.amount * 100,
//           channels: [validated.data.paymentMethod],
//           callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/wallet`,
//           metadata: { user_id: user.id, funding_id: funding.id },
//         }),
//       }
//     );
//     const { data } = await response.json();
//     console.log("paystack", data);
//     if (!data?.authorization_url)
//       throw new Error("Payment initialization failed");

//     // Step 3: Save the reference returned by Paystack
//     await supabase
//       .from("wallet_fundings")
//       .update({ payment_reference: data.reference })
//       .eq("id", funding.id);

//     return { success: true, error: null, redirectUrl: data.authorization_url };
//   } catch (error) {
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : "Payment failed",
//     };
//   }
// }
//Working backend flow with inline 50%
// export async function fundWallet(
//   _prevState: { success: boolean; error: string | null; reference?: string },
//   formData: FormData
// ) {
//   const supabase = await createSupabaseServerClient();
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();
//   if (!user) return { success: false, error: "Unauthorized" };

//   const validated = fundSchema.safeParse({
//     amount: Number(formData.get("amount")),
//     paymentMethod: formData.get("paymentMethod"),
//   });
//   if (!validated.success)
//     return { success: false, error: validated.error.issues[0].message };

//   try {
//     console.log("⏳ Starting wallet funding...");

//     const { data: funding, error: fundingError } = await supabase
//       .from("wallet_fundings")
//       .insert({
//         user_id: user.id,
//         amount: validated.data.amount,
//         payment_method: validated.data.paymentMethod,
//         status: "pending",
//       })
//       .select("id")
//       .single();

//     if (fundingError) {
//       console.error("❌ Funding insert error:", fundingError);
//       throw new Error(fundingError.message);
//     }
//     console.log("✅ Funding row created:", funding);

//     // Step 2: Paystack call
//     const response = await fetch(
//       "https://api.paystack.co/transaction/initialize",
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           email: "abduljelelahmed@gmail.com",
//           amount: validated.data.amount * 100,
//           channels: [validated.data.paymentMethod],
//           callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/wallet`,
//           metadata: { user_id: user.id, funding_id: funding.id },
//         }),
//       }
//     );

//     const resJson = await response.json();
//     console.log("🌍 Paystack raw response:", resJson);

//     const { data } = resJson;
//     if (!data?.reference) {
//       console.error("❌ Missing reference from Paystack response:", resJson);
//       throw new Error("Payment initialization failed");
//     }

//     // Step 3: Save reference
//     await supabase
//       .from("wallet_fundings")
//       .update({ payment_reference: data.reference })
//       .eq("id", funding.id);

//     console.log("✅ Reference saved:", data.reference);

//     return { success: true, error: null, reference: data.reference };
//   } catch (error) {
//     console.error("❌ fundWallet error:", error);
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : "Payment failed",
//     };
//   }
// }

//Atemptting:
export async function fundWallet(
  _prevState: {
    success: boolean;
    error: string | null;
    reference?: string;
  },
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
    console.log("⏳ Starting wallet funding...");

    // Step 1: Insert pending funding row
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

    if (fundingError) {
      console.error("❌ Funding insert error:", fundingError);
      throw new Error(fundingError.message);
    }
    console.log("✅ Funding row created:", funding);

    // Step 2: Initialize with Paystack
    const response = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email || "abduljelelahmed@gmail.com",
          amount: validated.data.amount * 100,
          channels: [validated.data.paymentMethod],
          metadata: { user_id: user.id, funding_id: funding.id },
        }),
      }
    );

    const resJson = await response.json();
    console.log("🌍 Paystack raw response:", resJson);

    const { data } = resJson;
    if (!data?.reference || !data?.access_code) {
      console.error(
        "❌ Missing reference or access_code from Paystack response:",
        resJson
      );
      throw new Error("Payment initialization failed");
    }

    // Step 3: Save reference + access_code
    await supabase
      .from("wallet_fundings")
      .update({
        payment_reference: data.reference,
        // access_code: data.access_code,
      })
      .eq("id", funding.id);

    console.log("✅ Reference", data);

    return {
      success: true,
      error: null,
      reference: data.reference,
      access_code: data.access_code,
      payment_method: data.payment_method,
    };
  } catch (error) {
    console.error("❌ fundWallet error:", error);
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
