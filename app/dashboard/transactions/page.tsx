"use client";

import { useState } from "react";

export default function Transactions() {
  const [search, setSearch] = useState("");

  const transactions = [
    {
      date: "26 Jul, 2024, 2:30 PM",
      type: "Data Purchase",
      network: "MTN",
      amount: "₦500.00",
      dataSize: "1GB",
      duration: "7 Days",
      phone: "08012345678",
      status: "Successful",
    },
    {
      date: "25 Jul, 2024, 10:15 AM",
      type: "Data Purchase",
      network: "Glo",
      amount: "₦1,000.00",
      dataSize: "2GB",
      duration: "30 Days",
      phone: "08123456789",
      status: "Successful",
    },
    {
      date: "24 Jul, 2024, 4:45 PM",
      type: "Airtime Purchase",
      network: "Airtel",
      amount: "₦200.00",
      dataSize: null,
      duration: null,
      phone: "09034567890",
      status: "Failed",
    },
    {
      date: "23 Jul, 2024, 9:00 AM",
      type: "Data Purchase",
      network: "9mobile",
      amount: "₦300.00",
      dataSize: "750MB",
      duration: "7 Days",
      phone: "07045678901",
      status: "Successful",
    },
    {
      date: "22 Jul, 2024, 11:20 AM",
      type: "Wallet Funding",
      network: null,
      amount: "₦500.00",
      dataSize: null,
      duration: null,
      phone: null,
      status: "Pending",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#0d0f1a] text-white">
      <main className="flex-grow py-8 sm:py-12 px-4 sm:px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-emerald-400">
              Transactions
            </h2>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search orders..."
                className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
              />
              <button
                type="button"
                className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
              >
                Filters
              </button>
            </div>
          </div>

          {/* Transactions Table / Cards */}
          <div className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 shadow">
            <div className="space-y-4">
              {/* Desktop Table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-gray-800 bg-gray-900/70">
                    <tr>
                      {[
                        "Date",
                        "Type",
                        "Network",
                        "Amount",
                        "Data Size",
                        "Duration",
                        "Phone",
                        "Status",
                        "",
                      ].map((h) => (
                        <th
                          key={h}
                          className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider"
                          scope="col"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {transactions.map((entry, i) => (
                      <tr
                        key={i}
                        className="hover:bg-gray-800/40 transition-colors"
                      >
                        <td className="px-5 py-4 text-gray-400">
                          {entry.date}
                        </td>
                        <td className="px-5 py-4 font-medium">{entry.type}</td>
                        <td className="px-5 py-4">{entry.network || "-"}</td>
                        <td className="px-5 py-4 text-gray-300">
                          {entry.amount}
                        </td>
                        <td className="px-5 py-4">{entry.dataSize || "-"}</td>
                        <td className="px-5 py-4">{entry.duration || "-"}</td>
                        <td className="px-5 py-4">{entry.phone || "-"}</td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                              entry.status === "Successful"
                                ? "bg-emerald-500/10 text-emerald-400"
                                : entry.status === "Pending"
                                ? "bg-yellow-500/10 text-yellow-400"
                                : "bg-red-500/10 text-red-400"
                            }`}
                          >
                            {entry.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <a
                            href="#"
                            className="text-emerald-400 hover:text-emerald-500 transition-colors text-xs font-medium"
                          >
                            View Details
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="sm:hidden space-y-4 p-4">
                {transactions.map((entry, i) => (
                  <div
                    key={i}
                    className="bg-gray-900 p-5 rounded-lg border border-gray-800 shadow-sm text-xs"
                  >
                    {[
                      ["Date", entry.date],
                      ["Type", entry.type],
                      ["Network", entry.network || "-"],
                      ["Amount", entry.amount],
                      ["Data Size", entry.dataSize || "-"],
                      ["Duration", entry.duration || "-"],
                      ["Phone", entry.phone || "-"],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="flex justify-between mb-2 last:mb-0"
                      >
                        <span className="font-semibold text-gray-400">
                          {label}
                        </span>
                        <span className="text-white">{value}</span>
                      </div>
                    ))}
                    <div className="flex justify-between mt-2">
                      <span className="font-semibold text-gray-400">
                        Status
                      </span>
                      <span
                        className={`inline-block px-2 py-1 rounded-full ${
                          entry.status === "Successful"
                            ? "text-emerald-400 bg-emerald-500/10"
                            : entry.status === "Pending"
                            ? "text-yellow-400 bg-yellow-500/10"
                            : "text-red-400 bg-red-500/10"
                        }`}
                      >
                        {entry.status}
                      </span>
                    </div>
                    <div className="flex justify-end mt-3">
                      <a
                        href="#"
                        className="text-emerald-400 hover:text-emerald-500 text-xs font-medium"
                      >
                        View Details
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between border-t border-gray-800 px-6 py-3">
              <p className="text-xs text-gray-400">
                Showing 1 to 5 of 20 results
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="px-3 py-1 text-xs font-medium rounded-lg bg-gray-900 border border-gray-800 hover:bg-gray-800 transition-colors disabled:opacity-50"
                  disabled
                >
                  Previous
                </button>
                <button
                  type="button"
                  className="px-3 py-1 text-xs font-medium rounded-lg bg-gray-900 border border-gray-800 hover:bg-gray-800 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
