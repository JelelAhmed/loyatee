import ResetPasswordClient from "@/components/auths/resetPasswordClient";

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams?: { code?: string };
}) {
  return <ResetPasswordClient code={searchParams?.code} />;
}
// "use client";

// import { useActionState, useEffect, useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { CreateSupabaseClient } from "@/lib/supabase/client";
// import { updatePassword } from "../actions";
// import Button from "@/components/ui/Button";
// import { AuthState } from "@/types/auth";

// export default function ResetPasswordPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const [loading, setLoading] = useState(true);

//   const [state, formAction, isPending] = useActionState<AuthState, FormData>(
//     updatePassword,
//     { success: false, error: "" }
//   );

//   // ✅ Step 1: Exchange the `code` from the URL for a Supabase session
//   useEffect(() => {
//     const exchangeCode = async () => {
//       const code = searchParams.get("code");
//       if (!code) {
//         setLoading(false);
//         return;
//       }

//       try {
//         const supabase = CreateSupabaseClient;
//         const { error } = await supabase.auth.exchangeCodeForSession(code);

//         if (error) {
//           console.error("Error exchanging code:", error.message);
//         }
//       } catch (err) {
//         console.error("Unexpected error exchanging code:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     exchangeCode();
//   }, [searchParams]);

//   // ✅ Step 2: Redirect to signin if password update succeeded
//   useEffect(() => {
//     if (state.success) {
//       router.push("/signin?reset=success");
//     }
//   }, [state.success, router]);

//   if (loading) {
//     return (
//       <div className="wavy-gradient text-white min-h-screen flex items-center justify-center">
//         <p className="text-lg">Loading reset form...</p>
//       </div>
//     );
//   }

//   // ✅ Step 3: Show password reset form
//   return (
//     <div className="wavy-gradient text-white min-h-screen flex items-center justify-center">
//       <div className="w-full max-w-md p-8 space-y-8 bg-[var(--dark-blue)] bg-opacity-80 backdrop-blur-sm rounded-2xl shadow-2xl">
//         <div className="text-center">
//           <h1 className="text-3xl font-bold mb-2">Reset Password</h1>
//           <p className="text-[var(--text-secondary)]">
//             Enter your new password below
//           </p>
//         </div>

//         <form action={formAction} className="mt-8 space-y-6">
//           <div>
//             <label htmlFor="password" className="sr-only">
//               New Password
//             </label>
//             <input
//               type="password"
//               id="password"
//               name="password"
//               required
//               placeholder="New Password"
//               className="relative block w-full appearance-none rounded-lg border border-gray-600 bg-[var(--input-bg-color)] px-3 py-4 text-white placeholder-gray-400 focus:z-10 focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 sm:text-sm"
//             />
//           </div>

//           {state.error && (
//             <p className="text-red-400 text-sm mt-2">{state.error}</p>
//           )}

//           <div className="text-center">
//             <Button
//               type="submit"
//               disabled={isPending}
//               className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {isPending ? "Updating..." : "Update Password"}
//             </Button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }
