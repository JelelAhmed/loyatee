"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function AdminNavbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/users", label: "Users" },
    { href: "/admin/transactions", label: "Transactions" },
    { href: "/admin/data-plans", label: "Data Plans" },
    { href: "/admin/settings", label: "Settings" },
    { href: "/admin/audit-logs", label: "Audit Logs" },
  ];

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <>
      <style jsx>{`
        @keyframes sidebar-in {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes sidebar-out {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(100%);
          }
        }
        .animate-sidebar-in {
          animation: sidebar-in 0.5s ease-out forwards;
        }
        .animate-sidebar-out {
          animation: sidebar-out 0.45s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
      `}</style>
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-white/10 bg-black/20 backdrop-blur-sm px-4 sm:px-10 py-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[var(--emerald-green)]">
            Yata
          </h1>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[var(--text-secondary)]">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`transition-colors duration-300 ${
                pathname === link.href
                  ? "text-[var(--emerald-green)] border-b-2 border-[var(--emerald-green)]"
                  : "hover:text-[var(--emerald-green)]"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <button className="relative">
            <svg
              className="w-6 h-6 text-[var(--emerald-green)] hover:text-[var(--text-primary)] transition-colors duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--emerald-green)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--emerald-green)]"></span>
            </span>
          </button>
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDqiyGFAMPCnjdjpdu4fb22Got2dFYUjU4FoTTrCoBTRwKG27pvXmg6lnr2RSND1o8yJmnbY8TN8IPxyS2pfZxz6vhSs5YwRO_iPWG_RVtG3Vg-xrWQXS_cx9jslKKyoQcNPUhXNYjuDofXavjvrkxg4Iplwi65M6Kz2G8vob84juGY6H8X37JFdlc-TCbCdv38i9yOxubmgoTsOCqHB3jUuzinaSeX9T27P3kboLIkHAA7lssSIAo-1g0aKMfbqA0R9SyltaA1y-D9")',
            }}
          ></div>
          <button className="md:hidden" onClick={() => setIsMenuOpen(true)}>
            <Menu className="w-6 h-6 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-300" />
          </button>
        </div>
      </header>
      {isMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsMenuOpen(false)}
          ></div>
          <nav
            ref={menuRef}
            className={`fixed top-0 right-0 h-full w-64 bg-[#0d1117]/95 backdrop-blur-lg border-l border-white/10 z-50 md:hidden ${
              isMenuOpen ? "animate-sidebar-in" : "animate-sidebar-out"
            }`}
          >
            <div className="flex justify-end p-4">
              <button onClick={() => setIsMenuOpen(false)}>
                <X className="w-6 h-6 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-300" />
              </button>
            </div>
            <div className="flex flex-col items-start gap-4 px-6 py-4 text-sm font-medium text-[var(--text-secondary)]">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`w-full py-2 transition-colors duration-300 ${
                    pathname === link.href
                      ? "text-[var(--emerald-green)] border-b-2 border-[var(--emerald-green)]"
                      : "hover:text-[var(--emerald-green)]"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </nav>
        </>
      )}
    </>
  );
}
