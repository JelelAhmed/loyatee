"use client";

import { formatDateTime } from "@/lib/utils";

interface User {
  id: string;
  email: string;
  phone: string;
  role: string;
  wallet_balance: number;
  is_banned: boolean;
  created_at: string;
}

interface UserCardReadonlyProps {
  user: User;
}

export default function UserCardReadonly({ user }: UserCardReadonlyProps) {
  return (
    <div className="bg-[var(--card-background-color)]/50 p-4 rounded-lg border border-white/10 text-sm text-[var(--text-primary)]/90 space-y-2">
      <div className="flex justify-between">
        <span className="font-semibold text-[var(--text-secondary)]">
          Email
        </span>
        <span className="truncate">{user.email}</span>
      </div>
      <div className="flex justify-between">
        <span className="font-semibold text-[var(--text-secondary)]">
          Phone
        </span>
        <span>{user.phone}</span>
      </div>
      <div className="flex justify-between">
        <span className="font-semibold text-[var(--text-secondary)]">Role</span>
        <span className="capitalize">{user.role}</span>
      </div>
      <div className="flex justify-between">
        <span className="font-semibold text-[var(--text-secondary)]">
          Wallet
        </span>
        <span>
          ₦
          {Number(user.wallet_balance).toLocaleString("en-NG", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      </div>
      <div className="flex justify-between">
        <span className="font-semibold text-[var(--text-secondary)]">
          Status
        </span>
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            user.is_banned
              ? "bg-red-500/10 text-red-400"
              : "bg-green-500/10 text-green-400"
          }`}
        >
          {user.is_banned ? "Suspended" : "Active"}
        </span>
      </div>
      <div className="flex justify-between">
        <span className="font-semibold text-[var(--text-secondary)]">
          Joined
        </span>
        <span>{formatDateTime(user.created_at)}</span>
      </div>
    </div>
  );
}
