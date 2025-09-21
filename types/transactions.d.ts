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
  userId: string;
  networkCode: string;
  phoneNumber: string;
  duration: string;
  planId: string;
  planSize: string;
  amount: number;
  ported?: boolean; // optional, defaults to true
}

export type PurchaseResult =
  | {
      success: true;
      message: string;
      transactionId?: string;
      newBalance: number;
    }
  | {
      success: false;
      message: string;
    };

export type VendorResponse = {
  transaction_id?: string;
  status?: string;
  Status?: string; // some responses might capitalize it
  message?: string;
  error?: string[];
  [key: string]: unknown; // allow extra vendor fields
};
