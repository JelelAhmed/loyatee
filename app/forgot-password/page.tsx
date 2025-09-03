"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { requestPasswordReset } from "../actions";
import { AuthState } from "@/types/auth";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [state, formAction, isPending] = useActionState<
    AuthState & { redirect?: string },
    FormData
  >(requestPasswordReset, {
    success: false,
    error: "",
  });

  // ✅ watch for redirect in returned state
  useEffect(() => {
    if (state?.redirect) {
      router.push(state.redirect);
    }
  }, [state?.redirect, router]);

  return (
    <div className="wavy-gradient text-white min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-[var(--dark-blue)] bg-opacity-80 backdrop-blur-sm rounded-2xl shadow-2xl">
        <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
        <p className="text-sm text-gray-400 mb-6">
          Enter your email and we’ll send you a reset link.
        </p>

        <form action={formAction} className="space-y-4">
          <input
            type="email"
            name="email"
            required
            placeholder="Your email"
            className="w-full px-3 py-3 rounded-lg border border-gray-600 bg-[var(--input-bg-color)] text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-emerald-500 focus:outline-none"
          />

          {state.error && <p className="text-red-400 text-sm">{state.error}</p>}

          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-emerald-600 hover:bg-emerald-500"
          >
            {isPending ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>
      </div>
    </div>
  );
}
