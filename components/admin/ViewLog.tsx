"use client";

import { X } from "lucide-react";

interface AuditLog {
  id: string;
  admin_email: string;
  action: string;
  target_table?: string | null;
  target_id?: string | null;
  details: any;
  created_at: string;
}

interface ViewLogProps {
  log: AuditLog | null;
  onClose: () => void;
}

// Action color mapping
const ACTION_COLORS: Record<string, string> = {
  REFUND_ISSUED: "bg-green-100 text-green-800",
  WALLET_REFUND_ISSUED: "bg-green-100 text-green-800",
  WALLET_DISPUTE_PENDING: "bg-yellow-100 text-yellow-800",
  WALLET_DISPUTE_REJECTED: "bg-red-100 text-red-800",
  DEFAULT: "bg-gray-100 text-gray-800",
};

// Parse details into friendly key-value pairs
function parseDetails(action: string, details: any) {
  if (!details) return [];

  const entries: { label: string; value: string }[] = [];

  // Common transformations
  for (const [key, value] of Object.entries(details)) {
    const label = key
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    let displayValue = value === null || value === "" ? "-" : String(value);

    // Special formatting
    if (typeof value === "number" && key.toLowerCase().includes("amount")) {
      displayValue = `₦${value.toLocaleString("en-NG", {
        minimumFractionDigits: 2,
      })}`;
    }
    entries.push({ label, value: displayValue });
  }

  return entries;
}

export default function ViewLog({ log, onClose }: ViewLogProps) {
  if (!log) return null;

  const friendlyDetails = parseDetails(log.action, log.details);
  const actionColor = ACTION_COLORS[log.action] ?? ACTION_COLORS.DEFAULT;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4">
      <div className="bg-[var(--card-background-color)] w-full max-w-xl rounded-2xl shadow-xl border border-white/10 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-white/10 px-6 py-4">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">
            Audit Log Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 transition"
          >
            <X className="w-5 h-5 text-[var(--text-primary)]" />
          </button>
        </div>

        {/* Action Tag */}
        <div className="px-6 py-3">
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${actionColor}`}
          >
            {log.action.replace(/_/g, " ")}
          </span>
        </div>

        {/* Target Info */}
        <div className="px-6 py-2 space-y-2 border-b border-white/10">
          <div className="flex justify-between">
            <span className="font-semibold text-[var(--text-secondary)]">
              Admin
            </span>
            <span className="text-[var(--text-primary)]">
              {log.admin_email}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-[var(--text-secondary)]">
              Target Table
            </span>
            <span className="text-[var(--text-primary)]">
              {log.target_table ?? "-"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-[var(--text-secondary)]">
              Target ID
            </span>
            <span className="text-[var(--text-primary)]">
              {log.target_id ?? "-"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-[var(--text-secondary)]">
              Created At
            </span>
            <span className="text-[var(--text-primary)]">
              {new Date(log.created_at).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Details Section */}
        {friendlyDetails.length > 0 && (
          <div className="px-6 py-4 space-y-3">
            <h3 className="text-[var(--text-secondary)] font-semibold text-sm">
              Details
            </h3>
            <div className="bg-gray-900/90 rounded-lg p-4 space-y-2">
              {friendlyDetails.map((d) => (
                <div
                  key={d.label}
                  className="flex justify-between border-b border-white/10 last:border-b-0 py-1"
                >
                  <span className="text-[var(--text-secondary)] font-medium">
                    {d.label}
                  </span>
                  <span className="text-[var(--text-primary)]">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end border-t border-white/10 px-6 py-4">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[var(--primary-color)]/30 hover:bg-[var(--primary-color)]/50 transition text-sm font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
