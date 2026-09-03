/** Shared formatting helpers. Deterministic — no locale or timezone drift. */

/**
 * Zero-padded count with a correctly inflected label: "01 finish",
 * "05 finishes". The counters in the section headers are set in the same
 * two-digit style as the station numbers, so the padding is part of the
 * typography, not an accident.
 */
export function countLabel(n: number, singular: string, plural = `${singular}s`): string {
  return `${String(n).padStart(2, "0")} ${n === 1 ? singular : plural}`;
}

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
