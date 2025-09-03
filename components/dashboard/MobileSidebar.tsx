"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  YataLogoPlayful,
  YataLogoBadge,
  YataLogoMinimal,
  YataLogo,
} from "../logo/LogoOptions";

import {
  Menu,
  X,
  Home,
  ShoppingBag,
  Wallet,
  Receipt,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const topNav = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <Home className="h-5 w-5" />,
  },
  {
    label: "Buy Data",
    href: "/dashboard/buy-data",
    icon: <ShoppingBag className="h-5 w-5" />,
  },
  {
    label: "Fund Wallet",
    href: "/dashboard/wallet",
    icon: <Wallet className="h-5 w-5" />,
  },
  {
    label: "Transactions",
    href: "/dashboard/transactions",
    icon: <Receipt className="h-5 w-5" />,
  },
];

const bottomNav = [
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: <Settings className="h-5 w-5" />,
  },
  { label: "Logout", href: "/logout", icon: <LogOut className="h-5 w-5" /> },
];

export default function MobileSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="lg:hidden">
      {/* Hamburger */}
      <button
        onClick={() => setOpen(true)}
        className="p-3 fixed top-4 left-4 z-40 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg shadow-md backdrop-blur transition"
      >
        <Menu className="h-6 w-6 text-white/90 drop-shadow-md" />
      </button>

      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-30 bg-black/50 transition-opacity duration-300",
          open ? "opacity-100 visible" : "opacity-0 invisible"
        )}
        onClick={() => setOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-64 z-40 bg-[#111927] p-6 border-r border-[var(--dark-navy)] flex flex-col justify-between transition-transform duration-300",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div>
          <div className="flex justify-between items-center mb-10">
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 text-2xl font-semibold"
            >
              <YataLogo className="h-10 w-auto" />
            </Link>

            <button onClick={() => setOpen(false)}>
              <X className="h-6 w-6 text-white" />
            </button>
          </div>

          {/* Top Nav */}
          <nav className="flex flex-col gap-3">
            {topNav.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-4 px-4 py-2 rounded-lg transition",
                    isActive
                      ? "bg-[var(--hover-bg)] text-[var(--text-primary)]"
                      : "text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)]"
                  )}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Nav */}
        <nav className="flex flex-col gap-3 mt-10">
          {bottomNav.map((item) => {
            const isActive = pathname === item.href;
            const isLogout = item.label === "Logout";

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-4 px-4 py-2 rounded-lg transition relative",
                  isLogout
                    ? "text-red-500 hover:bg-red-500/10"
                    : isActive
                    ? "bg-[var(--hover-bg)] text-[var(--emerald-green)]"
                    : "text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)]"
                )}
              >
                {/* Accent bar for active link (except logout) */}
                {!isLogout && isActive && (
                  <span className="absolute left-0 top-0 h-full w-1 bg-[var(--emerald-green)] rounded-r-lg" />
                )}
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </div>
  );
}
