"use client";

import { formatDateTime } from "@/lib/utils";

interface DisplayTransaction {
  id: string;
  user: string;
  amount: number;
  type: string;
  status: string;
  payment_reference?: string | null;
  funding_id?: string;
  created_at: string;
}

export default function TransactionTableReadonly({
  transactions,
}: {
  transactions: DisplayTransaction[];
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-white/10 bg-[var(--card-background-color)]/50 backdrop-blur-md">
      <table className="min-w-full text-sm text-[var(--text-primary)]">
        <thead className="bg-white/5 text-gray-300">
          <tr>
            <th className="px-4 py-3 text-left font-medium">Time</th>
            <th className="px-4 py-3 text-left font-medium">User</th>
            <th className="px-4 py-3 text-left font-medium">Type</th>
            <th className="px-4 py-3 text-left font-medium">Amount</th>
            <th className="px-4 py-3 text-left font-medium">Reference</th>
            <th className="px-4 py-3 text-left font-medium">Status</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-white/10">
          {transactions.map((tx) => {
            const lowerStatus = tx.status?.toLowerCase();

            const statusClass =
              lowerStatus === "completed"
                ? "text-emerald-400 bg-emerald-500/20"
                : lowerStatus === "pending"
                ? "text-amber-400 bg-amber-500/20"
                : lowerStatus === "failed"
                ? "text-red-400 bg-red-500/20"
                : "text-gray-300 bg-gray-600/20";

            return (
              <tr
                key={tx.id}
                className="hover:bg-white/5 transition-colors duration-150"
              >
                <td className="px-4 py-3 whitespace-nowrap">
                  {formatDateTime(tx.created_at)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">{tx.user}</td>
                <td className="px-4 py-3 capitalize whitespace-nowrap">
                  {tx.type.replace("_", " ")}
                </td>
                <td className="px-4 py-3 font-medium text-[var(--text-primary)] whitespace-nowrap">
                  ₦{Number(tx.amount).toLocaleString()}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {tx.payment_reference || tx.funding_id || "—"}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span
                    className={`inline-block px-3 py-1 text-xs font-medium rounded-full capitalize ${statusClass}`}
                  >
                    {tx.status}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
