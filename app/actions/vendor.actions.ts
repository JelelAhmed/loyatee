"use server";

import { NETWORK_MAPPING } from "@/lib/datastation/constants";
import { DataPlan } from "@/types/dataPlans";

export async function fetchVendorPlans(): Promise<DataPlan[]> {
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

  const data = await response.json();
  const dataplans = data.Dataplans || {};
  const plans: DataPlan[] = [];
  const seenIds = new Set<string>();

  Object.keys(dataplans).forEach((networkKey) => {
    const planGroups = dataplans[networkKey] || {};
    const rawPlans = planGroups["ALL"] || [];

    rawPlans.forEach((plan: any) => {
      const dedupeKey = plan.dataplan_id || plan.id;
      if (seenIds.has(dedupeKey)) return;

      const networkName =
        NETWORK_MAPPING[plan.network.toString()] || `Unknown (${plan.network})`;

      plans.push({
        ...plan,
        dataplan_id: dedupeKey,
        plan_network: networkName,
        plan_type: plan.plan_type?.trim() || "UNKNOWN",
        plan_amount: plan.plan_amount, // vendor cost (string)
        final_price: 0, // will be calculated after overrides
      });

      seenIds.add(dedupeKey);
    });
  });

  return plans;
}
