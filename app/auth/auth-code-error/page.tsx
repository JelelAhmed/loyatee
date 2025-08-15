// app/auth/auth-code-error/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function AuthCodeError() {
  const searchParams = useSearchParams();
  const reason = searchParams?.get("reason");

  // Default values for unknown errors
  let title = "Verification Error";
  let message =
    "An error occurred during email verification. Please try again or contact support.";
  let buttonText = "Try Again";
  let buttonHref = "/signup";

  if (reason === "already-verified") {
    title = "Email Already Verified";
    message = "This email has already been verified. You can sign in now.";
    buttonText = "Sign In";
    buttonHref = "/signin";
  } else if (reason === "invalid-token") {
    title = "Verification Link Invalid";
    message =
      "The verification link is invalid or has expired. Please try signing up again.";
    buttonText = "Sign Up";
    buttonHref = "/signup";
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-white font-manrope flex items-center justify-center px-4 py-20 text-center">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-6">Loyatee</h1>
        <h2 className="text-3xl font-bold mb-4">{title}</h2>
        <p className="text-lg text-gray-200">{message}</p>
        <Link
          href={buttonHref}
          className="inline-block bg-[#19e586] text-black px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:scale-105 transition-transform duration-300 mt-6"
        >
          {buttonText}
        </Link>
      </div>
    </div>
  );
}
