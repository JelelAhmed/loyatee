"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/admin";
import {
  PurchaseDataPlanInput,
  PurchaseResult,
  VendorResponse,
} from "@/types/transactions";
import { mapVendorErrorToUserMessage } from "@/lib/utils";
import { fetchVendorPlans } from "./vendor.actions";

type DataPlan = {
  id: string;
  dataplan_id: string;
  network: number;
  plan_type: string;
  plan_network: string;
  month_validate: string;
  enabled: boolean;
  plan: string;
  plan_amount: string; // API returns as string, e.g., "780.0"
  final_price: number; // Price with your fee
};

export async function getDataPlansWithOverrides(): Promise<{
  plans: DataPlan[];
  error: string | null;
}> {
  try {
    const vendorPlans = await fetchVendorPlans();

    const { data: overrides, error: overrideError } = await supabaseAdmin
      .from("plan_overrides")
      .select("dataplan_id, base_markup, enabled");

    if (overrideError) {
      console.error("[getDataPlansWithOverrides] error:", overrideError);
      return { plans: [], error: "An error occured. Please try again" };
    }

    const updatedPlans: DataPlan[] = vendorPlans.map((plan) => {
      const vendorCost = Number(plan.plan_amount);
      const override = overrides?.find(
        (o) => o.dataplan_id === plan.dataplan_id
      );

      const base_markup = override?.base_markup ?? 50; // default minimum
      const enabled = override?.enabled ?? true;

      return {
        ...plan,
        base_markup,
        enabled,
        final_price: enabled
          ? vendorCost + Math.max(base_markup, 10)
          : vendorCost,
      };
    });

    return { plans: updatedPlans, error: null };
  } catch (err) {
    console.error("[getDataPlansWithOverrides] Unexpected error:", err);
    return {
      plans: [],
      error: err instanceof Error ? err.message : "Failed to fetch plans",
    };
  }
}

export async function getCustomerDataPlans() {
  const { plans, error } = await getDataPlansWithOverrides();
  if (error) return { plans: [], error };

  // filter only enabled plans
  const enabledPlans = plans.filter((p) => p.enabled);

  return { plans: enabledPlans, error: null };
}

/**
 * Update or insert a plan override markup.
 * @param dataplan_id The vendor's plan identifier
 * @param base_markup The extra amount to add on top of vendor price
 */
export async function updatePlanMarkup(
  dataplan_id: string,
  base_markup: number
) {
  try {
    const { error } = await supabaseAdmin.from("plan_overrides").upsert(
      {
        dataplan_id,
        base_markup,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "dataplan_id" }
    );

    if (error) throw new Error(error.message);

    // Revalidate affected paths
    revalidatePath("/dashboard/buy-data"); // Customer-facing page
    revalidatePath("/admin/data-plans"); // Admin page

    return { success: true, message: "Markup updated successfully" };
  } catch (err) {
    console.error("[updatePlanMarkup] Error:", err);
    return {
      success: false,
      message: err instanceof Error ? err.message : "Failed to update markup",
    };
  }
}

export async function togglePlanEnabled(dataplan_id: string, enabled: boolean) {
  try {
    const { error } = await supabaseAdmin.from("plan_overrides").upsert(
      {
        dataplan_id,
        enabled,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "dataplan_id" }
    );

    if (error) throw new Error(error.message);

    return {
      success: true,
      message: `Plan ${enabled ? "enabled" : "disabled"} successfully`,
    };
  } catch (err) {
    console.error("[togglePlanEnabled] Error:", err);
    return {
      success: false,
      message: err instanceof Error ? err.message : "Failed to toggle plan",
    };
  }
}

export async function purchaseDataPlan(
  input: PurchaseDataPlanInput
): Promise<PurchaseResult> {
  const {
    userId,
    networkCode,
    phoneNumber,
    planId,
    amount,
    planSize,
    duration,
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
        duration: duration,
        data_size: planSize,
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
