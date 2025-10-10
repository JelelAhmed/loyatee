"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";
import { toast } from "sonner";
import { useActionState, useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signInWithPassword } from "@/app/actions/auth.actions";
import { SignInState } from "@/types/auth";

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [state, formAction, isPending] = useActionState<SignInState, FormData>(
    signInWithPassword,
    { success: false, error: null }
  );

  const [verifiedMessage, setVerifiedMessage] = useState<string | null>(null);

  // Show message if user just verified email
  useEffect(() => {
    if (searchParams.get("verified") === "true") {
      setVerifiedMessage("Your email has been verified! Please log in.");
    }

    if (searchParams.get("error") === "suspended") {
      toast.error("Account is Suspended. Contact Support yata@admin");
    }
  }, [searchParams]);

  useEffect(() => {
    if (state.success) {
      router.push("/dashboard");
    }
  }, [state.success, router]);

  return (
    <div className="wavy-gradient text-white min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-8 bg-[var(--dark-blue)] bg-opacity-80 backdrop-blur-sm rounded-2xl shadow-2xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-[var(--text-secondary)]">
            Sign in to continue to Yata
          </p>

          {verifiedMessage && (
            <p className="mt-4 text-green-400 font-medium text-sm">
              {verifiedMessage}
            </p>
          )}
        </div>

        <form action={formAction} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="identifier" className="sr-only">
                Email or Phone
              </label>
              <input
                type="text"
                id="identifier"
                name="identifier"
                autoComplete="username"
                required
                placeholder="Email"
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
                name="password"
                autoComplete="current-password"
                required
                placeholder="Password"
                className="relative block w-full appearance-none rounded-b-lg border border-gray-600 bg-[var(--input-bg-color)] px-3 py-4 text-white placeholder-gray-400 focus:z-10 focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 sm:text-sm"
              />
            </div>
          </div>
          {state.error && (
            <p
              className="text-red-400 text-sm mt-2"
              dangerouslySetInnerHTML={{
                __html: state.error
                  // highlight emails
                  .replace(
                    /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g,
                    '<span class="text-green-400 font-medium">$1</span>'
                  )
                  // highlight phone numbers (Nigerian or international)
                  .replace(
                    /(\+?\d{1,4}[\s-]?\(?\d{2,4}\)?[\s-]?\d{3,4}[\s-]?\d{3,4})/g,
                    '<span class="text-green-400 font-medium">$1</span>'
                  ),
              }}
            />
          )}

          <div className="flex justify-between items-center mt-1">
            <Link
              href="/forgot-password"
              className="text-sm text-emerald-500 hover:text-emerald-400 hover:underline transition-colors"
            >
              Forgot password?
            </Link>
          </div>

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

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="text-white">Loading...</div>}>
      <SignInContent />
    </Suspense>
  );
}
