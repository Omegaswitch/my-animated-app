"use client";

import { useTransform, type MotionValue } from "framer-motion";

/**
 * Timing for a station that presents its items one at a time.
 *
 * Shared by Kits and Colours so the two read as the same mechanism rather
 * than two implementations that happen to look alike. Give it the stage's
 * progress and an index, and it returns the opacity and vertical travel for
 * that slide.
 *
 * The slides divide the first 80% of the stage between them; the finale — the
 * grid or the palette strip — takes the rest. Each slide's exit window is
 * exactly its successor's entry window, so one pushes out as the next slides
 * in, with no dead frame between where the screen holds nothing.
 *
 * With four items that lands on 0-20-40-60-80, which is the sequence the kits
 * station was specified against. With five it divides the same span evenly.
 */

/** Slides own this much of the stage; the finale takes what is left. */
export const SEQUENCE_SPAN = 0.8;

/** Finale cross-fade, overlapping the last slide's exit. */
export const FINALE_IN = 0.78;
export const FINALE_SET = 0.88;

/** Vertical travel entering and leaving, in percent of the slide's height. */
const TRAVEL = 65;

/** Lead-in and lag-out as fractions of one slide's slot. */
const LEAD_RATIO = 0.3;
const LAG_RATIO = 0.1;

export interface SlideMotion {
  opacity: MotionValue<number>;
  y: MotionValue<number>;
}

export function useSequenceSlide(
  progress: MotionValue<number>,
  index: number,
  count: number,
): SlideMotion {
  const step = SEQUENCE_SPAN / count;
  const lead = step * LEAD_RATIO;
  const lag = step * LAG_RATIO;

  const enter = index * step;
  const leave = (index + 1) * step;
  const isFirst = index === 0;

  /* The first item is already on screen when the station arrives — it has
     nothing to slide in from, so its entry keyframes sit at zero. */
  const stops = isFirst
    ? [0, 0.001, leave - lead, leave + lag]
    : [enter - lead, enter + lag, leave - lead, leave + lag];

  const opacity = useTransform(
    progress,
    stops,
    isFirst ? [1, 1, 1, 0] : [0, 1, 1, 0],
    {
      clamp: true,
    },
  );
  const y = useTransform(
    progress,
    stops,
    isFirst ? [0, 0, 0, -TRAVEL] : [TRAVEL, 0, 0, -TRAVEL],
    { clamp: true },
  );

  return { opacity, y };
}
