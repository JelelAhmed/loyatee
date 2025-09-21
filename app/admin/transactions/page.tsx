// /app/admin/transactions/page.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import TransactionTable from "@/components/admin/TransactionTable";
import TransactionCard from "@/components/admin/TransactionCard";
import { CreateSupabaseClient } from "@/lib/supabase/client";

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

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<DisplayTransaction[]>([]);
  const [search, setSearch] = useState("");
  const [activityType, setActivityType] = useState<
    "data_purchase" | "wallet_funding"
  >("data_purchase");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const supabase = CreateSupabaseClient; // ✅ call the function

  useEffect(() => {
    const fetchTransactions = async () => {
      // Fetch transactions
      const { data: txData, error: txError } = await supabase
        .from("transactions")
        .select("*")
        .order("created_at", { ascending: false });

      if (txError) {
        console.error("Failed to fetch transactions:", txError.message);
        return;
      }

      // Fetch users for mapping user_id -> email & phone
      const userIds = txData?.map((t: any) => t.user_id) ?? [];
      const { data: usersData } = await supabase
        .from("users")
        .select("id, email, phone_number")
        .in("id", userIds);

      // Map network codes to friendly names
      const networkMap: Record<string, string> = {
        "1": "MTN",
        "2": "GLO",
        "3": "Airtel",
        "4": "9mobile",
      };

      const mapped: DisplayTransaction[] = (txData ?? []).map((t: any) => {
        // Try to find the user by ID
        const user = usersData?.find((u) => u.id === t.user_id);

        return {
          id: t.id,
          user_email: user?.email ?? "Unknown email",
          user_id: t.user_id,
          type: t.type,
          amount: t.amount,
          status: t.status,
          network_name: t.network_code
            ? networkMap[t.network_code.toString()]
            : "-",
          data_size: t.data_size ?? "-",
          duration: t.duration ?? "-",
          funding_id: t.funding_id ?? "-",
          // Use transaction phone_number first, fallback to user phone
          phone_number: t.phone_number ?? user?.phone_number ?? "Unknown phone",
        };
      });

      setTransactions(mapped);
    };

    fetchTransactions();
  }, []);

  // Filtering & search
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((t) => t.type === activityType)
      .filter((t) => {
        const userField = t.user_email ?? t.user_id ?? "";
        return (
          userField.toLowerCase().includes(search.toLowerCase()) ||
          t.amount.toString().includes(search) ||
          t.status.toLowerCase().includes(search.toLowerCase())
        );
      });
  }, [transactions, activityType, search]);

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / perPage);
  const paginatedTransactions = useMemo(() => {
    const start = (page - 1) * perPage;
    return filteredTransactions.slice(start, start + perPage);
  }, [filteredTransactions, page]);

  return (
    <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header & filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">
            Transactions
          </h2>

          <div className="flex items-center gap-2">
            {/* Activity selector */}
            <select
              value={activityType}
              onChange={(e) => {
                setActivityType(
                  e.target.value as "data_purchase" | "wallet_funding"
                );
                setPage(1);
              }}
              className="bg-[#1f1f2e] border border-[#44475a] rounded-lg px-4 py-2 text-sm text-[#f8f8f2] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition-all"
            >
              <option value="data_purchase">Data Purchases</option>
              <option value="wallet_funding">Wallet Funding</option>
            </select>

            {/* Search input */}
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by user, amount, status..."
              className="bg-[#1f1f2e] border border-[#44475a] rounded-lg px-4 py-2 text-sm text-[#f8f8f2] placeholder-[#6272a4] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition-all"
            />
          </div>
        </div>

        {/* Table & Cards */}
        <div className="bg-[var(--card-background-color)]/50 border border-white/10 backdrop-blur-lg rounded-lg overflow-hidden relative z-10">
          <TransactionTable
            transactions={paginatedTransactions}
            activityType={activityType}
          />

          <div className="sm:hidden space-y-4 p-4 z-10 relative">
            {paginatedTransactions.map((t) => (
              <TransactionCard key={t.id} transaction={t} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-white/10 px-6 py-3 z-10 relative">
            <p className="text-sm text-[var(--text-secondary)]">
              Showing {(page - 1) * perPage + 1} to{" "}
              {Math.min(page * perPage, filteredTransactions.length)} of{" "}
              {filteredTransactions.length} results
            </p>
            <div className="flex items-center gap-2">
              <button
                className="px-3 py-1 text-sm font-medium rounded-md bg-[var(--card-background-color)]/50 hover:bg-white/10 transition-colors disabled:opacity-50"
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
              >
                Previous
              </button>
              <button
                className="px-3 py-1 text-sm font-medium rounded-md bg-[var(--card-background-color)]/50 hover:bg-white/10 transition-colors"
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
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
