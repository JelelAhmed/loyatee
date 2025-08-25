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
    const result = await fundWallet({ success: false, error: null }, formData);
    setLoading(false);
    if (result.redirectUrl) router.push(result.redirectUrl);
    else if (result.error) setError(result.error);
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0d0f1a] text-white">
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
        {/* Fund Wallet Card (compact) */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-gray-900 p-6 sm:p-8 rounded-xl shadow border border-gray-800 mb-10">
            <h2 className="text-lg font-semibold mb-6 text-emerald-400">
              Fund Wallet
            </h2>
            <form action={handleFund} className="space-y-6">
              <div>
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-gray-400 mb-2"
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
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-colors"
                  disabled={loading}
                />
              </div>
              <div>
                <label
                  htmlFor="payment-method"
                  className="block text-sm font-medium text-gray-400 mb-2"
                >
                  Payment Method
                </label>
                <select
                  id="payment-method"
                  name="paymentMethod"
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-colors"
                  disabled={loading}
                >
                  <option value="card">Card</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="ussd">USSD</option>
                </select>
              </div>
              {success && (
                <div className="text-emerald-400 text-sm bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20">
                  {success}
                </div>
              )}
              {error && (
                <div className="text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                  {error}
                </div>
              )}
              <div>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading}
                  className="w-full bg-emerald-400 text-black font-bold py-3 px-4 rounded-lg hover:bg-emerald-500 transition-colors"
                >
                  {loading ? "Processing..." : "Fund Wallet"}
                </Button>
              </div>
            </form>
            <p className="mt-4 text-center text-sm text-gray-400">
              Current Balance: <span className="font-semibold">{balance}</span>
            </p>
          </div>
        </div>

        {/* Funding History (wider like dashboard) */}
        <div className="bg-gray-900 p-8 rounded-xl shadow border border-gray-800 max-w-4xl mx-auto">
          <h3 className="text-lg font-semibold mb-6 text-emerald-400">
            Funding History
          </h3>

          {/* Desktop Table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-700">
                  <th className="py-3">Date</th>
                  <th className="py-3">Amount</th>
                  <th className="py-3">Method</th>
                  <th className="py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {history.map((entry, i) => (
                  <tr
                    key={i}
                    className="border-b border-gray-800 hover:bg-gray-800/40"
                  >
                    <td className="py-4">{entry.date}</td>
                    <td>{entry.amount}</td>
                    <td>{entry.method}</td>
                    <td>
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                          entry.status === "Completed"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-red-500/10 text-red-400"
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

          {/* Mobile Cards */}
          <div className="sm:hidden space-y-4">
            {history.map((entry, i) => (
              <div
                key={i}
                className="bg-gray-900 p-5 rounded-lg border border-gray-700 text-sm text-white shadow-sm shadow-black/20"
              >
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-gray-400">Date</span>
                  <span>{entry.date}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-gray-400">Amount</span>
                  <span>{entry.amount}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-gray-400">Method</span>
                  <span>{entry.method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-400">Status</span>
                  <span
                    className={`inline-block px-2 py-1 rounded-full ${
                      entry.status === "Completed"
                        ? "text-emerald-400 bg-emerald-500/10"
                        : "text-red-400 bg-red-500/10"
                    }`}
                  >
                    {entry.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
