"use client";

import { Dialog } from "@headlessui/react";
import { useState, useEffect } from "react";

interface ReportIssueModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (issueType: string, note: string) => Promise<void>;
  submitting?: boolean;
  transaction?: {
    id: string;
    type: string;
  } | null;
}

export default function ReportIssueModal({
  open,
  onClose,
  onSubmit,
  submitting = false,
  transaction,
}: ReportIssueModalProps) {
  const [issueType, setIssueType] = useState("");
  const [note, setNote] = useState("");

  // 🎯 Dynamically compute issue options based on transaction type
  const issueOptions =
    transaction?.type === "wallet_funding"
      ? [
          "Wallet not credited",
          "Wrong amount credited",
          "Payment stuck in pending",
          "Duplicate charge",
          "Other",
        ]
      : [
          "Data not received",
          "Wrong amount deducted",
          "Delivered to wrong number",
          "Other",
        ];

  // 🧹 Reset state when modal opens or transaction changes
  useEffect(() => {
    if (transaction) {
      setIssueType(issueOptions[0]);
      setNote("");
    }
  }, [transaction, open]);

  async function handleSubmit() {
    if (!transaction) return;
    await onSubmit(issueType, note);
  }

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />

      {/* Modal panel */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-gray-900 rounded-xl p-6 w-full max-w-md border border-gray-800 shadow-xl">
          <Dialog.Title className="text-lg font-semibold text-white mb-4">
            Report Issue
          </Dialog.Title>

          {transaction && (
            <p className="text-sm text-gray-400 mb-4">
              Reporting issue for{" "}
              <span className="font-semibold text-emerald-400">
                {transaction.type.replace("_", " ")}
              </span>{" "}
              transaction{" "}
              <span className="font-medium text-white">{transaction.id}</span>
            </p>
          )}

          {/* Issue type */}
          <label className="block text-sm text-gray-400 mb-2">Issue Type</label>
          <select
            value={issueType}
            onChange={(e) => setIssueType(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm mb-4 focus:ring-emerald-400"
          >
            {issueOptions.map((opt) => (
              <option key={opt}>{opt}</option>
            ))}
          </select>

          {/* Additional Notes */}
          <label className="block text-sm text-gray-400 mb-2">
            Additional Notes
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Optional..."
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm mb-4 focus:ring-emerald-400"
          />

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 text-sm rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-4 py-2 text-sm rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-50 flex items-center gap-2"
            >
              {submitting && (
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              )}
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
