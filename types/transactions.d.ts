export type Transaction = {
  id: string;
  user_id: string;
  user_email: string;
  type: string;
  amount: number;
  status: string;
  payment_method: string;
  data_size: string;
  duration: string;
  phone_number: string;
  vendor_plan_id: string;
  created_at: string;
  network: string;
  network_code: number;
  funding_id: string;
  date: string;
};
export interface PurchaseDataPlanInput {
  userId: string; // Authenticated user ID
  networkCode: string; // Vendor’s network code (e.g., "1" for MTN)
  planId: string; // Vendor’s plan identifier
  phoneNumber: string; // Target phone number
  ported?: boolean;
}

// ✅ Result from server -> client
export interface PurchaseResult {
  success: boolean;
  message: string;

  // optional on success
  transactionId?: string;
  newBalance?: number;

  // optional on failure
  errorCode?: string;
}

export type VendorResponse = {
  transaction_id?: string;
  status?: string;
  Status?: string; // some responses might capitalize it
  message?: string;
  error?: string[];
  [key: string]: unknown; // allow extra vendor fields
};
