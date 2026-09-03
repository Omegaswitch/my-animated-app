"use client";

import { motion } from "framer-motion";
import { ROUTE_CENTRE_X, ROUTE_PRIMARY_X } from "@/lib/route-geometry";

/**
 * A station on the route, drawn as a metro interchange marker.
 *
 * These are SVG nodes rendered *inside* `LineRoute`'s single `<svg>`, not
 * absolutely positioned HTML. That is what guarantees they sit on the strokes:
 * they share the same coordinate system as the lines rather than trying to
 * match it from the outside.
 *
 * The marker is a concentric pair carrying both line colours — an outer ring
 * in the primary and an inner disc in the secondary, over a ground-filled
 * core so the rails do not show through. That is the printed convention for
 * an interchange, as opposed to the plain tick used for a single-line stop.
 *
 * Purely presentational: it is told where it sits and what state it is in, and
 * never reads scroll itself. `LineRoute` owns the one scroll subscription.
 */

export type StationState = "passed" | "active" | "upcoming";

export interface LineStationProps {
  label: string;
  /** Position along the route, 0 (top) to 1 (bottom). */
  progress: number;
  state: StationState;
  /** Render the label beside the node. Desktop only; off by default. */
  showLabel?: boolean;
  /** Suppresses transitions; set by `LineRoute` from `useReducedMotion`. */
  staticTrace?: boolean;
}

/** Outer ring radius, active and at rest. */
const RING_R = 9;
const RING_R_ACTIVE = 11;
/** Inner disc radius. */
const CORE_R = 3.5;
const CORE_R_ACTIVE = 4.5;

export default function LineStation({
  label,
  progress,
  state,
  showLabel = false,
  staticTrace = false,
}: LineStationProps) {
  const isUpcoming = state === "upcoming";
  const isActive = state === "active";

  const y = `${progress * 100}%`;
  const transition = staticTrace
    ? { duration: 0 }
    : ({ type: "spring", stiffness: 320, damping: 26 } as const);

  return (
    <g data-station={label} data-state={state} opacity={isUpcoming ? 0.45 : 1}>
      {/* Ground-filled core: masks the rails so the ring reads as a stop on
          the line rather than a circle floating over it. */}
      <motion.circle
        cx={ROUTE_CENTRE_X}
        cy={y}
        fill="var(--color-ground)"
        initial={false}
        animate={{ r: isActive ? RING_R_ACTIVE : RING_R }}
        transition={transition}
      />

      {/* Outer ring — primary line colour. */}
      <motion.circle
        cx={ROUTE_CENTRE_X}
        cy={y}
        fill="none"
        stroke="var(--color-line-primary)"
        strokeWidth={3}
        initial={false}
        animate={{ r: isActive ? RING_R_ACTIVE : RING_R }}
        transition={transition}
      />

      {/* Inner disc — secondary line colour. */}
      <motion.circle
        cx={ROUTE_CENTRE_X}
        cy={y}
        fill="var(--color-line-secondary)"
        initial={false}
        animate={{ r: isActive ? CORE_R_ACTIVE : CORE_R }}
        transition={transition}
      />

      {showLabel ? (
        // Labels hang to the left of the track: on desktop the content column
        // sits right of the centre line, so a right-hand label would run into
        // the type. `x` is negative, i.e. outside the track box, which the
        // parent svg allows via overflow: visible.
        <text
          x={ROUTE_PRIMARY_X - 18}
          y={y}
          textAnchor="end"
          dominantBaseline="middle"
          className="hidden fill-ink text-[10px] uppercase tracking-[0.18em] lg:block"
        >
          {label}
        </text>
      ) : null}
    </g>
  );
}
