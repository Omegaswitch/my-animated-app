"use client";

import { motion, type MotionValue } from "framer-motion";
import type { LineRef } from "@/types/project";
import {
  ROUTE_CENTRE_X,
  ROUTE_POSITION_CLASS,
  ROUTE_TRACK_CLASS,
  ROUTE_TRACK_WIDTH,
  STATION_FILL,
  STATION_RADIUS,
  STATION_STROKE_WIDTH,
} from "@/lib/route-geometry";

/**
 * The stop — a white disc over the twin track.
 *
 * Exactly one of these is on screen at a time. It belongs to the station
 * whose stage owns it, appears as that station arrives, and goes with it;
 * there is no column of upcoming stops rendered ahead of you.
 *
 * The disc is centred on the pair rather than on one track, so it reads as a
 * stop on the route rather than a marker on one of its two lines. The ring
 * takes the colour of the track the station is assigned to.
 *
 * Every stop is a single disc, the terminus included.
 */

export interface StationDiscProps {
  /** Drives fade and scale; mirrors the station content. */
  opacity: MotionValue<number> | number;
  scale: MotionValue<number> | number;
  line: LineRef;
}

const RING: Record<LineRef, string> = {
  primary: "var(--color-line-primary)",
  secondary: "var(--color-line-secondary)",
};

export default function StationDisc({
  opacity,
  scale,
  line,
}: StationDiscProps) {
  // Room for the disc plus its stroke, so nothing is cropped.
  const height = STATION_RADIUS * 2 + STATION_STROKE_WIDTH;
  const centreY = STATION_RADIUS + STATION_STROKE_WIDTH / 2;

  return (
    <motion.div
      aria-hidden
      style={{ opacity, scale }}
      className={`pointer-events-none absolute top-1/2 -translate-y-1/2 ${ROUTE_TRACK_CLASS} ${ROUTE_POSITION_CLASS}`}
    >
      <svg
        width={ROUTE_TRACK_WIDTH}
        height={height}
        style={{ overflow: "visible" }}
      >
        <circle
          cx={ROUTE_CENTRE_X}
          cy={centreY}
          r={STATION_RADIUS}
          fill={STATION_FILL}
          stroke={RING[line]}
          strokeWidth={STATION_STROKE_WIDTH}
        />
      </svg>
    </motion.div>
  );
}
