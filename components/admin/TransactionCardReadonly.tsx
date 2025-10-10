import { formatDateTime } from "@/lib/utils";
import StatusBadge from "../ui/StatusBadge";

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

export default function TransactionCardReadonly({
  transaction,
}: {
  transaction: DisplayTransaction;
}) {
  const ref = transaction.payment_reference || transaction.funding_id || "—";
  const statusColor =
    transaction.status === "completed"
      ? "text-green-400 bg-green-500/10"
      : transaction.status === "failed"
      ? "text-red-400 bg-red-500/10"
      : "text-yellow-400 bg-yellow-500/10";

  return (
    <div className="bg-[var(--card-background-color)]/50 border border-white/10 backdrop-blur-md rounded-lg p-4 space-y-2">
      {/* Time */}
      <p className="text-xs text-gray-400">
        {formatDateTime(transaction.created_at)}
      </p>

      {/* User */}
      <p className="text-sm text-[var(--text-primary)] font-medium">
        {transaction.user}
      </p>

      {/* Type, Amount, Status */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm capitalize text-gray-300">
            {transaction.type.replace("_", " ")}
          </p>
          <p className="text-sm font-semibold text-[var(--text-primary)]">
            ₦{transaction.amount}
          </p>
        </div>
        <StatusBadge status={transaction.status} size="sm" />
      </div>

      {/* Reference */}
      <p className="text-xs text-gray-400 truncate">Ref: {ref}</p>
    </div>
  );
}
