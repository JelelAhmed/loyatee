"use client";

import { useState } from "react";

export default function FundWallet() {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("Paystack");

  const history = [
    {
      date: "2024-07-26",
      amount: "₦5,000.00",
      method: "Paystack",
      status: "Successful",
    },
    {
      date: "2024-07-25",
      amount: "₦2,000.00",
      method: "Flutterwave",
      status: "Successful",
    },
    {
      date: "2024-07-24",
      amount: "₦10,000.00",
      method: "Paystack",
      status: "Successful",
    },
    {
      date: "2024-07-23",
      amount: "₦3,000.00",
      method: "Flutterwave",
      status: "Failed",
    },
    {
      date: "2024-07-22",
      amount: "₦1,500.00",
      method: "Paystack",
      status: "Successful",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--navy-blue)]">
      <main className="flex-grow flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl space-y-8">
          <div className="bg-[var(--card-bg)] backdrop-blur-lg p-6 sm:p-8 rounded-2xl shadow-2xl shadow-black/30 border border-[var(--border-color)]">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 text-[var(--text-primary)]">
              Fund Wallet
            </h2>
            <form className="space-y-6">
              <div>
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-[var(--text-secondary)] mb-2"
                >
                  Amount (₦)
                </label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="1000"
                  className="w-full bg-[var(--input-bg-color)] border border-[var(--border-color)] rounded-lg py-3 px-4 text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--emerald-green)] focus:border-transparent transition-colors"
                />
              </div>
              <div>
                <label
                  htmlFor="payment-method"
                  className="block text-sm font-medium text-[var(--text-secondary)] mb-2"
                >
                  Payment Method
                </label>
                <select
                  id="payment-method"
                  name="payment-method"
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="w-full bg-[var(--card-solid-bg)] border border-[var(--border-color)] rounded-lg py-3 px-4 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--emerald-green)] focus:border-transparent transition-colors appearance-none"
                  style={{
                    backgroundImage:
                      "url('data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 20 20%27%3e%3cpath stroke=%27%23A0AEC0%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%271.5%27 d=%27M6 8l4 4 4-4%27/%3e%3c/svg%3e')",
                    backgroundPosition: "right 0.5rem center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "1.5em 1.5em",
                  }}
                >
                  <option>Paystack</option>
                  <option>Flutterwave</option>
                </select>
              </div>
              <div>
                <button
                  type="button"
                  className="w-full bg-[var(--emerald-green)] text-[var(--navy-blue)] font-bold py-3 px-4 rounded-lg hover:bg-[var(--button-primary-hover)] transition-all duration-300 transform hover:scale-105 shadow-lg shadow-[var(--emerald-green)]/20"
                >
                  Fund Wallet
                </button>
              </div>
            </form>
          </div>
          <div className="bg-[var(--card-bg)] backdrop-blur-lg p-6 sm:p-8 rounded-2xl shadow-2xl shadow-black/30 border border-[var(--border-color)]">
            <h3 className="text-xl sm:text-2xl font-bold mb-6 text-[var(--text-primary)]">
              Funding History
            </h3>
            <div className="space-y-4 sm:overflow-x-auto">
              <div className="hidden sm:block">
                <table className="min-w-full">
                  <thead>
                    <tr>
                      {["Date", "Amount", "Method", "Status"].map((h) => (
                        <th
                          key={h}
                          className="px-5 py-3 border-b-2 border-[var(--border-color)] text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((entry, i) => (
                      <tr key={i}>
                        <td className="px-5 py-5 border-b border-[var(--border-color)] text-sm text-[var(--text-primary)]/90">
                          {entry.date}
                        </td>
                        <td className="px-5 py-5 border-b border-[var(--border-color)] text-sm text-[var(--text-primary)]/90">
                          {entry.amount}
                        </td>
                        <td className="px-5 py-5 border-b border-[var(--border-color)] text-sm text-[var(--text-primary)]/90">
                          {entry.method}
                        </td>
                        <td className="px-5 py-5 border-b border-[var(--border-color)] text-sm">
                          <span
                            className={`relative inline-block px-3 py-1 font-semibold leading-tight rounded-full ${
                              entry.status === "Successful"
                                ? "text-green-500 bg-green-500/10"
                                : "text-red-500 bg-red-500/10"
                            }`}
                          >
                            {entry.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="sm:hidden space-y-4">
                {history.map((entry, i) => (
                  <div
                    key={i}
                    className="bg-[var(--card-solid-bg)] p-4 rounded-lg border border-[var(--border-color)] text-xs text-[var(--text-primary)]/90"
                  >
                    <div className="flex justify-between">
                      <span className="font-semibold text-[var(--text-secondary)]">
                        Date
                      </span>
                      <span>{entry.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-[var(--text-secondary)]">
                        Amount
                      </span>
                      <span>{entry.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-[var(--text-secondary)]">
                        Method
                      </span>
                      <span>{entry.method}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-[var(--text-secondary)]">
                        Status
                      </span>
                      <span
                        className={`inline-block px-2 py-1 font-semibold leading-tight rounded-full ${
                          entry.status === "Successful"
                            ? "text-green-500 bg-green-500/10"
                            : "text-red-500 bg-red-500/10"
                        }`}
                      >
                        {entry.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
