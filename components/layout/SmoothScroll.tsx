"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { registerSmoothScroll } from "@/lib/smooth-scroll";

/**
 * Inertial scrolling for the whole document.
 *
 * Lenis intercepts wheel and touch input and animates the *real* scroll
 * position, so a flick decays into a glide instead of landing as a stack of
 * discrete ticks. Because it moves the actual scroll position rather than
 * transforming a container, everything reading `window` scroll keeps working:
 * `position: sticky` still pins, and framer's `useScroll` still measures.
 *
 * `autoRaf` lets Lenis own its own frame loop, so there is no second loop
 * here to fall out of step with framer's.
 *
 * Disabled outright under `prefers-reduced-motion`. Smoothing is momentum
 * applied to a deliberate action, which is exactly what that setting asks us
 * not to do — and the page then scrolls natively, which is the correct
 * fallback rather than a degraded one.
 *
 * Renders nothing.
 */

/** ~0.09 lerp: a flick glides without feeling detached from the input. */
const LERP = 0.09;

export default function SmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;

    const lenis = new Lenis({
      lerp: LERP,
      smoothWheel: true,
      autoRaf: true,
      // Anchor jumps should land, not glide for a second and a half.
      anchors: false,
    });
    registerSmoothScroll(lenis);

    return () => {
      registerSmoothScroll(null);
      lenis.destroy();
    };
  }, []);

  return null;
}
