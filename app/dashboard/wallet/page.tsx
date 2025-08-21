"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button";
import { fundWallet, getWalletBalance } from "@/app/actions/wallet.actions";
import { CreateSupabaseClient } from "@/lib/supabase/client";

type FundingHistory = {
  date: string;
  amount: string;
  method: string;
  status: string;
};

export default function FundWallet() {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("card");
  const [balance, setBalance] = useState("₦0");
  const [history, setHistory] = useState<FundingHistory[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch wallet balance
        const balance = await getWalletBalance();
        setBalance(`₦${balance.toLocaleString()}`);

        // Fetch funding history
        const supabase = CreateSupabaseClient;
        const { data: user } = await supabase.auth.getUser();
        if (!user.user) throw new Error("Unauthorized");

        const { data, error: historyError } = await supabase
          .from("wallet_fundings")
          .select("id, created_at, amount, payment_method, status")
          .eq("user_id", user.user.id)
          .order("created_at", { ascending: false });
        if (historyError) throw new Error(historyError.message);

        setHistory(
          data.map((entry) => ({
            date: new Date(entry.created_at).toISOString().split("T")[0],
            amount: `₦${entry.amount.toLocaleString()}`,
            method:
              entry.payment_method.charAt(0).toUpperCase() +
              entry.payment_method.slice(1),
            status:
              entry.status.charAt(0).toUpperCase() + entry.status.slice(1),
          }))
        );

        // Check for payment success
        const reference = searchParams.get("reference");
        if (reference) {
          const { data: funding, error: fundingError } = await supabase
            .from("wallet_fundings")
            .select("status, amount")
            .eq("id", reference)
            .eq("user_id", user.user.id)
            .single();
          if (fundingError) throw new Error(fundingError.message);
          if (funding?.status === "completed") {
            setSuccess(
              `Successfully funded wallet with ₦${funding.amount.toLocaleString()}`
            );
            // Auto-dismiss success message after 5 seconds
            setTimeout(() => setSuccess(""), 5000);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      }
    }
    fetchData();
  }, [searchParams]);

  async function handleFund(formData: FormData) {
    setLoading(true);
    setError("");
    setSuccess("");
    const result = await fundWallet(
      { success: false, error: null }, // Default _prevState
      formData
    );
    setLoading(false);
    if (result.redirectUrl) router.push(result.redirectUrl);
    else if (result.error) setError(result.error);
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--navy-blue)]">
      <main className="flex-grow flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl space-y-8">
          <div className="bg-[var(--card-bg)] backdrop-blur-lg p-6 sm:p-8 rounded-2xl shadow-2xl shadow-black/30 border border-[var(--border-color)]">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 text-[var(--text-primary)]">
              Fund Wallet
            </h2>
            <form action={handleFund} className="space-y-6">
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
                  disabled={loading}
                  aria-label="Amount in Naira"
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
                  name="paymentMethod"
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="w-full bg-[var(--card-solid-bg)] border border-[var(--border-color)] rounded-lg py-3 px-4 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--emerald-green)] focus:border-transparent transition-colors appearance-none"
                  disabled={loading}
                  style={{
                    backgroundImage:
                      "url('data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 20 20%27%3e%3cpath stroke=%27%23A0AEC0%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%271.5%27 d=%27M6 8l4 4 4-4%27/%3e%3c/svg%3e')",
                    backgroundPosition: "right 0.5rem center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "1.5em 1.5em",
                  }}
                  aria-label="Payment method"
                >
                  <option value="card">Card</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="ussd">USSD</option>
                </select>
              </div>
              {success && (
                <div
                  className="text-[var(--emerald-green)] text-sm bg-[var(--emerald-green)]/10 p-3 rounded-lg shadow-md border border-[var(--emerald-green)]/20"
                  role="alert"
                >
                  {success}
                </div>
              )}
              {error && (
                <div
                  className="text-red-400 text-sm bg-red-400/10 p-3 rounded-lg shadow-md border border-red-400/20"
                  role="alert"
                >
                  {error}
                </div>
              )}
              <div>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading}
                  className="w-full bg-[var(--emerald-green)] text-[var(--navy-blue)] font-bold py-3 px-4 rounded-lg hover:bg-[var(--button-primary-hover)] transition-all duration-300 transform hover:scale-105 shadow-lg shadow-[var(--emerald-green)]/20"
                >
                  {loading ? "Processing..." : "Fund Wallet"}
                </Button>
              </div>
            </form>
            <p className="mt-4 text-center text-sm text-[var(--text-secondary)]">
              Current Balance: <span className="font-semibold">{balance}</span>
            </p>
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
                              entry.status === "Completed"
                                ? "text-green-500 bg-green-500/10"
                                : "text-red-400 bg-red-400/10"
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
                          entry.status === "Completed"
                            ? "text-green-500 bg-green-500/10"
                            : "text-red-400 bg-red-400/10"
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
