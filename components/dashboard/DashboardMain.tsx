"use client";

import Link from "next/link";
import UserStatsCard from "./UserStatsCard";
import { PlusIcon, ArrowDown, ArrowUp, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { CreateSupabaseClient } from "@/lib/supabase/client";
import { NETWORK_MAPPING } from "@/lib/datastation/constants";

type Transaction = {
  id: string;
  type: "wallet_funding" | "data_purchase";
  amount: number;
  status: string;
  created_at: string;
  network_code?: string;
  phone_number?: string;
  data_size?: string;
  payment_method?: string;
  payment_reference?: string;
  vendor_transaction_id: string;
};

export default function DashboardMain() {
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalSpent, setTotalSpent] = useState<number>(0);
  const [totalData, setTotalData] = useState<number>(0); // store as MB internally

  const supabase = CreateSupabaseClient;

  useEffect(() => {
    async function loadDashboardData() {
      // 1. Get current user session
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();
      if (sessionError || !sessionData.session?.user) {
        console.error("No active session:", sessionError);
        return;
      }

      const userId = sessionData.session.user.id;

      // 2. Fetch wallet balance
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("wallet_balance")
        .eq("id", userId)
        .single();

      if (!userError) {
        setWalletBalance(userData.wallet_balance);
      }

      // 3. Fetch all transactions (to calculate totals)
      const { data: allTx, error: allTxError } = await supabase
        .from("transactions")
        .select("type, amount, data_size, status")
        .eq("user_id", userId)
        .eq("status", "completed");

      if (!allTxError && allTx) {
        let spent = 0;
        let totalMB = 0;

        allTx.forEach((tx) => {
          if (
            tx.type === "data_purchase" &&
            tx.status?.toLowerCase() === "completed"
          ) {
            spent += tx.amount;

            // convert data_size like "1.5GB" or "500MB" into MB
            if (tx.data_size) {
              const size = tx.data_size.toUpperCase().trim();
              if (size.endsWith("GB")) {
                totalMB += parseFloat(size.replace("GB", "")) * 1024;
              } else if (size.endsWith("MB")) {
                totalMB += parseFloat(size.replace("MB", ""));
              }
            }
          }
        });

        setTotalSpent(spent);
        setTotalData(totalMB);
      }

      // 4. Fetch latest 10 transactions
      const { data: txData, error: txError } = await supabase
        .from("transactions")
        .select(
          "id, type, amount, status, created_at, network_code, phone_number, data_size, payment_method, payment_reference, vendor_transaction_id"
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(10);

      if (!txError) {
        setTransactions(txData || []);
      }
    }

    loadDashboardData();
  }, [supabase]);

  // Format data purchased (MB → GB/MB)
  const formattedData =
    totalData >= 1024
      ? `${(totalData / 1024).toFixed(1)}GB`
      : `${totalData.toFixed(0)}MB`;

  return (
    <main className="py-6 bg-[#0d0f1a] text-white">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        <UserStatsCard
          title="Wallet Balance"
          value={
            walletBalance !== null
              ? `₦${walletBalance.toLocaleString()}`
              : "..."
          }
          icon={<Wallet className="text-emerald-400" />}
        />
        <UserStatsCard
          title="Total Spent"
          value={`₦${totalSpent.toLocaleString()}`}
          icon={<ArrowUp className="text-emerald-400" />}
        />
        <UserStatsCard
          title="Data Purchased"
          value={formattedData}
          icon={<ArrowDown className="text-emerald-400" />}
        />
      </div>

      {/* Transaction History */}
      {/* Transaction History */}
      <div className="bg-gray-900 p-4 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4 text-emerald-400">
          Recent Transactions
        </h2>

        {/* Mobile: Cards */}
        <div className="space-y-4 md:hidden">
          {transactions.length > 0 ? (
            transactions.map((tx) => (
              <div
                key={tx.id}
                className="p-4 bg-gray-800 rounded-lg shadow flex flex-col gap-2"
              >
                <div className="flex justify-between items-center">
                  <span className="capitalize font-semibold">
                    {tx.type.replace("_", " ")}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold capitalize
                ${
                  tx.status.toLowerCase() === "completed"
                    ? "bg-emerald-500/10 text-emerald-400"
                    : tx.status.toLowerCase() === "pending"
                    ? "bg-yellow-500/10 text-yellow-400"
                    : "bg-red-500/10 text-red-400"
                }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        tx.status.toLowerCase() === "completed"
                          ? "bg-emerald-400"
                          : tx.status.toLowerCase() === "pending"
                          ? "bg-yellow-400"
                          : "bg-red-400"
                      }`}
                    />
                    {tx.status}
                  </span>
                </div>

                <div className="text-sm text-gray-300">
                  {tx.type === "data_purchase" ? (
                    <>
                      <p>
                        Network:{" "}
                        {NETWORK_MAPPING[String(tx.network_code)] ?? "Unknown"}
                      </p>
                      <p>Data: {tx.data_size || "-"}</p>
                      <p>Phone: {tx.phone_number || "-"}</p>
                    </>
                  ) : (
                    <>
                      <p>Method: {tx.payment_method || "-"}</p>
                      <p>Ref: {tx.vendor_transaction_id || "-"}</p>
                    </>
                  )}
                </div>

                <div className="flex justify-between items-center text-sm mt-2">
                  <span className="font-bold">
                    ₦{tx.amount.toLocaleString()}
                  </span>
                  <span className="text-gray-400">
                    {new Date(tx.created_at).toLocaleDateString("en-NG", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400 italic">
              No transactions yet
            </p>
          )}
        </div>

        {/* Desktop: Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-700">
                <th className="py-2">Type</th>
                <th className="py-2">Details</th>
                <th className="py-2">Amount</th>
                <th className="py-2">Status</th>
                <th className="py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? (
                transactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-gray-800">
                    <td className="py-3 capitalize">
                      {tx.type.replace("_", " ")}
                    </td>
                    <td className="py-3 text-gray-300">
                      {tx.type === "data_purchase" ? (
                        <>
                          <span className="block">
                            Network:{" "}
                            {NETWORK_MAPPING[String(tx.network_code)] ??
                              "Unknown"}
                          </span>
                          <span className="block">
                            Data: {tx.data_size || "-"}
                          </span>
                          <span className="block">
                            Phone: {tx.phone_number || "-"}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="block">
                            Method: {tx.payment_method || "-"}
                          </span>
                          <span className="block">
                            Ref: {tx.vendor_transaction_id || "-"}
                          </span>
                        </>
                      )}
                    </td>
                    <td>₦{tx.amount.toLocaleString()}</td>
                    <td>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold capitalize ${
                          tx.status.toLowerCase() === "completed"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : tx.status.toLowerCase() === "pending"
                            ? "bg-yellow-500/10 text-yellow-400"
                            : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            tx.status.toLowerCase() === "completed"
                              ? "bg-emerald-400"
                              : tx.status.toLowerCase() === "pending"
                              ? "bg-yellow-400"
                              : "bg-red-400"
                          }`}
                        />
                        {tx.status}
                      </span>
                    </td>
                    <td>
                      {new Date(tx.created_at).toLocaleDateString("en-NG", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="py-4 text-center text-gray-400 italic"
                  >
                    No transactions yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Buy New Data Button */}
      <div className="mt-6 flex justify-center">
        <Link href={"/dashboard/buy-data"}>
          <button className="bg-emerald-400 hover:bg-emerald-500 text-black font-bold px-6 py-2 sm:px-4 sm:py-2 text-sm sm:text-xs rounded transition duration-200">
            <span className="inline-flex items-center gap-2">
              <PlusIcon className="w-4 h-4" />
              <span>Buy New Data</span>
            </span>
          </button>
        </Link>
      </div>
    </main>
  );
}
