"use client";

import { useEffect, useMemo, useState } from "react";
import { CreateSupabaseClient } from "@/lib/supabase/client";
import ViewLog from "@/components/admin/ViewLog";
import debounce from "lodash/debounce";
import PaginationControls from "@/components/ui/paginationControls";
import { usePagination } from "@/hooks/usePagination";

interface AdminLog {
  id: string;
  admin_id: string;
  admin_email: string;
  action: string;
  target_table: string | null;
  target_id: string | null;
  details: any;
  created_at: string;
}

export default function AuditLogsPage() {
  const supabase = CreateSupabaseClient;

  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLog, setSelectedLog] = useState<AdminLog | null>(null);

  const limit = 10;

  const debouncedSetSearch = useMemo(
    () =>
      debounce((value: string) => {
        setSearch(value);
      }, 300),
    []
  );

  useEffect(() => {
    return () => debouncedSetSearch.cancel();
  }, [debouncedSetSearch]);

  const fetchLogs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      let query: any = supabase
        .from("admin_activity_logs")
        .select("*, admin:users(id,email)")
        .order("created_at", { ascending: false });

      if (search) query = query.ilike("action", `%${search}%`);
      if (actionFilter !== "all") query = query.eq("action", actionFilter);

      const { data, error } = await query;

      if (error) throw error;

      const formatted = (data ?? []).map((l: any) => ({
        id: l.id,
        admin_id: l.admin_id,
        admin_email: l.admin?.email ?? "Unknown",
        action: l.action,
        target_table: l.target_table,
        target_id: l.target_id,
        details: l.details,
        created_at: new Date(l.created_at).toLocaleString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      }));

      setLogs(formatted);
    } catch (err: any) {
      setError(err?.message ?? "Failed to fetch logs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [search, actionFilter]);

  const { page, setPage, totalPages, pagedItems, nextPage, prevPage } =
    usePagination(logs, limit);

  const handleSearchInputChange = (val: string) => {
    setSearchInput(val);
    debouncedSetSearch(val);
    setPage(0);
  };

  const handleActionFilterChange = (val: string) => {
    setActionFilter(val);
    setPage(0);
  };

  return (
    <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 relative z-10">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Stats Card */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Total Logs" value={logs.length} />
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div className="w-full sm:w-1/3">
            <input
              type="text"
              placeholder="Search by action..."
              value={searchInput}
              onChange={(e) => handleSearchInputChange(e.target.value)}
              className="w-full bg-gray-800/80 border border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
            />
          </div>
          <div className="flex w-full sm:w-auto gap-2">
            <select
              value={actionFilter}
              onChange={(e) => handleActionFilterChange(e.target.value)}
              className="flex-1 min-w-[120px] bg-gray-800/80 border border-gray-600 rounded-lg px-2 py-2 text-xs sm:text-sm text-gray-100 truncate focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
            >
              <option value="all">All Actions</option>
              <option value="REFUND_ISSUED">Refund Issued</option>
              <option value="WALLET_DISPUTE_REJECTED">Dispute Rejected</option>
              <option value="WALLET_DISPUTE_PENDING">Dispute Pending</option>
              <option value="WALLET_REFUND_ISSUED">Wallet Refund Issued</option>
            </select>
          </div>
        </div>

        {/* Logs Table / Cards */}
        <div className="bg-[var(--card-background-color)]/50 border border-white/10 backdrop-blur-lg rounded-lg overflow-hidden relative z-20">
          {error && <p className="text-red-400 text-center py-4">{error}</p>}
          {pagedItems.length === 0 ? (
            <p className="text-center py-4">No logs found</p>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-sm text-left text-[var(--text-secondary)]">
                  <thead className="text-xs text-[var(--text-primary)] uppercase bg-white/5">
                    <tr>
                      {[
                        "Admin",
                        "Action",
                        "Target Table",
                        "Target ID",
                        "Details",
                        "Created At",
                      ].map((h) => (
                        <th
                          key={h}
                          className="px-6 py-3 whitespace-nowrap"
                          scope="col"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pagedItems.map((log) => (
                      <tr
                        key={log.id}
                        className="border-b border-white/10 hover:bg-white/10 transition-colors"
                      >
                        <td className="px-6 py-3 font-medium text-[var(--text-primary)] whitespace-nowrap">
                          {log.admin_email}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap">
                          {log.action}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap">
                          {log.target_table ?? "-"}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap">
                          {log.target_id ?? "-"}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap">
                          <button
                            className="px-2 py-1 text-xs rounded bg-[var(--primary-color)]/20 hover:bg-[var(--primary-color)]/40 transition-colors"
                            onClick={() => setSelectedLog(log)}
                          >
                            View
                          </button>
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap">
                          {log.created_at}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="sm:hidden space-y-4 p-4">
                {pagedItems.map((log) => (
                  <div
                    key={log.id}
                    className="bg-[var(--card-background-color)]/50 p-4 rounded-lg border border-white/10 text-sm text-[var(--text-primary)]/90 space-y-2"
                  >
                    <div className="flex justify-between">
                      <span className="font-semibold text-[var(--text-secondary)]">
                        Admin
                      </span>
                      <span>{log.admin_email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-[var(--text-secondary)]">
                        Action
                      </span>
                      <span>{log.action}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-[var(--text-secondary)]">
                        Target Table
                      </span>
                      <span>{log.target_table ?? "-"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-[var(--text-secondary)]">
                        Target ID
                      </span>
                      <span>{log.target_id ?? "-"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-[var(--text-secondary)]">
                        Details
                      </span>
                      <button
                        className="px-2 py-1 text-xs rounded bg-[var(--primary-color)]/20 hover:bg-[var(--primary-color)]/40 transition-colors"
                        onClick={() => setSelectedLog(log)}
                      >
                        View
                      </button>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-[var(--text-secondary)]">
                        Created
                      </span>
                      <span>{log.created_at}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <PaginationControls
                page={page}
                totalPages={totalPages}
                onPrev={prevPage}
                onNext={nextPage}
                onSetPage={setPage}
                showNumbers={true}
              />
            </>
          )}
        </div>

        {/* Modal for JSON Details */}
        {selectedLog && (
          <ViewLog log={selectedLog} onClose={() => setSelectedLog(null)} />
        )}
      </div>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-[var(--card-background-color)]/70 p-4 rounded-lg border border-white/10 text-center relative z-10">
      <p className="text-sm text-[var(--text-secondary)]">{label}</p>
      <p className="text-xl font-bold text-[var(--text-primary)]">{value}</p>
    </div>
  );
}
