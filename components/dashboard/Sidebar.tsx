"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Home,
  ShoppingBag,
  Wallet,
  Receipt,
  Settings,
  LogOut,
} from "lucide-react";

const topNav = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <Home className="h-6 w-6" />,
  },
  {
    label: "Buy Data",
    href: "/dashboard/buy-data",
    icon: <ShoppingBag className="h-6 w-6" />,
  },
  {
    label: "Fund Wallet",
    href: "/dashboard/wallet",
    icon: <Wallet className="h-6 w-6" />,
  },
  {
    label: "Transactions",
    href: "/dashboard/transactions",
    icon: <Receipt className="h-6 w-6" />,
  },
];

const bottomNav = [
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: <Settings className="h-6 w-6" />,
  },
  { label: "Logout", href: "/logout", icon: <LogOut className="h-6 w-6" /> },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar fixed top-0 left-0 h-full w-64 hidden lg:flex flex-col justify-between p-6 bg-[var(--sidebar-bg)] border-r border-[var(--dark-navy)] backdrop-blur-lg z-30">
      {/* Logo + Top Nav */}
      <div>
        <div className="mb-12">
          <Link
            href="/dashboard"
            className="text-[32px] font-bold text-[var(--emerald-green)]"
          >
            Loyatee
          </Link>
        </div>
        <nav className="flex flex-col space-y-3">
          {topNav.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-4 px-4 py-3 rounded-lg transition-colors duration-300",
                  isActive
                    ? "text-[var(--text-primary)] bg-[var(--hover-bg)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)]"
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
      <nav className="flex flex-col space-y-3">
        {bottomNav.map((item) => {
          const isActive = pathname === item.href;
          const isLogout = item.label === "Logout";

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-4 px-4 py-3 rounded-lg transition-colors duration-300",
                isLogout
                  ? "text-[var(--danger-color)] hover:bg-[var(--danger-bg)]"
                  : isActive
                  ? "text-[var(--text-primary)] bg-[var(--hover-bg)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)]"
              )}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
