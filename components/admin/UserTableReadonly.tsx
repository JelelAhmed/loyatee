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

interface UserTableReadonlyProps {
  users: User[];
}

export default function UserTableReadonly({ users }: UserTableReadonlyProps) {
  return (
    <div className="relative">
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm text-left text-[var(--text-secondary)]">
          <thead className="text-xs text-[var(--text-primary)] uppercase bg-white/5">
            <tr>
              {["Email", "Phone", "Role", "Wallet", "Status", "Joined"].map(
                (h) => (
                  <th
                    key={h}
                    className="px-6 py-3 whitespace-nowrap"
                    scope="col"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-white/10 hover:bg-white/10 transition-colors"
              >
                <td className="px-6 py-3 font-medium text-[var(--text-primary)] whitespace-nowrap">
                  {user.email}
                </td>
                <td className="px-6 py-3 whitespace-nowrap">{user.phone}</td>
                <td className="px-6 py-3 whitespace-nowrap capitalize">
                  {user.role}
                </td>
                <td className="px-6 py-3 whitespace-nowrap">
                  ₦
                  {Number(user.wallet_balance).toLocaleString("en-NG", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      user.is_banned
                        ? "bg-red-500/10 text-red-400"
                        : "bg-green-500/10 text-green-400"
                    }`}
                  >
                    {user.is_banned ? "Suspended" : "Active"}
                  </span>
                </td>
                <td className="px-6 py-3 whitespace-nowrap">
                  {formatDateTime(user.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
