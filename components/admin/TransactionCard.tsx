"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useAdminDispute } from "@/hooks/useAdminDispute";
import AdminDisputeModal from "./AdminDisputeModal";

interface DisplayTransaction {
  id: string;
  user_email?: string;
  user_id: string;
  type: "data_purchase" | "wallet_funding";
  amount: string;
  status: string;
  network_name?: string;
  data_size?: string;
  duration?: string;
  funding_id?: string;
  phone_number?: string;
  dispute_type?: string;
  dispute_note?: string;
  payment_method?: string;
  payment_reference?: string;
  error_message?: string | null;
}

interface TransactionCardProps {
  transaction: DisplayTransaction;
  onResolved?: () => Promise<void> | void;
}

export default function TransactionCard({
  transaction,
  onResolved,
}: TransactionCardProps) {
  const {
    selectedDispute,
    isModalOpen,
    openDispute,
    closeDispute,
    handleResolve,
  } = useAdminDispute(onResolved);

  const [verifying, setVerifying] = useState(false);

  const handleManualVerify = async (reference?: string | null) => {
    if (!reference) {
      toast.error("Missing reference for verification");
      return;
    }

    setVerifying(true);
    toast.loading("Verifying funding…");

    try {
      const res = await fetch("/api/admin/verify-funding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || "Verification failed");
      }

      toast.dismiss();
      toast.success(result.message || "Funding verified successfully ✅");

      if (onResolved) await onResolved();
    } catch (err: any) {
      toast.dismiss();
      toast.error(err.message || "Verification failed ❌");
      console.error("Manual verify error:", err);
    } finally {
      setVerifying(false);
    }
  };

  const lowerStatus = transaction.status.toLowerCase();

  return (
    <>
      <div
        className={`bg-[var(--card-background-color)]/50 p-4 rounded-lg border text-sm space-y-2 ${
          lowerStatus === "disputed" ? "border-red-500/30" : "border-white/10"
        } text-[var(--text-primary)]/90`}
      >
        <div className="flex justify-between">
          <span className="font-semibold text-[var(--text-secondary)]">
            User
          </span>
          <span>{transaction.user_email ?? transaction.user_id}</span>
        </div>

        <div className="flex justify-between">
          <span className="font-semibold text-[var(--text-secondary)]">
            Phone
          </span>
          <span>{transaction.phone_number ?? "-"}</span>
        </div>

        {transaction.type === "data_purchase" && (
          <>
            <div className="flex justify-between">
              <span className="font-semibold text-[var(--text-secondary)]">
                Network
              </span>
              <span>{transaction.network_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-[var(--text-secondary)]">
                Data Size
              </span>
              <span>{transaction.data_size}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-[var(--text-secondary)]">
                Duration
              </span>
              <span>{transaction.duration}</span>
            </div>
          </>
        )}

        {transaction.type === "wallet_funding" && (
          <div className="flex justify-between">
            <span className="font-semibold text-[var(--text-secondary)]">
              Funding ID
            </span>
            <span>{transaction.funding_id}</span>
          </div>
        )}

        <div className="flex justify-between mt-2">
          <span className="font-semibold text-[var(--text-secondary)]">
            Status
          </span>
          <span
            className={`inline-block px-3 py-1 font-medium text-xs rounded-full capitalize ${
              lowerStatus === "completed"
                ? "text-emerald-400 bg-emerald-500/20"
                : lowerStatus === "pending"
                ? "text-amber-400 bg-amber-500/20"
                : lowerStatus === "disputed"
                ? "text-red-400 bg-red-500/20"
                : lowerStatus === "failed"
                ? "text-red-300 bg-red-500/20"
                : "text-gray-300 bg-gray-600/20"
            }`}
          >
            {transaction.status}
          </span>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 mt-3">
          {lowerStatus === "disputed" && (
            <button
              onClick={() => openDispute(transaction)}
              className="text-xs text-amber-400 hover:text-amber-300 underline"
            >
              View Dispute
            </button>
          )}

          {transaction.type === "wallet_funding" &&
            ["pending", "failed"].includes(lowerStatus) && (
              <button
                onClick={() =>
                  handleManualVerify(transaction.payment_reference ?? null)
                }
                disabled={verifying}
                className={`text-xs px-3 py-1 rounded-md transition-colors ${
                  verifying
                    ? "bg-blue-400/20 text-blue-300 cursor-wait"
                    : "text-blue-400 hover:text-blue-300 hover:bg-blue-400/10"
                }`}
              >
                {verifying ? "Verifying…" : "Verify Manually"}
              </button>
            )}
        </div>
      </div>

      <AdminDisputeModal
        isOpen={isModalOpen}
        onClose={closeDispute}
        dispute={selectedDispute}
        onResolve={handleResolve}
      />
    </>
  );
}
