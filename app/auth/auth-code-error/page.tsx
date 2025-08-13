// app/auth/auth-code-error/page.tsx
export default function AuthCodeError() {
  return (
    <div className="min-h-screen bg-[#0d1117] text-white font-manrope flex items-center justify-center px-4 py-20 text-center">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-6">Loyatee</h1>
        <h2 className="text-3xl font-bold mb-4">Verification Error</h2>
        <p className="text-lg text-gray-200">
          An error occurred during email verification. Please try again or
          contact support.
        </p>
        <a
          href="/signup"
          className="inline-block bg-[#19e586] text-black px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:scale-105 transition-transform duration-300 mt-6"
        >
          Try Again
        </a>
      </div>
    </div>
  );
}
