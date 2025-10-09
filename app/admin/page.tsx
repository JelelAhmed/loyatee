"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import StatCard from "@/components/admin/StatCard";
import UserTableReadonly from "@/components/admin/UserTableReadonly";
import UserCardReadonly from "@/components/admin/UserCardReadonly";
import TransactionCardReadonly from "@/components/admin/TransactionCardReadonly";
import TransactionTableReadonly from "@/components/admin/TransactionTableReadonly";
import { CreateSupabaseClient } from "@/lib/supabase/client";

export default function AdminDashboard() {
  const supabase = CreateSupabaseClient;

  const [users, setUsers] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [stats, setStats] = useState([
    { title: "Total Users", value: "..." },
    { title: "Total Transactions", value: "..." },
    { title: "Total Revenue", value: "..." },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      const [{ data: usersData }, { data: transactionsData }] =
        await Promise.all([
          supabase
            .from("users")
            .select("*")
            .order("created_at", { ascending: false }),
          supabase
            .from("transactions")
            .select("*")
            .order("created_at", { ascending: false }),
        ]);

      if (!usersData || !transactionsData) return;

      // ✅ Combine user email into transactions
      const mergedTransactions = transactionsData.map((tx) => {
        const user = usersData.find((u) => u.id === tx.user_id);
        return {
          ...tx,
          user: user?.email || "Unknown user",
        };
      });

      setUsers(usersData);
      setTransactions(mergedTransactions);

      const totalUsers = usersData.length;
      const totalTransactions = transactionsData.length;
      const totalRevenue =
        transactionsData
          .filter((t) => t.status === "completed")
          .reduce((sum, t) => sum + Number(t.amount || 0), 0) || 0;

      setStats([
        { title: "Total Users", value: totalUsers.toLocaleString() },
        {
          title: "Total Transactions",
          value: totalTransactions.toLocaleString(),
        },
        { title: "Total Revenue", value: `₦${totalRevenue.toLocaleString()}` },
      ]);
    };

    fetchData();
  }, [supabase]);

  return (
    <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 relative z-10">
      <div className="max-w-7xl mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, i) => (
            <StatCard key={i} title={stat.title} value={stat.value} />
          ))}
        </div>

        <div className="space-y-10">
          {/* Recent Users */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                Recent Users
              </h2>
              <Link
                href="/admin/users"
                className="text-[var(--primary-color)] hover:underline text-sm"
              >
                View all users →
              </Link>
            </div>

            <div className="bg-[var(--card-background-color)]/50 border border-white/10 backdrop-blur-lg rounded-lg overflow-hidden">
              <div className="hidden sm:block">
                <UserTableReadonly users={users.slice(0, 5)} />
              </div>
              <div className="sm:hidden space-y-4 p-4">
                {users.slice(0, 5).map((user) => (
                  <UserCardReadonly key={user.id} user={user} />
                ))}
              </div>
            </div>
          </div>

          {/* Latest Transactions */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                Latest Transactions
              </h2>
              <Link
                href="/admin/transactions"
                className="text-[var(--primary-color)] hover:underline text-sm"
              >
                View all →
              </Link>
            </div>

            <div className="bg-[var(--card-background-color)]/50 border border-white/10 backdrop-blur-lg rounded-lg overflow-hidden">
              {/* ✅ Table for Desktop */}
              <div className="hidden sm:block">
                <TransactionTableReadonly
                  transactions={transactions.slice(0, 5)}
                />
              </div>

              {/* ✅ Cards for Mobile */}
              <div className="sm:hidden space-y-4 p-4">
                {transactions.slice(0, 5).map((transaction) => (
                  <TransactionCardReadonly
                    key={transaction.id}
                    transaction={transaction}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
