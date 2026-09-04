"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
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
 * The train — one disc riding the spine.
 *
 * Fixed to the viewport, so it is always on the tracks. Its vertical position
 * is the document's scroll progress: at the top of the page it sits at the top
 * of the screen, at the bottom it has reached the bottom. Nothing pins, nothing
 * jacks the scroll — the page scrolls natively and the disc simply reports
 * where you are.
 *
 * The spring is what makes it read as a train rather than a scrollbar: it
 * carries a little momentum into and out of a flick instead of tracking the
 * wheel tick for tick.
 */

const RIDE_SPRING = { stiffness: 90, damping: 26, mass: 0.2, restDelta: 0.001 };

/** Keeps the disc off the very edges of the viewport. */
const INSET = 6;

export default function RidingDisc() {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll();

  const springed = useSpring(scrollYProgress, RIDE_SPRING);
  const progress = prefersReducedMotion ? scrollYProgress : springed;

  const top = useTransform(progress, [0, 1], [`${INSET}%`, `${100 - INSET}%`]);

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-y-0 z-30 ${ROUTE_TRACK_CLASS} ${ROUTE_POSITION_CLASS}`}
    >
      <motion.div
        style={{ top }}
        className="absolute -translate-y-1/2 will-change-transform"
        data-riding-disc
      >
        <svg
          width={ROUTE_TRACK_WIDTH}
          height={STATION_RADIUS * 2 + STATION_STROKE_WIDTH}
          style={{ overflow: "visible" }}
        >
          {/* The disc belongs to both tracks, so its ring runs from one line
              colour to the other rather than picking a side. */}
          <defs>
            <linearGradient id="disc-ring" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--color-line-primary)" />
              <stop offset="100%" stopColor="var(--color-line-secondary)" />
            </linearGradient>
          </defs>
          <circle
            cx={ROUTE_CENTRE_X}
            cy={STATION_RADIUS + STATION_STROKE_WIDTH / 2}
            r={STATION_RADIUS}
            fill={STATION_FILL}
            stroke="url(#disc-ring)"
            strokeWidth={STATION_STROKE_WIDTH}
          />
        </svg>
      </motion.div>
    </div>
  );
}
