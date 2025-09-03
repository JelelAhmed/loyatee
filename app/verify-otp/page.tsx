// "use client";

// import { useSearchParams, useRouter } from "next/navigation";
// import { useEffect, useTransition, useState } from "react";
// import { useActionState } from "react";
// import Link from "next/link";
// import { CheckCircle2 } from "lucide-react";

// import Button from "@/components/ui/Button";
// import { verifyPhoneOtp } from "../actions";

// export default function VerifyOtpPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const phone = searchParams.get("phone") || "";

//   const [isPending, startTransition] = useTransition();
//   const [showModal, setShowModal] = useState(false);

//   const [state, formAction] = useActionState(verifyPhoneOtp, {
//     success: false,
//     error: "",
//   });

//   useEffect(() => {
//     if (state.success) {
//       setShowModal(true);
//       const timer = setTimeout(() => {
//         setShowModal(false);
//         router.push("/dashboard");
//       }, 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [state.success, router]);

//   return (
//     <div className="relative min-h-screen flex items-center justify-center bg-gray-900 px-4 sm:px-6 lg:px-8 text-white">
//       <div className="wavy-gradient wavy-gradient-client absolute top-0 left-0 w-full h-full z-0"></div>

//       <div className="w-full max-w-md space-y-8 z-10">
//         <div className="bg-[var(--card-bg)] backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-[var(--border-color)]">
//           <div className="text-center">
//             <h1 className="text-3xl font-extrabold text-white">Yata</h1>
//             <h2 className="mt-2 text-2xl font-bold tracking-tight text-white">
//               Verify your phone
//             </h2>
//             <p className="mt-2 text-sm text-[var(--text-secondary)]">
//               We sent a 6-digit code to{" "}
//               <span className="text-emerald-500 font-semibold">{phone}</span>.
//               Enter it below to continue.
//             </p>
//           </div>

//           <form
//             action={(formData) => {
//               startTransition(() => {
//                 formAction(formData);
//               });
//             }}
//             className="mt-8 space-y-6"
//           >
//             <input type="hidden" name="phone" value={phone} />

//             <div>
//               <label htmlFor="otp" className="sr-only">
//                 Verification Code
//               </label>
//               <input
//                 type="text"
//                 id="otp"
//                 name="otp"
//                 inputMode="numeric"
//                 maxLength={6}
//                 pattern="[0-9]*"
//                 required
//                 placeholder="Enter 6-digit code"
//                 className="relative block w-full appearance-none rounded-lg border border-gray-600 bg-[var(--input-bg-color)] px-3 py-4 text-white placeholder-gray-400 focus:z-10 focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 sm:text-sm text-center tracking-widest text-lg"
//               />
//             </div>

//             {state?.error && (
//               <p className="text-red-500 text-sm text-center">{state.error}</p>
//             )}

//             <div className="text-center">
//               <Button
//                 type="submit"
//                 disabled={isPending}
//                 className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {isPending ? "Verifying..." : "Verify Code"}
//               </Button>
//             </div>
//           </form>

//           <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
//             Didn’t receive a code?{" "}
//             <Link
//               href={`/signup?phone=${encodeURIComponent(phone)}`}
//               className="font-medium text-emerald-500 hover:text-emerald-400 hover:underline transition-colors"
//             >
//               Resend
//             </Link>
//           </p>
//         </div>
//       </div>

//       {/* Success Modal */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-[var(--card-bg)] backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-[var(--border-color)] text-center max-w-sm w-full">
//             <CheckCircle2 className="mx-auto text-emerald-500 w-12 h-12 mb-4" />
//             <h2 className="text-xl font-semibold text-white mb-2">
//               Verification Successful
//             </h2>
//             <p className="text-[var(--text-secondary)] text-sm">
//               Redirecting to your dashboard in 3 seconds...
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useTransition, useState, Suspense } from "react";
import { useActionState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import Button from "@/components/ui/Button";
import { verifyPhoneOtp } from "../actions";

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone") || "";

  const [isPending, startTransition] = useTransition();
  const [showModal, setShowModal] = useState(false);

  const [state, formAction] = useActionState(verifyPhoneOtp, {
    success: false,
    error: "",
  });

  useEffect(() => {
    if (state.success) {
      setShowModal(true);
      const timer = setTimeout(() => {
        setShowModal(false);
        router.push("/dashboard");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [state.success, router]);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-900 px-4 sm:px-6 lg:px-8 text-white">
      <div className="wavy-gradient wavy-gradient-client absolute top-0 left-0 w-full h-full z-0"></div>

      <div className="w-full max-w-md space-y-8 z-10">
        <div className="bg-[var(--card-bg)] backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-[var(--border-color)]">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-white">Yata</h1>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-white">
              Verify your phone
            </h2>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              We sent a 6-digit code to{" "}
              <span className="text-emerald-500 font-semibold">{phone}</span>.
              Enter it below to continue.
            </p>
          </div>

          <form
            action={(formData) => {
              startTransition(() => {
                formAction(formData);
              });
            }}
            className="mt-8 space-y-6"
          >
            <input type="hidden" name="phone" value={phone} />

            <div>
              <label htmlFor="otp" className="sr-only">
                Verification Code
              </label>
              <input
                type="text"
                id="otp"
                name="otp"
                inputMode="numeric"
                maxLength={6}
                pattern="[0-9]*"
                required
                placeholder="Enter 6-digit code"
                className="relative block w-full appearance-none rounded-lg border border-gray-600 bg-[var(--input-bg-color)] px-3 py-4 text-white placeholder-gray-400 focus:z-10 focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 sm:text-sm text-center tracking-widest text-lg"
              />
            </div>

            {state?.error && (
              <p className="text-red-500 text-sm text-center">{state.error}</p>
            )}

            <div className="text-center">
              <Button
                type="submit"
                disabled={isPending}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? "Verifying..." : "Verify Code"}
              </Button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
            Didn’t receive a code?{" "}
            <Link
              href={`/signup?phone=${encodeURIComponent(phone)}`}
              className="font-medium text-emerald-500 hover:text-emerald-400 hover:underline transition-colors"
            >
              Resend
            </Link>
          </p>
        </div>
      </div>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[var(--card-bg)] backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-[var(--border-color)] text-center max-w-sm w-full">
            <CheckCircle2 className="mx-auto text-emerald-500 w-12 h-12 mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">
              Verification Successful
            </h2>
            <p className="text-[var(--text-secondary)] text-sm">
              Redirecting to your dashboard in 3 seconds...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div className="text-white">Loading...</div>}>
      <VerifyOtpContent />
    </Suspense>
  );
}
