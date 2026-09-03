"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import type { LineRef } from "@/types/project";
import LineStation, { type StationState } from "./LineStation";

/**
 * The route — two parallel rails that trace the document's scroll progress.
 *
 * Native scrolling only: this component reads the scroll position and never
 * drives it. Nothing here snaps, pins, or hijacks the wheel.
 *
 * Layout follows the brief's two cases:
 *   mobile  — pinned to the left margin, content takes the remaining width
 *   desktop — centred, content offsets around it editorially
 *
 * The rails are decorative (`aria-hidden`). The lifecycle they depict is real
 * content rendered elsewhere on the page; a screen reader should read that,
 * not a progress bar. Content sections need `relative z-10` to sit above.
 */

export interface RouteStation {
  id: string;
  label: string;
  /** Position along the route, 0 (top) to 1 (bottom). Clamped. */
  progress: number;
  /** Rail the node is pinned to. Defaults to the primary. */
  line?: LineRef;
}

export interface LineRouteProps {
  stations: RouteStation[];
  /** Print station labels beside the nodes on large screens. */
  showLabels?: boolean;
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/** The lead rail: tight enough to feel connected to the wheel. */
const PRIMARY_SPRING = { stiffness: 140, damping: 30, restDelta: 0.0005 };
/** The second rail runs softer, so the pair separates slightly in motion. */
const SECONDARY_SPRING = { stiffness: 70, damping: 26, restDelta: 0.0005 };

export default function LineRoute({ stations, showLabels = false }: LineRouteProps) {
  // `?? false` because useReducedMotion resolves to null before hydration.
  const prefersReducedMotion = useReducedMotion() ?? false;

  // One scroll subscription for the whole route, no matter how many stations.
  const { scrollYProgress } = useScroll();
  const primaryTrace = useSpring(scrollYProgress, PRIMARY_SPRING);
  const secondaryTrace = useSpring(scrollYProgress, SECONDARY_SPRING);

  const ordered = useMemo(
    () =>
      stations
        .map((station) => ({ ...station, progress: clamp01(station.progress) }))
        .sort((a, b) => a.progress - b.progress),
    [stations],
  );

  const resolveActive = useCallback(
    (value: number) => {
      // The active station is the last one the scroll position has reached.
      let next = -1;
      for (let i = 0; i < ordered.length; i += 1) {
        if (ordered[i].progress <= value + 0.001) next = i;
      }
      return next;
    },
    [ordered],
  );

  /**
   * Scroll is an external store, so it is read as one.
   *
   * The snapshot is the resolved station *index*, not the raw progress: the
   * subscriber fires on every frame of a scroll, but React only re-renders
   * when that integer actually changes — so passing a station costs one
   * render, and scrolling between stations costs none. The rails themselves
   * never re-render; they are driven by motion values straight to the
   * compositor. The server snapshot matches a page at rest at the top, which
   * is also what hydration renders, so the two agree.
   */
  const subscribe = useCallback(
    (onChange: () => void) => scrollYProgress.on("change", onChange),
    [scrollYProgress],
  );

  const activeIndex = useSyncExternalStore(
    subscribe,
    () => resolveActive(scrollYProgress.get()),
    () => resolveActive(0),
  );

  const stationState = (index: number): StationState => {
    if (index === activeIndex) return "active";
    return index < activeIndex ? "passed" : "upcoming";
  };

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-y-0 left-6 z-0 sm:left-8 lg:left-1/2 lg:-translate-x-1/2"
    >
      <div className="relative h-full w-2">
        {/* Unfilled route. The whole line is visible from the top, the way a
            printed diagram shows the full journey before you travel it. */}
        <div className="absolute inset-y-0 left-0 w-px bg-line-primary opacity-25" />
        <div className="absolute inset-y-0 right-0 w-px bg-line-secondary opacity-25" />

        {/* Filled trace. Under reduced motion these are plain full-height
            divs — a clean static trace, with no scroll-linked transform. */}
        {prefersReducedMotion ? (
          <>
            <div className="absolute inset-y-0 left-0 w-px bg-line-primary" />
            <div className="absolute inset-y-0 right-0 w-px bg-line-secondary" />
          </>
        ) : (
          <>
            <motion.div
              className="absolute inset-y-0 left-0 w-px origin-top bg-line-primary"
              style={{ scaleY: primaryTrace }}
            />
            <motion.div
              className="absolute inset-y-0 right-0 w-px origin-top bg-line-secondary"
              style={{ scaleY: secondaryTrace }}
            />
          </>
        )}

        {ordered.map((station, index) => (
          <LineStation
            key={station.id}
            label={station.label}
            progress={station.progress}
            state={stationState(index)}
            line={station.line ?? "primary"}
            showLabel={showLabels}
            staticTrace={prefersReducedMotion}
          />
        ))}
      </div>
    </div>
  );
}
