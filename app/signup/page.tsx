"use client";

import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-900 px-4 sm:px-6 lg:px-8 text-white">
      <div className="wavy-gradient absolute top-0 left-0 w-full h-full z-0"></div>

      <div className="w-full max-w-md space-y-8 z-10">
        <div className="bg-gray-800/50 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-gray-700/50">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-white">Loyatee</h1>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-white">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              Join the movement for affordable data.
            </p>
          </div>

          <form className="mt-8 space-y-6" method="POST">
            <div className="rounded-md shadow-sm -space-y-px">
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
                  className="relative block w-full appearance-none rounded-t-lg border border-gray-600 bg-gray-700 px-3 py-4 text-white placeholder-gray-400 focus:z-10 focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 sm:text-sm"
                />
              </div>

              <div className="relative">
                <label htmlFor="phone-number" className="sr-only">
                  Phone Number
                </label>
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <span className="text-gray-400 sm:text-sm">+234</span>
                </div>
                <input
                  type="tel"
                  id="phone-number"
                  name="phone-number"
                  autoComplete="tel"
                  required
                  placeholder="801 234 5678"
                  className="relative block w-full appearance-none border border-gray-600 bg-gray-700 pl-14 pr-3 py-4 text-white placeholder-gray-400 focus:z-10 focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 sm:text-sm"
                />
              </div>

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
                  className="relative block w-full appearance-none rounded-b-lg border border-gray-600 bg-gray-700 px-3 py-4 text-white placeholder-gray-400 focus:z-10 focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 sm:text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-[var(--brand-emerald)] py-3 px-4 text-sm font-semibold text-gray-900 transition-transform duration-200 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              Sign Up
            </button>
          </form>

          <p className="mt-6 text-center text-sm">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="font-medium text-[var(--brand-emerald)] hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
