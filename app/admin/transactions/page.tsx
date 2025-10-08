// // /app/admin/transactions/page.tsx
// "use client";

// import { useState, useMemo, useEffect } from "react";
// import TransactionTable from "@/components/admin/TransactionTable";
// import TransactionCard from "@/components/admin/TransactionCard";
// import { CreateSupabaseClient } from "@/lib/supabase/client";

// interface DisplayTransaction {
//   id: string;
//   user_email?: string;
//   user_id: string;
//   type: "data_purchase" | "wallet_funding";
//   amount: string;
//   status: string;
//   network_name?: string;
//   data_size?: string;
//   duration?: string;
//   funding_id?: string;
//   phone_number?: string;
//   dispute_type?: string;
//   dispute_note?: string;
//   payment_method?: string;
//   payment_reference?: string;
//   error_message?: string | null;
// }

// export default function TransactionsPage() {
//   const [transactions, setTransactions] = useState<DisplayTransaction[]>([]);
//   const [search, setSearch] = useState("");
//   const [activityType, setActivityType] = useState<
//     "data_purchase" | "wallet_funding"
//   >("data_purchase");
//   const [page, setPage] = useState(1);
//   const perPage = 10;

//   const supabase = CreateSupabaseClient; // ✅ call the function

//   const fetchTransactions = async () => {
//     // Fetch transactions
//     const { data: txData, error: txError } = await supabase
//       .from("transactions")
//       .select("*")
//       .order("created_at", { ascending: false });

//     if (txError) {
//       console.error("Failed to fetch transactions:", txError.message);
//       return;
//     }

//     // Fetch users for mapping user_id -> email & phone
//     const userIds = txData?.map((t: any) => t.user_id) ?? [];
//     const { data: usersData } = await supabase
//       .from("users")
//       .select("id, email, phone_number")
//       .in("id", userIds);

//     // Map network codes to friendly names
//     const networkMap: Record<string, string> = {
//       "1": "MTN",
//       "2": "GLO",
//       "3": "Airtel",
//       "4": "9mobile",
//     };

//     const mapped: DisplayTransaction[] = (txData ?? []).map((t: any) => {
//       const user = usersData?.find((u) => u.id === t.user_id);
//       return {
//         id: t.id,
//         user_email: user?.email ?? "Unknown email",
//         user_id: t.user_id,
//         type: t.type,
//         amount: t.amount,
//         status: t.status,
//         network_name: t.network_code
//           ? networkMap[t.network_code.toString()]
//           : "-",
//         data_size: t.data_size ?? "-",
//         duration: t.duration ?? "-",
//         funding_id: t.funding_id ?? "-",
//         dispute_note: t.dispute_note,
//         dispute_type: t.dispute_type,
//         phone_number: t.phone_number ?? user?.phone_number ?? "Unknown phone",
//         created_at: t.created_at,

//         // 🆕 Wallet funding–related
//         payment_method: t.payment_method ?? "-",
//         payment_reference: t.payment_reference ?? "-",
//         error_message: t.error_message ?? null,

//         vendor_response:
//           typeof t.vendor_response === "string"
//             ? JSON.parse(t.vendor_response || "{}")
//             : t.vendor_response,
//         reference_id: t.reference_id,
//       };
//     });

//     setTransactions(mapped);
//   };

//   useEffect(() => {
//     fetchTransactions();
//   }, []);

//   // Filtering & search
//   const filteredTransactions = useMemo(() => {
//     return transactions
//       .filter((t) => t.type === activityType)
//       .filter((t) => {
//         const userField = t.user_email ?? t.user_id ?? "";
//         return (
//           userField.toLowerCase().includes(search.toLowerCase()) ||
//           t.amount.toString().includes(search) ||
//           t.status.toLowerCase().includes(search.toLowerCase())
//         );
//       });
//   }, [transactions, activityType, search]);

//   // Pagination
//   const totalPages = Math.ceil(filteredTransactions.length / perPage);
//   const paginatedTransactions = useMemo(() => {
//     const start = (page - 1) * perPage;
//     return filteredTransactions.slice(start, start + perPage);
//   }, [filteredTransactions, page]);

//   return (
//     <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header & filters */}
//         <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
//           <h2 className="text-xl font-semibold text-[var(--text-primary)]">
//             Transactions
//           </h2>

//           <div className="flex items-center gap-2">
//             {/* Activity selector */}
//             <select
//               value={activityType}
//               onChange={(e) => {
//                 setActivityType(
//                   e.target.value as "data_purchase" | "wallet_funding"
//                 );
//                 setPage(1);
//               }}
//               className="bg-[#1f1f2e] border border-[#44475a] rounded-lg px-4 py-2 text-sm text-[#f8f8f2] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition-all"
//             >
//               <option value="data_purchase">Data Purchases</option>
//               <option value="wallet_funding">Wallet Funding</option>
//             </select>

//             {/* Search input */}
//             <input
//               type="text"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               placeholder="Search by user, amount, status..."
//               className="bg-[#1f1f2e] border border-[#44475a] rounded-lg px-4 py-2 text-sm text-[#f8f8f2] placeholder-[#6272a4] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition-all"
//             />
//           </div>
//         </div>

//         {/* Table & Cards */}
//         <div className="bg-[var(--card-background-color)]/50 border border-white/10 backdrop-blur-lg rounded-lg overflow-hidden relative z-10">
//           <TransactionTable
//             transactions={paginatedTransactions}
//             activityType={activityType}
//             onResolved={fetchTransactions}
//           />

//           <div className="sm:hidden space-y-4 p-4 z-10 relative">
//             {paginatedTransactions.map((t) => (
//               <TransactionCard
//                 key={t.id}
//                 transaction={t}
//                 onResolved={fetchTransactions}
//               />
//             ))}
//           </div>

//           {/* Pagination */}
//           <div className="flex items-center justify-between border-t border-white/10 px-6 py-3 z-10 relative">
//             <p className="text-sm text-[var(--text-secondary)]">
//               Showing {(page - 1) * perPage + 1} to{" "}
//               {Math.min(page * perPage, filteredTransactions.length)} of{" "}
//               {filteredTransactions.length} results
//             </p>
//             <div className="flex items-center gap-2">
//               <button
//                 className="px-3 py-1 text-sm font-medium rounded-md bg-[var(--card-background-color)]/50 hover:bg-white/10 transition-colors disabled:opacity-50"
//                 onClick={() => setPage((p) => Math.max(p - 1, 1))}
//                 disabled={page === 1}
//               >
//                 Previous
//               </button>
//               <button
//                 className="px-3 py-1 text-sm font-medium rounded-md bg-[var(--card-background-color)]/50 hover:bg-white/10 transition-colors"
//                 onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
//                 disabled={page === totalPages}
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }

"use client";

import { useState, useMemo, useEffect } from "react";
import TransactionTable from "@/components/admin/TransactionTable";
import TransactionCard from "@/components/admin/TransactionCard";
import { CreateSupabaseClient } from "@/lib/supabase/client";

interface DisplayTransaction {
  id: string;
  user_email?: string;
  user_id: string;
  type: "data_purchase" | "wallet_funding";
  amount: string;
  status: string;
  network_name?: string;
  data_size?: string;
  duration?: string;
  funding_id?: string;
  phone_number?: string;
  dispute_type?: string;
  dispute_note?: string;
  payment_method?: string;
  payment_reference?: string;
  error_message?: string | null;
  vendor_transaction_id?: string;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<DisplayTransaction[]>([]);
  const [search, setSearch] = useState("");
  const [activityType, setActivityType] = useState<
    "data_purchase" | "wallet_funding"
  >("data_purchase");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const supabase = CreateSupabaseClient;

  // const fetchTransactions = async () => {
  //   const { data: txData, error: txError } = await supabase
  //     .from("transactions")
  //     .select("*")
  //     .order("created_at", { ascending: false });

  //   if (txError) {
  //     console.error("Failed to fetch transactions:", txError.message);
  //     return;
  //   }

  //   // Fetch users for mapping
  //   const userIds = txData?.map((t: any) => t.user_id) ?? [];
  //   const { data: usersData } = await supabase
  //     .from("users")
  //     .select("id, email, phone_number")
  //     .in("id", userIds);

  //   const networkMap: Record<string, string> = {
  //     "1": "MTN",
  //     "2": "GLO",
  //     "3": "Airtel",
  //     "4": "9mobile",
  //   };

  //   const mapped: DisplayTransaction[] = (txData ?? []).map((t: any) => {
  //     const user = usersData?.find((u) => u.id === t.user_id);
  //     return {
  //       id: t.id,
  //       user_email: user?.email ?? "Unknown",
  //       user_id: t.user_id,
  //       type: t.type,
  //       amount: t.amount,
  //       status: t.status,
  //       network_name: t.network_code
  //         ? networkMap[t.network_code.toString()]
  //         : "-",
  //       data_size: t.data_size ?? "-",
  //       duration: t.duration ?? "-",
  //       funding_id: t.funding_id ?? "-",
  //       phone_number: t.phone_number ?? user?.phone_number ?? "-",
  //       dispute_type: t.dispute_type,
  //       dispute_note: t.dispute_note,
  //       payment_method: t.payment_method ?? "-",
  //       payment_reference: t.payment_reference ?? "-",
  //       error_message: t.error_message ?? null,
  //       vendor_transaction_id: t.vendor_transaction_id ?? "-",
  //       vendor_response:
  //         typeof t.vendor_response === "string"
  //           ? JSON.parse(t.vendor_response || "{}")
  //           : t.vendor_response,
  //     };
  //   });

  //   setTransactions(mapped);
  // };

  const fetchTransactions = async () => {
    // Fetch data purchase & wallet funding transactions
    const { data: txData, error: txError } = await supabase
      .from("transactions")
      .select("*")
      .order("created_at", { ascending: false });

    if (txError) {
      console.error("Failed to fetch transactions:", txError.message);
      return;
    }

    // 🆕 Fetch wallet_fundings for pending/failed records only
    const { data: fundingsData, error: fundingsError } = await supabase
      .from("wallet_fundings")
      .select("*")
      .in("status", ["pending", "failed"])
      .order("created_at", { ascending: false });

    if (fundingsError) {
      console.error("Failed to fetch wallet_fundings:", fundingsError.message);
    }

    // Fetch users for email/phone mapping
    const userIds = [
      ...(txData?.map((t) => t.user_id) ?? []),
      ...(fundingsData?.map((f) => f.user_id) ?? []),
    ];

    const { data: usersData } = await supabase
      .from("users")
      .select("id, email, phone_number")
      .in("id", userIds);

    // Map network codes (for data purchase)
    const networkMap: Record<string, string> = {
      "1": "MTN",
      "2": "GLO",
      "3": "Airtel",
      "4": "9mobile",
    };

    // --- Convert `transactions` ---
    const transactionMapped = (txData ?? []).map((t: any) => {
      const user = usersData?.find((u) => u.id === t.user_id);
      return {
        id: t.id,
        user_email: user?.email ?? "Unknown email",
        user_id: t.user_id,
        type: t.type,
        amount: t.amount,
        status: t.status,
        network_name: t.network_code
          ? networkMap[t.network_code.toString()]
          : "-",
        data_size: t.data_size ?? "-",
        duration: t.duration ?? "-",
        funding_id: t.funding_id ?? "-",
        dispute_note: t.dispute_note,
        dispute_type: t.dispute_type,
        phone_number: t.phone_number ?? user?.phone_number ?? "Unknown phone",
        created_at: t.created_at,
        payment_method: t.payment_method ?? "-",
        payment_reference: t.payment_reference ?? "-",
        error_message: t.error_message ?? null,
        vendor_response:
          typeof t.vendor_response === "string"
            ? JSON.parse(t.vendor_response || "{}")
            : t.vendor_response,
      };
    });

    // --- Convert `wallet_fundings` (pending/failed only) ---
    const pendingMapped = (fundingsData ?? []).map((f: any) => {
      const user = usersData?.find((u) => u.id === f.user_id);
      return {
        id: f.id,
        user_email: user?.email ?? "Unknown email",
        user_id: f.user_id,
        type: "wallet_funding",
        amount: f.amount,
        status: f.status, // 'pending' or 'failed'
        network_name: "-",
        data_size: "-",
        duration: "-",
        funding_id: f.id,
        dispute_note: null,
        dispute_type: null,
        phone_number: user?.phone_number ?? "-",
        created_at: f.created_at,
        payment_method: f.payment_method ?? "-",
        payment_reference: f.payment_reference ?? "-",
        error_message: f.error_message ?? null,
        vendor_response:
          typeof f.vendor_response === "string"
            ? JSON.parse(f.vendor_response || "{}")
            : f.vendor_response,
      };
    });

    // 🧩 Merge both sets of wallet fundings
    const mergedWalletFundings = [
      ...transactionMapped.filter((t) => t.type === "wallet_funding"),
      ...pendingMapped,
    ];

    // ✅ Final data source
    const finalMapped = [
      ...transactionMapped.filter((t) => t.type === "data_purchase"),
      ...mergedWalletFundings,
    ];

    setTransactions(finalMapped);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // 🧠 Filtering logic
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((t) => t.type === activityType)
      .filter((t) =>
        statusFilter ? t.status.toLowerCase() === statusFilter : true
      )
      .filter((t) => {
        const text = `${t.user_email ?? ""} ${t.user_id} ${t.amount} ${
          t.status
        }`.toLowerCase();
        return text.includes(search.toLowerCase());
      });
  }, [transactions, activityType, statusFilter, search]);

  const totalPages = Math.ceil(filteredTransactions.length / perPage);
  const paginatedTransactions = useMemo(() => {
    const start = (page - 1) * perPage;
    return filteredTransactions.slice(start, start + perPage);
  }, [filteredTransactions, page]);

  return (
    <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">
            Transactions
          </h2>

          <div className="flex flex-wrap gap-2 items-center">
            {/* Activity type */}
            <select
              value={activityType}
              onChange={(e) => {
                setActivityType(
                  e.target.value as "data_purchase" | "wallet_funding"
                );
                setPage(1);
              }}
              className="bg-[#1f1f2e] border border-[#44475a] rounded-lg px-3 py-2 text-sm text-[#f8f8f2] focus:ring-2 focus:ring-[var(--primary-color)]"
            >
              <option value="data_purchase">Data Purchases</option>
              <option value="wallet_funding">Wallet Fundings</option>
            </select>

            {/* Status filter */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="bg-[#1f1f2e] border border-[#44475a] rounded-lg px-3 py-2 text-sm text-[#f8f8f2] focus:ring-2 focus:ring-[var(--primary-color)]"
            >
              <option value="">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="under_review">Under Review</option>
              <option value="refunded">Refunded</option>
            </select>

            {/* Search */}
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search user, amount, status..."
              className="bg-[#1f1f2e] border border-[#44475a] rounded-lg px-3 py-2 text-sm text-[#f8f8f2] placeholder-[#6272a4] focus:ring-2 focus:ring-[var(--primary-color)]"
            />
          </div>
        </div>

        {/* Table & Cards */}
        <div className="bg-[var(--card-background-color)]/50 border border-white/10 rounded-lg overflow-hidden">
          <TransactionTable
            transactions={paginatedTransactions}
            activityType={activityType}
            onResolved={fetchTransactions}
          />

          <div className="sm:hidden space-y-4 p-4">
            {paginatedTransactions.map((t) => (
              <TransactionCard
                key={t.id}
                transaction={t}
                onResolved={fetchTransactions}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-white/10 px-6 py-3">
            <p className="text-sm text-[var(--text-secondary)]">
              Showing {(page - 1) * perPage + 1} to{" "}
              {Math.min(page * perPage, filteredTransactions.length)} of{" "}
              {filteredTransactions.length} results
            </p>
            <div className="flex gap-2">
              <button
                className="px-3 py-1 text-sm rounded-md bg-white/5 hover:bg-white/10 disabled:opacity-40"
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
              >
                Prev
              </button>
              <button
                className="px-3 py-1 text-sm rounded-md bg-white/5 hover:bg-white/10 disabled:opacity-40"
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
