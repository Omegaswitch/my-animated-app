import { LIFECYCLE_ORDER } from "@/data/project";
import type {
  Lifecycle,
  LifecyclePhase,
  LifecycleStage,
  StageState,
} from "@/types/project";

/**
 * Lifecycle derivation.
 *
 * `Lifecycle.current` is the only authored status. Everything the diagram
 * shows — ticks, the active dot, pending rings, the progress fraction — is
 * computed from it against `LIFECYCLE_ORDER`. Move `current` one phase along
 * and every view updates together, because there is nothing else to update.
 */

/** Glyphs for the mini route. */
export const STATE_GLYPH: Record<StageState, string> = {
  complete: "✓",
  active: "●",
  pending: "○",
};

export function phaseIndex(phase: LifecyclePhase): number {
  return LIFECYCLE_ORDER.indexOf(phase);
}

export function resolveStageState(
  phase: LifecyclePhase,
  current: LifecyclePhase,
): StageState {
  const at = phaseIndex(phase);
  const now = phaseIndex(current);
  if (at < now) return "complete";
  if (at === now) return "active";
  return "pending";
}

export interface ResolvedStage extends LifecycleStage {
  state: StageState;
  glyph: string;
}

export function resolveStages(lifecycle: Lifecycle): ResolvedStage[] {
  return lifecycle.stages.map((stage) => {
    const state = resolveStageState(stage.id, lifecycle.current);
    return { ...stage, state, glyph: STATE_GLYPH[state] };
  });
}

/**
 * How far along the programme is, 0–1. The active phase counts as reached but
 * not finished, so a run sitting on the first phase does not read as 0%.
 */
export function lifecycleProgress(lifecycle: Lifecycle): number {
  const total = LIFECYCLE_ORDER.length - 1;
  if (total <= 0) return 1;
  return phaseIndex(lifecycle.current) / total;
}
