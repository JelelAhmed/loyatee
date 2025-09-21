// /components/admin/TransactionTable.tsx
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

interface TransactionTableProps {
  transactions: DisplayTransaction[];
  activityType: "data_purchase" | "wallet_funding";
}

export default function TransactionTable({
  transactions,
  activityType,
}: TransactionTableProps) {
  return (
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
                ]
              : ["User Email", "Phone", "Amount", "Funding ID", "Status"]
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
              className="border-b border-white/10 hover:bg-white/10 transition-colors"
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
                      : "text-red-400 bg-red-500/20"
                  }`}
                >
                  {t.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
