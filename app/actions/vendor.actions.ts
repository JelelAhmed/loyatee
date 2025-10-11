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

export interface VendorAccount {
  id: number;
  email: string;
  username: string;
  fullName: string;
  pin: string;
  img: string;
  address: string;
  phone: string;
  user_type: string;
  email_verify: boolean;
  account_balance: number;
  wallet_balance: string;
  bonus_balance: string;
  referer_username: string;
  reserved_account_number: string;
  reserved_bank_name: string;
  bank_accounts: {
    accounts: {
      bankCode: string;
      bankName: string;
      accountNumber: string;
      accountName: string;
    }[];
  };
}

/**
 * Fetches vendor account info from DataStation API.
 * This retrieves the "user" object, not the "Dataplans" object.
 */
export async function fetchVendorAccount(): Promise<VendorAccount> {
  const token = process.env.DATASTATION_TOKEN;
  if (!token) throw new Error("DATASTATION_TOKEN is not set");

  const response = await fetch("https://datastationapi.com/api/user", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    cache: "no-store", // ensure fresh data on each request
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to fetch vendor account: ${response.status} ${errorText}`
    );
  }

  const data = await response.json();

  if (!data.user) {
    throw new Error("Vendor account data not found in API response");
  }

  const user = data.user;

  const vendorAccount: VendorAccount = {
    id: user.id,
    email: user.email,
    username: user.username,
    fullName: user.FullName,
    pin: user.pin,
    img: user.img,
    address: user.Address,
    phone: user.Phone,
    user_type: user.user_type,
    email_verify: user.email_verify,
    account_balance: user.Account_Balance,
    wallet_balance: user.wallet_balance,
    bonus_balance: user.bonus_balance,
    referer_username: user.referer_username,
    reserved_account_number: user.reservedaccountNumber,
    reserved_bank_name: user.reservedbankName,
    bank_accounts: user.bank_accounts,
  };

  return vendorAccount;
}
