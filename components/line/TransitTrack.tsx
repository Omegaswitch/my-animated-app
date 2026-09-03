"use client";

import { motion, type MotionValue, useTransform } from "framer-motion";
import type { LineRef } from "@/types/project";
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
 * The track between two stations.
 *
 * This exists only in transit. There is no permanent line down the page and
 * no preview of stops further along: a track belongs to one station's scroll
 * container, arrives from the top, terminates in that station's node, and
 * later departs out of the bottom toward the next one. While you are AT a
 * station its whole layer is at opacity 0 and the content has the screen.
 *
 * The arrival and departure segments are drawn with `pathLength`, which
 * framer normalises to 0–1, so each segment is a single solid stroke growing
 * from one end — never a repeating dash.
 *
 * Both segments meet at the node, which sits at the vertical centre of the
 * viewport: the previous station's departure leaves the bottom of the screen
 * exactly where this one's arrival enters the top, so the line reads as
 * continuous across the handover.
 */

export interface TransitTrackProps {
  /** Scroll progress of the owning station's track, 0–1. */
  progress: MotionValue<number>;
  /** Track the station's node is stroked in. */
  line: LineRef;
  /** The first station has nothing to arrive from. */
  isFirst?: boolean;
  /** The last station terminates rather than leading onward. */
  isLast?: boolean;
  /** Disables the scroll-linked draw; the track renders whole and still. */
  staticTrace?: boolean;
}

const TRACK_COLOUR: Record<LineRef, string> = {
  primary: "var(--color-line-primary)",
  secondary: "var(--color-line-secondary)",
};

const TRACKS = [
  { x: ROUTE_PRIMARY_X, colour: "var(--color-line-primary)" },
  { x: ROUTE_SECONDARY_X, colour: "var(--color-line-secondary)" },
];

export default function TransitTrack({
  progress,
  line,
  isFirst = false,
  isLast = false,
  staticTrace = false,
}: TransitTrackProps) {
  /* Arrival draws over the first fifth, departure over the last. Between
     them the layer is invisible, so nothing is drawn while you are reading. */
  const arrival = useTransform(progress, [0, 0.2], [0, 1], { clamp: true });
  const departure = useTransform(progress, [0.8, 1], [0, 1], { clamp: true });

  /* The node illuminates as the arriving line lands in it. */
  const nodeRadius = useTransform(progress, [0.1, 0.2], [0, STATION_RADIUS], {
    clamp: true,
  });

  const arrivalLength = staticTrace || isFirst ? 1 : arrival;
  const departureLength = staticTrace ? 1 : departure;
  const radius = staticTrace || isFirst ? STATION_RADIUS : nodeRadius;

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-y-0 ${ROUTE_TRACK_CLASS} ${ROUTE_POSITION_CLASS}`}
    >
      <svg
        width={ROUTE_TRACK_WIDTH}
        height="100%"
        className="h-full"
        style={{ overflow: "visible" }}
      >
        {/* Arrival: top of the viewport down into the node. */}
        {!isFirst
          ? TRACKS.map((track) => (
              <motion.line
                key={`in-${track.x}`}
                x1={track.x}
                y1={0}
                x2={track.x}
                y2="50%"
                stroke={track.colour}
                strokeWidth={ROUTE_STROKE_WIDTH}
                style={{ pathLength: arrivalLength }}
              />
            ))
          : null}

        {/* Departure: out of the node toward the next stop. The last station
            has no onward track — it is capped instead. */}
        {!isLast
          ? TRACKS.map((track) => (
              <motion.line
                key={`out-${track.x}`}
                x1={track.x}
                y1="50%"
                x2={track.x}
                y2="100%"
                stroke={track.colour}
                strokeWidth={ROUTE_STROKE_WIDTH}
                style={{ pathLength: departureLength }}
              />
            ))
          : null}

        {/* End of line: the Prague convention caps every track a terminating
            route carries, closed with a cross-tie. */}
        {isLast ? (
          <line
            x1={ROUTE_PRIMARY_X}
            y1="calc(50% + 22px)"
            x2={ROUTE_SECONDARY_X}
            y2="calc(50% + 22px)"
            stroke="var(--color-ink)"
            strokeWidth={3}
          />
        ) : null}

        {/* The station node: a white disc on each track, stroked in its own
            colour. The station's own line is drawn last so it sits on top. */}
        {TRACKS.map((track) => (
          <motion.circle
            key={`node-${track.x}`}
            cx={track.x}
            cy="50%"
            fill={STATION_FILL}
            stroke={track.colour}
            strokeWidth={STATION_STROKE_WIDTH}
            style={{ r: radius }}
          />
        ))}

        {/* A slightly heavier ring marks which track this stop belongs to. */}
        <motion.circle
          cx={line === "primary" ? ROUTE_PRIMARY_X : ROUTE_SECONDARY_X}
          cy="50%"
          fill="none"
          stroke={TRACK_COLOUR[line]}
          strokeWidth={STATION_STROKE_WIDTH}
          style={{ r: radius }}
        />
      </svg>
    </div>
  );
}
