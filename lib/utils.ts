import airtelLogo from "@/public/logos/bharti-airtel-limited.svg";
import mtnLogo from "@/public/logos/mtn-group.svg";
import gloLogo from "@/public/logos/glo.svg";
import nineMobileLogo from "@/public/logos/idxHZRwL_K_1756814260433.jpeg";

export function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

// utils/errorMapping.ts
export function mapVendorErrorToUserMessage(vendorData: any): string {
  const rawMessage =
    vendorData?.error?.[0] ||
    vendorData?.message ||
    vendorData?.Message ||
    "Unknown vendor error";

  const lower = rawMessage.toLowerCase();

  if (lower.includes("invalid mobile number")) {
    return "Please enter a valid phone number.";
  }
  if (lower.includes("insufficient balance")) {
    return "Service is temporarily unavailable. Please try again later.";
  }
  if (lower.includes("plan")) {
    return "The selected data plan is not available at the moment.";
  }

  // fallback generic
  return "Purchase failed. Please try again later.";
}

export const NETWORK_LOGOS: Record<string, any> = {
  MTN: mtnLogo,
  GLO: gloLogo,
  AIRTEL: airtelLogo,
  "9MOBILE": nineMobileLogo,
};

export function formatFundingType(type: string): string {
  switch (type) {
    case "card":
      return "Card";
    case "bank_transfer":
      return "Bank Transfer";
    case "ussd":
      return "USSD";
    case "wallet_funding":
      return "Wallet Funding";
    default:
      // fallback: replace underscores with spaces + title-case
      return type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  }
}

export function formatCurrency(amount: number | string) {
  return Number(amount).toLocaleString("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

////  extract the numeric GB value
export function extractDataSize(planName: string): number {
  // Try to capture numbers like "1.5GB", "500MB"
  const match = planName.match(/([\d.]+)\s*(GB|MB)/i);
  if (!match) return Number.MAX_SAFE_INTEGER;

  let size = parseFloat(match[1]);
  const unit = match[2].toUpperCase();

  // Convert MB to GB for uniform comparison
  if (unit === "MB") {
    size = size / 1024;
  }

  return size;
}
export function extractDurationDays(raw: string): number {
  if (!raw) return 9999;

  let lower = raw.toLowerCase().trim();

  // Ensure spacing between digits and letters, e.g. "30days" -> "30 days"
  lower = lower.replace(/(\d)([a-z])/gi, "$1 $2");

  // Find first "<number> <unit>"
  const match = lower.match(
    /(\d+(\.\d+)?)\s*(day|days|week|weeks|month|months|year|years)/
  );
  if (!match) return 9999;

  const num = parseFloat(match[1]);
  const unit = match[3];

  if (unit.startsWith("day")) return num;
  if (unit.startsWith("week")) return num * 7;
  if (unit.startsWith("month")) return num * 30;
  if (unit.startsWith("year")) return num * 365;

  return 9999;
}

export function categorizeDuration(
  raw: string
): "daily" | "weekly" | "monthly" {
  const days = extractDurationDays(raw);

  if (days <= 3) return "daily";
  if (days <= 14) return "weekly";
  return "monthly";
}

export function formatDateTime(timestamp?: string | Date): string {
  if (!timestamp) return "—";

  try {
    const date = new Date(timestamp);

    // Example: "14 Aug 2025, 22:44"
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // 👈 forces 24-hour format
    });
  } catch (err) {
    console.error("Invalid timestamp:", timestamp);
    return "Invalid date";
  }
}
