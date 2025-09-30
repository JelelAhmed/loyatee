export type DataPlan = {
  id: string;
  dataplan_id: string;
  network: number;
  plan_type: string;
  plan_network: string;
  month_validate: string;
  plan: string;

  // From vendor API (comes as string, e.g. "780.0")
  plan_amount: string;

  // Calculated fields
  final_price: number;

  // --- Admin-only fields (optional) ---
  // vendor_cost is just plan_amount parsed as number
  vendor_cost?: number;

  // Custom markup applied by admin (in ₦), minimum 10
  base_markup?: number;

  // Admin toggle: whether this plan is sellable
  enabled?: boolean;
};
