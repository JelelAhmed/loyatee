"use client";

import { useState, useEffect, useMemo } from "react";
import {
  getCustomerDataPlans,
  purchaseDataPlan,
} from "@/app/actions/data.actions";
import { CreateSupabaseClient } from "@/lib/supabase/client";
import { CheckCircle2, Loader2, Pencil } from "lucide-react";
import { XCircle, ChevronRight, ChevronLeft } from "lucide-react";

import { toast } from "sonner";
import { DataPlan } from "@/types/dataPlans";
import { NETWORK_MAPPING } from "@/lib/datastation/constants";
import { NETWORK_LOGOS } from "@/lib/utils";
import { NetworkLogo } from "@/components/NetworkLogos";
import { Transaction } from "@/types/transactions";
import { usePagination } from "@/hooks/usePagination";
import PaginationControls from "@/components/ui/paginationControls";
import { motion } from "framer-motion";

export default function DataPlansPage() {
  const [plans, setPlans] = useState<DataPlan[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedNetwork, setSelectedNetwork] = useState<string>("");
  const [selectedPlanType, setSelectedPlanType] = useState<string>("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [selectedPlan, setSelectedPlan] = useState<DataPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // fetch plans + transactions
  useEffect(() => {
    async function fetchData() {
      const { plans, error } = await getCustomerDataPlans();
      setPlans(plans);
      setError(error);

      const supabase = CreateSupabaseClient;
      const { data: userRes } = await supabase.auth.getUser();
      if (userRes.user) {
        const { data: txData } = await supabase
          .from("transactions")
          .select("*")
          .eq("user_id", userRes.user.id)
          .eq("type", "data_purchase")
          .order("created_at", { ascending: false });
        setTransactions(txData ?? []);
      }
    }
    fetchData();
  }, []);

  // Reset to page 0 when network changes
  useEffect(() => {
    resetPlanPage();
  }, [selectedNetwork]);

  const networks = useMemo(
    () => Array.from(new Set(plans.map((p) => p.plan_network))),
    [plans]
  );

  const planTypes = useMemo(
    () =>
      Array.from(
        new Set(
          plans
            .filter((p) => p.plan_network === selectedNetwork)
            .map((p) => p.plan_type)
        )
      ),
    [plans, selectedNetwork]
  );

  const filteredPlans = useMemo(
    () =>
      plans
        .filter((p) => p.plan_network === selectedNetwork)
        .filter((p) =>
          selectedPlanType ? p.plan_type === selectedPlanType : true
        )
        .sort((a, b) => a.final_price - b.final_price),
    [plans, selectedNetwork, selectedPlanType]
  );

  async function handlePurchase(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!selectedPlan || !phoneNumber) {
      setError("Please select a plan and enter phone number");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    const supabase = CreateSupabaseClient;
    const { data: userRes } = await supabase.auth.getUser();
    if (!userRes.user) {
      setError("You must be logged in");
      setLoading(false);
      return;
    }

    const result = await purchaseDataPlan({
      userId: userRes.user.id,
      networkCode: String(selectedPlan.network),
      planId: selectedPlan.dataplan_id,
      planSize: selectedPlan.plan,
      duration: selectedPlan.month_validate,
      phoneNumber,
      amount: selectedPlan.final_price,
    });

    if (result.success) {
      setSuccessMsg(result.message);
      toast.success(`You purchased ${selectedPlan.plan} successfully ✅`);
      // refetch transactions
      const { data: txData } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", userRes.user.id)
        .eq("type", "data_purchase")
        .order("created_at", { ascending: false });
      setTransactions(txData ?? []);
    } else {
      setError(result.message);
      toast.error(result.message || "Purchase failed. Try again.");
    }

    setLoading(false);
  }

  const {
    page: planPage,
    totalPages: planTotalPages,
    pagedItems: pagedPlans,
    nextPage: nextPlanPage,
    setPage: setPlanPage,
    prevPage: prevPlanPage,
    resetPage: resetPlanPage,
  } = usePagination(filteredPlans, 9);

  const {
    page: historyPage,
    totalPages: historyTotalPages,
    pagedItems: pagedTransactions,
    nextPage: nextHistoryPage,
    prevPage: prevHistoryPage,
    setPage: setHisoryPage,
  } = usePagination(transactions, 10);

  return (
    <main className="py-6 bg-[#0d0f1a] text-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        <h1 className="text-2xl font-semibold text-emerald-400">Buy Data</h1>

        {error && (
          <p className="text-red-400 bg-red-900/30 p-3 rounded-lg border border-red-700 md:block hidden">
            {error}
          </p>
        )}
        {successMsg && (
          <p className="text-emerald-400 bg-emerald-900/30 p-3 rounded-lg border border-emerald-700 flex items-center gap-2 md:block hidden">
            <CheckCircle2 className="w-5 h-5" />
            {successMsg}
          </p>
        )}

        {/* Desktop Form */}
        <form
          onSubmit={handlePurchase}
          className="bg-gray-900 p-6 rounded-xl shadow space-y-6 hidden md:block"
        >
          {/* Desktop Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* Network */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Select Network
              </label>
              <select
                value={selectedNetwork}
                onChange={(e) => {
                  setSelectedNetwork(e.target.value);
                  setSelectedPlanType("");
                  setSelectedPlan(null);
                }}
                className="w-full p-2 rounded-lg bg-[#0d0f1a] text-white border border-gray-700 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">Choose network</option>
                {networks.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
            {/* Plan Type */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Select Plan Type
              </label>
              <select
                value={selectedPlanType}
                onChange={(e) => setSelectedPlanType(e.target.value)}
                disabled={!selectedNetwork}
                className="w-full p-2 rounded-lg bg-[#0d0f1a] text-white border border-gray-700 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">All types</option>
                {planTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            {/* Phone */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="08123456789"
                className="w-full p-2 rounded-lg bg-[#0d0f1a] text-white border border-gray-700 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Plans Grid */}
          {selectedNetwork && (
            <div>
              {filteredPlans.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pagedPlans.map((plan) => (
                      <button
                        key={plan.dataplan_id}
                        type="button"
                        onClick={() => setSelectedPlan(plan)}
                        className={`p-4 rounded-xl shadow-sm transition-all text-left w-full
                          ${
                            selectedPlan?.dataplan_id === plan.dataplan_id
                              ? "bg-emerald-500/10 border-emerald-400"
                              : "bg-gray-800 border border-gray-700"
                          } hover:scale-[1.02] active:scale-[0.98]`}
                      >
                        <h3 className="font-semibold text-base">
                          {plan.plan} ({plan.plan_type})
                        </h3>
                        <p className="text-sm text-gray-400">
                          {plan.month_validate}
                        </p>
                        <p className="text-emerald-400 font-bold mt-2 text-lg">
                          ₦{plan.final_price}
                        </p>
                      </button>
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  <PaginationControls
                    page={planPage}
                    totalPages={planTotalPages}
                    onPrev={prevPlanPage}
                    onNext={nextPlanPage}
                    onSetPage={setPlanPage}
                  />
                </>
              ) : (
                <p className="text-gray-400 col-span-full text-center">
                  No plans available.
                </p>
              )}
            </div>
          )}

          {/* Submit */}
          {selectedPlan && (
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto bg-emerald-400 hover:bg-emerald-500 text-black font-semibold px-6 py-3 rounded-lg transition disabled:opacity-50"
              >
                {loading ? "Processing..." : `Buy ${selectedPlan.plan}`}
              </button>
            </div>
          )}
        </form>

        {/* ---------- MOBILE UI ---------- */}
        <div className="md:hidden space-y-6">
          {/* Networks as chips */}
          {/* <div className="flex gap-3 overflow-x-auto pb-2">
            {networks.map((n) => (
              <button
                key={n}
                onClick={() => {
                  setSelectedNetwork(n);
                  setSelectedPlanType("");
                  setSelectedPlan(null);
                }}
                className={`flex-shrink-0 px-4 py-2 rounded-full border ${
                  selectedNetwork === n
                    ? "bg-emerald-500 text-black border-emerald-500"
                    : "bg-gray-900 text-gray-300 border-gray-700"
                }`}
              >
                {n}
              </button>
            ))}
          </div> */}
          {/* <div className="flex gap-3 overflow-x-auto pb-2">
            {networks.map((n) => (
              <button
                key={n}
                onClick={() => {
                  setSelectedNetwork(n);
                  setSelectedPlanType("");
                  setSelectedPlan(null);
                }}
                className={`flex-shrink-0 px-4 py-2 rounded-full border flex items-center justify-center ${
                  selectedNetwork === n
                    ? "bg-emerald-500 text-black border-emerald-500"
                    : "bg-gray-900 text-gray-300 border-gray-700"
                }`}
              >
                <div className="w-10 h-10 flex items-center justify-center">
                  <Image
                    src={NETWORK_LOGOS[n]}
                    alt={n}
                    width={40}
                    height={40}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              </button>
            ))}
          </div> */}
          <div className="flex gap-3 overflow-x-auto pb-2">
            {networks.map((n) => (
              <button
                key={n}
                onClick={() => {
                  setSelectedNetwork(n);
                  setSelectedPlanType("");
                  setSelectedPlan(null);
                }}
                className={`flex-shrink-0 px-3 py-2 rounded-full border flex items-center gap-2
        ${
          selectedNetwork === n
            ? "bg-emerald-500/10 border-emerald-400"
            : "bg-gray-900 border-gray-700"
        }`}
              >
                {/* uniform logo badge */}
                <NetworkLogo name={n} className="w-8 h-8" />
                {/* keep tiny label for a11y/clarity on mobile */}
                {/* <span
                  className={`text-xs font-medium ${
                    selectedNetwork === n ? "text-emerald-300" : "text-gray-300"
                  }`}
                >
                  {n}
                </span> */}
              </button>
            ))}
          </div>

          {/* Plan type pills */}
          {selectedNetwork && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {planTypes.map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedPlanType(t)}
                  className={`px-4 py-1 rounded-full text-sm ${
                    selectedPlanType === t
                      ? "bg-emerald-500 text-black font-semibold"
                      : "bg-gray-800 text-gray-300"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          )}

          {/* Phone input */}
          <div className="space-y-1">
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter phone number"
              className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500"
            />
            {error?.includes("phone") && (
              <span className="text-red-400 text-xs">{error}</span>
            )}
          </div>

          {/* Plan cards */}
          {selectedNetwork && (
            <div className="grid gap-3">
              {filteredPlans.map((plan) => (
                <div
                  key={plan.dataplan_id}
                  onClick={() => setSelectedPlan(plan)}
                  className={`p-4 rounded-xl border cursor-pointer ${
                    selectedPlan?.dataplan_id === plan.dataplan_id
                      ? "border-emerald-500 bg-emerald-500/10"
                      : "border-gray-700 bg-gray-900"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">{plan.plan}</span>
                    <span className="text-sm text-gray-400">
                      {plan.month_validate}
                    </span>
                    <span className="font-bold">
                      ₦{plan.final_price.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Purchase History (kept same) */}
        <div className="bg-gray-900 p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4 text-emerald-400">
            Purchase History
          </h2>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            {/* ... same table as before ... */}
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-400 border-b border-gray-700">
                    <th className="py-2">Network</th>
                    <th className="py-2">Amount</th>
                    <th className="py-2">Data Plan</th>
                    <th className="py-2">Duration</th>
                    <th className="py-2">Status</th>
                    <th className="py-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedTransactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-gray-800">
                      <td className="py-3">
                        {NETWORK_MAPPING[tx.network_code?.toString()] || "—"}
                      </td>
                      <td>₦{tx.amount || "..."}</td>
                      <td>{tx.data_size}</td>
                      <td>{tx.duration}</td>
                      <td>
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                            tx.status === "completed"
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "bg-red-500/10 text-red-400"
                          }`}
                        >
                          {tx.status === "completed" ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : (
                            <XCircle className="w-3 h-3" />
                          )}
                          {tx.status}
                        </span>
                      </td>
                      <td>
                        {new Date(tx.created_at).toLocaleDateString("en-NG", {
                          timeZone: "Africa/Lagos",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="space-y-4 md:hidden">
            {pagedTransactions.map((tx) => (
              <div
                key={tx.id}
                className="p-4 bg-gray-800 rounded-lg shadow flex flex-col gap-2"
              >
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-emerald-400">
                    {NETWORK_MAPPING[tx.network_code?.toString()] || "—"}
                  </span>
                  <span className="font-bold">₦{tx.amount}</span>
                </div>
                <p className="text-gray-300 text-sm">
                  {tx.data_size} • {tx.duration}
                </p>
                <div className="flex justify-between items-center text-xs text-gray-400">
                  <span
                    className={`px-2 py-1 rounded-full font-semibold ${
                      tx.status === "completed"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-red-500/10 text-red-400"
                    }`}
                  >
                    {tx.status}
                  </span>
                  <span>
                    {new Date(tx.created_at).toLocaleDateString("en-NG", {
                      timeZone: "Africa/Lagos",
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
          {/* Pagination Controls */}
          {/* {historyTotalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-4">
              <button
                onClick={prevHistoryPage}
                disabled={historyPage === 0}
                className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 disabled:opacity-40"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm text-gray-400">
                Page {historyPage + 1} of {historyTotalPages}
              </span>
              <button
                onClick={nextHistoryPage}
                disabled={historyPage === historyTotalPages - 1}
                className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 disabled:opacity-40"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )} */}
          <PaginationControls
            page={historyPage}
            totalPages={historyTotalPages}
            onPrev={prevHistoryPage}
            onNext={nextHistoryPage}
            onSetPage={setHisoryPage}
          />
        </div>
      </div>

      {/* Sticky Purchase Bar (mobile only) */}
      {selectedPlan && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 bg-gray-950 border-t border-gray-800 p-4 md:hidden z-50"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Selected Plan</p>
              <p className="font-semibold">
                {selectedPlan.plan} – {selectedPlan.month_validate}
              </p>
              <p className="text-emerald-400 font-bold">
                ₦{selectedPlan.final_price.toLocaleString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedPlan(null)}
                className="p-2 rounded-full bg-gray-800 hover:bg-gray-700"
              >
                <Pencil className="w-4 h-4 text-gray-300" />
              </button>
              <button
                disabled={loading}
                onClick={() => handlePurchase()}
                className="px-6 py-2 rounded-lg font-bold bg-emerald-500 text-black disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Processing…
                  </>
                ) : (
                  "Buy"
                )}
              </button>
            </div>
          </div>
          {error && !error.includes("phone") && (
            <div className="mt-2 text-red-400 text-sm">{error}</div>
          )}
        </motion.div>
      )}
    </main>
  );
}
