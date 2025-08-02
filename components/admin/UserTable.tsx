interface User {
  email: string;
  phone: string;
  joinedDate: string;
}

interface UserTableProps {
  users: User[];
}

export default function UserTable({ users }: UserTableProps) {
  return (
    <div className="hidden sm:block">
      <table className="w-full text-sm text-left text-[var(--text-secondary)]">
        <thead className="text-xs text-[var(--text-primary)] uppercase bg-white/5">
          <tr>
            {["Email", "Phone", "Joined Date"].map((h) => (
              <th key={h} className="px-6 py-3" scope="col">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.map((user, i) => (
            <tr
              key={i}
              className="border-b border-white/10 hover:bg-white/10 transition-colors"
            >
              <td className="px-6 py-4 font-medium text-[var(--text-primary)] whitespace-nowrap">
                {user.email}
              </td>
              <td className="px-6 py-4">{user.phone}</td>
              <td className="px-6 py-4">{user.joinedDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
