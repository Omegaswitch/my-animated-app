"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import type { LineRef } from "@/types/project";
import TransitTrack from "@/components/line/TransitTrack";

/**
 * One station's stage — the two-phase choreography.
 *
 * Each station owns a tall scroll track with a sticky, viewport-height pane.
 * `useScroll` on that track gives a 0–1 progress that is split in two:
 *
 *   0.0 – 0.2   IN TRANSIT (arriving)  the twin lines draw down from the top
 *                                      into the node, which illuminates; the
 *                                      content is still faded back
 *   0.2 – 0.8   AT STATION             content at opacity 1, scale 1, z-20;
 *                                      the whole track layer is at opacity 0,
 *                                      so no line cuts through the view
 *   0.8 – 1.0   IN TRANSIT (departing) content falls to 0.95 and fades out;
 *                                      the lines return at z-30 and draw on
 *                                      out of the bottom toward the next stop
 *
 * The two layers are exclusive by construction: their opacity curves are
 * mirror images, so content and track are never both solid, and no station
 * ever previews the ones after it. The pane is `overflow-hidden`, so nothing
 * — content or stray label — escapes into a neighbour.
 *
 * Native scrolling only. Nothing here drives the scroll position; the hold at
 * a station is CSS `position: sticky`, which the browser handles.
 */

export interface StationStageProps {
  children: ReactNode;
  /** Track the station's node is stroked in. */
  line: LineRef;
  isFirst?: boolean;
  isLast?: boolean;
  /** Track height. Longer holds the station for longer. */
  trackHeightClass?: string;
}

/** Content: faded back in transit, full and still at the station. */
const CONTENT_STOPS = [0, 0.2, 0.8, 1];
const CONTENT_OPACITY = [0, 1, 1, 0];
const CONTENT_SCALE = [0.95, 1, 1, 0.95];

/** Track: the exact inverse — present only between stations. */
const TRACK_OPACITY = [1, 0, 0, 1];

/**
 * The ends of the line are asymmetric, and have to be.
 *
 * The first station has nothing to arrive from, so it must already be at full
 * opacity at progress 0 — otherwise the very first paint, and the
 * server-rendered HTML, are a blank screen that only fills in once framer has
 * measured the scroll position. The last station has nowhere to depart to, so
 * it holds rather than fading out into an empty tail.
 */
const FIRST_OPACITY = [1, 1, 1, 0];
const FIRST_SCALE = [1, 1, 1, 0.95];
const FIRST_TRACK_OPACITY = [0, 0, 0, 1];

const LAST_OPACITY = [0, 1, 1, 1];
const LAST_SCALE = [0.95, 1, 1, 1];
const LAST_TRACK_OPACITY = [1, 0, 0, 0];

export default function StationStage({
  children,
  line,
  isFirst = false,
  isLast = false,
  trackHeightClass = "h-[200vh]",
}: StationStageProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion() ?? false;

  const { scrollYProgress } = useScroll({
    target: trackRef,
    // Measured across the whole pass, so the departure of one station and the
    // arrival of the next overlap rather than leaving a dead frame between.
    offset: ["start end", "end start"],
  });

  const opacityCurve = isFirst
    ? FIRST_OPACITY
    : isLast
      ? LAST_OPACITY
      : CONTENT_OPACITY;
  const scaleCurve = isFirst
    ? FIRST_SCALE
    : isLast
      ? LAST_SCALE
      : CONTENT_SCALE;
  const trackCurve = isFirst
    ? FIRST_TRACK_OPACITY
    : isLast
      ? LAST_TRACK_OPACITY
      : TRACK_OPACITY;

  const contentOpacity = useTransform(
    scrollYProgress,
    CONTENT_STOPS,
    opacityCurve,
  );
  const contentScale = useTransform(scrollYProgress, CONTENT_STOPS, scaleCurve);
  const trackOpacity = useTransform(scrollYProgress, CONTENT_STOPS, trackCurve);

  // Reduced motion: no scroll-linked geometry. Content simply present, and the
  // track drawn whole and still rather than animating between stops.
  const contentStyle = prefersReducedMotion
    ? undefined
    : { opacity: contentOpacity, scale: contentScale };
  const trackStyle = prefersReducedMotion
    ? { opacity: 0.35 }
    : { opacity: trackOpacity };

  return (
    <div ref={trackRef} className={`relative ${trackHeightClass}`}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Content layer — owns the screen at the station. */}
        <motion.div
          style={contentStyle}
          className="absolute inset-0 z-20 flex items-center will-change-transform"
        >
          {/* The section's own vertical padding is redundant once the pane
              centres it, and costs height a full-screen stage cannot spare. */}
          <div className="w-full [&>section]:py-0">{children}</div>
        </motion.div>

        {/* Track layer — owns the screen between stations. */}
        <motion.div style={trackStyle} className="absolute inset-0 z-30">
          <TransitTrack
            progress={scrollYProgress}
            line={line}
            isFirst={isFirst}
            isLast={isLast}
            staticTrace={prefersReducedMotion}
          />
        </motion.div>
      </div>
    </div>
  );
}
