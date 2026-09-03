"use client";

import { createContext, useContext } from "react";
import type { MotionValue } from "framer-motion";

/**
 * A station's *sequence* progress, published to whatever it contains.
 *
 * `StationStage` measures its track across the whole pass — approach, hold,
 * departure — which is what makes consecutive stations cross-fade. A section
 * running its own internal choreography does not want that range: it wants
 * 0 at the moment the pane pins and 1 at the moment it unpins, so its own
 * percentages line up with the time it actually owns the screen.
 *
 * The stage does that remapping and hands the result down here, so a section
 * can run a multi-step sequence without owning a scroll container of its own
 * or knowing how tall its track is.
 *
 * Null outside a stage; sections must cope with that rather than assume.
 */
const StageProgressContext = createContext<MotionValue<number> | null>(null);

export const StageProgressProvider = StageProgressContext.Provider;

export function useStageProgress(): MotionValue<number> | null {
  return useContext(StageProgressContext);
}
