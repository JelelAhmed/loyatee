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
