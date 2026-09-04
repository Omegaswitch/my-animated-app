/** Shared formatting helpers. Deterministic — no locale or timezone drift. */

/**
 * Money from minor units. The locale is pinned rather than taken from the
 * runtime, so the server and the client render byte-identical strings and
 * hydration stays quiet.
 */
export function formatPrice(minor: number, currency: string): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(minor / 100);
}
