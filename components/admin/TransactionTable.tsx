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

interface TransactionTableProps {
  transactions: DisplayTransaction[];
  activityType: "data_purchase" | "wallet_funding";
  onResolved?: () => Promise<void> | void;
}

export default function TransactionTable({
  transactions,
  activityType,
  onResolved,
}: TransactionTableProps) {
  const {
    selectedDispute,
    isModalOpen,
    openDispute,
    closeDispute,
    handleResolve,
  } = useAdminDispute(onResolved);

  const [verifying, setVerifying] = useState<string | null>(null);

  const handleManualVerify = async (reference?: string | null) => {
    if (!reference) {
      toast.error("Missing reference for verification");
      return;
    }

    setVerifying(reference);
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

      toast.dismiss(); // remove loading
      toast.success(result.message || "Funding verified successfully ✅");

      // Refresh table
      if (onResolved) await onResolved();
    } catch (err: any) {
      toast.dismiss();
      toast.error(err.message || "Verification failed ❌");
      console.error("Manual verify error:", err);
    } finally {
      setVerifying(null);
    }
  };

  return (
    <>
      <div className="hidden sm:block">
        <table className="w-full text-sm text-left text-[var(--text-secondary)]">
          <thead className="text-xs text-[var(--text-primary)] uppercase bg-white/5 sticky top-0 z-20">
            <tr>
              {(activityType === "data_purchase"
                ? [
                    "User Email",
                    "Phone",
                    "Network",
                    "Amount",
                    "Data Size",
                    "Duration",
                    "Status",
                    "Action",
                  ]
                : [
                    "User Email",
                    "Phone",
                    "Amount",
                    "Funding ID",
                    "Status",
                    "Action",
                  ]
              ).map((h) => (
                <th key={h} className="px-6 py-3">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {transactions.map((t) => (
              <tr
                key={t.id}
                className={`border-b border-white/10 transition-colors ${
                  t.status.toLowerCase() === "disputed"
                    ? "bg-red-500/5 hover:bg-red-500/10"
                    : "hover:bg-white/10"
                }`}
              >
                <td className="px-6 py-4 font-medium text-[var(--text-primary)] whitespace-nowrap">
                  {t.user_email ?? "-"}
                </td>
                <td className="px-6 py-4">{t.phone_number ?? "-"}</td>

                {activityType === "data_purchase" ? (
                  <>
                    <td className="px-6 py-4">{t.network_name}</td>
                    <td className="px-6 py-4">₦{t.amount}</td>
                    <td className="px-6 py-4">{t.data_size}</td>
                    <td className="px-6 py-4">{t.duration}</td>
                  </>
                ) : (
                  <>
                    <td className="px-6 py-4">₦{t.amount}</td>
                    <td className="px-6 py-4">{t.funding_id}</td>
                  </>
                )}

                <td className="px-6 py-4 text-center">
                  <span
                    className={`inline-block px-3 py-1 font-medium text-xs rounded-full capitalize ${
                      t.status.toLowerCase() === "completed"
                        ? "text-emerald-400 bg-emerald-500/20"
                        : t.status.toLowerCase() === "pending"
                        ? "text-amber-400 bg-amber-500/20"
                        : t.status.toLowerCase() === "disputed"
                        ? "text-red-400 bg-red-500/20"
                        : t.status.toLowerCase() === "failed"
                        ? "text-red-300 bg-red-500/20"
                        : "text-gray-300 bg-gray-600/20"
                    }`}
                  >
                    {t.status}
                  </span>
                </td>

                <td className="px-6 py-4 text-right space-x-3">
                  {/* Dispute view */}
                  {t.status.toLowerCase() === "disputed" && (
                    <button
                      onClick={() => openDispute(t)}
                      className="text-xs text-amber-400 hover:text-amber-300 underline"
                    >
                      View Dispute
                    </button>
                  )}

                  {/* Manual verify for wallet fundings */}
                  {activityType === "wallet_funding" &&
                    ["pending", "failed"].includes(t.status.toLowerCase()) && (
                      <button
                        onClick={() =>
                          handleManualVerify(t.payment_reference ?? null)
                        }
                        disabled={verifying === t.payment_reference}
                        className={`text-xs rounded-md px-3 py-1 transition-colors ${
                          verifying === t.payment_reference
                            ? "bg-blue-400/20 text-blue-300 cursor-wait"
                            : "text-blue-400 hover:text-blue-300 hover:bg-blue-400/10"
                        }`}
                      >
                        {verifying === t.payment_reference
                          ? "Verifying..."
                          : "Verify Manually"}
                      </button>
                    )}

                  {/* Default filler */}
                  {t.status.toLowerCase() !== "disputed" &&
                    !(
                      activityType === "wallet_funding" &&
                      ["pending", "failed"].includes(t.status.toLowerCase())
                    ) && <span className="text-xs text-gray-500">—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
