"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreateSupabaseClient } from "@/lib/supabase/client";
import { Mail, Lock, LogIn, Send, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const supabase = CreateSupabaseClient;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    // 🔑 Sign in attempt
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // 🔍 Check user role
    const { data: userRecord, error: userError } = await supabase
      .from("users")
      .select("role")
      .eq("id", data.user?.id)
      .single();

    if (userError || !userRecord) {
      setError("Account not found.");
      await supabase.auth.signOut();
      setLoading(false);
      return;
    }

    if (userRecord.role !== "admin") {
      // 🚫 reject non-admins right here
      setError("Access denied: only admins can log in here.");
      await supabase.auth.signOut();
      setLoading(false);
      return;
    }

    // ✅ Only admins pass
    router.push("/admin");
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email) {
      setError("Please enter your email");
      setLoading(false);
      return;
    }

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
      }
    );

    if (resetError) {
      setError(resetError.message);
      setLoading(false);
      return;
    }

    alert("Password reset link sent to your email.");
    setIsLogin(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--navy-blue)] px-4 sm:px-0 font-['Manrope',sans-serif] text-sm">
      <div className="w-full max-w-md p-6 sm:p-8 bg-[var(--card-background-color)]/95 backdrop-blur-sm border border-[var(--border-color)] rounded-lg shadow-lg">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-[var(--emerald-green)] mb-6">
          Yata Admin
        </h1>

        {isLogin ? (
          <>
            <h2 className="text-lg sm:text-xl font-semibold text-center text-[var(--text-primary)] mb-8">
              Log In
            </h2>
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label className="flex items-center gap-2 text-[var(--text-secondary)] mb-2">
                  <Mail className="w-5 h-5" /> Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-[var(--card-background-color)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--emerald-green)]"
                  placeholder="admin@loyatee.com"
                  disabled={loading}
                />
              </div>

              {/* Password */}
              <div>
                <label className="flex items-center gap-2 text-[var(--text-secondary)] mb-2">
                  <Lock className="w-5 h-5" /> Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-[var(--card-background-color)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--emerald-green)]"
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>

              {error && (
                <p className="text-red-400 text-sm text-center">{error}</p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-[var(--emerald-green)] text-white font-bold py-2 px-4 rounded-md hover:scale-105 transition disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Logging in…
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" /> Log In
                  </>
                )}
              </button>
            </form>

            <button
              onClick={() => {
                setIsLogin(false);
                setError("");
                setPassword("");
              }}
              disabled={loading}
              className="block w-full text-center text-[var(--text-secondary)] text-sm mt-4 hover:text-[var(--emerald-green)] disabled:opacity-50"
            >
              Forgot Password?
            </button>
          </>
        ) : (
          <>
            <h2 className="text-lg sm:text-xl font-semibold text-center text-[var(--text-primary)] mb-8">
              Forgot Password
            </h2>
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-6">
              <div>
                <label className="flex items-center gap-2 text-[var(--text-secondary)] mb-2">
                  <Mail className="w-5 h-5" /> Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-[var(--card-background-color)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--emerald-green)]"
                  placeholder="admin@loyatee.com"
                  disabled={loading}
                />
              </div>

              {error && (
                <p className="text-red-400 text-sm text-center">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-[var(--emerald-green)] text-white font-bold py-2 px-4 rounded-md hover:scale-105 transition disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Sending…
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" /> Send Reset Link
                  </>
                )}
              </button>
            </form>

            <button
              onClick={() => {
                setIsLogin(true);
                setError("");
              }}
              disabled={loading}
              className="block w-full text-center text-[var(--text-secondary)] text-sm mt-4 hover:text-[var(--emerald-green)] disabled:opacity-50"
            >
              Back to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}
