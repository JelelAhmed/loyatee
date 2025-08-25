"use client";

import Link from "next/link";
import UserStatsCard from "./UserStatsCard";
import { PlusIcon } from "lucide-react";
import { ArrowDown, ArrowUp, Wallet } from "lucide-react";
import { useEffect } from "react";
import { CreateSupabaseClient } from "@/lib/supabase/client";

const dummyTransactions = [
  {
    id: 1,
    network: "MTN",
    amount: "₦500",
    status: "Successful",
    date: "2025-07-30",
  },
  {
    id: 2,
    network: "Glo",
    amount: "₦1000",
    status: "Failed",
    date: "2025-07-29",
  },
  {
    id: 3,
    network: "Airtel",
    amount: "₦750",
    status: "Successful",
    date: "2025-07-28",
  },
];

export default function DashboardMain() {
  console.log("DashboardMain mounted");

  useEffect(() => {
    console.log("useEffect fired ✅");

    async function checkSession() {
      const { data, error } = await CreateSupabaseClient.auth.getSession();
      if (error) {
        console.error("Error getting session:", error);
      } else {
        console.log("Session:", data.session);
      }
    }

    checkSession();
  }, []);

  return (
    <main className="py-6 bg-[#0d0f1a] text-white">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <UserStatsCard
          title="Wallet Balance"
          value="₦12,000"
          icon={<Wallet />}
        />
        <UserStatsCard
          title="Data Purchased"
          value="5.5GB"
          icon={<ArrowDown />}
        />
        <UserStatsCard title="Data Shared" value="1.2GB" icon={<ArrowUp />} />
      </div>

      {/* Transaction History */}
      <div className="bg-gray-900 p-4 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4 text-emerald-400">
          Recent Transactions
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-700">
                <th className="py-2">Network</th>
                <th className="py-2">Amount</th>
                <th className="py-2">Status</th>
                <th className="py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {dummyTransactions.map((tx) => (
                <tr key={tx.id} className="border-b border-gray-800">
                  <td className="py-3">{tx.network}</td>
                  <td>{tx.amount}</td>
                  <td>
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                        tx.status === "Successful"
                          ? "bg-emerald-500/10 text-emerald-600"
                          : "bg-red-500/10 text-red-600"
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td>{tx.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Centered Buy New Data Button */}
      <div className="mt-6 flex justify-center">
        <div className="flex justify-center mt-6">
          <Link href={"/dashboard/buy-data"}>
            <button className="bg-emerald-400 hover:bg-emerald-500 text-black font-bold px-6 py-2 sm:px-4 sm:py-2 text-sm sm:text-xs rounded transition duration-200">
              <span className="inline-flex items-center gap-2">
                <PlusIcon className="w-4 h-4" />
                <span>Buy New Data</span>
              </span>
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
