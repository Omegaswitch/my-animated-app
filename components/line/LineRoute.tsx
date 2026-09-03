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
  STATION_FILL,
  STATION_RADIUS,
  STATION_STROKE_WIDTH,
} from "@/lib/route-geometry";

/**
 * The route — two bold parallel tracks that draw as the document scrolls.
 *
 * Crisp by construction. The `<svg>` carries no viewBox, so user units are
 * CSS pixels and `strokeWidth={10}` is exactly 10 device-independent pixels
 * at every viewport, with no scaling to soften the edge. Nothing is dashed,
 * blurred, or given a filter; the only stroke geometry in play is the
 * `pathLength` reveal, which framer normalises to 0–1.
 *
 * Native scrolling only: this reads scroll position and never drives it.
 *
 *   mobile  — pinned to the left margin, content takes the remaining width
 *   desktop — centred, content offsets around it
 *
 * All positioning comes from `lib/route-geometry`, which the intro's origin
 * marker and the terminus import too.
 *
 * The rails are decorative (`aria-hidden`). The stations they depict are real
 * content in the sections themselves.
 */

export interface RouteStation {
  id: string;
  label: string;
  /** Position along the route, 0 (top) to 1 (bottom). Clamped. */
  progress: number;
  /** Track the disc is stroked in. */
  line: LineRef;
}

export interface LineRouteProps {
  stations: RouteStation[];
  showLabels?: boolean;
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/** The lead track: tight enough to feel connected to the wheel. */
const PRIMARY_SPRING = { stiffness: 140, damping: 30, restDelta: 0.0005 };
/** The second track runs softer, so the pair separates slightly in motion. */
const SECONDARY_SPRING = { stiffness: 70, damping: 26, restDelta: 0.0005 };

/** Unfilled route beneath the draw, so the whole line reads from the top. */
const TRACK_OPACITY = 0.18;

export default function LineRoute({
  stations,
  showLabels = false,
}: LineRouteProps) {
  // `?? false` because useReducedMotion resolves to null before hydration.
  const prefersReducedMotion = useReducedMotion() ?? false;

  // One scroll subscription for the whole route, however many stations.
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
   * The snapshot is the resolved station *index*, not raw progress: the
   * subscriber fires every frame of a scroll, but React re-renders only when
   * that integer changes — so passing a station costs one render and scrolling
   * between stations costs none. The tracks never re-render at all; motion
   * values drive them straight to the compositor.
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

  const tracks = [
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

  const lastStation = ordered[ordered.length - 1];

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-y-0 z-0 ${ROUTE_TRACK_CLASS} ${ROUTE_POSITION_CLASS}`}
    >
      <svg
        width={ROUTE_TRACK_WIDTH}
        height="100%"
        // Station labels are drawn at negative x, outside the track box.
        style={{ overflow: "visible" }}
        className="h-full"
      >
        {/* Unfilled route. Remove these two for a bare progressive draw. */}
        {tracks.map((track) => (
          <line
            key={`bed-${track.x}`}
            x1={track.x}
            y1={0}
            x2={track.x}
            y2="100%"
            stroke={track.colour}
            strokeWidth={ROUTE_STROKE_WIDTH}
            opacity={TRACK_OPACITY}
          />
        ))}

        {/* Drawn route. Under reduced motion the tracks render solid and full
            length — a clean static trace with no scroll-linked geometry. */}
        {tracks.map((track) =>
          prefersReducedMotion ? (
            <line
              key={`track-${track.x}`}
              x1={track.x}
              y1={0}
              x2={track.x}
              y2="100%"
              stroke={track.colour}
              strokeWidth={ROUTE_STROKE_WIDTH}
            />
          ) : (
            <motion.line
              key={`track-${track.x}`}
              x1={track.x}
              y1={0}
              x2={track.x}
              y2="100%"
              stroke={track.colour}
              strokeWidth={ROUTE_STROKE_WIDTH}
              style={{ pathLength: track.trace }}
            />
          ),
        )}

        {ordered.map((station, index) => (
          <LineStation
            key={station.id}
            label={station.label}
            progress={station.progress}
            state={stationState(index)}
            line={station.line}
            showLabel={showLabels}
            staticTrace={prefersReducedMotion}
          />
        ))}

        {/* End of line. The Prague map terminates a route with a marker on
            every track it carries, so both tracks get a disc regardless of
            which one the final station is stroked in. */}
        {lastStation
          ? tracks.map((track) => (
              <circle
                key={`terminal-${track.x}`}
                cx={track.x}
                cy={`${lastStation.progress * 100}%`}
                r={STATION_RADIUS}
                fill={STATION_FILL}
                stroke={track.colour}
                strokeWidth={STATION_STROKE_WIDTH}
              />
            ))
          : null}
      </svg>
    </div>
  );
}
