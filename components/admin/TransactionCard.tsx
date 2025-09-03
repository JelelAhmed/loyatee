interface Transaction {
  user: string;
  network: string;
  amount: string;
  date: string;
  status: string;
}

interface TransactionCardProps {
  transaction: Transaction;
}

export default function TransactionCard({ transaction }: TransactionCardProps) {
  return (
    <div className="bg-[var(--card-background-color)]/50 p-4 rounded-lg border border-white/10 text-sm text-[var(--text-primary)]/90">
      <div className="flex justify-between">
        <span className="font-semibold text-[var(--text-secondary)]">User</span>
        <span>{transaction?.user}</span>
      </div>
      <div className="flex justify-between">
        <span className="font-semibold text-[var(--text-secondary)]">
          Network
        </span>
        <span>{transaction?.network}</span>
      </div>
      <div className="flex justify-between">
        <span className="font-semibold text-[var(--text-secondary)]">
          Amount
        </span>
        <span>{transaction?.amount}</span>
      </div>
      <div className="flex justify-between">
        <span className="font-semibold text-[var(--text-secondary)]">Date</span>
        <span>{transaction?.date}</span>
      </div>
      <div className="flex justify-between">
        <span className="font-semibold text-[var(--text-secondary)]">
          Status
        </span>
        <span
          className={`inline-block px-3 py-1 font-medium text-xs rounded-full capitalize ${
            transaction?.status === "Completed"
              ? "text-emerald-400 bg-emerald-500/20"
              : transaction?.status === "Pending"
              ? "text-amber-400 bg-amber-500/20"
              : "text-red-400 bg-red-500/20"
          }`}
        >
          {transaction?.status}
        </span>
      </div>
    </div>
  );
}
