"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import type { LineRef } from "@/types/project";
import LineStation, { type StationState } from "./LineStation";
import {
  ROUTE_POSITION_CLASS,
  ROUTE_PRIMARY_X,
  ROUTE_SECONDARY_X,
  ROUTE_STROKE_WIDTH,
  ROUTE_TRACK_CLASS,
  ROUTE_TRACK_WIDTH,
} from "@/lib/route-geometry";

/**
 * The route — two solid parallel rails that draw as the document scrolls.
 *
 * Drawn as SVG rather than scaled boxes. The progressive reveal is
 * `pathLength`, which framer-motion normalises to 0–1 and applies as
 * stroke-dash geometry, so the stroke is *drawn* from the top down at a
 * constant 8px width. Scaling a box on scaleY would have stretched the shape
 * instead, and could not carry a round cap or share a coordinate system with
 * the station markers.
 *
 * The `<svg>` has no viewBox on purpose: user units are then CSS pixels, so
 * `strokeWidth={8}` is 8px at every viewport and no aspect correction is
 * needed for a full-height element of fixed width.
 *
 * Native scrolling only: this reads scroll position and never drives it.
 * Nothing snaps, pins or hijacks the wheel.
 *
 * Layout follows the brief:
 *   mobile  — pinned to the left margin, content takes the remaining width
 *   desktop — centred, content offsets around it editorially
 *
 * All positioning comes from `lib/route-geometry`, which the hero's origin
 * marker and the thank-you terminus import too.
 *
 * The rails are decorative (`aria-hidden`). The lifecycle they depict is real
 * content rendered by `ProjectStatus`; a screen reader should read that, not a
 * progress bar. Content sections need `relative z-10` to sit above.
 */

export interface RouteStation {
  id: string;
  label: string;
  /** Position along the route, 0 (top) to 1 (bottom). Clamped. */
  progress: number;
  /** Retained for callers; markers carry both colours, so it is not read. */
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

/** Unfilled route beneath the draw, so the whole line reads from the top. */
const TRACK_OPACITY = 0.16;

export default function LineRoute({
  stations,
  showLabels = false,
}: LineRouteProps) {
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

  const rails = [
    {
      x: ROUTE_PRIMARY_X,
      colour: "var(--color-line-primary)",
      trace: primaryTrace,
    },
    {
      x: ROUTE_SECONDARY_X,
      colour: "var(--color-line-secondary)",
      trace: secondaryTrace,
    },
  ];

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-y-0 z-0 ${ROUTE_TRACK_CLASS} ${ROUTE_POSITION_CLASS}`}
    >
      <svg
        width={ROUTE_TRACK_WIDTH}
        height="100%"
        // Labels are drawn at negative x, outside the track box.
        style={{ overflow: "visible" }}
        className="h-full"
      >
        {/* Unfilled route. Delete these two lines for a bare progressive draw. */}
        {rails.map((rail) => (
          <line
            key={`track-${rail.x}`}
            x1={rail.x}
            y1={0}
            x2={rail.x}
            y2="100%"
            stroke={rail.colour}
            strokeWidth={ROUTE_STROKE_WIDTH}
            opacity={TRACK_OPACITY}
          />
        ))}

        {/* Drawn route. Under reduced motion the rails are rendered solid and
            full length — a clean static trace with no scroll-linked geometry. */}
        {rails.map((rail) =>
          prefersReducedMotion ? (
            <line
              key={`trace-${rail.x}`}
              x1={rail.x}
              y1={0}
              x2={rail.x}
              y2="100%"
              stroke={rail.colour}
              strokeWidth={ROUTE_STROKE_WIDTH}
            />
          ) : (
            <motion.line
              key={`trace-${rail.x}`}
              x1={rail.x}
              y1={0}
              x2={rail.x}
              y2="100%"
              stroke={rail.colour}
              strokeWidth={ROUTE_STROKE_WIDTH}
              style={{ pathLength: rail.trace }}
            />
          ),
        )}

        {ordered.map((station, index) => (
          <LineStation
            key={station.id}
            label={station.label}
            progress={station.progress}
            state={stationState(index)}
            showLabel={showLabels}
            staticTrace={prefersReducedMotion}
          />
        ))}
      </svg>
    </div>
  );
}
