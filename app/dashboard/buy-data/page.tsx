"use client";

import { useState } from "react";

export default function BuyData() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [network, setNetwork] = useState("MTN");
  const [selectedPlan, setSelectedPlan] = useState("1GB - ₦500 - 7 Days");

  const history = [
    {
      date: "26 Jul, 2024",
      amount: "₦500.00",
      network: "MTN",
      plan: "1GB",
      duration: "7 Days",
      phone: "08012345678",
      status: "Successful",
    },
    {
      date: "25 Jul, 2024",
      amount: "₦1,000.00",
      network: "Airtel",
      plan: "2GB",
      duration: "30 Days",
      phone: "08123456789",
      status: "Successful",
    },
    {
      date: "24 Jul, 2024",
      amount: "₦2,000.00",
      network: "Glo",
      plan: "5GB",
      duration: "30 Days",
      phone: "09034567890",
      status: "Failed",
    },
    {
      date: "23 Jul, 2024",
      amount: "₦750.00",
      network: "9mobile",
      plan: "1.5GB",
      duration: "7 Days",
      phone: "07045678901",
      status: "Successful",
    },
    {
      date: "22 Jul, 2024",
      amount: "₦500.00",
      network: "MTN",
      plan: "1GB",
      duration: "7 Days",
      phone: "08098765432",
      status: "Successful",
    },
  ];

  const networkOptions = ["MTN", "Airtel", "Glo", "9mobile"];
  const dataPlans = [
    { plan: "500MB", price: "₦300", duration: "7 Days" },
    { plan: "1GB", price: "₦500", duration: "7 Days" },
    { plan: "2GB", price: "₦1,000", duration: "30 Days" },
    { plan: "5GB", price: "₦2,000", duration: "30 Days" },
    { plan: "10GB", price: "₦3,500", duration: "30 Days" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--navy-blue)]">
      <main className="flex-grow flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-4xl space-y-8">
          <div className="bg-[var(--card-bg)] backdrop-blur-lg p-6 sm:p-8 rounded-2xl shadow-2xl shadow-black/30 border border-[var(--border-color)]">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 text-[var(--text-primary)]">
              Buy Data
            </h2>
            <form className="space-y-6">
              <div>
                <label
                  htmlFor="phone-number"
                  className="block text-sm font-medium text-[var(--text-secondary)] mb-2"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone-number"
                  name="phone-number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="08012345678"
                  className="w-full bg-[var(--input-bg-color)] border border-[var(--border-color)] rounded-lg py-3 px-4 text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--emerald-green)] focus:border-transparent transition-colors"
                />
              </div>
              <div>
                <label
                  htmlFor="network"
                  className="block text-sm font-medium text-[var(--text-secondary)] mb-2"
                >
                  Network Provider
                </label>
                <select
                  id="network"
                  name="network"
                  value={network}
                  onChange={(e) => setNetwork(e.target.value)}
                  className="w-full bg-[var(--card-solid-bg)] border border-[var(--border-color)] rounded-lg py-3 px-4 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--emerald-green)] focus:border-transparent transition-colors appearance-none"
                  style={{
                    backgroundImage:
                      "url('data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 20 20%27%3e%3cpath stroke=%27%23A0AEC0%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%271.5%27 d=%27M6 8l4 4 4-4%27/%3e%3c/svg%3e')",
                    backgroundPosition: "right 0.5rem center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "1.5em 1.5em",
                  }}
                >
                  {networkOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                  Data Plan
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {dataPlans.map((plan) => (
                    <button
                      key={plan.plan}
                      type="button"
                      onClick={() =>
                        setSelectedPlan(
                          `${plan.plan} - ${plan.price} - ${plan.duration}`
                        )
                      }
                      className={`p-3 rounded-lg border transition-all duration-200 ${
                        selectedPlan ===
                        `${plan.plan} - ${plan.price} - ${plan.duration}`
                          ? "bg-[var(--emerald-green)] text-[var(--navy-blue)] border-[var(--emerald-green)]"
                          : "bg-[var(--card-solid-bg)] text-[var(--text-primary)] border-[var(--border-color)] hover:bg-[var(--hover-bg)] hover:border-[var(--emerald-green)]"
                      }`}
                    >
                      <div className="text-left">
                        <p className="font-bold text-sm">{plan.plan}</p>
                        <p
                          className={`text-xs font-medium ${
                            selectedPlan ===
                            `${plan.plan} - ${plan.price} - ${plan.duration}`
                              ? "text-[var(--text-primary)]"
                              : "text-[var(--text-secondary)]/90"
                          }`}
                        >
                          {plan.price}
                        </p>
                        <p
                          className={`text-xs ${
                            selectedPlan ===
                            `${plan.plan} - ${plan.price} - ${plan.duration}`
                              ? "text-[var(--text-primary)]/80"
                              : "text-[var(--text-secondary)]/80"
                          }`}
                        >
                          {plan.duration}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <button
                  type="button"
                  className="w-full bg-[var(--emerald-green)] text-[var(--navy-blue)] font-bold py-3 px-4 rounded-lg hover:bg-[var(--button-primary-hover)] transition-all duration-300 transform hover:scale-105 shadow-lg shadow-[var(--emerald-green)]/20"
                >
                  Buy Data
                </button>
              </div>
            </form>
          </div>
          <div className="bg-[var(--card-bg)] backdrop-blur-lg p-6 sm:p-8 rounded-2xl shadow-2xl shadow-black/30 border border-[var(--border-color)]">
            <h3 className="text-xl sm:text-2xl font-bold mb-6 text-[var(--text-primary)]">
              Purchase History
            </h3>
            <div className="space-y-4">
              <div className="hidden sm:block">
                <table className="w-full">
                  <thead>
                    <tr>
                      {[
                        "Date",
                        "Amount",
                        "Network",
                        "Plan",
                        "Duration",
                        "Phone",
                        "Status",
                      ].map((h) => (
                        <th
                          key={h}
                          className="px-4 py-3 border-b-2 border-[var(--border-color)] text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((entry, i) => (
                      <tr key={i}>
                        <td className="px-4 py-4 border-b border-[var(--border-color)] text-xs text-[var(--text-primary)]/90">
                          {entry.date}
                        </td>
                        <td className="px-4 py-4 border-b border-[var(--border-color)] text-xs text-[var(--text-primary)]/90">
                          {entry.amount}
                        </td>
                        <td className="px-4 py-4 border-b border-[var(--border-color)] text-xs text-[var(--text-primary)]/90">
                          {entry.network}
                        </td>
                        <td className="px-4 py-4 border-b border-[var(--border-color)] text-xs text-[var(--text-primary)]/90">
                          {entry.plan}
                        </td>
                        <td className="px-4 py-4 border-b border-[var(--border-color)] text-xs text-[var(--text-primary)]/90">
                          {entry.duration}
                        </td>
                        <td className="px-4 py-4 border-b border-[var(--border-color)] text-xs text-[var(--text-primary)]/90">
                          {entry.phone}
                        </td>
                        <td className="px-4 py-4 border-b border-[var(--border-color)] text-xs">
                          <span
                            className={`relative inline-block px-2 py-1 font-semibold leading-tight rounded-full ${
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
                        Network
                      </span>
                      <span>{entry.network}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-[var(--text-secondary)]">
                        Plan
                      </span>
                      <span>{entry.plan}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-[var(--text-secondary)]">
                        Duration
                      </span>
                      <span>{entry.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-[var(--text-secondary)]">
                        Phone
                      </span>
                      <span>{entry.phone}</span>
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
