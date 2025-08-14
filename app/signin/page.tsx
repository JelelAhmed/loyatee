"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";
import { useActionState, useTransition } from "react";
import { signInWithEmail } from "@/app/actions/auth.actions";

export default function SignInPage() {
  const [isPending] = useTransition();
  const [state, formAction] = useActionState(signInWithEmail, {
    success: false,
    error: null,
  });

  return (
    <div className="wavy-gradient text-white min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-8 bg-[var(--dark-blue)] bg-opacity-80 backdrop-blur-sm rounded-2xl shadow-2xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-[var(--text-secondary)]">
            Sign in to continue to Loyatee
          </p>
        </div>

        <form action={formAction} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                type="email"
                id="email"
                name="email" // ✅ important
                autoComplete="email"
                required
                placeholder="Email address"
                className="relative block w-full appearance-none rounded-t-lg border border-gray-600 bg-[var(--input-bg-color)] px-3 py-4 text-white placeholder-gray-400 focus:z-10 focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password" // ✅ important
                autoComplete="current-password"
                required
                placeholder="Password"
                className="relative block w-full appearance-none rounded-b-lg border border-gray-600 bg-[var(--input-bg-color)] px-3 py-4 text-white placeholder-gray-400 focus:z-10 focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 sm:text-sm"
              />
            </div>
          </div>

          {state.error && (
            <p className="text-red-400 text-sm mt-2">{state.error}</p>
          )}

          <div className="text-center">
            <Button
              type="submit"
              disabled={isPending}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Processing..." : "Sign In"}
            </Button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
          Don’t have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-emerald-500 hover:text-emerald-400 hover:underline transition-colors"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
