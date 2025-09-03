// lib/datastation/pricing.ts

/**
 * Global default markup applied to all plans (10% in this case).
 */
export const DEFAULT_MARKUP = 1.1;

/**
 * Optional per-network markups (fallback = DEFAULT_MARKUP).
 */
export const NETWORK_MARKUPS: Record<string, number> = {
  MTN: 1.12,
  GLO: 1.1,
  "9MOBILE": 1.15,
  AIRTEL: 1.1,
};

/**
 * Calculates the final selling price for a data plan.
 * - Applies API discount % (from vendor).
 * - Applies internal markup % (your margin).
 */
export function calculateFinalPrice(
  baseAmount: number,
  networkName: string,
  discountMap: Record<string, { percent: number }>
): number {
  // vendor discount (fallback 100% = no discount)
  const discountPercent = discountMap[networkName]?.percent ?? 100;

  // your markup (per network or global)
  const markup = NETWORK_MARKUPS[networkName] || DEFAULT_MARKUP;

  const raw = (baseAmount / (discountPercent / 100)) * markup;
  return Number(raw.toFixed(2));
}
