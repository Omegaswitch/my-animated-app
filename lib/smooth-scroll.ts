import type Lenis from "lenis";

/**
 * A handle on the page's smooth-scroll instance.
 *
 * Lenis drives the real scroll position under its own rAF loop, which means
 * setting `overflow: hidden` does not stop it — it keeps calling `scrollTo`
 * regardless. Anything that needs the page to actually hold still, like the
 * lightbox, has to tell Lenis directly.
 *
 * A module singleton rather than context: the consumers are a provider that
 * mounts once and a modal that may open from anywhere, and threading a
 * context through six stations for that is more plumbing than it is worth.
 */
let instance: Lenis | null = null;

export function registerSmoothScroll(lenis: Lenis | null): void {
  instance = lenis;
}

/** Freeze the page. Safe to call when smooth scroll is not running. */
export function pauseSmoothScroll(): void {
  instance?.stop();
}

/** Resume. Safe to call when smooth scroll is not running. */
export function resumeSmoothScroll(): void {
  instance?.start();
}
