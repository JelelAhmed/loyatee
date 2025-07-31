"use client";

import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="wavy-gradient text-white min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-8 bg-[var(--dark-blue)] bg-opacity-80 backdrop-blur-sm rounded-2xl shadow-2xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-[var(--light-gray)]">
            Sign in to continue to Loyatee
          </p>
        </div>

        <form className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                type="email"
                id="email"
                autoComplete="email"
                required
                placeholder="Email address"
                className="form-input appearance-none rounded-t-md relative block w-full px-3 py-4 bg-[var(--slate-gray)] bg-opacity-40 border border-transparent placeholder-[var(--light-gray)] text-white focus:outline-none focus:ring-[var(--brand-emerald)] focus:border-[var(--brand-emerald)] focus:z-10 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                type="password"
                id="password"
                autoComplete="current-password"
                required
                placeholder="Password"
                className="form-input appearance-none rounded-b-md relative block w-full px-3 py-4 bg-[var(--slate-gray)] bg-opacity-40 border border-transparent placeholder-[var(--light-gray)] text-white focus:outline-none focus:ring-[var(--brand-emerald)] focus:border-[var(--brand-emerald)] focus:z-10 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-md text-black bg-[var(--brand-emerald)] hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--dark-blue)] focus:ring-[var(--brand-emerald)] transition-transform duration-200 ease-in-out hover:scale-105"
            >
              Sign In
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--light-gray)]">
          Don’t have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-[var(--brand-emerald)] hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
