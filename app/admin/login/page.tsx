"use client";

import { useState } from "react";
import { Mail, Lock, LogIn, Send } from "lucide-react";

export default function AdminLoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    // Placeholder for login auth logic (replace with API call to lib/admin/auth.ts)
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your email");
      return;
    }

    // Placeholder for forgot password logic (replace with API call to lib/admin/auth.ts)
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--navy-blue)] font-['Manrope',sans-serif] text-sm">
      <div className="w-full max-w-md p-6 bg-[var(--card-background-color)]/95 backdrop-blur-sm border border-[var(--border-color)] rounded-lg">
        <h1 className="text-3xl font-bold text-center text-[var(--emerald-green)] mb-6">
          Loyatee Admin
        </h1>
        {isLogin ? (
          <>
            <h2 className="text-xl font-semibold text-center text-[var(--text-primary)] mb-8">
              Log In
            </h2>
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="flex items-center gap-2 text-[var(--text-secondary)] mb-2"
                >
                  <Mail className="w-5 h-5" />
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-[var(--navy-blue)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--emerald-green)]"
                  placeholder="admin@loyatee.com"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="flex items-center gap-2 text-[var(--text-secondary)] mb-2"
                >
                  <Lock className="w-5 h-5" />
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-[var(--navy-blue)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--emerald-green)]"
                  placeholder="••••••••"
                />
              </div>
              {error && (
                <p className="text-[var(--text-secondary)] text-sm text-center">
                  {error}
                </p>
              )}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-[var(--emerald-green)] text-[var(--navy-blue)] font-bold py-2 px-4 rounded-md hover:scale-105 transform transition-transform duration-300"
              >
                <LogIn className="w-5 h-5" />
                Log In
              </button>
            </form>
            <button
              onClick={() => {
                setIsLogin(false);
                setError("");
                setPassword("");
              }}
              className="block text-center text-[var(--text-secondary)] text-sm mt-4 hover:text-[var(--emerald-green)] transition-colors duration-300"
            >
              Forgot Password?
            </button>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-center text-[var(--text-primary)] mb-8">
              Forgot Password
            </h2>
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="flex items-center gap-2 text-[var(--text-secondary)] mb-2"
                >
                  <Mail className="w-5 h-5" />
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-[var(--navy-blue)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--emerald-green)]"
                  placeholder="admin@loyatee.com"
                />
              </div>
              {error && (
                <p className="text-[var(--text-secondary)] text-sm text-center">
                  {error}
                </p>
              )}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-[var(--emerald-green)] text-[var(--navy-blue)] font-bold py-2 px-4 rounded-md hover:scale-105 transform transition-transform duration-300"
              >
                <Send className="w-5 h-5" />
                Send Reset Link
              </button>
            </form>
            <button
              onClick={() => {
                setIsLogin(true);
                setError("");
              }}
              className="block text-center text-[var(--text-secondary)] text-sm mt-4 hover:text-[var(--emerald-green)] transition-colors duration-300"
            >
              Back to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}
