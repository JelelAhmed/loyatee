"use client";

interface User {
  id: string;
  email: string;
  phone: string;
  role: string;
  walletBalance: number;
  status: string;
  joinedDate: string;
  is_banned: boolean;
}

interface UserTableProps {
  users: User[];
  onToggleStatus: (id: string, isBanned: boolean) => void;
  onChangeRole: (id: string, newRole: string) => void;
  onDelete: (id: string) => void;
}

export default function UserTable({
  users,
  onToggleStatus,
  onChangeRole,
  onDelete,
}: UserTableProps) {
  return (
    <div className="relative">
      {/* Table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm text-left text-[var(--text-secondary)]">
          <thead className="text-xs text-[var(--text-primary)] uppercase bg-white/5">
            <tr>
              {[
                "Email",
                "Phone",
                "Role",
                "Wallet",
                "Status",
                "Joined",
                "Actions",
              ].map((h) => (
                <th key={h} className="px-6 py-3 whitespace-nowrap" scope="col">
                  {h}
                </th>
              ))}
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
                <td className="px-6 py-3 whitespace-nowrap">
                  <select
                    value={user.role}
                    onChange={(e) => onChangeRole(user.id, e.target.value)}
                    className="bg-transparent border border-white/20 rounded px-2 py-1 text-xs"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-6 py-3 whitespace-nowrap">
                  ₦
                  {Number(user.walletBalance).toLocaleString("en-NG", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td
                  className={`px-6 py-3 font-semibold whitespace-nowrap ${
                    user.status === "Active" ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {user.status}
                </td>
                <td className="px-6 py-3 whitespace-nowrap">
                  {user.joinedDate}
                </td>
                <td className="px-6 py-3 whitespace-nowrap flex gap-x-2">
                  <button
                    onClick={() => onToggleStatus(user.id, user.is_banned)}
                    className="px-3 py-1 text-xs rounded bg-[var(--primary-color)]/20 hover:bg-[var(--primary-color)]/40 transition-colors"
                  >
                    {user.is_banned ? "Activate" : "Suspend"}
                  </button>
                  <button
                    onClick={() => onDelete(user.id)}
                    className="px-3 py-1 text-xs rounded bg-red-500/20 hover:bg-red-500/40 text-red-400 transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
