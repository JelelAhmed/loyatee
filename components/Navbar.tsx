"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/buy-data", label: "Buy Data" },
  { href: "/signin", label: "Sign In" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-[#0d1117]/80 backdrop-blur-sm">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-[#19e586] font-extrabold text-3xl">
          Loyatee
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "transition-colors duration-300 hover:text-[#19e586]",
                pathname === href
                  ? "text-[#19e586] font-semibold"
                  : "text-white"
              )}
            >
              {label}
            </Link>
          ))}
        </div>

        <Link
          href="/signup"
          className="hidden md:inline-block bg-[#19e586] text-[#0d1117] font-bold py-2 px-6 rounded-lg hover:scale-105 transform transition-transform duration-300"
        >
          Get Started
        </Link>
      </nav>
    </header>
  );
}
