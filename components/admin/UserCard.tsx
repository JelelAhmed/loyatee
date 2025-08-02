interface User {
  email: string;
  phone: string;
  joinedDate: string;
}

interface UserCardProps {
  user: User;
}

export default function UserCard({ user }: UserCardProps) {
  return (
    <div className="bg-[var(--card-background-color)]/50 p-4 rounded-lg border border-white/10 text-sm text-[var(--text-primary)]/90">
      <div className="flex justify-between">
        <span className="font-semibold text-[var(--text-secondary)]">
          Email
        </span>
        <span>{user.email}</span>
      </div>
      <div className="flex justify-between">
        <span className="font-semibold text-[var(--text-secondary)]">
          Phone
        </span>
        <span>{user.phone}</span>
      </div>
      <div className="flex justify-between">
        <span className="font-semibold text-[var(--text-secondary)]">
          Joined Date
        </span>
        <span>{user.joinedDate}</span>
      </div>
    </div>
  );
}
