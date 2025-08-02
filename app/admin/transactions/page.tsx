"use client";

import { useState } from "react";
import TransactionTable from "@/components/admin/TransactionTable";
import TransactionCard from "@/components/admin/TransactionCard";

export default function TransactionsPage() {
  const [search, setSearch] = useState("");

  const transactions = [
    {
      user: "ada.eze@email.com",
      network: "MTN",
      amount: "₦1,000",
      date: "20 Jul, 2023",
      status: "Completed",
    },
    {
      user: "chidi.okafor@email.com",
      network: "Glo",
      amount: "₦500",
      date: "21 Jul, 2023",
      status: "Pending",
    },
    {
      user: "nkechi.obi@email.com",
      network: "Airtel",
      amount: "₦2,500",
      date: "22 Jul, 2023",
      status: "Completed",
    },
    {
      user: "emeka.nwosu@email.com",
      network: "9mobile",
      amount: "₦750",
      date: "23 Jul, 2023",
      status: "Failed",
    },
    {
      user: "ifeoma.okoro@email.com",
      network: "MTN",
      amount: "₦1,500",
      date: "24 Jul, 2023",
      status: "Completed",
    },
  ];

  return (
    <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">
            Transactions
          </h2>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search transactions..."
              className="bg-[var(--card-background-color)]/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition-all"
            />
            <button
              type="button"
              className="bg-[var(--card-background-color)]/50 border border-white/10 rounded-lg px-4 py-2 text-sm font-medium text-[var(--text-primary)] hover:bg-white/10 transition-colors"
            >
              Filters
            </button>
          </div>
        </div>
        <div className="bg-[var(--card-background-color)]/50 border border-white/10 backdrop-blur-lg rounded-lg overflow-hidden">
          <TransactionTable transactions={transactions} />
          <div className="sm:hidden space-y-4 p-4">
            {transactions.map((transaction, i) => (
              <TransactionCard key={i} transaction={transaction} />
            ))}
          </div>
          <div className="flex items-center justify-between border-t border-white/10 px-6 py-3">
            <p className="text-sm text-[var(--text-secondary)]">
              Showing 1 to 5 of 20 results
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="px-3 py-1 text-sm font-medium rounded-md bg-[var(--card-background-color)]/50 hover:bg-white/10 transition-colors disabled:opacity-50"
                disabled
              >
                Previous
              </button>
              <button
                type="button"
                className="px-3 py-1 text-sm font-medium rounded-md bg-[var(--card-background-color)]/50 hover:bg-white/10 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
