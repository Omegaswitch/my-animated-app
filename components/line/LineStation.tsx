"use client";

import { motion } from "framer-motion";
import type { LineRef } from "@/types/project";
import {
  ROUTE_PRIMARY_X,
  ROUTE_SECONDARY_X,
  STATION_FILL,
  STATION_RADIUS,
  STATION_RADIUS_ACTIVE,
  STATION_STROKE_WIDTH,
} from "@/lib/route-geometry";

/**
 * A Prague Metro station stop.
 *
 * A solid white disc with a bold coloured ring, sitting directly on its track
 * — the marker the Prague map uses for a stop, as opposed to the plain tick
 * of a minor halt. Drawn as SVG *inside* `LineRoute`'s single `<svg>`, so it
 * shares the coordinate system of the lines rather than trying to match it
 * from the outside. That is what keeps the disc exactly on the stroke.
 *
 * Presentational only: it is told where it sits and what state it is in, and
 * never reads scroll. `LineRoute` owns the one subscription.
 */

export type StationState = "passed" | "active" | "upcoming";

export interface LineStationProps {
  label: string;
  /** Position along the route, 0 (top) to 1 (bottom). */
  progress: number;
  state: StationState;
  /** Which track the disc is stroked in. */
  line: LineRef;
  showLabel?: boolean;
  /** Suppresses transitions; set by `LineRoute` from `useReducedMotion`. */
  staticTrace?: boolean;
}

const TRACK_X: Record<LineRef, number> = {
  primary: ROUTE_PRIMARY_X,
  secondary: ROUTE_SECONDARY_X,
};

const TRACK_COLOUR: Record<LineRef, string> = {
  primary: "var(--color-line-primary)",
  secondary: "var(--color-line-secondary)",
};

export default function LineStation({
  label,
  progress,
  state,
  line,
  showLabel = false,
  staticTrace = false,
}: LineStationProps) {
  const isActive = state === "active";
  const y = `${progress * 100}%`;
  const cx = TRACK_X[line];

  const transition = staticTrace
    ? { duration: 0 }
    : ({ type: "spring", stiffness: 320, damping: 26 } as const);

  return (
    <g data-station={label} data-state={state}>
      <motion.circle
        cx={cx}
        cy={y}
        fill={STATION_FILL}
        stroke={TRACK_COLOUR[line]}
        strokeWidth={STATION_STROKE_WIDTH}
        initial={false}
        animate={{ r: isActive ? STATION_RADIUS_ACTIVE : STATION_RADIUS }}
        transition={transition}
      />

      {showLabel ? (
        // Labels hang left of the track. On desktop the content column sits to
        // the right of the centre line, so a right-hand label would run into
        // the type. Negative x puts them outside the track box, which the
        // parent svg permits via overflow: visible.
        <text
          x={ROUTE_PRIMARY_X - 20}
          y={y}
          textAnchor="end"
          dominantBaseline="middle"
          className="hidden fill-ink text-[13px] font-bold uppercase tracking-[0.08em] lg:block"
        >
          {label}
        </text>
      ) : null}
    </g>
  );
}
