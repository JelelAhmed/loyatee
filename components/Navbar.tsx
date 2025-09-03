"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { YataLogoMinimal } from "./logo/LogoOptions";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/dashboard/buy-data", label: "Buy Data" },
  { href: "/signin", label: "Sign In" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-sm">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link
          href="/"
          className="animate-fade-in text-[#19e586] font-extrabold text-3xl"
        >
          <YataLogoMinimal className="h-10 w-auto" />
        </Link>

        {/* Desktop Links */}
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

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div
          ref={menuRef}
          className="md:hidden animate-fade-in bg-[#0d1117]/95 px-6 pb-4"
        >
          <div className="flex flex-col space-y-4">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "block text-lg transition-colors duration-300 hover:text-[#19e586]",
                  pathname === href
                    ? "text-[#19e586] font-semibold"
                    : "text-white"
                )}
              >
                {label}
              </Link>
            ))}

            <Link
              href="/signup"
              onClick={() => setIsOpen(false)}
              className="bg-[#19e586] text-[#0d1117] text-center font-bold py-2 px-4 rounded-lg hover:scale-105 transform transition-transform duration-300"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
