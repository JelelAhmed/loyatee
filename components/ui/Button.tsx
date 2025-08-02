// components/ui/Button.tsx
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost";
}

export default function Button({
  children,
  className,
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "transition font-medium px-4 py-2 rounded-lg",
        variant === "primary" &&
          "bg-[var(--emerald-green)] text-white hover:bg-[var(--button-primary-hover)]",
        variant === "ghost" &&
          "bg-transparent text-white border border-[var(--border-color)] hover:bg-[var(--hover-bg)]",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
