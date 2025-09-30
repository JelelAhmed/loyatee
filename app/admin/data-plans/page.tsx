"use client";

import { useState, useEffect, useMemo } from "react";
import {
  getDataPlansWithOverrides,
  updatePlanMarkup,
  togglePlanEnabled,
} from "@/app/actions/data.actions";
import { DataPlan } from "@/types/dataPlans";
import { usePagination } from "@/hooks/usePagination";
import PaginationControls from "@/components/ui/paginationControls";
import { Pencil, Save, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { CreateSupabaseClient } from "@/lib/supabase/client";

export default function AdminDataPlansPage() {
  const [plans, setPlans] = useState<DataPlan[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedNetwork, setSelectedNetwork] = useState<string>("");
  const [selectedPlanType, setSelectedPlanType] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "enabled" | "disabled"
  >("all");

  const [editPlanId, setEditPlanId] = useState<string | null>(null);
  const [editMarkup, setEditMarkup] = useState<string>("");
  const [saving, setSaving] = useState<string | null>(null);

  // ✅ Fetch vendor plans + merge overrides
  useEffect(() => {
    async function fetchData() {
      const { plans, error } = await getDataPlansWithOverrides();
      if (error) {
        setError(error);
        return;
      }

      const supabase = CreateSupabaseClient;
      const { data: overrides, error: overrideError } = await supabase
        .from("plan_overrides")
        .select("dataplan_id, base_markup, enabled");

      if (overrideError) {
        console.error(
          "[AdminDataPlansPage] overrides fetch error:",
          overrideError
        );
        setError("Failed to fetch custom overrides");
        return;
      }

      // ✅ Merge overrides (guarantee base_markup exists)
      const updatedPlans: DataPlan[] = plans.map((plan) => {
        const override = overrides?.find(
          (o) => o.dataplan_id === plan.dataplan_id
        );
        const vendorCost = Number(plan.plan_amount);
        const base_markup = override?.base_markup ?? 50;
        const enabled = override?.enabled ?? true;

        return {
          ...plan,
          base_markup,
          enabled,
          final_price: vendorCost + Math.max(base_markup, 10),
        };
      });

      setPlans(updatedPlans);

      if (updatedPlans.length > 0 && !selectedNetwork) {
        const firstNetwork = updatedPlans[0].plan_network;
        setSelectedNetwork(firstNetwork);

        const firstType = updatedPlans.find(
          (p) => p.plan_network === firstNetwork
        )?.plan_type;
        if (firstType) setSelectedPlanType(firstType);
      }
    }
    fetchData();
  }, []);

  // Reset pagination on network change
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

  const filteredPlans = useMemo(() => {
    return plans
      .filter((p) => p.plan_network === selectedNetwork)
      .filter((p) =>
        selectedPlanType ? p.plan_type === selectedPlanType : true
      )
      .filter((p) =>
        statusFilter === "all"
          ? true
          : statusFilter === "enabled"
          ? p.enabled
          : !p.enabled
      )
      .sort((a, b) => a.final_price - b.final_price);
  }, [plans, selectedNetwork, selectedPlanType, statusFilter]);

  async function handleSaveMarkup(dataplan_id: string) {
    const newMarkup = parseFloat(editMarkup);
    if (isNaN(newMarkup) || newMarkup < 10) {
      toast.error("Please enter a valid markup (minimum ₦10)");
      return;
    }

    setSaving(dataplan_id);
    const result = await updatePlanMarkup(dataplan_id, newMarkup);
    setSaving(null);

    if (result.success) {
      setPlans((prev) =>
        prev.map((plan) =>
          plan.dataplan_id === dataplan_id
            ? {
                ...plan,
                base_markup: newMarkup,
                final_price: Number(plan.plan_amount) + Math.max(newMarkup, 10),
              }
            : plan
        )
      );
      setEditPlanId(null);
      setEditMarkup("");
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  }

  const {
    page: planPage,
    totalPages: planTotalPages,
    pagedItems: pagedPlans,
    nextPage: nextPlanPage,
    prevPage: prevPlanPage,
    setPage: setPlanPage,
    resetPage: resetPlanPage,
  } = usePagination(filteredPlans, 9);

  return (
    <main className="py-6 bg-[#0d0f1a] text-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        <h1 className="text-2xl font-semibold text-emerald-400">
          Manage Data Plans
        </h1>

        {error && (
          <p className="text-red-400 bg-red-900/30 p-3 rounded-lg border border-red-700">
            {error}
          </p>
        )}

        <div className="bg-gray-900 p-6 rounded-xl shadow space-y-6">
          {/* Filters Section */}
          <div className="space-y-6">
            {/* Network Filter */}
            <div>
              {/* Desktop Select */}
              <div className="hidden md:block">
                <label className="block text-sm text-gray-400 mb-1">
                  Select Network
                </label>
                <select
                  value={selectedNetwork}
                  onChange={(e) => {
                    setSelectedNetwork(e.target.value);
                    setSelectedPlanType("");
                    setEditPlanId(null);
                    setEditMarkup("");
                  }}
                  className="w-full p-2 rounded-lg bg-[#0d0f1a] text-white border border-gray-700"
                >
                  {networks.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>

              {/* Mobile Pills */}
              <div className="flex gap-2 overflow-x-auto pb-2 md:hidden">
                {networks.map((n) => (
                  <button
                    key={n}
                    onClick={() => {
                      setSelectedNetwork(n);
                      setSelectedPlanType("");
                      setEditPlanId(null);
                      setEditMarkup("");
                    }}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedNetwork === n
                        ? "bg-emerald-500 text-black font-semibold"
                        : "bg-gray-800 text-gray-300"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* Plan Type Filter */}
            {selectedNetwork && (
              <div>
                {/* Desktop Select */}
                <div className="hidden md:block">
                  <label className="block text-sm text-gray-400 mb-1">
                    Select Plan Type
                  </label>
                  <select
                    value={selectedPlanType}
                    onChange={(e) => setSelectedPlanType(e.target.value)}
                    className="w-full p-2 rounded-lg bg-[#0d0f1a] text-white border border-gray-700"
                  >
                    {planTypes.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Mobile Pills */}
                <div className="flex gap-2 overflow-x-auto pb-2 md:hidden">
                  {planTypes.map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedPlanType(t)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        selectedPlanType === t
                          ? "bg-emerald-500 text-black font-semibold"
                          : "bg-gray-800 text-gray-300"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Status Filter */}
            <div>
              {/* Desktop */}
              <div className="hidden md:block">
                <label className="block text-sm text-gray-400 mb-1">
                  Plan Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(
                      e.target.value as "all" | "enabled" | "disabled"
                    )
                  }
                  className="w-full p-2 rounded-lg bg-[#0d0f1a] text-white border border-gray-700"
                >
                  <option value="all">All</option>
                  <option value="enabled">Enabled Only</option>
                  <option value="disabled">Disabled Only</option>
                </select>
              </div>

              {/* Mobile Pills */}
              <div className="flex gap-2 overflow-x-auto pb-2 md:hidden">
                {(["all", "enabled", "disabled"] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      statusFilter === status
                        ? "bg-emerald-500 text-black font-semibold"
                        : "bg-gray-800 text-gray-300"
                    }`}
                  >
                    {status === "all"
                      ? "All"
                      : status === "enabled"
                      ? "Enabled"
                      : "Disabled"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Plans Grid */}
          {selectedNetwork && (
            <div>
              {filteredPlans.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pagedPlans.map((plan) => {
                      const vendorCost = Number(plan.plan_amount);
                      return (
                        <div
                          key={plan.dataplan_id}
                          className="p-4 rounded-xl shadow-sm bg-gray-800 border border-gray-700"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-semibold text-base">
                              {plan.plan} ({plan.plan_type})
                            </h3>

                            <div className="flex items-center gap-2">
                              {/* Enable/Disable toggle */}
                              <button
                                onClick={async () => {
                                  const result = await togglePlanEnabled(
                                    plan.dataplan_id,
                                    !plan.enabled
                                  );
                                  if (result.success) {
                                    setPlans((prev) =>
                                      prev.map((p) =>
                                        p.dataplan_id === plan.dataplan_id
                                          ? { ...p, enabled: !plan.enabled }
                                          : p
                                      )
                                    );
                                    toast.success(result.message);
                                  } else {
                                    toast.error(result.message);
                                  }
                                }}
                                className={`px-2 py-1 text-xs rounded ${
                                  plan.enabled
                                    ? "bg-emerald-600 text-white"
                                    : "bg-red-600 text-gray-300"
                                }`}
                              >
                                {plan.enabled ? "Enabled" : "Disabled"}
                              </button>

                              {/* Edit button */}
                              <button
                                onClick={() => {
                                  if (editPlanId === plan.dataplan_id) {
                                    setEditPlanId(null);
                                    setEditMarkup("");
                                  } else {
                                    setEditPlanId(plan.dataplan_id);
                                    setEditMarkup(
                                      plan.base_markup?.toString() ?? "50"
                                    );
                                  }
                                }}
                                className="p-1 rounded-full hover:bg-gray-700"
                              >
                                <Pencil className="w-4 h-4 text-gray-300" />
                              </button>
                            </div>
                          </div>

                          <p className="text-sm text-gray-400">
                            {plan.month_validate}
                          </p>

                          <p className="text-gray-400 text-sm">
                            Vendor: ₦{vendorCost.toLocaleString()}
                          </p>

                          {editPlanId === plan.dataplan_id ? (
                            <div className="mt-2 flex items-center gap-2">
                              <input
                                type="number"
                                value={editMarkup}
                                onChange={(e) => setEditMarkup(e.target.value)}
                                placeholder="Enter markup"
                                className="w-full p-2 rounded-lg bg-[#0d0f1a] text-white border border-gray-700"
                              />
                              <button
                                onClick={() =>
                                  handleSaveMarkup(plan.dataplan_id)
                                }
                                disabled={saving === plan.dataplan_id}
                                className="p-2 rounded-lg bg-emerald-500 text-black disabled:opacity-50"
                              >
                                {saving === plan.dataplan_id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Save className="w-4 h-4" />
                                )}
                              </button>
                              <button
                                onClick={() => {
                                  setEditPlanId(null);
                                  setEditMarkup("");
                                }}
                                className="p-2 rounded-lg bg-red-500 text-white"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <p className="text-sm text-gray-400">
                              Markup: ₦{plan.base_markup}
                            </p>
                          )}

                          <p className="text-emerald-400 font-bold mt-2 text-lg">
                            Final Price: ₦{plan.final_price.toLocaleString()}
                          </p>
                        </div>
                      );
                    })}
                  </div>

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
        </div>
      </div>
    </main>
  );
}
