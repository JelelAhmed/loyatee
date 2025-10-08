"use client";

import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { Filter } from "lucide-react";
import { toast } from "sonner";
import { CreateSupabaseClient } from "@/lib/supabase/client";
import { reportTransactionIssue } from "@/app/actions/transaction.actions";
import { usePagination } from "@/hooks/usePagination";
import PaginationControls from "@/components/ui/paginationControls";
import TransactionCardDash from "@/components/dashboard/TransactionCardDash";
import ReportIssueModal from "@/components/dashboard/ReportIssueModal";

const NETWORKS: Record<string, string> = {
  "1": "Airtel",
  "2": "MTN",
  "3": "Glo",
  "4": "9mobile",
};

function formatCurrency(amount: string | number) {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return `₦${num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatType(type: string) {
  return type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatStatus(status: string) {
  if (status === "completed") return "Successful";
  if (status === "failed") return "Failed";
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export default function Transactions() {
  const [search, setSearch] = useState("");
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [complaintOpen, setComplaintOpen] = useState(false);
  const [complaintTx, setComplaintTx] = useState<any | null>(null);
  const [issueType, setIssueType] = useState("Data not received");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const supabase = CreateSupabaseClient;

  useEffect(() => {
    async function fetchTransactions() {
      setLoading(true);
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setTransactions(data);
      }
      setLoading(false);
    }

    fetchTransactions();
  }, [supabase]);

  async function handleComplaintSubmit(issueType: string, note: string) {
    if (!complaintTx) return;

    setSubmitting(true);
    const result = await reportTransactionIssue(
      complaintTx.id,
      issueType,
      note
    );
    setSubmitting(false);

    if (result.success) {
      toast.success(result.message);
      setTransactions((prev) =>
        prev.map((t) =>
          t.id === complaintTx.id
            ? {
                ...t,
                status: "disputed",
                dispute_type: issueType,
                dispute_note: note,
              }
            : t
        )
      );
      setComplaintOpen(false);
    } else {
      toast.error(result.message);
    }
  }

  // filters state
  const [filters, setFilters] = useState({
    network: "",
    status: "",
    type: "",
  });
  const [filterOpen, setFilterOpen] = useState(false);

  // filter before pagination
  const filtered = transactions.filter((t) => {
    const query = search.toLowerCase();

    const matchesSearch =
      t.phone_number?.toLowerCase().includes(query) ||
      t.type?.toLowerCase().includes(query) ||
      t.status?.toLowerCase().includes(query) ||
      t.amount?.toString().includes(query);

    const matchesFilters =
      (!filters.network || t.network_code === filters.network) &&
      (!filters.status || t.status === filters.status) &&
      (!filters.type || t.type === filters.type);

    return matchesSearch && matchesFilters;
  });

  // hook in pagination
  const {
    page,
    totalPages,
    pagedItems: pagedTransactions,
    nextPage,
    prevPage,
    setPage,
  } = usePagination(filtered, 10);

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
                placeholder="Search transactions..."
                className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
              />
              {/* Filters button */}
              <button
                onClick={() => setFilterOpen(true)}
                className="flex items-center gap-2 bg-gray-800 px-3 py-2 rounded-lg text-sm text-white hover:bg-gray-700 transition"
              >
                <Filter className="w-4 h-4" />
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
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {loading ? (
                      <tr>
                        <td
                          colSpan={9}
                          className="px-5 py-6 text-center text-gray-400"
                        >
                          Loading...
                        </td>
                      </tr>
                    ) : pagedTransactions.length === 0 ? (
                      <tr>
                        <td
                          colSpan={9}
                          className="px-5 py-6 text-center text-gray-500"
                        >
                          No transactions found
                        </td>
                      </tr>
                    ) : (
                      pagedTransactions.map((entry, i) => (
                        <tr
                          key={entry.id || i}
                          className="hover:bg-gray-800/40 transition-colors"
                        >
                          <td className="px-5 py-4 text-gray-400">
                            {new Date(entry.created_at).toLocaleString()}
                          </td>
                          <td className="px-5 py-4 font-medium">
                            {formatType(entry.type)}
                          </td>
                          <td className="px-5 py-4">
                            {NETWORKS[entry.network_code] || "-"}
                          </td>
                          <td className="px-5 py-4 text-gray-300">
                            {formatCurrency(entry.amount)}
                          </td>
                          <td className="px-5 py-4">
                            {entry.data_size || "-"}
                          </td>
                          <td className="px-5 py-4">{entry.duration || "-"}</td>
                          <td className="px-5 py-4">
                            {entry.phone_number || "-"}
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                                entry.status === "completed"
                                  ? "bg-emerald-500/10 text-emerald-400"
                                  : entry.status === "pending"
                                  ? "bg-yellow-500/10 text-yellow-400"
                                  : entry.status === "disputed"
                                  ? "bg-orange-500/10 text-orange-400"
                                  : "bg-red-500/10 text-red-400"
                              }`}
                            >
                              {formatStatus(entry.status)}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-right space-x-2">
                            {["data_purchase", "wallet_funding"].includes(
                              entry.type
                            ) &&
                              entry.status === "completed" && (
                                <button
                                  onClick={() => {
                                    setComplaintTx(entry);
                                    setComplaintOpen(true);
                                  }}
                                  className="text-yellow-400 hover:text-yellow-500 text-xs font-medium"
                                >
                                  Report Issue
                                </button>
                              )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              {/* Mobile Cards */}
              <div className="sm:hidden space-y-4 p-4">
                {pagedTransactions.map((entry, i) => (
                  <TransactionCardDash
                    key={entry.id || i}
                    entry={entry}
                    onReport={(tx) => {
                      setComplaintTx(tx);
                      setComplaintOpen(true);
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Pagination Controls */}
            <div className="border-t border-gray-800 px-6 py-3">
              <PaginationControls
                page={page}
                totalPages={totalPages}
                onPrev={prevPage}
                onNext={nextPage}
                onSetPage={setPage}
              />

              <p className="text-sm text-gray-400 mt-2 text-center">
                Showing{" "}
                <span className="font-semibold text-white">
                  {(page - 1) * 10 + 1}
                </span>{" "}
                –{" "}
                <span className="font-semibold text-white">
                  {Math.min(page * 10, filtered.length)}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-white">
                  {filtered.length}
                </span>{" "}
                transactions
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Filter Modal */}
      {/* (keep your filter modal code unchanged) */}
      <Dialog
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-gray-900 rounded-xl p-6 w-full max-w-sm border border-gray-800 shadow-xl">
            <Dialog.Title className="text-lg font-semibold text-white mb-4">
              Filter Transactions
            </Dialog.Title>

            {/* Network filter */}
            <label className="block text-sm text-gray-400 mb-2">Network</label>
            <select
              value={filters.network}
              onChange={(e) =>
                setFilters((f) => ({ ...f, network: e.target.value }))
              }
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-emerald-400 mb-4"
            >
              <option value="">All Networks</option>
              {Object.entries(NETWORKS).map(([code, name]) => (
                <option key={code} value={code}>
                  {name}
                </option>
              ))}
            </select>

            {/* Status filter */}
            <label className="block text-sm text-gray-400 mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters((f) => ({ ...f, status: e.target.value }))
              }
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-emerald-400 mb-4"
            >
              <option value="">All Statuses</option>
              <option value="completed">Successful</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>

            {/* Type filter */}
            <label className="block text-sm text-gray-400 mb-2">Type</label>
            <select
              value={filters.type}
              onChange={(e) =>
                setFilters((f) => ({ ...f, type: e.target.value }))
              }
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-emerald-400"
            >
              <option value="">All Types</option>
              <option value="airtime">Airtime</option>
              <option value="data">Data</option>
              <option value="wallet_funding">Wallet Funding</option>
              <option value="bank_transfer">Bank Transfer</option>
            </select>

            {/* Actions */}
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => {
                  setFilters({ network: "", status: "", type: "" });
                  setFilterOpen(false);
                }}
                className="px-4 py-2 text-sm rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600"
              >
                Reset
              </button>
              <button
                onClick={() => setFilterOpen(false)}
                className="px-4 py-2 text-sm rounded-lg bg-emerald-500 text-white hover:bg-emerald-600"
              >
                Apply
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Complaint Modal */}
      <ReportIssueModal
        open={complaintOpen}
        onClose={() => setComplaintOpen(false)}
        transaction={complaintTx}
        submitting={submitting}
        onSubmit={handleComplaintSubmit}
      />
    </div>
  );
}
