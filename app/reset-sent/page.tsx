"use client";

import Link from "next/link";

export default function ResetSentPage() {
  return (
    <div className="wavy-gradient text-white min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-6 bg-[var(--dark-blue)] bg-opacity-80 backdrop-blur-sm rounded-2xl shadow-2xl text-center">
        <h1 className="text-3xl font-bold mb-4">Check Your Email</h1>
        <p className="text-[var(--text-secondary)]">
          We’ve sent you a password reset link. Please check your inbox and
          follow the instructions to reset your password.
        </p>

        <div className="mt-6">
          <Link
            href="/signin"
            className="inline-block bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-6 py-3 rounded-lg transition-colors"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
