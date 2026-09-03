"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import type { LineRef } from "@/types/project";
import StationDisc from "@/components/line/StationDisc";
import { StageProgressProvider } from "./StageProgress";

/**
 * One station's stage.
 *
 * The spine is permanent and lives outside this component — `RouteBackbone`
 * is fixed to the viewport and never fades. What belongs to a station is its
 * stop disc and its content, and both are scoped to this stage. That is what
 * keeps the page from becoming a timeline: there is no list of upcoming
 * stops rendered ahead of you, because a stop only exists inside the stage
 * that owns it.
 *
 * Each stage is a tall track with a sticky, viewport-height pane. `useScroll`
 * on the track gives a 0–1 progress:
 *
 *   0.0 – 0.2   arriving   disc and content fade up from 0.95 as the spine
 *                          carries you in
 *   0.2 – 0.8   at stop    disc and content at full opacity, scale 1
 *   0.8 – 1.0   departing  both recede to 0.95 and fade out, leaving the
 *                          spine to carry you to the next stage
 *
 * Disc and content share one pair of curves, so the stop and the thing it
 * marks always arrive and leave together. The pane is `overflow-hidden`, so
 * neither can spill into a neighbouring stage.
 *
 * Native scrolling only: the hold at a stop is CSS `position: sticky`.
 */

export interface StationStageProps {
  children: ReactNode;
  /** Track the stop's ring is drawn in. */
  line: LineRef;
  isFirst?: boolean;
  isLast?: boolean;
  /**
   * Track height in viewport heights. Longer holds the station for longer,
   * and gives a section room to run an internal sequence.
   */
  trackVh?: 100 | 200 | 500;
}

/**
 * Tailwind needs literal class strings, so heights are looked up.
 *
 * 100 means a track exactly one viewport tall: the pane still sticks, but it
 * unpins the moment it pins, so the station scrolls naturally with no held
 * span. That is what the intro wants — scrolling should move you along the
 * line immediately rather than spending a viewport going nowhere.
 */
const TRACK_CLASS: Record<100 | 200 | 500, string> = {
  100: "h-screen",
  200: "h-[200vh]",
  500: "h-[500vh]",
};

const STOPS = [0, 0.2, 0.8, 1];
const OPACITY = [0, 1, 1, 0];
const SCALE = [0.95, 1, 1, 0.95];

/**
 * The ends of the line are asymmetric, and have to be.
 *
 * The first station has nothing to arrive from, so it must already be at full
 * opacity at progress 0 — otherwise the first paint, and the server-rendered
 * HTML, are a blank screen that fills in only once framer has measured the
 * scroll. The last has nowhere to depart to, so it holds rather than fading
 * out into an empty tail.
 */
const FIRST_OPACITY = [1, 1, 1, 0];
const FIRST_SCALE = [1, 1, 1, 0.95];
const LAST_OPACITY = [0, 1, 1, 1];
const LAST_SCALE = [0.95, 1, 1, 1];

export default function StationStage({
  children,
  line,
  isFirst = false,
  isLast = false,
  trackVh = 200,
}: StationStageProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion() ?? false;

  const { scrollYProgress } = useScroll({
    target: trackRef,
    // Measured across the whole pass, so one station's departure and the
    // next one's arrival overlap rather than leaving a dead frame between.
    offset: ["start end", "end start"],
  });

  const opacityCurve = isFirst
    ? FIRST_OPACITY
    : isLast
      ? LAST_OPACITY
      : OPACITY;
  const scaleCurve = isFirst ? FIRST_SCALE : isLast ? LAST_SCALE : SCALE;

  const opacity = useTransform(scrollYProgress, STOPS, opacityCurve);
  const scale = useTransform(scrollYProgress, STOPS, scaleCurve);

  /**
   * Sequence progress: 0 the instant the pane pins, 1 the instant it unpins.
   *
   * The pane pins once the track's top reaches the top of the viewport — one
   * viewport of scrolling into a range of `trackVh + 100`. It unpins when the
   * track's bottom arrives at the bottom of the viewport, `trackVh` in. A
   * section reading this gets percentages that mean what they say, whatever
   * the track height.
   */
  const total = trackVh + 100;
  const pinStart = 100 / total;
  const pinEnd = trackVh / total;
  /* A one-viewport track has no held span, so the two bounds collapse onto
     each other. useTransform needs a strictly increasing input range, so fall
     back to the whole pass rather than handing it a zero-width one. */
  const hasHeldSpan = pinEnd > pinStart;
  const sequenceProgress = useTransform(
    scrollYProgress,
    hasHeldSpan ? [pinStart, pinEnd] : [0, 1],
    [0, 1],
    { clamp: true },
  );

  // Reduced motion: no scroll-linked geometry, content simply present.
  const contentStyle = prefersReducedMotion ? undefined : { opacity, scale };
  const discOpacity = prefersReducedMotion ? 1 : opacity;
  const discScale = prefersReducedMotion ? 1 : scale;

  return (
    <div ref={trackRef} className={`relative ${TRACK_CLASS[trackVh]}`}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Content — z-20, above the spine, below the stop. */}
        <motion.div
          style={contentStyle}
          className="absolute inset-0 z-20 flex items-center will-change-transform"
        >
          {/* The section's own vertical padding is redundant once the pane
              centres it, and costs height a full-screen stage cannot spare. */}
          <div className="w-full [&>section]:py-0">
            <StageProgressProvider value={sequenceProgress}>
              {children}
            </StageProgressProvider>
          </div>
        </motion.div>

        {/* The stop — z-30, sitting on the spine. */}
        <div className="absolute inset-0 z-30">
          <StationDisc opacity={discOpacity} scale={discScale} line={line} />
        </div>
      </div>
    </div>
  );
}
