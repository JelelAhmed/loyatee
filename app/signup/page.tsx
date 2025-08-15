"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useActionState } from "react";
import clsx from "clsx";

import Button from "@/components/ui/Button";
import { Eye, EyeOff } from "lucide-react";

import { signUpWithEmail, signUpWithPhone } from "../actions";

export default function SignUpPage() {
  const [useOtpFlow, setUseOtpFlow] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [state, formAction, isPending] = useActionState(
    useOtpFlow ? signUpWithPhone : signUpWithEmail,
    {
      success: false,
      error: null,
      unverified: false,
    }
  );

  useEffect(() => {
    if (state.success && !useOtpFlow) {
      // Only redirect to dashboard if verified
      if (!state.unverified) {
        const timer = setTimeout(() => {
          window.location.href = "/dashboard";
        }, 100);
        return () => clearTimeout(timer);
      }
      // Otherwise, stay on page and show feedback
    }
  }, [state.success, state.unverified, useOtpFlow]);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-900 px-4 sm:px-6 lg:px-8 text-white">
      <div className="wavy-gradient wavy-gradient-client absolute top-0 left-0 w-full h-full z-0"></div>

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

          <div className="flex justify-center mt-4 space-x-4 text-sm">
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

          <form action={formAction} className="mt-8 space-y-6">
            <div className="rounded-md shadow-sm -space-y-px">
              {/* Username */}
              <div>
                <label htmlFor="username" className="sr-only">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  autoComplete="username"
                  required
                  placeholder="Username"
                  className="relative block w-full appearance-none rounded-t-lg border border-gray-600 bg-[var(--input-bg-color)] px-3 py-4 text-white placeholder-gray-400 focus:z-10 focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 sm:text-sm"
                />
              </div>
              {!useOtpFlow && (
                <>
                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="sr-only">
                      Email address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      autoComplete="email"
                      required
                      placeholder="Email address"
                      className="relative block w-full appearance-none border border-gray-600 bg-[var(--input-bg-color)] px-3 py-4 text-white placeholder-gray-400 focus:z-10 focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 sm:text-sm"
                    />
                  </div>
                </>
              )}

              {/* Phone */}
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

                {/* Password */}
                <div className="relative">
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    autoComplete="current-password"
                    required
                    placeholder="Password"
                    className="relative block w-full appearance-none rounded-b-lg border border-gray-600 bg-[var(--input-bg-color)] px-3 py-4 pr-12 text-white placeholder-gray-400 focus:z-10 focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-white focus:outline-none"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            {state?.error && (
              <p className="text-red-500 text-sm text-center">{state.error}</p>
            )}
            {state.unverified && (
              <div className="text-center mt-4 p-4 bg-yellow-600/20 text-yellow-400 rounded-lg">
                ✅ Check your inbox! We sent a confirmation email to activate
                your account.
              </div>
            )}

            <div className="text-center">
              <Button
                type="submit"
                disabled={isPending}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending
                  ? "Processing..."
                  : useOtpFlow
                  ? "Sign Up with OTP"
                  : "Sign Up with Email"}
              </Button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="font-medium text-emerald-500 hover:text-emerald-400 hover:underline transition-colors"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
