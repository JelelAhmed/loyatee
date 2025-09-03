"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button";
import { fundWallet, getWalletBalance } from "@/app/actions/wallet.actions";
import { CreateSupabaseClient } from "@/lib/supabase/client";
import PaginationControls from "@/components/ui/paginationControls";
import { usePagination } from "@/hooks/usePagination";
import { formatFundingType } from "@/lib/utils";
import PaystackPop from "@paystack/inline-js";

type FundingHistory = {
  date: string;
  amount: string;
  method: string;
  status: string;
  payment_reference: string;
};

// Small helpers for cleaner form markup
function FormInput({ label, id, ...props }: any) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-400 mb-2"
      >
        {label}
      </label>
      <input
        id={id}
        {...props}
        className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white placeholder-gray-500 
                   focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-colors"
      />
    </div>
  );
}

function FormSelect({ label, id, children, ...props }: any) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-400 mb-2"
      >
        {label}
      </label>
      <select
        id={id}
        {...props}
        className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white 
                   focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-colors"
      >
        {children}
      </select>
    </div>
  );
}

function FormMessage({
  type,
  message,
}: {
  type: "success" | "error";
  message: string;
}) {
  if (!message) return null;

  const styles =
    type === "success"
      ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
      : "text-red-400 bg-red-500/10 border-red-500/20";

  return (
    <div className={`text-sm p-3 rounded-lg border ${styles}`}>{message}</div>
  );
}

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

  async function fetchWalletData(
    setBalance,
    setHistory,
    setError,
    searchParams
  ) {
    try {
      const balance = await getWalletBalance();
      setBalance(`₦${balance.toLocaleString()}`);

      const supabase = CreateSupabaseClient;
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Unauthorized");

      const { data, error: historyError } = await supabase
        .from("wallet_fundings")
        .select(
          "id, created_at, amount, payment_method, payment_reference, status"
        )
        .eq("user_id", user.user.id)
        .order("created_at", { ascending: false });

      if (historyError) throw new Error(historyError.message);

      setHistory(
        data.map((entry) => ({
          date: new Date(entry.created_at).toISOString().split("T")[0],
          amount: `₦${entry.amount.toLocaleString()}`,
          method: entry.payment_method,
          payment_reference: entry.payment_reference,
          status: entry.status,
        }))
      );

      // handle "reference" in query params
      const reference = searchParams.get("reference");
      if (reference) {
        const { data: funding } = await supabase
          .from("wallet_fundings")
          .select("status, amount")
          .eq("payment_reference", reference)
          .eq("user_id", user.user.id)
          .single();

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
  useEffect(() => {
    fetchWalletData(setBalance, setHistory, setError, searchParams);
  }, [searchParams]);

  async function handleFund(formData: FormData) {
    setLoading(true);
    setError("");
    setSuccess("");

    const result = await fundWallet({ success: false, error: null }, formData);

    if (!result.success || !result.reference) {
      setError(result.error ?? "Unknown error");
      setLoading(false); // stop loading if init failed
      return;
    }

    const supabase = CreateSupabaseClient;
    const { data: user } = await supabase.auth.getUser();
    const paystack = new PaystackPop();

    const handleFinish = () => setLoading(false); // helper to stop loading in all paths

    if (result.access_code) {
      console.log("🔄 Resuming transaction:", result.access_code);

      paystack.resumeTransaction(result.access_code, {
        onSuccess: async (trx) => {
          setSuccess("Payment successful! Verifying…");

          try {
            const res = await fetch("/api/verify-funding", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ reference: trx.reference }),
            });

            const verifyResult = await res.json();
            if (verifyResult.success) {
              setSuccess("✅ Wallet funded successfully!");
              await fetchWalletData(
                setBalance,
                setHistory,
                setError,
                searchParams
              );
            } else {
              setError("⚠️ Verification failed: " + verifyResult.error);
            }
          } catch (err) {
            setError(
              err instanceof Error ? err.message : "Verification failed"
            );
          } finally {
            handleFinish();
          }
        },
        onCancel: () => {
          setError("Payment cancelled.");
          handleFinish();
        },
        onError: (err) => {
          console.error("❌ Paystack error:", err);
          setError(err.message);
          handleFinish();
        },
        onLoad: (tranx) => console.log("💡 Transaction loaded:", tranx),
      });
    } else {
      console.log(
        "🚀 Starting new transaction with reference:",
        result.reference
      );

      paystack.newTransaction({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
        email: user.user?.email || "abduljelelahmed@gmail.com",
        amount: Number(formData.get("amount")) * 100,
        reference: result.reference,
        onSuccess: async (trx) => {
          setSuccess("Payment successful! Verifying…");

          try {
            const res = await fetch("/api/verify-funding", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ reference: trx.reference }),
            });

            const verifyResult = await res.json();
            if (verifyResult.success) {
              setSuccess("✅ Wallet funded successfully!");
              await fetchWalletData(
                setBalance,
                setHistory,
                setError,
                searchParams
              );
            } else {
              setError("⚠️ Verification failed: " + verifyResult.error);
            }
          } catch (err) {
            setError(
              err instanceof Error ? err.message : "Verification failed"
            );
          } finally {
            handleFinish();
          }
        },
        onCancel: () => {
          setError("Payment cancelled.");
          handleFinish();
        },
        onError: (err) => {
          console.error("❌ Paystack error:", err);
          setError(err.message);
          handleFinish();
        },
      });
    }
  }

  const {
    page: historyPage,
    totalPages: historyTotalPages,
    pagedItems: pagedHistory,
    nextPage: nextHistoryPage,
    prevPage: prevHistoryPage,
    setPage: setHistoryPage,
  } = usePagination(history, 10);

  return (
    <div className="min-h-screen flex flex-col bg-[#0d0f1a] text-white">
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
        {/* Fund Wallet Card */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-gray-900 p-6 sm:p-8 rounded-xl shadow border border-gray-800 mb-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-emerald-400">
                Fund Wallet
              </h2>
              <span className="px-3 py-1 text-sm font-semibold bg-gray-800 border border-gray-700 rounded-lg text-emerald-300">
                Balance: {balance}
              </span>
            </div>

            {/* <form action={handleFund} className="space-y-6"> */}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                await handleFund(formData);
              }}
              className="space-y-6"
            >
              <FormInput
                label="Amount (₦)"
                type="number"
                id="amount"
                name="amount"
                value={amount}
                onChange={(e: any) => setAmount(e.target.value)}
                placeholder="1000"
                disabled={loading}
              />

              <FormSelect
                label="Payment Method"
                id="payment-method"
                name="paymentMethod"
                value={method}
                onChange={(e: any) => setMethod(e.target.value)}
                disabled={loading}
              >
                <option value="card">Card</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="ussd">USSD</option>
              </FormSelect>

              <FormMessage type="success" message={success} />
              <FormMessage type="error" message={error} />

              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                className="w-full bg-emerald-400 text-black font-bold py-3 px-4 rounded-lg hover:bg-emerald-500 transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Fund Wallet"
                )}
              </Button>
            </form>
          </div>
        </div>

        {/* Funding History */}
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
                  <th className="py-3">Reference</th>
                  <th className="py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {pagedHistory.map((entry, i) => (
                  <tr
                    key={i}
                    className="border-b border-gray-800 hover:bg-gray-800/40"
                  >
                    <td className="py-4">{entry.date}</td>
                    <td>{entry.amount}</td>
                    <td>{formatFundingType(entry.method)}</td>
                    <td>{entry.payment_reference}</td>
                    <td>
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                          entry.status.toLowerCase() === "completed"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {entry.status.charAt(0).toUpperCase() +
                          entry.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="sm:hidden space-y-4">
            {pagedHistory.map((entry, i) => (
              <div
                key={i}
                className="bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-700 
                 hover:bg-gray-700/60 transition-colors"
              >
                {/* Top row: date + status */}
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs text-gray-400">{entry.date}</span>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      entry.status.toLowerCase() === "completed"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : entry.status.toLowerCase() === "pending"
                        ? "bg-yellow-500/10 text-yellow-400"
                        : "bg-red-500/10 text-red-400"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        entry.status.toLowerCase() === "completed"
                          ? "bg-emerald-400"
                          : entry.status.toLowerCase() === "pending"
                          ? "bg-yellow-400"
                          : "bg-red-400"
                      }`}
                    />
                    {entry.status}
                  </span>
                </div>

                {/* Amount */}
                <div className="text-xl font-bold text-white mb-2">
                  {entry.amount}
                </div>

                {/* Method + Ref */}
                <div className="flex justify-between items-center text-sm">
                  <span className="flex items-center gap-2 text-gray-300">
                    {/* You can swap these with icons based on entry.method */}
                    {formatFundingType(entry.method)}
                  </span>
                  <button
                    className="text-xs text-gray-400 bg-gray-900 px-2 py-0.5 rounded hover:text-gray-200"
                    onClick={() =>
                      navigator.clipboard.writeText(entry.payment_reference)
                    }
                  >
                    #{entry.payment_reference}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* <div className="sm:hidden space-y-4">
            {pagedHistory.map((entry, i) => (
              <div
                key={i}
                className="bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-800"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400 text-sm">{entry.date}</span>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      entry.status.toLowerCase() === "completed"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-red-500/10 text-red-400"
                    }`}
                  >
                    {entry.status.charAt(0).toUpperCase() +
                      entry.status.slice(1)}
                  </span>
                </div>

                <div className="text-lg font-semibold text-white mb-1">
                  {entry.amount}
                </div>

                <div className="text-sm text-gray-400 mb-1">
                  {formatFundingType(entry.method)}
                </div>

                <code className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded">
                  {entry.payment_reference}
                </code>
              </div>
            ))}
          </div> */}

          {/* Pagination */}
          <div className="mt-6 flex justify-center">
            <PaginationControls
              page={historyPage}
              totalPages={historyTotalPages}
              onPrev={prevHistoryPage}
              onNext={nextHistoryPage}
              onSetPage={setHistoryPage}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
