"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function resolveDataDispute(
  id: string,
  refund: boolean,
  note?: string
) {
  // ✅ Create Supabase server client using the new cookie API
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set({ name, value, ...options })
          );
        },
      },
    }
  );

  try {
    // 1️⃣ Get current admin from session
    const {
      data: { user: admin },
      error: adminError,
    } = await supabase.auth.getUser();

    if (adminError || !admin)
      throw new Error("Unauthorized or invalid session");
    const adminId = admin.id;

    // 2️⃣ Fetch the transaction details
    const { data: tx, error: txError } = await supabaseAdmin
      .from("transactions")
      .select("id, user_id, amount, status")
      .eq("id", id)
      .single();

    if (txError || !tx) throw new Error("Transaction not found");

    // 3️⃣ If refund: run the admin_refund_wallet RPC
    if (refund) {
      const { error: rpcError } = await supabaseAdmin.rpc(
        "admin_refund_wallet",
        {
          p_admin_id: adminId,
          p_user_id: tx.user_id,
          p_transaction_id: tx.id,
          p_amount: tx.amount,
          p_reason: note ?? "Admin-approved refund",
        }
      );

      if (rpcError) throw new Error(`Refund aborted: ${rpcError.message}`);
    }

    // 4️⃣ Update transaction record
    const newStatus = refund ? "refunded" : "dispute_rejected";

    const { error: updateError } = await supabaseAdmin
      .from("transactions")
      .update({
        status: newStatus,
        dispute_type: null,
        dispute_note: null,
        admin_resolution: note ?? null,
        resolved_at: new Date().toISOString(),
        resolved_by: adminId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (updateError) throw new Error(updateError.message);

    return {
      success: true,
      message: refund
        ? "Dispute resolved, refund issued and logged."
        : "Dispute rejected successfully.",
    };
  } catch (err: any) {
    console.error("resolveDisputeAction error:", err.message);
    return { success: false, message: err.message };
  }
}

export async function resolveWalletDispute(
  id: string,
  refund: boolean,
  note?: string,
  refundAmount?: number,
  statusOverride?: string
) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set({ name, value, ...options })
          );
        },
      },
    }
  );

  try {
    // 1️⃣ Get the current admin
    const {
      data: { user: admin },
      error: adminError,
    } = await supabase.auth.getUser();

    if (adminError || !admin)
      throw new Error("Unauthorized or invalid session");
    const adminId = admin.id;

    // 2️⃣ Fetch the wallet funding transaction
    const { data: tx, error: txError } = await supabaseAdmin
      .from("transactions")
      .select("id, user_id, amount, status, type")
      .eq("id", id)
      .eq("type", "wallet_funding")
      .single();

    if (txError || !tx) throw new Error("Wallet funding transaction not found");

    // 3️⃣ Determine the admin action
    let newStatus = statusOverride ?? tx.status;
    let message = "";
    let refundedAmount: number | null = null;

    if (refund) {
      const amountToRefund = refundAmount ?? tx.amount;

      if (amountToRefund > tx.amount) {
        throw new Error(
          "Refund amount cannot exceed the original transaction amount"
        );
      }

      const { error: rpcError } = await supabaseAdmin.rpc(
        "admin_refund_wallet",
        {
          p_admin_id: adminId,
          p_user_id: tx.user_id,
          p_transaction_id: tx.id,
          p_amount: amountToRefund,
          p_reason: note ?? "Admin wallet refund",
        }
      );

      if (rpcError) throw new Error(`Refund failed: ${rpcError.message}`);

      newStatus = "refunded";
      message = "Refund completed successfully.";
      refundedAmount = amountToRefund;
    } else if (statusOverride === "pending_review") {
      newStatus = "under_review";
      message = "Marked as pending review.";
    } else {
      newStatus = "dispute_rejected";
      message = "Dispute rejected successfully.";
    }

    // 4️⃣ Update the transaction
    const { error: updateError } = await supabaseAdmin
      .from("transactions")
      .update({
        status: newStatus,
        admin_resolution: note ?? null,
        resolved_at:
          newStatus !== "under_review" ? new Date().toISOString() : null,
        resolved_by: newStatus !== "under_review" ? adminId : null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (updateError) throw new Error(updateError.message);

    // 5️⃣ Log admin action
    const { error: logError } = await supabaseAdmin
      .from("admin_activity_logs")
      .insert({
        admin_id: adminId,
        action: refund
          ? "WALLET_REFUND_ISSUED"
          : newStatus === "under_review"
          ? "WALLET_DISPUTE_PENDING"
          : "WALLET_DISPUTE_REJECTED",
        target_table: "transactions",
        target_id: tx.id,
        details: {
          refund,
          refunded_amount: refundedAmount,
          note,
          previous_status: tx.status,
          new_status: newStatus,
        },
      });

    if (logError)
      console.warn("⚠️ Failed to log admin action:", logError.message);

    return { success: true, message };
  } catch (err: any) {
    console.error("resolveWalletDispute error:", err.message);
    return { success: false, message: err.message };
  }
}
