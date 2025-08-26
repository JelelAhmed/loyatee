// "use client";

"use client";

import { useState, useEffect, useMemo } from "react";
import { getDataPlans, purchaseDataPlan } from "@/app/actions/data.actions";
import { CreateSupabaseClient } from "@/lib/supabase/client";
import { CheckCircle2, XCircle } from "lucide-react";
import { DataPlan } from "@/types/dataPlans";
import { Transaction } from "@/types/transactions";

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
      const { plans, error } = await getDataPlans();
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

  async function handlePurchase(e: React.FormEvent) {
    e.preventDefault();
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
      networkCode: String(selectedPlan.network), // vendor expects numeric id
      planId: selectedPlan.dataplan_id,
      phoneNumber,
      amount: selectedPlan.final_price,
    });

    if (result.success) {
      setSuccessMsg(result.message);
      // refetch transactions after purchase
      const { data: txData } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", userRes.user.id)
        .eq("type", "data_purchase")
        .order("created_at", { ascending: false });
      setTransactions(txData ?? []);
    } else {
      setError(result.message);
    }

    setLoading(false);
  }

  return (
    <main className="py-6 bg-[#0d0f1a] text-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        <h1 className="text-2xl font-semibold text-emerald-400">Buy Data</h1>

        {error && (
          <p className="text-red-400 bg-red-900/30 p-3 rounded-lg border border-red-700">
            {error}
          </p>
        )}
        {successMsg && (
          <p className="text-emerald-400 bg-emerald-900/30 p-3 rounded-lg border border-emerald-700 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            {successMsg}
          </p>
        )}

        {/* Buy Data Form */}
        <form
          onSubmit={handlePurchase}
          className="bg-gray-900 p-6 rounded-xl shadow space-y-6"
        >
          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPlans.length > 0 ? (
                filteredPlans.map((plan) => (
                  <button
                    key={plan.dataplan_id}
                    type="button"
                    onClick={() => setSelectedPlan(plan)}
                    className={`p-4 border rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors text-left ${
                      selectedPlan?.dataplan_id === plan.dataplan_id
                        ? "border-emerald-400"
                        : "border-gray-700"
                    }`}
                  >
                    <h3 className="font-semibold">
                      {plan.plan} ({plan.plan_type})
                    </h3>
                    <p className="text-sm text-gray-400">
                      {plan.month_validate}
                    </p>
                    <p className="text-emerald-400 font-bold mt-2">
                      ₦{plan.final_price}
                    </p>
                  </button>
                ))
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
                className="bg-emerald-400 hover:bg-emerald-500 text-black font-semibold px-6 py-2 rounded-lg transition disabled:opacity-50"
              >
                {loading ? "Processing..." : `Buy ${selectedPlan.plan}`}
              </button>
            </div>
          )}
        </form>

        {/* Purchase History */}
        <div className="bg-gray-900 p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4 text-emerald-400">
            Purchase History
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-700">
                  <th className="py-2">Network</th>
                  <th className="py-2">Amount</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-gray-800">
                    <td className="py-3">{tx.network_code}</td>
                    <td>₦{tx.amount}</td>
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
      </div>
    </main>
  );
}

// import { useState, useEffect, useMemo, useActionState } from "react";
// import { getDataPlans, purchaseDataPlan } from "@/app/actions/data.actions";
// import { CreateSupabaseClient } from "@/lib/supabase/client";
// import { CheckCircle2, XCircle } from "lucide-react";

// const dummyTransactions = [
//   {
//     id: 1,
//     network: "MTN",
//     amount: "₦500",
//     status: "Successful",
//     date: "2025-07-30",
//     vendor_plan_id: "1",
//     created_at: "2025-07-30",
//   },
//   {
//     id: 2,
//     network: "Glo",
//     amount: "₦1000",
//     status: "Failed",
//     date: "2025-07-29",
//     vendor_plan_id: "2",
//     created_at: "2025-07-30",
//   },
//   {
//     id: 3,
//     network: "Airtel",
//     amount: "₦750",
//     status: "Successful",
//     date: "2025-07-28",
//     vendor_plan_id: "3",
//     created_at: "2025-07-30",
//   },
// ];

// export default function DataPlansPage() {
//   const [plans, setPlans] = useState<DataPlan[]>([]);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedNetwork, setSelectedNetwork] = useState<string>("");
//   const [selectedPlanType, setSelectedPlanType] = useState<string>("");
//   const [transactions, setTransactions] = useState<Transaction[]>([]);
//   const [phoneNumber, setPhoneNumber] = useState<string>("");
//   const [selectedPlan, setSelectedPlan] = useState<DataPlan | null>(null);
//   const [state, formAction] = useActionState(purchaseDataPlan, {
//     success: false,
//     error: null,
//   });

//   useEffect(() => {
//     async function fetchData() {
//       const { plans, error } = await getDataPlans();
//       setPlans(plans);
//       setError(error);
//     }
//     fetchData();
//   }, []);

//   useEffect(() => {
//     async function fetchData() {
//       const { plans, error } = await getDataPlans();
//       setPlans(plans);
//       setError(error);

//       const supabase = CreateSupabaseClient;
//       const { data: user } = await supabase.auth.getUser();
//       if (user.user) {
//         const { data: txData } = await supabase
//           .from("transactions")
//           .select("*")
//           .eq("user_id", user.user.id)
//           .eq("type", "data_purchase")
//           .order("created_at", { ascending: false });
//         setTransactions(txData ?? []);
//       }
//     }
//     fetchData();
//   }, []);

//   const networks = useMemo(
//     () => Array.from(new Set(plans.map((p) => p.plan_network))),
//     [plans]
//   );

//   const planTypes = useMemo(
//     () =>
//       Array.from(
//         new Set(
//           plans
//             .filter((p) => p.plan_network === selectedNetwork)
//             .map((p) => p.plan_type)
//         )
//       ),
//     [plans, selectedNetwork]
//   );

//   const filteredPlans = useMemo(
//     () =>
//       plans
//         .filter((p) => p.plan_network === selectedNetwork)
//         .filter((p) =>
//           selectedPlanType ? p.plan_type === selectedPlanType : true
//         )
//         .sort((a, b) => a.final_price - b.final_price),
//     [plans, selectedNetwork, selectedPlanType]
//   );

//   return (
//     <main className="py-6 bg-[#0d0f1a] text-white min-h-screen">
//       <div className="max-w-6xl mx-auto px-4 space-y-8">
//         {/* Page Title */}
//         <h1 className="text-2xl font-semibold text-emerald-400">Buy Data</h1>

//         {/* Error / Success Messages */}
//         {error && (
//           <p className="text-red-400 bg-red-900/30 p-3 rounded-lg border border-red-700">
//             {error}
//           </p>
//         )}
//         {state.error && (
//           <p className="text-red-400 bg-red-900/30 p-3 rounded-lg border border-red-700">
//             {state.error}
//           </p>
//         )}
//         {state.success && selectedPlan && (
//           <p className="text-emerald-400 bg-emerald-900/30 p-3 rounded-lg border border-emerald-700 flex items-center gap-2">
//             <CheckCircle2 className="w-5 h-5" />
//             Successfully purchased {selectedPlan.plan} ({selectedPlan.plan_type}
//             ) for {phoneNumber}!
//           </p>
//         )}

//         {/* Buy Data Form */}
//         <form
//           action={formAction}
//           className="bg-gray-900 p-6 rounded-xl shadow space-y-6"
//         >
//           {/* Controls */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//               <label className="block text-sm text-gray-400 mb-1">
//                 Select Network
//               </label>
//               <select
//                 value={selectedNetwork}
//                 onChange={(e) => {
//                   setSelectedNetwork(e.target.value);
//                   setSelectedPlanType("");
//                   setSelectedPlan(null);
//                 }}
//                 className="w-full p-2 rounded-lg bg-[#0d0f1a] text-white border border-gray-700 focus:ring-emerald-500 focus:border-emerald-500"
//               >
//                 <option value="">Choose network</option>
//                 {networks.map((n) => (
//                   <option key={n} value={n}>
//                     {n}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm text-gray-400 mb-1">
//                 Select Plan Type
//               </label>
//               <select
//                 value={selectedPlanType}
//                 onChange={(e) => setSelectedPlanType(e.target.value)}
//                 disabled={!selectedNetwork}
//                 className="w-full p-2 rounded-lg bg-[#0d0f1a] text-white border border-gray-700 focus:ring-emerald-500 focus:border-emerald-500"
//               >
//                 <option value="">All types</option>
//                 {planTypes.map((t) => (
//                   <option key={t} value={t}>
//                     {t}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm text-gray-400 mb-1">
//                 Phone Number
//               </label>
//               <input
//                 type="text"
//                 value={phoneNumber}
//                 onChange={(e) => setPhoneNumber(e.target.value)}
//                 placeholder="08123456789"
//                 className="w-full p-2 rounded-lg bg-[#0d0f1a] text-white border border-gray-700 focus:ring-emerald-500 focus:border-emerald-500"
//               />
//             </div>
//           </div>

//           {/* Plans Grid */}
//           {selectedNetwork && (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//               {filteredPlans.length > 0 ? (
//                 filteredPlans.map((plan) => (
//                   <button
//                     key={plan.dataplan_id}
//                     type="button"
//                     onClick={() => setSelectedPlan(plan)}
//                     className={`p-4 border rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors text-left ${
//                       selectedPlan?.dataplan_id === plan.dataplan_id
//                         ? "border-emerald-400"
//                         : "border-gray-700"
//                     }`}
//                   >
//                     <h3 className="font-semibold">
//                       {plan.plan} ({plan.plan_type})
//                     </h3>
//                     <p className="text-sm text-gray-400">
//                       {plan.month_validate}
//                     </p>
//                     <p className="text-emerald-400 font-bold mt-2">
//                       ₦{plan.final_price}
//                     </p>
//                   </button>
//                 ))
//               ) : (
//                 <p className="text-gray-400 col-span-full text-center">
//                   No plans available.
//                 </p>
//               )}
//             </div>
//           )}

//           {/* Submit */}
//           {selectedPlan && (
//             <div className="flex justify-center">
//               <button
//                 type="submit"
//                 className="bg-emerald-400 hover:bg-emerald-500 text-black font-semibold px-6 py-2 rounded-lg transition"
//               >
//                 Buy {selectedPlan.plan}
//               </button>
//             </div>
//           )}
//         </form>

//         {/* Purchase History */}
//         <div className="bg-gray-900 p-6 rounded-xl shadow">
//           <h2 className="text-lg font-semibold mb-4 text-emerald-400">
//             Purchase History
//           </h2>
//           <div className="overflow-x-auto">
//             <table className="min-w-full text-sm">
//               <thead>
//                 <tr className="text-left text-gray-400 border-b border-gray-700">
//                   <th className="py-2">Network</th>
//                   <th className="py-2">Amount</th>
//                   <th className="py-2">Status</th>
//                   <th className="py-2">Date</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {[...transactions, ...dummyTransactions].map((tx, idx) => (
//                   <tr key={tx.id || idx} className="border-b border-gray-800">
//                     <td className="py-3">
//                       {tx.network || tx.vendor_plan_id?.split("-")[0]}
//                     </td>
//                     <td>₦{tx.amount}</td>
//                     <td>
//                       <span
//                         className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
//                           tx.status === "Successful" || tx.status === "success"
//                             ? "bg-emerald-500/10 text-emerald-400"
//                             : "bg-red-500/10 text-red-400"
//                         }`}
//                       >
//                         {tx.status === "Successful" ||
//                         tx.status === "success" ? (
//                           <CheckCircle2 className="w-3 h-3" />
//                         ) : (
//                           <XCircle className="w-3 h-3" />
//                         )}
//                         {tx.status}
//                       </span>
//                     </td>
//                     <td>
//                       {tx.date ||
//                         new Date(tx.created_at).toLocaleDateString("en-NG", {
//                           timeZone: "Africa/Lagos",
//                         })}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }
