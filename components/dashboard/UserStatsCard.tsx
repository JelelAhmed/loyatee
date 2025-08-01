import { ReactNode } from "react";

type UserStatsCardProps = {
  title: string;
  value: string;
  icon: ReactNode;
  color?: string;
};

export default function UserStatsCard({
  title,
  value,
  icon,
  color = "bg-gray-800",
}: UserStatsCardProps) {
  return (
    <div
      className={`p-4 rounded-xl shadow-md flex items-center justify-between ${color}`}
    >
      <div>
        <h4 className="text-gray-400 text-sm">{title}</h4>
        <p className="text-2xl font-semibold text-white">{value}</p>
      </div>
      <div className="text-3xl text-emerald-400">{icon}</div>
    </div>
  );
}
