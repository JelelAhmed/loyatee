"use client";

import { useState } from "react";

export default function DataPlansPage() {
  const [search, setSearch] = useState("");

  const dataPlans = [
    { network: "MTN", dataSize: "1GB", price: "₦500", duration: "7 Days" },
    { network: "Glo", dataSize: "2GB", price: "₦1,000", duration: "30 Days" },
    { network: "Airtel", dataSize: "750MB", price: "₦300", duration: "7 Days" },
    {
      network: "9mobile",
      dataSize: "1.5GB",
      price: "₦800",
      duration: "14 Days",
    },
    { network: "MTN", dataSize: "3GB", price: "₦1,500", duration: "30 Days" },
  ];

  return (
    <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">
            Data Plans
          </h2>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search data plans..."
              className="bg-[var(--card-background-color)]/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition-all"
            />
            <button
              type="button"
              className="bg-[var(--card-background-color)]/50 border border-white/10 rounded-lg px-4 py-2 text-sm font-medium text-[var(--text-primary)] hover:bg-white/10 transition-colors"
            >
              Filters
            </button>
            <button
              type="button"
              className="bg-[var(--primary-color)] rounded-lg px-4 py-2 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--primary-color)]/80 transition-colors"
            >
              Add Plan
            </button>
          </div>
        </div>
        <div className="bg-[var(--card-background-color)]/50 border border-white/10 backdrop-blur-lg rounded-lg overflow-hidden">
          <div className="hidden sm:block">
            <table className="w-full text-sm text-left text-[var(--text-secondary)]">
              <thead className="text-xs text-[var(--text-primary)] uppercase bg-white/5">
                <tr>
                  {["Network", "Data Size", "Price", "Duration", "Actions"].map(
                    (h) => (
                      <th key={h} className="px-6 py-3" scope="col">
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {dataPlans.map((plan, i) => (
                  <tr
                    key={i}
                    className="border-b border-white/10 hover:bg-white/10 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-[var(--text-primary)]">
                      {plan.network}
                    </td>
                    <td className="px-6 py-4">{plan.dataSize}</td>
                    <td className="px-6 py-4">{plan.price}</td>
                    <td className="px-6 py-4">{plan.duration}</td>
                    <td className="px-6 py-4 text-right">
                      <a
                        href="#"
                        className="text-[var(--primary-color)] hover:text-[var(--primary-color)]/80 mr-4"
                      >
                        Edit
                      </a>
                      <a
                        href="#"
                        className="text-red-400 hover:text-red-400/80"
                      >
                        Delete
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="sm:hidden space-y-4 p-4">
            {dataPlans.map((plan, i) => (
              <div
                key={i}
                className="bg-[var(--card-background-color)]/50 p-4 rounded-lg border border-white/10 text-sm text-[var(--text-primary)]/90"
              >
                <div className="flex justify-between">
                  <span className="font-semibold text-[var(--text-secondary)]">
                    Network
                  </span>
                  <span>{plan.network}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-[var(--text-secondary)]">
                    Data Size
                  </span>
                  <span>{plan.dataSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-[var(--text-secondary)]">
                    Price
                  </span>
                  <span>{plan.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-[var(--text-secondary)]">
                    Duration
                  </span>
                  <span>{plan.duration}</span>
                </div>
                <div className="flex justify-end gap-4 mt-2">
                  <a
                    href="#"
                    className="text-[var(--primary-color)] hover:text-[var(--primary-color)]/80"
                  >
                    Edit
                  </a>
                  <a href="#" className="text-red-400 hover:text-red-400/80">
                    Delete
                  </a>
                </div>
              </div>
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
