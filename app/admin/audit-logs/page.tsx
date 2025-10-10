// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { CreateSupabaseClient } from "@/lib/supabase/client";
// import ViewLog from "@/components/admin/ViewLog";
// import debounce from "lodash/debounce";
// import PaginationControls from "@/components/ui/paginationControls";
// import { usePagination } from "@/hooks/usePagination";

// interface AdminLog {
//   id: string;
//   admin_id: string;
//   admin_email: string;
//   action: string;
//   formatted_action: string; // Added for display
//   target_table: string | null;
//   target_id: string | null;
//   target_email?: string | null; // Mapped email
//   details: any;
//   created_at: string;
// }

// export default function AuditLogsPage() {
//   const supabase = CreateSupabaseClient;

//   const [logs, setLogs] = useState<AdminLog[]>([]);
//   const [searchInput, setSearchInput] = useState("");
//   const [search, setSearch] = useState("");
//   const [actionFilter, setActionFilter] = useState("all");
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedLog, setSelectedLog] = useState<AdminLog | null>(null);

//   const limit = 10;

//   const debouncedSetSearch = useMemo(
//     () =>
//       debounce((value: string) => {
//         setSearch(value);
//       }, 300),
//     []
//   );

//   useEffect(() => {
//     return () => debouncedSetSearch.cancel();
//   }, [debouncedSetSearch]);

//   // Helper to format action names (remove underscores, capitalize)
//   const formatAction = (action: string): string => {
//     return action
//       .replace(/_/g, " ")
//       .split(" ")
//       .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
//       .join(" ");
//   };

//   const fetchLogs = async () => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       let query: any = supabase
//         .from("admin_activity_logs")
//         .select("*, admin:users(id,email)")
//         .order("created_at", { ascending: false });

//       if (search) query = query.ilike("action", `%${search}%`);
//       if (actionFilter !== "all") query = query.eq("action", actionFilter);

//       const { data, error } = await query;

//       if (error) throw error;

//       // Collect unique target_ids where target_table is 'users'
//       const targetUserIds =
//         data
//           ?.filter((l: any) => l.target_table === "users" && l.target_id)
//           .map((l: any) => l.target_id) ?? [];

//       let targetEmails: Record<string, string> = {};
//       if (targetUserIds.length > 0) {
//         const { data: targetUsers } = await supabase
//           .from("users")
//           .select("id, email")
//           .in("id", targetUserIds);

//         targetEmails =
//           targetUsers?.reduce((acc, u) => {
//             acc[u.id] = u.email ?? "Unknown";
//             return acc;
//           }, {} as Record<string, string>) ?? {};
//       }

//       const formatted = (data ?? []).map((l: any) => ({
//         id: l.id,
//         admin_id: l.admin_id,
//         admin_email: l.admin?.email ?? "Unknown",
//         action: l.action,
//         formatted_action: formatAction(l.action),
//         target_table: l.target_table,
//         target_id: l.target_id,
//         target_email:
//           l.target_table === "users" && l.target_id
//             ? targetEmails[l.target_id]
//             : null,
//         details: l.details,
//         created_at: new Date(l.created_at).toLocaleString("en-GB", {
//           day: "2-digit",
//           month: "short",
//           year: "numeric",
//           hour: "2-digit",
//           minute: "2-digit",
//         }),
//       }));

//       setLogs(formatted);
//     } catch (err: any) {
//       setError(err?.message ?? "Failed to fetch logs");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchLogs();
//   }, [search, actionFilter]);

//   const { page, setPage, totalPages, pagedItems, nextPage, prevPage } =
//     usePagination(logs, limit);

//   const handleSearchInputChange = (val: string) => {
//     setSearchInput(val);
//     debouncedSetSearch(val);
//     setPage(0);
//   };

//   const handleActionFilterChange = (val: string) => {
//     setActionFilter(val);
//     setPage(0);
//   };

//   return (
//     <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 relative z-10">
//       <div className="max-w-7xl mx-auto space-y-6">
//         {/* Stats Card */}
//         <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
//           <StatCard label="Total Logs" value={logs.length} />
//         </div>

//         {/* Search + Filter */}
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
//           <div className="w-full sm:w-1/3">
//             <input
//               type="text"
//               placeholder="Search by action..."
//               value={searchInput}
//               onChange={(e) => handleSearchInputChange(e.target.value)}
//               className="w-full bg-gray-800/80 border border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
//             />
//           </div>
//           <div className="flex w-full sm:w-auto gap-2">
//             <select
//               value={actionFilter}
//               onChange={(e) => handleActionFilterChange(e.target.value)}
//               className="flex-1 min-w-[120px] bg-gray-800/80 border border-gray-600 rounded-lg px-2 py-2 text-xs sm:text-sm text-gray-100 truncate focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
//             >
//               <option value="all">All Actions</option>
//               <option value="REFUND_ISSUED">Refund Issued</option>
//               <option value="WALLET_DISPUTE_REJECTED">Dispute Rejected</option>
//               <option value="WALLET_DISPUTE_PENDING">Dispute Pending</option>
//               <option value="WALLET_REFUND_ISSUED">Wallet Refund Issued</option>
//             </select>
//           </div>
//         </div>

//         {/* Logs Table / Cards */}
//         <div className="bg-[var(--card-background-color)]/50 border border-white/10 backdrop-blur-lg rounded-lg overflow-hidden relative z-20 shadow-lg">
//           {error && <p className="text-red-400 text-center py-4">{error}</p>}
//           {pagedItems.length === 0 ? (
//             <p className="text-center py-4 text-[var(--text-secondary)]">
//               No logs found
//             </p>
//           ) : (
//             <>
//               {/* Desktop Table */}
//               <div className="hidden sm:block overflow-x-auto">
//                 <table className="w-full text-sm text-left text-[var(--text-secondary)]">
//                   <thead className="text-xs text-[var(--text-primary)] uppercase bg-white/5">
//                     <tr>
//                       {[
//                         "Admin",
//                         "Action",
//                         "Target Table",
//                         "Target",
//                         "Details",
//                         "Created At",
//                       ].map((h) => (
//                         <th
//                           key={h}
//                           className="px-6 py-3 whitespace-nowrap"
//                           scope="col"
//                         >
//                           {h}
//                         </th>
//                       ))}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {pagedItems.map((log) => (
//                       <tr
//                         key={log.id}
//                         className="border-b border-white/10 hover:bg-white/10 transition-colors"
//                       >
//                         <td className="px-6 py-3 font-medium text-[var(--text-primary)] whitespace-nowrap">
//                           {log.admin_email}
//                         </td>
//                         <td className="px-6 py-3 whitespace-nowrap">
//                           <span className="text-[var(--text-primary)]">
//                             {log.formatted_action}
//                           </span>
//                         </td>
//                         <td className="px-6 py-3 whitespace-nowrap">
//                           <span className="inline-block px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-400">
//                             {log.target_table ?? "-"}
//                           </span>
//                         </td>
//                         <td className="px-6 py-3 whitespace-nowrap">
//                           <span className="font-mono text-xs text-[var(--text-primary)] bg-gray-800/50 px-2 py-1 rounded">
//                             {log.target_email ?? log.target_id ?? "-"}
//                           </span>
//                         </td>
//                         <td className="px-6 py-3 whitespace-nowrap">
//                           <button
//                             className="px-3 py-2 text-xs rounded bg-[var(--primary-color)] hover:bg-[var(--primary-color)]/90 text-white font-medium transition-colors shadow-sm"
//                             onClick={() => setSelectedLog(log)}
//                           >
//                             View Details
//                           </button>
//                         </td>
//                         <td className="px-6 py-3 whitespace-nowrap text-[var(--text-secondary)]">
//                           {log.created_at}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>

//               {/* Mobile Cards */}
//               <div className="sm:hidden space-y-4 p-4">
//                 {pagedItems.map((log) => (
//                   <div
//                     key={log.id}
//                     className="bg-[var(--card-background-color)]/50 p-4 rounded-lg border border-white/10 text-sm text-[var(--text-primary)]/90 space-y-3 shadow-sm"
//                   >
//                     <div className="flex justify-between items-center">
//                       <span className="font-semibold text-[var(--text-secondary)]">
//                         Admin
//                       </span>
//                       <span className="text-[var(--text-primary)]">
//                         {log.admin_email}
//                       </span>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span className="font-semibold text-[var(--text-secondary)]">
//                         Action
//                       </span>
//                       <span className="text-[var(--text-primary)]">
//                         {log.formatted_action}
//                       </span>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span className="font-semibold text-[var(--text-secondary)]">
//                         Target Table
//                       </span>
//                       <span className="inline-block px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-400">
//                         {log.target_table ?? "-"}
//                       </span>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span className="font-semibold text-[var(--text-secondary)]">
//                         Target
//                       </span>
//                       <span className="font-mono text-xs text-[var(--text-primary)] bg-gray-800/50 px-2 py-1 rounded">
//                         {log.target_email ?? log.target_id ?? "-"}
//                       </span>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span className="font-semibold text-[var(--text-secondary)]">
//                         Created
//                       </span>
//                       <span className="text-[var(--text-secondary)]">
//                         {log.created_at}
//                       </span>
//                     </div>
//                     <div className="pt-2 border-t border-white/10">
//                       <button
//                         className="w-full px-3 py-2 text-xs rounded bg-[var(--primary-color)] hover:bg-[var(--primary-color)]/90 text-white font-medium transition-colors shadow-sm"
//                         onClick={() => setSelectedLog(log)}
//                       >
//                         View Details
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Pagination */}
//               <PaginationControls
//                 page={page}
//                 totalPages={totalPages}
//                 onPrev={prevPage}
//                 onNext={nextPage}
//                 onSetPage={setPage}
//                 showNumbers={true}
//               />
//             </>
//           )}
//         </div>

//         {/* Modal for JSON Details */}
//         {selectedLog && (
//           <ViewLog log={selectedLog} onClose={() => setSelectedLog(null)} />
//         )}
//       </div>
//     </main>
//   );
// }

// function StatCard({ label, value }: { label: string; value: string | number }) {
//   return (
//     <div className="bg-[var(--card-background-color)]/70 p-4 rounded-lg border border-white/10 text-center relative z-10 shadow-sm">
//       <p className="text-sm text-[var(--text-secondary)]">{label}</p>
//       <p className="text-xl font-bold text-[var(--text-primary)]">{value}</p>
//     </div>
//   );
// }

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
  formatted_action: string; // For display
  target_table: string | null;
  target_id: string | null;
  target_email?: string | null; // Mapped email
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

  useEffect(() => () => debouncedSetSearch.cancel(), [debouncedSetSearch]);

  const formatAction = (action: string): string =>
    action
      .replace(/_/g, " ")
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");

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

      // Map target emails for logs
      const targetUserIds =
        data
          ?.filter((l: any) => l.target_table === "users" && l.target_id)
          .map((l: any) => l.target_id) ?? [];

      let targetEmails: Record<string, string> = {};
      if (targetUserIds.length > 0) {
        const { data: targetUsers } = await supabase
          .from("users")
          .select("id,email")
          .in("id", targetUserIds);

        targetEmails =
          targetUsers?.reduce((acc, u) => {
            acc[u.id] = u.email ?? "Unknown";
            return acc;
          }, {} as Record<string, string>) ?? {};
      }

      const formatted = (data ?? []).map((l: any) => ({
        id: l.id,
        admin_id: l.admin_id,
        admin_email: l.admin?.email ?? "Unknown",
        action: l.action,
        formatted_action: formatAction(l.action),
        target_table: l.target_table,
        target_id: l.target_id,
        target_email:
          l.target_table === "users" && l.target_id
            ? targetEmails[l.target_id]
            : null,
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
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Total Logs" value={logs.length} />
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <input
            type="text"
            placeholder="Search by action..."
            value={searchInput}
            onChange={(e) => handleSearchInputChange(e.target.value)}
            className="w-full sm:w-1/3 bg-gray-800/80 border border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
          />
          <select
            value={actionFilter}
            onChange={(e) => handleActionFilterChange(e.target.value)}
            className="w-full sm:w-auto bg-gray-800/80 border border-gray-600 rounded-lg px-2 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
          >
            <option value="all">All Actions</option>
            <option value="REFUND_ISSUED">Refund Issued</option>
            <option value="WALLET_DISPUTE_REJECTED">Dispute Rejected</option>
            <option value="WALLET_DISPUTE_PENDING">Dispute Pending</option>
            <option value="WALLET_REFUND_ISSUED">Wallet Refund Issued</option>
          </select>
        </div>

        {/* Logs Table */}
        <div className="bg-[var(--card-background-color)]/50 border border-white/10 backdrop-blur-lg rounded-lg overflow-hidden shadow-lg">
          {error && <p className="text-red-400 text-center py-4">{error}</p>}
          {pagedItems.length === 0 ? (
            <p className="text-center py-4 text-[var(--text-secondary)]">
              No logs found
            </p>
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
                        "Target",
                        "Details",
                        "Created At",
                      ].map((h) => (
                        <th key={h} className="px-6 py-3 whitespace-nowrap">
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
                        <td className="px-6 py-3 font-medium text-[var(--text-primary)]">
                          {log.admin_email}
                        </td>
                        <td className="px-6 py-3">{log.formatted_action}</td>
                        <td className="px-6 py-3">
                          <span className="inline-block px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-400">
                            {log.target_table ?? "-"}
                          </span>
                        </td>
                        <td className="px-6 py-3">
                          <span className="font-mono text-xs text-[var(--text-primary)] bg-gray-800/50 px-2 py-1 rounded">
                            {log.target_email ?? log.target_id ?? "-"}
                          </span>
                        </td>
                        <td className="px-6 py-3">
                          <button
                            className="px-3 py-1 text-xs font-semibold rounded bg-green-500 hover:bg-green-600 text-white shadow transition-colors"
                            onClick={() => setSelectedLog(log)}
                          >
                            View
                          </button>
                        </td>
                        <td className="px-6 py-3 text-[var(--text-secondary)]">
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
                    className="bg-[var(--card-background-color)]/50 p-4 rounded-lg border border-white/10 shadow-sm"
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
                      <span>{log.formatted_action}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-[var(--text-secondary)]">
                        Target Table
                      </span>
                      <span className="inline-block px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-400">
                        {log.target_table ?? "-"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-[var(--text-secondary)]">
                        Target
                      </span>
                      <span className="font-mono text-xs bg-gray-800/50 px-2 py-1 rounded">
                        {log.target_email ?? log.target_id ?? "-"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-[var(--text-secondary)]">
                        Created
                      </span>
                      <span>{log.created_at}</span>
                    </div>
                    <div className="pt-2">
                      <button
                        className="w-full px-3 py-2 rounded bg-green-500 hover:bg-green-600 text-white font-semibold shadow"
                        onClick={() => setSelectedLog(log)}
                      >
                        View
                      </button>
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
                showNumbers
              />
            </>
          )}
        </div>

        {selectedLog && (
          <ViewLog log={selectedLog} onClose={() => setSelectedLog(null)} />
        )}
      </div>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-[var(--card-background-color)]/70 p-4 rounded-lg border border-white/10 text-center shadow-sm">
      <p className="text-sm text-[var(--text-secondary)]">{label}</p>
      <p className="text-xl font-bold text-[var(--text-primary)]">{value}</p>
    </div>
  );
}
