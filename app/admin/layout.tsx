"use client";

import { usePathname } from "next/navigation";
import AdminNavbar from "@/components/admin/AdminNavbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Exclude navbar and wavy background for /admin/login
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex size-full min-h-screen flex-col bg-[var(--navy-blue)] font-['Manrope',sans-serif]">
      <style jsx>{`
        :root {
          --primary-color: #19e586;
          --navy-blue: #0d1117;
          --card-background-color: #2d3748;
          --text-primary: #ffffff;
          --text-secondary: #a0aec0;
          --border-color: #4a5568;
        }
        .wavy-gradient-background {
          background: radial-gradient(circle at 30% 110%, #4c1d95, #0d1117 50%),
            radial-gradient(circle at 80% 20%, #19e586, #0d1117 40%);
          position: relative;
          overflow: hidden;
        }
        .wavy-svg {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          opacity: 0.3;
          animation: wave-shift 8s ease-in-out infinite;
          z-index: 0;
        }
        @keyframes wave-shift {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
      <div className="relative z-10 flex h-full grow flex-col wavy-gradient-background">
        <AdminNavbar />
        <main className="pt-16">{children}</main>
        <svg
          className="wavy-svg"
          fill="none"
          viewBox="0 0 1440 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 50C120 20 240 80 360 70C480 60 600 10 720 30C840 50 960 90 1080 80C1200 70 1320 20 1440 50V100H0V50Z"
            fill="white"
          />
        </svg>
      </div>
    </div>
  );
}
