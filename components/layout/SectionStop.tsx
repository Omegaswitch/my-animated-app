"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

/**
 * A stop on the line — the scroll behaviour wrapped around a section.
 *
 * Native scrolling throughout. This reads the scroll position of its own
 * track and never drives it: no wheel handlers, no snapping, no pinning of
 * the page itself. The only thing that "holds" is a CSS `position: sticky`
 * pane, which the browser handles.
 *
 * ## Why there are two modes
 *
 * `stop` is the pinned treatment: a tall track with a sticky, viewport-height
 * pane that holds the content centred while the track scrolls past it.
 * It requires the content to fit inside the viewport, because a sticky pane
 * with `overflow-hidden` clips whatever does not fit and — being pinned —
 * offers no way to scroll to the remainder. The content would be
 * unreachable, not merely off-screen.
 *
 * `pass` is for sections taller than the viewport. It keeps the scale and
 * opacity treatment so the section still arrives and departs like a stop, but
 * lets the content flow at its natural height and clips nothing.
 *
 * Choose per section. A section that fits at 900px tall may not at 700px, so
 * when in doubt `pass` is the safe one: it degrades the effect rather than
 * the content.
 *
 * ## The scroll range
 *
 * `offset: ["start end", "end start"]` measures from the moment the track's
 * top reaches the bottom of the viewport to the moment its bottom leaves the
 * top — so the range covers the approach and the departure, not just the time
 * on screen. That is what makes consecutive stops overlap: this section is
 * still fading out over its last 20% while the next is already fading in over
 * its first 20%, so the handover crossfades instead of leaving a blank frame
 * between two sections that both sit at zero.
 */

export interface SectionStopProps {
  children: ReactNode;
  /**
   * `stop` pins the content centred; requires it to fit the viewport.
   * `pass` leaves the content in flow — use for anything taller.
   */
  mode?: "stop" | "pass";
  /**
   * Track height in `stop` mode, applied from `lg` where pinning happens.
   * Longer tracks hold the stop for longer.
   */
  trackHeightClass?: string;
}

/** Scale holds at 1 across the middle, matching the pinned window. */
const SCALE_STOPS = [0, 0.3, 0.7, 1];
const SCALE_VALUES = [0.88, 1, 1, 1.08];

/** Opacity per the brief: in over the first fifth, out over the last. */
const OPACITY_STOPS = [0, 0.2, 0.8, 1];
const OPACITY_VALUES = [0, 1, 1, 0];

/**
 * In `pass` mode the section is taller than the viewport, so part of it is
 * still being read when the fade begins. It therefore bottoms out at a
 * legible floor instead of zero — fading long body copy to nothing while it
 * is still on screen would be a readability bug, not an effect.
 */
const PASS_OPACITY_VALUES = [0.4, 1, 1, 0.4];

export default function SectionStop({
  children,
  mode = "pass",
  trackHeightClass = "lg:h-[220vh]",
}: SectionStopProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion() ?? false;

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, SCALE_STOPS, SCALE_VALUES);
  const opacity = useTransform(
    scrollYProgress,
    OPACITY_STOPS,
    mode === "stop" ? OPACITY_VALUES : PASS_OPACITY_VALUES,
  );

  // Reduced motion: no scroll-linked geometry at all, content simply present.
  const style = prefersReducedMotion ? undefined : { scale, opacity };

  if (mode === "pass") {
    return (
      <div ref={trackRef} className="relative">
        <motion.div style={style} className="w-full will-change-transform">
          {children}
        </motion.div>
      </div>
    );
  }

  // Pinning is applied from `lg` only. Below that the column is narrow, every
  // section grows taller than the viewport, and a pinned pane would clip it —
  // Specification measures 913px against an 844px phone viewport. On small
  // screens the section simply flows, keeping the scale and opacity pass.
  return (
    <div ref={trackRef} className={`relative ${trackHeightClass}`}>
      <div className="lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-full lg:items-center lg:justify-center lg:overflow-hidden">
        {/* The section's own `py-32` separates it from its neighbours in
            normal flow. Pinned and vertically centred, that padding buys
            nothing and costs 256px of the height budget — enough to push a
            section that fits at 900px over the edge at 700px. Dropped only
            where the pane actually pins. */}
        <motion.div
          style={style}
          className="w-full will-change-transform lg:[&>section]:py-0"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
