interface Transaction {
  user: string;
  network: string;
  amount: string;
  date: string;
  status: string;
}

interface TransactionTableProps {
  transactions: Transaction[];
}

export default function TransactionTable({
  transactions,
}: TransactionTableProps) {
  return (
    <div className="hidden sm:block">
      <table className="w-full text-sm text-left text-[var(--text-secondary)]">
        <thead className="text-xs text-[var(--text-primary)] uppercase bg-white/5">
          <tr>
            {["User", "Network", "Amount", "Date", "Status"].map((h) => (
              <th key={h} className="px-6 py-3" scope="col">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, i) => (
            <tr
              key={i}
              className="border-b border-white/10 hover:bg-white/10 transition-colors"
            >
              <td className="px-6 py-4 font-medium text-[var(--text-primary)] whitespace-nowrap">
                {transaction.user}
              </td>
              <td className="px-6 py-4">{transaction.network}</td>
              <td className="px-6 py-4">{transaction.amount}</td>
              <td className="px-6 py-4">{transaction.date}</td>
              <td className="px-6 py-4 text-center">
                <span
                  className={`relative inline-block px-3 py-1 font-medium text-xs rounded-full capitalize ${
                    transaction.status === "Completed"
                      ? "text-emerald-400 bg-emerald-500/20"
                      : transaction.status === "Pending"
                      ? "text-amber-400 bg-amber-500/20"
                      : "text-red-400 bg-red-500/20"
                  }`}
                >
                  {transaction.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
