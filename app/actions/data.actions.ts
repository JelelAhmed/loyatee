"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

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

export async function purchaseDataPlan(
  prevState: { success: boolean; error: string | null },
  formData: FormData
) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error("Unauthorized");

    const dataplan_id = formData.get("vendor_plan_id") as string;
    const phone_number = formData.get("phone_number") as string;
    const amount = parseFloat(formData.get("amount") as string);
    const data_size = formData.get("data_size") as string;
    const duration = formData.get("duration") as string;

    if (!phone_number || !/^\d{11}$/.test(phone_number)) {
      throw new Error("Invalid phone number");
    }

    // Check wallet balance
    const { data: userData, error: balanceError } = await supabase
      .from("users")
      .select("wallet_balance")
      .eq("id", user.user.id)
      .single();
    if (balanceError) throw new Error(balanceError.message);
    if (userData.wallet_balance < amount)
      throw new Error("Insufficient wallet balance");

    // Placeholder: Call DataStation purchase API
    const token = process.env.DATASTATION_TOKEN;
    if (!token) throw new Error("DATASTATION_TOKEN is not set");

    const response = await fetch(
      "https://datastationapi.com/api/data/purchase",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          dataplan_id,
          phone_number,
          amount,
        }),
      }
    );
    let purchaseData;
    try {
      purchaseData = await response.json();
    } catch (err) {
      const rawText = await response.text();
      console.error("Failed to parse purchase JSON:", rawText);
      throw new Error(`Invalid purchase JSON response: ${rawText}`);
    }
    if (!response.ok)
      throw new Error(purchaseData.message || "Purchase failed");

    // Insert transaction
    const { error: txError } = await supabase.from("transactions").insert({
      user_id: user.user.id,
      type: "data_purchase",
      amount,
      status: "completed",
      payment_method: "wallet",
      data_size,
      duration,
      phone_number,
      vendor_plan_id: dataplan_id,
    });
    if (txError) throw new Error(txError.message);

    // Deduct wallet balance
    const { error: balanceUpdateError } = await supabase
      .from("users")
      .update({ wallet_balance: userData.wallet_balance - amount })
      .eq("id", user.user.id);
    if (balanceUpdateError) throw new Error(balanceUpdateError.message);

    return { success: true, error: null };
  } catch (err) {
    console.error("purchaseDataPlan error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Purchase failed",
    };
  }
}
