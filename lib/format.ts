import type { CountNoun } from "@/types/project";

/** Shared formatting helpers. Deterministic — no locale or timezone drift. */

/** Picks the right form of a noun for a count. */
export function inflect(n: number, noun: CountNoun): string {
  return n === 1 ? noun.singular : (noun.plural ?? `${noun.singular}s`);
}

/**
 * Zero-padded count with a correctly inflected label: "01 finish",
 * "05 finishes". The counters in the section headers are set in the same
 * two-digit style as the station numbers, so the padding is part of the
 * typography, not an accident.
 */
export function countLabel(n: number, noun: CountNoun): string {
  return `${String(n).padStart(2, "0")} ${inflect(n, noun)}`;
}

/** Unpadded count, for running text and badges: "1 render", "2 renders". */
export function plainCount(n: number, noun: CountNoun): string {
  return `${n} ${inflect(n, noun)}`;
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
