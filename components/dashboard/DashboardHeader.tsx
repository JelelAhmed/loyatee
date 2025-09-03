// "use client";

// import { useEffect, useState } from "react";
// import { UserCircle, Wallet } from "lucide-react";
// import { CreateSupabaseClient } from "@/lib/supabase/client";

// export default function DashboardHeader() {
//   const [userName, setUserName] = useState<string | null>(null);
//   const [walletBalance, setWalletBalance] = useState<number | null>(null);

//   useEffect(() => {
//     async function loadUserData() {
//       const { data: sessionData, error } =
//         await CreateSupabaseClient.auth.getSession();
//       if (error || !sessionData.session?.user) {
//         console.error("Error fetching session:", error);
//         return;
//       }

//       const user = sessionData.session.user;
//       setUserName(user?.user_metadata?.display_name || user?.email || "User");

//       // Fetch wallet balance
//       const { data: userData, error: balanceError } =
//         await CreateSupabaseClient.from("users")
//           .select("wallet_balance")
//           .eq("id", user.id)
//           .single();

//       if (!balanceError && userData) {
//         setWalletBalance(userData.wallet_balance);
//       }
//     }

//     loadUserData();
//   }, []);

//   // Decide balance color
//   const balanceColor =
//     walletBalance !== null && walletBalance < 100
//       ? "text-red-400 bg-red-500/10"
//       : "text-emerald-400 bg-gray-800";

//   return (
//     <header className="bg-gray-900 text-white py-3 shadow-md rounded-xl mb-6 sm:pt-3 pt-12">
//       {/* 👆 on mobile we push it down with pt-12 so it clears the sidebar button */}
//       <div className="flex justify-between items-center px-4">
//         {/* Greeting + Date */}
//         <div>
//           <h1 className="text-lg font-semibold text-emerald-400 truncate max-w-[150px] sm:max-w-none">
//             Hi, {userName ?? "…"}
//           </h1>
//           <p className="text-xs text-gray-400">
//             {new Date().toLocaleDateString("en-NG", {
//               weekday: "long",
//               year: "numeric",
//               month: "long",
//               day: "numeric",
//             })}
//           </p>
//         </div>

//         {/* Wallet + Avatar */}
//         <div className="flex items-center gap-4">
//           <div
//             className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold ${balanceColor}`}
//           >
//             <Wallet className="w-4 h-4" />
//             {walletBalance !== null
//               ? `₦${walletBalance.toLocaleString()}`
//               : "₦..."}
//           </div>
//           <UserCircle className="w-9 h-9 text-gray-400" />
//         </div>
//       </div>
//     </header>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { Wallet } from "lucide-react";
import { CreateSupabaseClient } from "@/lib/supabase/client";

export default function DashboardHeader() {
  const [userName, setUserName] = useState<string | null>(null);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);

  useEffect(() => {
    async function loadUserData() {
      const { data: sessionData, error } =
        await CreateSupabaseClient.auth.getSession();
      if (error || !sessionData.session?.user) {
        console.error("Error fetching session:", error);
        return;
      }

      const user = sessionData.session.user;
      setUserName(user?.user_metadata?.display_name || user?.email || "User");

      // Fetch wallet balance
      const { data: userData, error: balanceError } =
        await CreateSupabaseClient.from("users")
          .select("wallet_balance")
          .eq("id", user.id)
          .single();

      if (!balanceError && userData) {
        setWalletBalance(userData.wallet_balance);
      }
    }

    loadUserData();
  }, []);

  // Decide balance color
  const balanceColor =
    walletBalance !== null && walletBalance < 100
      ? "text-red-400 bg-red-500/10"
      : "text-emerald-400 bg-gray-800";

  return (
    <header className="bg-gray-900 text-white py-3 shadow-md rounded-xl mb-6 sm:pt-3 pt-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-4">
        {/* Greeting */}
        <div>
          <h1 className="text-lg font-semibold text-emerald-400 truncate max-w-[150px] sm:max-w-none">
            Hi, {userName ?? "…"}
          </h1>
          <p className="text-xs text-gray-400">
            {new Date().toLocaleDateString("en-NG", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Wallet */}
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold ${balanceColor}`}
        >
          <Wallet className="w-4 h-4" />
          {walletBalance !== null
            ? `₦${walletBalance.toLocaleString()}`
            : "₦..."}
        </div>
      </div>
    </header>
  );
}
