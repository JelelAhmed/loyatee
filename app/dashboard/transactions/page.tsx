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
    <div className="min-h-screen flex flex-col bg-[var(--navy-blue)]">
      <main className="flex-grow py-8 sm:py-12 px-4 sm:px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
              Transactions
            </h2>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search orders..."
                className="bg-[var(--card-solid-bg)] border border-[var(--border-color)] rounded-lg px-4 py-2 text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--emerald-green)] focus:border-[var(--emerald-green)] transition-all"
              />
              <button
                type="button"
                className="bg-[var(--card-solid-bg)] border border-[var(--border-color)] rounded-lg px-4 py-2 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition-colors"
              >
                Filters
              </button>
            </div>
          </div>
          <div className="bg-[var(--card-solid-bg)] rounded-2xl overflow-hidden border border-[var(--border-color)]">
            <div className="space-y-4">
              <div className="hidden sm:block">
                <table className="w-full text-left">
                  <thead className="border-b border-[var(--border-color)] bg-[var(--card-bg)]">
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
                          className="px-4 py-3 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider"
                          scope="col"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-color)]">
                    {transactions.map((entry, i) => (
                      <tr
                        key={i}
                        className="hover:bg-[var(--emerald-green)]/10 transition-colors cursor-pointer"
                      >
                        <td className="px-4 py-4 whitespace-nowrap text-xs text-[var(--text-secondary)]">
                          {entry.date}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-xs font-medium text-[var(--text-primary)]">
                          {entry.type}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-xs text-[var(--text-primary)]">
                          {entry.network || "-"}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-xs text-[var(--text-secondary)]">
                          {entry.amount}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-xs text-[var(--text-primary)]">
                          {entry.dataSize || "-"}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-xs text-[var(--text-primary)]">
                          {entry.duration || "-"}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-xs text-[var(--text-primary)]">
                          {entry.phone || "-"}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-xs">
                          <span
                            className={`relative inline-block px-2 py-1 font-medium text-xs rounded-full capitalize ${
                              entry.status === "Successful"
                                ? "text-green-500 bg-green-500/10"
                                : entry.status === "Pending"
                                ? "text-yellow-500 bg-yellow-500/10"
                                : "text-red-500 bg-red-500/10"
                            }`}
                          >
                            {entry.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-xs font-medium">
                          <a
                            href="#"
                            className="text-[var(--emerald-green)] hover:text-[var(--button-primary-hover)] transition-colors"
                          >
                            View Details
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="sm:hidden space-y-4 p-4">
                {transactions.map((entry, i) => (
                  <div
                    key={i}
                    className="bg-[var(--card-bg)] p-4 rounded-lg border border-[var(--border-color)] text-xs text-[var(--text-primary)]/90"
                  >
                    <div className="flex justify-between">
                      <span className="font-semibold text-[var(--text-secondary)]">
                        Date
                      </span>
                      <span>{entry.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-[var(--text-secondary)]">
                        Type
                      </span>
                      <span>{entry.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-[var(--text-secondary)]">
                        Network
                      </span>
                      <span>{entry.network || "-"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-[var(--text-secondary)]">
                        Amount
                      </span>
                      <span>{entry.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-[var(--text-secondary)]">
                        Data Size
                      </span>
                      <span>{entry.dataSize || "-"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-[var(--text-secondary)]">
                        Duration
                      </span>
                      <span>{entry.duration || "-"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-[var(--text-secondary)]">
                        Phone
                      </span>
                      <span>{entry.phone || "-"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-[var(--text-secondary)]">
                        Status
                      </span>
                      <span
                        className={`inline-block px-2 py-1 font-medium rounded-full capitalize ${
                          entry.status === "Successful"
                            ? "text-green-500 bg-green-500/10"
                            : entry.status === "Pending"
                            ? "text-yellow-500 bg-yellow-500/10"
                            : "text-red-500 bg-red-500/10"
                        }`}
                      >
                        {entry.status}
                      </span>
                    </div>
                    <div className="flex justify-end mt-2">
                      <a
                        href="#"
                        className="text-[var(--emerald-green)] hover:text-[var(--button-primary-hover)] text-xs font-medium"
                      >
                        View Details
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-[var(--border-color)] px-6 py-3">
              <p className="text-xs text-[var(--text-secondary)]">
                Showing 1 to 5 of 20 results
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="px-3 py-1 text-xs font-medium rounded-md bg-[var(--card-bg)] hover:bg-[var(--hover-bg)] transition-colors disabled:opacity-50"
                  disabled
                >
                  Previous
                </button>
                <button
                  type="button"
                  className="px-3 py-1 text-xs font-medium rounded-md bg-[var(--card-bg)] hover:bg-[var(--hover-bg)] transition-colors"
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
