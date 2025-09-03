// components/NetworkLogos.tsx
import * as React from "react";

type Props = {
  name: string; // e.g. "MTN" | "AIRTEL" | "GLO" | "9MOBILE"
  className?: string; // tailwind sizing like "w-10 h-10"
  title?: string; // a11y label override
};

/**
 * Uniform, brand-colored SVG badges using initials—not official marks.
 * ViewBox and padding are consistent so they align nicely in a row.
 */
export function NetworkLogo({ name, className = "w-10 h-10", title }: Props) {
  const upper = (name || "").toUpperCase();

  // brand colors (approx)
  const palette: Record<string, { bg: string; fg: string; text: string }> = {
    MTN: { bg: "#FFCB05", fg: "#111827", text: "MTN" },
    AIRTEL: { bg: "#EA1B22", fg: "#FFFFFF", text: "Airtel" },
    GLO: { bg: "#00A651", fg: "#FFFFFF", text: "Glo" },
    "9MOBILE": { bg: "#A4CE39", fg: "#111827", text: "9mobile" },
  };

  const { bg, fg, text } = palette[upper] || {
    bg: "#374151",
    fg: "#F9FAFB",
    text: upper || "—",
  };

  return (
    <svg
      className={className}
      viewBox="0 0 40 40"
      role="img"
      aria-label={title || text}
    >
      {/* rounded badge background */}
      <rect x="0" y="0" width="40" height="40" rx="12" fill={bg} />
      {/* subtle inner ring for depth */}
      <rect
        x="1.5"
        y="1.5"
        width="37"
        height="37"
        rx="10.5"
        fill="none"
        stroke="rgba(0,0,0,0.12)"
        strokeWidth="1.5"
      />
      {/* initials */}
      <text
        x="20"
        y="23.5"
        textAnchor="middle"
        fontWeight="800"
        fontSize="14"
        fontFamily="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial"
        fill={fg}
      >
        {upper === "9MOBILE" ? "9" : upper === "AIRTEL" ? "A" : upper}
      </text>
    </svg>
  );
}

/** Convenience map if you prefer object access */
export const NETWORK_SVG: Record<
  string,
  (props?: Partial<Props>) => React.JSX.Element
> = {
  MTN: (p) => <NetworkLogo name="MTN" {...p} />,
  AIRTEL: (p) => <NetworkLogo name="AIRTEL" {...p} />,
  GLO: (p) => <NetworkLogo name="GLO" {...p} />,
  "9MOBILE": (p) => <NetworkLogo name="9MOBILE" {...p} />,
};
