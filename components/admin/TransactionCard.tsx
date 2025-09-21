// /components/admin/TransactionCard.tsx
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
}

interface TransactionCardProps {
  transaction: DisplayTransaction;
}

export default function TransactionCard({ transaction }: TransactionCardProps) {
  return (
    <div className="bg-[var(--card-background-color)]/50 p-4 rounded-lg border border-white/10 text-sm text-[var(--text-primary)]/90">
      <div className="flex justify-between">
        <span className="font-semibold text-[var(--text-secondary)]">User</span>
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
            transaction.status.toLowerCase() === "completed"
              ? "text-emerald-400 bg-emerald-500/20"
              : transaction.status.toLowerCase() === "pending"
              ? "text-amber-400 bg-amber-500/20"
              : "text-red-400 bg-red-500/20"
          }`}
        >
          {transaction.status}
        </span>
      </div>
    </div>
  );
}
