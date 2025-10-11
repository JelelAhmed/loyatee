"use client";

import { useEffect, useMemo, useState } from "react";
import { CreateSupabaseClient } from "@/lib/supabase/client";
import { Search, Info } from "lucide-react";
import PaginationControls from "@/components/ui/paginationControls";
import { usePagination } from "@/hooks/usePagination";
import { Dialog } from "@headlessui/react";

interface AuditLog {
  id: string;
  admin_id: string;
  action: string;
  target_table: string;
  target_id: string;
  details?: Record<string, any> | string | null;
  created_at: string;
  admin_email?: string;
  target_user_email?: string;
  target_user_phone?: number;
}

const ACTION_MAP: Record<string, string> = {
  VERIFY_FUNDING_MANUAL: "Manual Funding Verified",
  VERIFY_FUNDING_FAILED: "Funding Verification Failed",
  REFUND_ISSUE: "Wallet Refund Issued",
  RESOLVE_DISPUTE: "Dispute Resolved",
  MARK_UNDER_REVIEW: "Marked Under Review",
  REJECT_DISPUTE: "Dispute Rejected",
  VERIFY_DATA_PURCHASE: "Data Purchase Verified",
};

const ACTION_COLORS: Record<string, string> = {
  VERIFY_FUNDING_MANUAL:
    "bg-emerald-500/10 text-emerald-400 border border-emerald-400/20",
  VERIFY_DATA_PURCHASE:
    "bg-emerald-500/10 text-emerald-400 border border-emerald-400/20",
  RESOLVE_DISPUTE: "bg-blue-500/10 text-blue-400 border border-blue-400/20",
  REFUND_ISSUE: "bg-cyan-500/10 text-cyan-400 border border-cyan-400/20",
  MARK_UNDER_REVIEW:
    "bg-amber-500/10 text-amber-400 border border-amber-400/20",
  REJECT_DISPUTE: "bg-red-500/10 text-red-400 border border-red-400/20",
  VERIFY_FUNDING_FAILED: "bg-red-500/10 text-red-400 border border-red-400/20",
};

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedAction, setSelectedAction] = useState<string>("all");
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const supabase = CreateSupabaseClient;

  useEffect(() => {
    async function fetchLogs() {
      setLoading(true);
      const { data: rawLogs, error } = await supabase
        .from("admin_activity_logs")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching logs:", error);
        setLoading(false);
        return;
      }

      // fetch unique admin & target users
      const adminIds = Array.from(new Set(rawLogs.map((l: any) => l.admin_id)));
      const { data: admins } = await supabase
        .from("users")
        .select("id, email, phone")
        .in("id", adminIds);

      const enriched = await Promise.all(
        rawLogs.map(async (log: any) => {
          let details: Record<string, any> | string | null = log.details;
          try {
            if (typeof log.details === "string") {
              details = JSON.parse(log.details);
            }
          } catch {
            details = log.details;
          }

          const admin = admins?.find((a) => a.id === log.admin_id) ?? undefined;
          const admin_email = admin?.email ?? admin?.phone ?? "Unknown Admin";

          let target_user_email: string | undefined;
          let target_user_phone: string | undefined;

          if (
            log.target_table === "wallet_fundings" ||
            log.target_table === "transactions"
          ) {
            // Wallet funding or transaction → get user via user_id
            const table = log.target_table;
            const { data: target } = await supabase
              .from(table)
              .select("user_id")
              .eq("id", log.target_id)
              .maybeSingle();

            if (target?.user_id) {
              const { data: user } = await supabase
                .from("users")
                .select("email, phone")
                .eq("id", target.user_id)
                .maybeSingle();
              target_user_email = user?.email ?? "-";
              target_user_phone = user?.phone ?? "-";
            }
          } else if (log.target_table === "users") {
            if (log.action === "DELETE_USER") {
              // deleted users no longer exist, so get details from JSON
              let detailsData: any = {};
              try {
                detailsData =
                  typeof log.details === "string"
                    ? JSON.parse(log.details)
                    : log.details || {};
              } catch {
                detailsData = {};
              }

              target_user_email =
                detailsData.target_user_email || detailsData.email || "-";
              target_user_phone =
                detailsData.target_user_phone || detailsData.phone || "-";
            } else {
              // for non-deleted users, fetch from users table
              const { data: user } = await supabase
                .from("users")
                .select("email, phone")
                .eq("id", log.target_id)
                .maybeSingle();

              target_user_email = user?.email ?? "-";
              target_user_phone = user?.phone ?? "-";
            }
          }

          return {
            ...log,
            admin_email,
            details,
            target_user_email,
            target_user_phone,
          };
        })
      );

      setLogs(enriched);
      setLoading(false);
    }

    fetchLogs();
  }, []);

  // filtering + search
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return logs.filter((log) => {
      const matchSearch =
        log.admin_email?.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        log.target_user_email?.toLowerCase().includes(q);
      const matchAction =
        selectedAction === "all" || log.action === selectedAction;
      return matchSearch && matchAction;
    });
  }, [logs, search, selectedAction]);

  // pagination
  const {
    page,
    totalPages,
    pagedItems,
    nextPage,
    prevPage,
    setPage,
    resetPage,
  } = usePagination(filtered, 10);

  const renderBadge = (action: string) => {
    const color = ACTION_COLORS[action] || "bg-gray-500/10 text-gray-300";
    const label = ACTION_MAP[action] || action.replace(/_/g, " ");
    return (
      <span
        className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${color}`}
      >
        {label}
      </span>
    );
  };

  return (
    <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-4">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">
            Admin Audit Logs
          </h2>

          <div className="flex flex-wrap gap-3 items-center">
            <select
              value={selectedAction}
              onChange={(e) => {
                setSelectedAction(e.target.value);
                resetPage();
              }}
              className="bg-[#1f1f2e] border border-[#44475a] rounded-lg px-3 py-2 text-sm text-[#f8f8f2]"
            >
              <option value="all">All Actions</option>
              {Object.keys(ACTION_MAP).map((key) => (
                <option key={key} value={key}>
                  {ACTION_MAP[key]}
                </option>
              ))}
            </select>

            <div className="flex items-center bg-[#1f1f2e] border border-[#44475a] rounded-lg px-3 py-2 w-full sm:w-72">
              <Search size={16} className="text-[#888] mr-2" />
              <input
                type="text"
                placeholder="Search by admin or user..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  resetPage();
                }}
                className="bg-transparent text-sm flex-1 text-[#f8f8f2] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block bg-[var(--card-background-color)]/50 border border-white/10 rounded-lg overflow-hidden">
          <table className="w-full text-sm text-left text-[var(--text-secondary)]">
            <thead className="bg-white/5 text-xs text-[var(--text-primary)] uppercase">
              <tr>
                <th className="px-6 py-3">Admin</th>
                <th className="px-6 py-3">Action</th>
                <th className="px-6 py-3">Target User</th>
                <th className="px-6 py-3">Phone</th>
                <th className="px-6 py-3">Details</th>
                <th className="px-6 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-[#999]">
                    Loading...
                  </td>
                </tr>
              ) : pagedItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-[#999]">
                    No logs found
                  </td>
                </tr>
              ) : (
                pagedItems.map((log) => (
                  <tr
                    key={log.id}
                    className="border-t border-white/10 hover:bg-white/5 transition"
                  >
                    <td className="px-6 py-4 text-[var(--text-primary)] whitespace-nowrap">
                      {log.admin_email}
                    </td>
                    <td className="px-6 py-4">{renderBadge(log.action)}</td>
                    <td className="px-6 py-4 text-xs whitespace-nowrap">
                      {log.target_user_email || "—"}
                    </td>
                    <td className="px-6 py-4 text-xs whitespace-nowrap">
                      {log.target_user_phone || "—"}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300"
                      >
                        <Info size={14} /> View
                      </button>
                    </td>
                    <td className="px-6 py-4 text-xs text-[#aaa] whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString("en-NG")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <PaginationControls
            page={page}
            totalPages={totalPages}
            onPrev={prevPage}
            onNext={nextPage}
            onSetPage={setPage}
          />
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {pagedItems.map((log) => (
            <div
              key={log.id}
              className="bg-[var(--card-background-color)]/50 border border-white/10 rounded-lg p-4 space-y-3"
            >
              <div className="flex justify-between">
                <span className="text-xs text-[#888]">Admin</span>
                <span className="text-sm text-[#f8f8f2] font-medium">
                  {log.admin_email}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs text-[#888]">Action</span>
                {renderBadge(log.action)}
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs text-[#888]">User Email</span>
                <span className="text-xs text-[#ccc]">
                  {log.target_user_email ?? "—"}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs text-[#888]">User Phone</span>
                <span className="text-xs text-[#ccc]">
                  {log.target_user_phone ?? "—"}
                </span>
              </div>

              <button
                onClick={() => setSelectedLog(log)}
                className="w-full mt-2 text-xs text-emerald-400 hover:text-emerald-300 flex items-center justify-center gap-1"
              >
                <Info size={14} /> View Details
              </button>

              <div className="text-xs text-[#aaa] text-right">
                {new Date(log.created_at).toLocaleString("en-NG")}
              </div>
            </div>
          ))}

          <PaginationControls
            page={page}
            totalPages={totalPages}
            onPrev={prevPage}
            onNext={nextPage}
            onSetPage={setPage}
          />
        </div>
      </div>

      {/* Details Modal */}
      <Dialog
        open={!!selectedLog}
        onClose={() => setSelectedLog(null)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-[#1a1a24] text-[#f8f8f2] rounded-xl shadow-2xl max-w-2xl w-full border border-white/10 p-6 space-y-4 overflow-y-auto max-h-[80vh]">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              {renderBadge(selectedLog?.action || "")}
            </h3>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-[#888]">Admin:</span>{" "}
                {selectedLog?.admin_email}
              </p>
              <p>
                <span className="text-[#888]">Target User:</span>{" "}
                {selectedLog?.target_user_email ?? "—"}
              </p>
              <p>
                <span className="text-[#888]">Date:</span>{" "}
                {selectedLog
                  ? new Date(selectedLog.created_at).toLocaleString("en-NG")
                  : ""}
              </p>
            </div>

            {selectedLog?.details && (
              <div className="bg-[#222233] border border-white/10 rounded-lg p-4 text-sm text-[#ddd] space-y-2">
                <h4 className="text-[#aaa] font-medium mb-2">Details</h4>

                {(() => {
                  let details: Record<string, any> = {};

                  try {
                    // Safely parse details (if stringified JSON)
                    details =
                      typeof selectedLog.details === "string"
                        ? JSON.parse(selectedLog.details)
                        : selectedLog.details || {};
                  } catch {
                    // If not valid JSON, show raw string safely
                    return (
                      <p className="text-[#bbb] whitespace-pre-wrap break-words">
                        {String(selectedLog.details)}
                      </p>
                    );
                  }

                  const humanizeKey = (key: string) =>
                    key
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())
                      .replace("Id", "ID");

                  const formatValue = (
                    key: string,
                    value: any
                  ): React.ReactNode => {
                    if (value === null || value === undefined || value === "")
                      return <span className="text-[#666]">—</span>;

                    // 🟢 Boolean badges
                    if (typeof value === "boolean")
                      return (
                        <span
                          className={`${
                            value
                              ? "text-emerald-400 bg-emerald-500/10"
                              : "text-red-400 bg-red-500/10"
                          } px-2 py-0.5 rounded-full text-xs`}
                        >
                          {value ? "Yes" : "No"}
                        </span>
                      );

                    if (value === "Active" || "Suspended")
                      return (
                        <span
                          className={`${
                            value === "Active"
                              ? "text-emerald-400 bg-emerald-500/10"
                              : "text-red-400 bg-red-500/10"
                          } px-2 py-0.5 rounded-full text-xs`}
                        >
                          {value}
                        </span>
                      );

                    // 🔢 Numbers — format with ₦ when key implies money
                    if (typeof value === "number") {
                      if (/(amount|fee|price|total)/i.test(key)) {
                        return `₦${value.toLocaleString("en-NG", {
                          minimumFractionDigits: 2,
                        })}`;
                      }
                      return value.toLocaleString();
                    }

                    // 🔤 Strings
                    if (typeof value === "string") {
                      // ISO Date
                      if (/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(value)) {
                        const d = new Date(value);
                        return d.toLocaleString("en-NG", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        });
                      }

                      // Status badges
                      if (
                        [
                          "success",
                          "failed",
                          "pending",
                          "abandoned",
                          "completed",
                          "Active",
                          "Suspended",
                        ].includes(value.toLowerCase())
                      ) {
                        const color =
                          value.toLowerCase() === "success" ||
                          value.toLowerCase() === "active" ||
                          value.toLowerCase() === "completed"
                            ? "text-emerald-400 bg-emerald-500/10"
                            : value.toLowerCase() === "pending" ||
                              value.toLowerCase() === "suspended"
                            ? "text-amber-400 bg-amber-500/10"
                            : "text-red-400 bg-red-500/10";
                        return (
                          <span
                            className={`${color} px-2 py-0.5 rounded-full text-xs`}
                          >
                            {value}
                          </span>
                        );
                      }

                      // Long references / IDs
                      if (value.length > 25) {
                        return (
                          <span className="font-mono text-xs break-all text-[#bbb]">
                            {value}
                          </span>
                        );
                      }

                      return value;
                    }

                    // 🧩 Nested objects
                    if (typeof value === "object" && !Array.isArray(value)) {
                      return (
                        <div className="ml-4 mt-1 border-l border-white/10 pl-3 space-y-1">
                          {Object.entries(value).map(
                            ([nestedKey, nestedValue]) => (
                              <div
                                key={nestedKey}
                                className="flex justify-between gap-3"
                              >
                                <span className="text-[#999]">
                                  {humanizeKey(nestedKey)}
                                </span>
                                <span>
                                  {formatValue(nestedKey, nestedValue)}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      );
                    }

                    // Arrays (show comma-separated)
                    if (Array.isArray(value)) {
                      return value.join(", ");
                    }

                    return String(value);
                  };

                  return (
                    <div className="space-y-1">
                      {Object.entries(details).map(([key, value]) => (
                        <div
                          key={key}
                          className="flex justify-between items-start gap-3 border-b border-white/5 pb-1"
                        >
                          <span className="text-[#999]">
                            {humanizeKey(key)}
                          </span>
                          <span className="text-right">
                            {formatValue(key, value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            )}

            <button
              onClick={() => setSelectedLog(null)}
              className="w-full mt-4 bg-white/10 hover:bg-white/20 text-sm py-2 rounded-lg"
            >
              Close
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>
    </main>
  );
}
