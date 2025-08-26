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
