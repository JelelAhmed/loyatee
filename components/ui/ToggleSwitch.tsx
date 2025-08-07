"use client";

import { ToggleLeft } from "lucide-react";

interface ToggleSwitchProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export default function ToggleSwitch({
  id,
  label,
  checked,
  onChange,
}: ToggleSwitchProps) {
  return (
    <div className="flex items-center gap-3">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="relative peer h-5 w-9 appearance-none rounded-full bg-[var(--border-color)] checked:bg-[var(--emerald-green)] transition-all duration-300 cursor-pointer
                   before:absolute before:top-0.5 before:left-0.5 before:h-4 before:w-4 before:rounded-full before:bg-[var(--text-primary)] before:transition-all before:duration-300
                   checked:before:translate-x-4 focus:outline-none focus:ring-2 focus:ring-[var(--emerald-green)]"
      />
      <label
        htmlFor={id}
        className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] cursor-pointer hover:text-[var(--text-primary)] transition-colors duration-300"
      >
        <ToggleLeft className="w-5 h-5" />
        {label}
      </label>
    </div>
  );
}
