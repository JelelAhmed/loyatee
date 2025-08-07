"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import clsx from "clsx";

export default function SignUpPage() {
  const [useOtpFlow, setUseOtpFlow] = useState(true); // true = OTP flow; false = email flow

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-900 px-4 sm:px-6 lg:px-8 text-white">
      <div className="wavy-gradient absolute top-0 left-0 w-full h-full z-0"></div>

      <div className="w-full max-w-md space-y-8 z-10">
        <div className="bg-[var(--card-bg)] backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-[var(--border-color)]">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-white">Loyatee</h1>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-white">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Join the movement for affordable data.
            </p>
          </div>

          {/* Toggle Button */}
          <div className="flex  justify-center mt-4 space-x-4 text-sm">
            <button
              onClick={() => setUseOtpFlow(true)}
              className={clsx(
                "inline-block py-1 border-b-2",
                useOtpFlow
                  ? "border-emerald-500 text-emerald-500"
                  : "border-transparent text-gray-400 hover:text-emerald-400"
              )}
            >
              Sign in with OTP
            </button>
            <button
              onClick={() => setUseOtpFlow(false)}
              className={clsx(
                "py-1 inline-block border-b-2 transition-all",
                !useOtpFlow
                  ? "border-emerald-500 text-emerald-500"
                  : "border-transparent text-gray-400 hover:text-emerald-400"
              )}
            >
              Sign up with Email
            </button>
          </div>

          <form className="mt-8 space-y-6">
            <div className="rounded-md shadow-sm -space-y-px">
              {/* Conditionally render Email input only for Email flow */}
              {!useOtpFlow && (
                <div>
                  <label htmlFor="email" className="sr-only">
                    Email address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    autoComplete="email"
                    required={!useOtpFlow}
                    placeholder="Email address"
                    className="relative block w-full appearance-none rounded-t-lg border border-gray-600 bg-[var(--input-bg-color)] px-3 py-4 text-white placeholder-gray-400 focus:z-10 focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 sm:text-sm"
                  />
                </div>
              )}

              {/* Phone Number input for both flows */}
              <div className={clsx(useOtpFlow ? "rounded-t-lg" : "")}>
                <label htmlFor="phone-number" className="sr-only">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="text-[var(--text-secondary)] sm:text-sm">
                      +234
                    </span>
                  </div>
                  <input
                    type="tel"
                    id="phone-number"
                    name="phone"
                    autoComplete="tel"
                    required
                    placeholder="801 234 5678"
                    className="relative block w-full appearance-none border border-gray-600 bg-[var(--input-bg-color)] pl-14 pr-3 py-4 text-white placeholder-gray-400 focus:z-10 focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 sm:text-sm"
                  />
                </div>
              </div>

              {/* Password input for both flows */}
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  autoComplete="current-password"
                  required
                  placeholder="Password"
                  className="relative block w-full appearance-none rounded-b-lg border border-gray-600 bg-[var(--input-bg-color)] px-3 py-4 text-white placeholder-gray-400 focus:z-10 focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Error display (conditionally rendered later) */}
            {/* {state?.error && (
              <p className="text-red-500 text-sm text-center">{state.error}</p>
            )} */}

            <div className="text-center">
              <Button type="submit">
                {useOtpFlow ? "Sign Up with OTP" : "Sign Up with Email"}
              </Button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="font-medium text-[var(--emerald-green)] hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// "use client";

// import Link from "next/link";
// import Button from "@/components/ui/Button";

// export default function SignUpPage() {
//   return (
//     <div className="relative min-h-screen flex items-center justify-center bg-gray-900 px-4 sm:px-6 lg:px-8 text-white">
//       <div className="wavy-gradient absolute top-0 left-0 w-full h-full z-0"></div>

//       <div className="w-full max-w-md space-y-8 z-10">
//         <div className="bg-[var(--card-bg)] backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-[var(--border-color)]">
//           <div className="text-center">
//             <h1 className="text-3xl font-extrabold text-white">Loyatee</h1>
//             <h2 className="mt-2 text-2xl font-bold tracking-tight text-white">
//               Create your account
//             </h2>
//             <p className="mt-2 text-sm text-[var(--text-secondary)]">
//               Join the movement for affordable data.
//             </p>
//           </div>

//           <form className="mt-8 space-y-6">
//             <div className="rounded-md shadow-sm -space-y-px">
//               <div>
//                 <label htmlFor="email" className="sr-only">
//                   Email address
//                 </label>
//                 <input
//                   type="email"
//                   id="email"
//                   name="email"
//                   autoComplete="email"
//                   required
//                   placeholder="Email address"
//                   className="relative block w-full appearance-none rounded-t-lg border border-gray-600 bg-[var(--input-bg-color)] px-3 py-4 text-white placeholder-gray-400 focus:z-10 focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 sm:text-sm"
//                 />
//               </div>

//               <div className="relative">
//                 <label htmlFor="phone-number" className="sr-only">
//                   Phone Number
//                 </label>
//                 <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                   <span className="text-[var(--text-secondary)] sm:text-sm">
//                     +234
//                   </span>
//                 </div>
//                 <input
//                   type="tel"
//                   id="phone-number"
//                   name="phone-number"
//                   autoComplete="tel"
//                   required
//                   placeholder="801 234 5678"
//                   className="relative block w-full appearance-none border border-gray-600 bg-[var(--input-bg-color)] pl-14 pr-3 py-4 text-white placeholder-gray-400 focus:z-10 focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 sm:text-sm"
//                 />
//               </div>

//               <div>
//                 <label htmlFor="password" className="sr-only">
//                   Password
//                 </label>
//                 <input
//                   type="password"
//                   id="password"
//                   name="password"
//                   autoComplete="current-password"
//                   required
//                   placeholder="Password"
//                   className="relative block w-full appearance-none rounded-b-lg border border-gray-600 bg-[var(--input-bg-color)] px-3 py-4 text-white placeholder-gray-400 focus:z-10 focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 sm:text-sm"
//                 />
//               </div>
//             </div>
//             {/*
//             {state?.error && (
//               <p className="text-red-500 text-sm text-center">{state.error}</p>
//             )} */}

//             <div className="text-center">
//               <Button type="submit">Sign Up</Button>
//             </div>
//           </form>

//           <p className="mt-6 text-center text-sm">
//             Already have an account?{" "}
//             <Link
//               href="/signin"
//               className="font-medium text-[var(--emerald-green)] hover:underline"
//             >
//               Sign In
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }
