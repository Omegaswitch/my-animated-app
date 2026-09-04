import type {
  DesignerCredit,
  GbStage,
  ProjectCopy,
  StageState,
  Station,
  Terminus,
} from "@/types/project";
import { GB_STAGE_ORDER } from "@/data/project";
import AssetFrame from "@/components/ui/AssetFrame";
import StationHeader from "./StationHeader";

/**
 * Station 6 — the terminus.
 *
 * Three things end here: the line, the group buy, and the document.
 *
 * The stage indicator is derived from a single key. `terminus.current` is the
 * only authored status; everything before it is complete and everything after
 * is pending. Storing a state per stage as well would let the two disagree —
 * a stage marked done sitting after the current one.
 */

export interface TerminusSectionProps {
  terminus: Terminus;
  station: Station;
  designers: DesignerCredit[];
  copy: ProjectCopy;
}

function resolveStageState(stage: GbStage, current: GbStage): StageState {
  const at = GB_STAGE_ORDER.indexOf(stage);
  const now = GB_STAGE_ORDER.indexOf(current);
  if (at < now) return "complete";
  if (at === now) return "active";
  return "pending";
}

export default function TerminusSection({
  terminus,
  station,
  designers,
  copy,
}: TerminusSectionProps) {
  const stages = GB_STAGE_ORDER.map((stage) => ({
    id: stage,
    label: terminus.stageLabels[stage],
    state: resolveStageState(stage, terminus.current),
  }));

  return (
    <section className="relative flex min-h-screen flex-col justify-center py-24">
      <div className="pl-24 pr-6 sm:pl-28 lg:ml-[50%] lg:pl-10 lg:pr-8 xl:pl-14 xl:pr-12">
        <StationHeader
          station={station}
          meta={`${copy.labels.updated} ${terminus.updatedOn}`}
        />

        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-ink/60">
          {terminus.eyebrow}
        </p>

        <h3 className="mt-5 max-w-[18ch] text-[clamp(2rem,4.4vw,3.5rem)] font-bold leading-[0.96] tracking-[-0.03em]">
          {terminus.headline}
        </h3>

        <p className="mt-5 max-w-[48ch] text-sm leading-relaxed text-ink/80">
          {terminus.message}
        </p>

        {/* Group buy stage — the run's position on its own little line. */}
        <ol className="mt-10 flex flex-col gap-0 border-t-2 border-ink/25 pt-5 sm:flex-row sm:gap-0">
          {stages.map((stage, index) => {
            const reached = stage.state !== "pending";
            const isLast = index === stages.length - 1;

            return (
              <li
                key={stage.id}
                className="relative flex gap-3 sm:flex-1 sm:flex-col sm:gap-2"
              >
                <div className="relative flex w-3 shrink-0 justify-center sm:h-3 sm:w-full sm:justify-start">
                  {!isLast ? (
                    <span
                      aria-hidden
                      className={`absolute left-1/2 top-3 h-full w-0.5 -translate-x-1/2 sm:left-0 sm:top-1/2 sm:h-0.5 sm:w-full sm:-translate-y-1/2 sm:translate-x-0 ${
                        stage.state === "complete"
                          ? "bg-line-primary"
                          : "bg-ink/20"
                      }`}
                    />
                  ) : null}
                  <span
                    aria-hidden
                    className={`relative z-10 block h-3 w-3 rounded-full border-[3px] ${
                      reached
                        ? "border-line-primary bg-white"
                        : "border-ink/30 bg-ground"
                    }`}
                  />
                </div>

                <div className="pb-4 sm:pb-0 sm:pr-4">
                  <p
                    className={`text-[11px] font-bold uppercase tracking-[0.1em] ${
                      stage.state === "active"
                        ? "text-ink"
                        : reached
                          ? "text-ink/70"
                          : "text-ink/40"
                    }`}
                  >
                    {stage.label}
                  </p>
                  {/* The state in words — what assistive tech reads. */}
                  <p className="sr-only">{stage.state}</p>
                </div>
              </li>
            );
          })}
        </ol>

        {/* Understated: a line of small caps and two marks, nothing more. */}
        {designers.length > 0 ? (
          <div className="mt-12 border-t border-ink/20 pt-5">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.22em] text-ink/45">
              {copy.labels.designedBy}
            </h4>
            <ul className="mt-3 flex flex-wrap items-center gap-x-8 gap-y-4">
              {designers.map((designer) => (
                <li key={designer.id} className="w-28 sm:w-32">
                  <AssetFrame
                    asset={designer.asset}
                    tag={designer.name}
                    placeholderLabel={copy.labels.assetPlaceholder}
                    sizes="128px"
                  />
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}
