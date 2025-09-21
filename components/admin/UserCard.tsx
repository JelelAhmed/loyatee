// "use client";

// interface User {
//   id: string;
//   email: string;
//   phone: string;
//   role: string;
//   walletBalance: number;
//   status: string;
//   is_banned: boolean;
//   joinedDate: string;
// }

// interface UserCardProps {
//   user: User;
// }

// export default function UserCard({ user }: UserCardProps) {
//   return (
//     <div className="bg-[var(--card-background-color)]/50 p-4 rounded-lg border border-white/10 text-sm text-[var(--text-primary)]/90 space-y-2">
//       <div className="flex justify-between">
//         <span className="font-semibold text-[var(--text-secondary)]">
//           Email
//         </span>
//         <span>{user.email}</span>
//       </div>
//       <div className="flex justify-between">
//         <span className="font-semibold text-[var(--text-secondary)]">
//           Phone
//         </span>
//         <span>{user.phone}</span>
//       </div>
//       <div className="flex justify-between">
//         <span className="font-semibold text-[var(--text-secondary)]">Role</span>
//         <span className="capitalize">{user.role}</span>
//       </div>
//       <div className="flex justify-between">
//         <span className="font-semibold text-[var(--text-secondary)]">
//           Wallet
//         </span>
//         <span>
//           ₦
//           {Number(user.walletBalance).toLocaleString("en-NG", {
//             minimumFractionDigits: 2,
//             maximumFractionDigits: 2,
//           })}
//         </span>
//       </div>
//       <div className="flex justify-between">
//         <span className="font-semibold text-[var(--text-secondary)]">
//           Status
//         </span>
//         <span
//           className={
//             user.status === "Active"
//               ? "text-green-400 font-semibold"
//               : "text-red-400 font-semibold"
//           }
//         >
//           {user.status}
//         </span>
//       </div>
//       <div className="flex justify-between">
//         <span className="font-semibold text-[var(--text-secondary)]">
//           Joined
//         </span>
//         <span>{user.joinedDate}</span>
//       </div>
//     </div>
//   );
// }

// "use client";

// interface User {
//   id: string;
//   email: string;
//   phone: string;
//   role: string;
//   walletBalance: number;
//   status: string;
//   is_banned: boolean;
//   joinedDate: string;
// }

// interface UserCardProps {
//   user: User;
//   onToggleStatus: (id: string, currentStatus: boolean) => void;
//   onChangeRole: (id: string, newRole: string) => void;
//   onDelete: (id: string) => void;
// }

// export default function UserCard({
//   user,
//   onToggleStatus,
//   onChangeRole,
//   onDelete,
// }: UserCardProps) {
//   return (
//     <div className="bg-[var(--card-background-color)]/50 p-4 rounded-lg border border-white/10 text-sm text-[var(--text-primary)]/90 space-y-2">
//       {/* Info fields */}
//       <div className="flex justify-between">
//         <span className="font-semibold text-[var(--text-secondary)]">
//           Email
//         </span>
//         <span>{user.email}</span>
//       </div>
//       <div className="flex justify-between">
//         <span className="font-semibold text-[var(--text-secondary)]">
//           Phone
//         </span>
//         <span>{user.phone}</span>
//       </div>
//       <div className="flex justify-between">
//         <span className="font-semibold text-[var(--text-secondary)]">Role</span>
//         <select
//           value={user.role}
//           onChange={(e) => onChangeRole(user.id, e.target.value)}
//           className="bg-transparent border border-white/20 rounded px-2 py-1 text-xs"
//         >
//           <option value="user">User</option>
//           <option value="admin">Admin</option>
//         </select>
//       </div>
//       <div className="flex justify-between">
//         <span className="font-semibold text-[var(--text-secondary)]">
//           Wallet
//         </span>
//         <span>
//           ₦
//           {Number(user.walletBalance).toLocaleString("en-NG", {
//             minimumFractionDigits: 2,
//             maximumFractionDigits: 2,
//           })}
//         </span>
//       </div>
//       <div className="flex justify-between">
//         <span className="font-semibold text-[var(--text-secondary)]">
//           Status
//         </span>
//         <span
//           className={
//             user.status === "Active"
//               ? "text-green-400 font-semibold"
//               : "text-red-400 font-semibold"
//           }
//         >
//           {user.status}
//         </span>
//       </div>
//       <div className="flex justify-between">
//         <span className="font-semibold text-[var(--text-secondary)]">
//           Joined
//         </span>
//         <span>{user.joinedDate}</span>
//       </div>

//       {/* Actions */}
//       <div className="flex justify-end gap-2 pt-3">
//         <button
//           onClick={() => onToggleStatus(user.id, user.is_banned)}
//           className="px-3 py-1 text-xs rounded bg-[var(--primary-color)]/20 hover:bg-[var(--primary-color)]/40 transition-colors"
//         >
//           {user.is_banned ? "Activate" : "Suspend"}
//         </button>
//         <button
//           onClick={() => onDelete(user.id)}
//           className="px-3 py-1 text-xs rounded bg-red-500/20 hover:bg-red-500/40 text-red-400 transition-colors"
//         >
//           Delete
//         </button>
//       </div>
//     </div>
//   );
// }

"use client";

interface User {
  id: string;
  email: string;
  phone: string;
  role: string;
  walletBalance: number;
  status: string;
  is_banned: boolean;
  joinedDate: string;
}

interface UserCardProps {
  user: User;
  onToggleStatus: (id: string, isBanned: boolean) => void;
  onChangeRole: (id: string, newRole: string) => void;
  onDelete: (id: string) => void;
}

export default function UserCard({
  user,
  onToggleStatus,
  onChangeRole,
  onDelete,
}: UserCardProps) {
  return (
    <div className="bg-[var(--card-background-color)]/50 p-4 rounded-lg border border-white/10 text-sm text-[var(--text-primary)]/90 space-y-2">
      {/* Info */}
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
      <div className="flex justify-between items-center">
        <span className="font-semibold text-[var(--text-secondary)]">Role</span>
        <select
          value={user.role}
          onChange={(e) => onChangeRole(user.id, e.target.value)}
          className="bg-transparent border border-white/20 rounded px-2 py-1 text-xs"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <div className="flex justify-between">
        <span className="font-semibold text-[var(--text-secondary)]">
          Wallet
        </span>
        <span>
          ₦
          {Number(user.walletBalance).toLocaleString("en-NG", {
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
          className={
            user.status === "Active"
              ? "text-green-400 font-semibold"
              : "text-red-400 font-semibold"
          }
        >
          {user.status}
        </span>
      </div>
      <div className="flex justify-between">
        <span className="font-semibold text-[var(--text-secondary)]">
          Joined
        </span>
        <span>{user.joinedDate}</span>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-3">
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
      </div>
    </div>
  );
}
