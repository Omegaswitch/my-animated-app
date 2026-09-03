"use client";

import { motion } from "framer-motion";
import type { LineRef } from "@/types/project";

/**
 * A single node on the route — the tick where a section meets the line.
 *
 * Purely presentational: it is told where it sits and what state it is in,
 * and never reads scroll itself. `LineRoute` owns the scroll subscription so
 * that a page with twelve stations still has exactly one listener.
 */

export type StationState = "passed" | "active" | "upcoming";

export interface LineStationProps {
  label: string;
  /** Position along the route, 0 (top) to 1 (bottom). */
  progress: number;
  state: StationState;
  /** Which rail the node is pinned to. */
  line: LineRef;
  /** Render the label beside the node. Desktop only; off by default. */
  showLabel?: boolean;
  /** Suppresses transitions; set by `LineRoute` from `useReducedMotion`. */
  staticTrace?: boolean;
}

/**
 * Tailwind scans for complete class strings, so these are written out in full
 * rather than interpolated (`bg-line-${line}` would never be generated).
 * The tokens resolve to #CD7925 and #BE8D4D — see `app/globals.css`.
 */
const NODE_FILL: Record<LineRef, string> = {
  primary: "bg-line-primary",
  secondary: "bg-line-secondary",
};

const NODE_BORDER: Record<LineRef, string> = {
  primary: "border-line-primary",
  secondary: "border-line-secondary",
};

export default function LineStation({
  label,
  progress,
  state,
  line,
  showLabel = false,
  staticTrace = false,
}: LineStationProps) {
  const isUpcoming = state === "upcoming";
  const isActive = state === "active";

  return (
    <div
      className="absolute left-1/2 -translate-x-1/2"
      style={{ top: `${progress * 100}%` }}
      data-station={label}
      data-state={state}
    >
      <motion.span
        className={[
          "block h-2 w-2 -translate-y-1/2 border",
          NODE_BORDER[line],
          // An upcoming station is drawn but not filled — the diagram shows
          // the whole route from the start, the way a printed map would.
          isUpcoming ? "bg-transparent" : NODE_FILL[line],
        ].join(" ")}
        initial={false}
        animate={{
          scale: isActive ? 1.75 : 1,
          opacity: isUpcoming ? 0.45 : 1,
        }}
        transition={
          staticTrace
            ? { duration: 0 }
            : { type: "spring", stiffness: 320, damping: 26 }
        }
      />

      {showLabel ? (
        // Labels hang to the *left* of the rail. On desktop the content column
        // sits to the right of the centre line, so a right-hand label would
        // run straight into the type; the left half is the empty one.
        <motion.span
          className="pointer-events-none absolute right-5 top-0 hidden -translate-y-1/2 whitespace-nowrap text-right text-[10px] uppercase tracking-[0.18em] text-ink lg:block"
          initial={false}
          animate={{ opacity: isUpcoming ? 0.4 : 1 }}
          transition={staticTrace ? { duration: 0 } : { duration: 0.24 }}
        >
          {label}
        </motion.span>
      ) : null}
    </div>
  );
}
