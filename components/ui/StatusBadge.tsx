"use client";

import React from "react";

interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md";
}

export default function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const normalized = status.toLowerCase();

  const base =
    "inline-block font-medium rounded-full capitalize transition-colors";

  const sizeClasses =
    size === "sm" ? "text-xs px-2 py-1" : "text-sm px-3 py-1.5";

  const colorClasses =
    normalized === "completed" || normalized === "success"
      ? "bg-emerald-500/10 text-emerald-400"
      : ["pending", "processing", "under_review"].includes(normalized)
      ? "bg-amber-500/10 text-amber-400"
      : ["failed", "rejected", "error"].includes(normalized)
      ? "bg-red-500/10 text-red-400"
      : ["disputed"].includes(normalized)
      ? "bg-rose-500/10 text-rose-400"
      : ["active"].includes(normalized)
      ? "bg-green-500/10 text-green-400"
      : ["suspended", "banned"].includes(normalized)
      ? "bg-red-500/10 text-red-400"
      : "bg-slate-500/10 text-slate-300";

  return (
    <span className={`${base} ${sizeClasses} ${colorClasses}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
}
