"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import {
  PurchaseDataPlanInput,
  PurchaseResult,
  VendorResponse,
} from "@/types/transactions";
import { mapVendorErrorToUserMessage } from "@/lib/utils";

type DataPlan = {
  id: string;
  dataplan_id: string;
  network: number;
  plan_type: string;
  plan_network: string;
  month_validate: string;
  plan: string;
  plan_amount: string; // API returns as string, e.g., "780.0"
  final_price: number; // Price with your fee
};

// Static network mapping matching DataStation
const NETWORK_MAPPING: Record<string, string> = {
  "1": "MTN",
  "2": "GLO",
  "3": "9MOBILE",
  "4": "AIRTEL",
};

export async function getDataPlans() {
  try {
    const token = process.env.DATASTATION_TOKEN;
    if (!token) throw new Error("DATASTATION_TOKEN is not set");

    const response = await fetch("https://datastationapi.com/api/user", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch plans: ${response.status} ${errorText}`);
    }

    let data;
    try {
      data = await response.json();
    } catch (err) {
      const rawText = await response.text();
      throw new Error(`Invalid JSON response: ${rawText}`);
    }

    const dataplans = data.Dataplans || {};
    const percentage = data.percentage || {};
    const plans: DataPlan[] = [];
    const seenIds = new Set<string>();

    // Only use ALL group per network
    Object.keys(dataplans).forEach((networkKey) => {
      const planGroups = dataplans[networkKey] || {};
      const rawPlans = planGroups["ALL"] || [];

      rawPlans.forEach((plan: DataPlan) => {
        const dedupeKey = plan.dataplan_id || plan.id;
        if (seenIds.has(dedupeKey)) return;

        const networkName =
          NETWORK_MAPPING[plan.network.toString()] ||
          `Unknown (${plan.network})`;

        const discountPercent = percentage[networkName]?.percent || 100;
        const markup = 1.1;
        const planAmount = parseFloat(plan.plan_amount);
        const finalPrice = (planAmount / (discountPercent / 100)) * markup;

        plans.push({
          ...plan,
          dataplan_id: dedupeKey,
          plan_network: networkName,
          plan_type: plan.plan_type?.trim() || "UNKNOWN",
          plan_amount: plan.plan_amount,
          final_price: Number(finalPrice.toFixed(2)),
        });

        seenIds.add(dedupeKey);
      });
    });

    // ✅ sort cheapest first globally
    plans.sort((a, b) => a.final_price - b.final_price);

    return {
      plans,
      error: null,
    };
  } catch (err) {
    console.error("getDataPlans error:", err);
    return {
      plans: [],
      error: err instanceof Error ? err.message : "Failed to fetch plans",
    };
  }
}

// console log heavy setup
// export async function purchaseDataPlan(
//   input: PurchaseDataPlanInput
// ): Promise<PurchaseResult> {
//   const {
//     userId,
//     networkCode,
//     phoneNumber,
//     planId,
//     amount,
//     ported = true,
//   } = input;
//   const supabase = await createSupabaseServerClient();
//   const token = process.env.DATASTATION_TOKEN;

//   if (!token) {
//     console.error("[purchaseDataPlan] Missing vendor token");
//     return { success: false, message: "DATASTATION_TOKEN not set" };
//   }

//   try {
//     console.log("[purchaseDataPlan] Starting purchase flow", {
//       userId,
//       networkCode,
//       phoneNumber,
//       planId,
//       amount,
//     });

//     // 1️⃣ Deduct wallet balance
//     console.log("[purchaseDataPlan] Deducting wallet balance…");
//     const { data: wallet, error: deductError } = await supabase.rpc(
//       "deduct_wallet_balance",
//       { user_id: userId, amount }
//     );

//     console.log("[purchaseDataPlan] Wallet deduction result:", {
//       wallet,
//       deductError,
//     });

//     if (deductError) {
//       console.error("[purchaseDataPlan] Wallet deduction failed:", deductError);
//       return { success: false, message: "Insufficient wallet balance" };
//     }

//     // 2️⃣ Insert transaction (pending)
//     console.log("[purchaseDataPlan] Inserting pending transaction…");
//     const { data: tx, error: insertError } = await supabase
//       .from("transactions")
//       .insert({
//         user_id: userId,
//         type: "data_purchase",
//         network_code: networkCode,
//         amount,
//         phone_number: phoneNumber,
//         status: "pending",
//         data_size: null, // will be filled later
//         duration: null,
//       })
//       .select()
//       .single();

//     console.log("[purchaseDataPlan] Transaction insert result:", {
//       tx,
//       insertError,
//     });

//     if (insertError || !tx) {
//       console.error(
//         "[purchaseDataPlan] Insert transaction failed:",
//         insertError
//       );
//       // rollback wallet deduction
//       await supabase.rpc("refund_wallet_balance", { user_id: userId, amount });
//       return { success: false, message: "Failed to create transaction" };
//     }

//     const transactionId = tx.id;
//     console.log("[purchaseDataPlan] Pending transaction ID:", transactionId);

//     // 3️⃣ Call vendor API
//     console.log("[purchaseDataPlan] Calling vendor API…");
//     const vendorResponse = await fetch("https://datastationapi.com/api/data/", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Token ${token}`,
//       },
//       body: JSON.stringify({
//         network: networkCode,
//         mobile_number: phoneNumber,
//         plan: planId,
//         Ported_number: ported,
//       }),
//     });

//     const vendorText = await vendorResponse.text();
//     let vendorData: any = null;
//     try {
//       vendorData = JSON.parse(vendorText);
//     } catch {
//       console.error("[purchaseDataPlan] Vendor response not JSON:", vendorText);
//     }

//     console.log("[purchaseDataPlan] Vendor API response:", {
//       status: vendorResponse.status,
//       vendorData,
//     });

//     if (!vendorResponse.ok || !vendorData) {
//       console.error("[purchaseDataPlan] Vendor purchase failed");
//       // mark failed
//       await supabase
//         .from("transactions")
//         .update({
//           status: "failed",
//           error_message: vendorData?.message || "Vendor API error",
//           updated_at: new Date().toISOString(),
//         })
//         .eq("id", transactionId);

//       // refund wallet
//       await supabase.rpc("refund_wallet_balance", { user_id: userId, amount });

//       return { success: false, message: "Vendor purchase failed" };
//     }

//     // 4️⃣ Update transaction (success/failure)
//     const vendorTxId = vendorData?.transaction_id || null;
//     const isSuccess = vendorData?.status?.toLowerCase() === "successful";

//     console.log("[purchaseDataPlan] Updating transaction status:", {
//       isSuccess,
//       vendorTxId,
//     });

//     await supabase
//       .from("transactions")
//       .update({
//         status: isSuccess ? "completed" : "failed",
//         vendor_transaction_id: vendorTxId,
//         vendor_response: vendorData,
//         updated_at: new Date().toISOString(),
//       })
//       .eq("id", transactionId);

//     if (!isSuccess) {
//       console.error("[purchaseDataPlan] Vendor reported failure", vendorData);
//       // refund wallet
//       await supabase.rpc("refund_wallet_balance", { user_id: userId, amount });

//       return { success: false, message: "Vendor reported failure" };
//     }

//     console.log("[purchaseDataPlan] Purchase completed successfully");
//     return {
//       success: true,
//       message: "Data plan purchased successfully",
//       transactionId,
//       newBalance: wallet,
//     };
//   } catch (err) {
//     console.error("[purchaseDataPlan] Unexpected error:", err);
//     return {
//       success: false,
//       message: "Unexpected error occurred during purchase",
//     };
//   }
// }

export async function purchaseDataPlan(
  input: PurchaseDataPlanInput
): Promise<PurchaseResult> {
  const {
    userId,
    networkCode,
    phoneNumber,
    planId,
    amount,
    ported = true,
  } = input;

  const supabase = supabaseAdmin;
  const token = process.env.DATASTATION_TOKEN;

  if (!token) {
    console.error("[purchaseDataPlan] Missing DATASTATION_TOKEN");
    return { success: false, message: "DATASTATION_TOKEN not set" };
  }

  let transactionId: string | undefined;

  try {
    // 1️⃣ Deduct balance
    console.log("[purchaseDataPlan] Attempting wallet deduction", {
      userId,
      amount,
    });
    const { data: newBalance, error: deductError } = await supabase.rpc(
      "deduct_user_wallet",
      { user_id: userId, amount }
    );
    console.log("[purchaseDataPlan] Wallet deduction result:", {
      newBalance,
      deductError,
    });

    if (deductError) {
      return { success: false, message: "Insufficient wallet balance" };
    }

    // 2️⃣ Insert pending transaction
    console.log("[purchaseDataPlan] Inserting pending transaction…");
    const { data: tx, error: insertError } = await supabase
      .from("transactions")
      .insert({
        user_id: userId,
        type: "data_purchase",
        network_code: networkCode,
        amount,
        phone_number: phoneNumber,
        status: "pending",
      })
      .select()
      .single();

    console.log("[purchaseDataPlan] Transaction insert result:", {
      tx,
      insertError,
    });

    if (insertError || !tx) {
      console.error(
        "[purchaseDataPlan] Insert transaction failed:",
        insertError
      );
      await supabase.rpc("refund_user_wallet", { user_id: userId, amount });
      return { success: false, message: "Failed to create transaction" };
    }

    transactionId = tx.id;
    console.log("[purchaseDataPlan] Created transaction:", transactionId);

    // 3️⃣ Call vendor API
    console.log("[purchaseDataPlan] Sending request to vendor API…", {
      networkCode,
      phoneNumber,
      planId,
    });

    let vendorData: VendorResponse | null = null;
    let vendorResponse: Response | undefined;

    try {
      vendorResponse = await fetch("https://datastationapi.com/api/data/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          network: networkCode,
          mobile_number: phoneNumber,
          plan: planId,
          Ported_number: ported,
        }),
      });

      const text = await vendorResponse.text();
      try {
        vendorData = JSON.parse(text) as VendorResponse;
      } catch {
        console.error("[purchaseDataPlan] Vendor returned non-JSON:", text);
      }
    } catch (vendorErr) {
      console.error("[purchaseDataPlan] Vendor request exception:", vendorErr);
    }

    console.log("[purchaseDataPlan] Vendor API response:", {
      status: vendorResponse?.status,
      vendorData,
    });

    if (!vendorResponse?.ok || !vendorData) {
      const userMessage = mapVendorErrorToUserMessage(vendorData);

      await supabase
        .from("transactions")
        .update({
          status: "failed",
          error_message:
            vendorData?.error?.[0] || vendorData?.message || "Vendor API error",
          vendor_response: vendorData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", transactionId);

      await supabase.rpc("refund_user_wallet", { user_id: userId, amount });

      return { success: false, message: userMessage };
    }

    // 4️⃣ Update transaction
    const vendorTxId = vendorData.transaction_id || null;
    const isSuccess =
      vendorData.status?.toLowerCase() === "successful" ||
      vendorData.Status?.toLowerCase() === "successful";

    console.log("[purchaseDataPlan] Updating transaction with vendor result:", {
      vendorTxId,
      isSuccess,
    });

    const { data: updateResult, error: updateError } = await supabase
      .from("transactions")
      .update({
        status: isSuccess ? "completed" : "failed",
        vendor_transaction_id: vendorTxId,
        vendor_response: vendorData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", transactionId);

    console.log("[purchaseDataPlan] Transaction update result:", {
      updateResult,
      updateError,
    });
    if (!isSuccess) {
      const errorMsg =
        vendorData.error?.[0] ||
        vendorData.message ||
        "Vendor reported failure";

      console.warn("[purchaseDataPlan] Vendor reported failure. Refunding…");
      await supabase.rpc("refund_user_wallet", { user_id: userId, amount });

      return { success: false, message: errorMsg };
    }

    console.log("[purchaseDataPlan] Purchase successful 🎉", {
      transactionId,
      newBalance,
    });

    return {
      success: true,
      message: "Data plan purchased successfully",
      transactionId,
      newBalance,
    };
  } catch (err) {
    console.error("[purchaseDataPlan] Unexpected error:", err);

    if (transactionId) {
      await supabase
        .from("transactions")
        .update({
          status: "failed",
          error_message: "Unexpected server error",
          updated_at: new Date().toISOString(),
        })
        .eq("id", transactionId);

      await supabase.rpc("refund_user_wallet", { user_id: userId, amount });
    }

    return {
      success: false,
      message: "Unexpected error occurred during purchase",
    };
  }
}
