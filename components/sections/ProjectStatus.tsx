import type { Lifecycle, ProjectCopy } from "@/types/project";
import { resolveStages } from "@/lib/lifecycle";

/**
 * Project status — the programme as a miniature of the route.
 *
 * Every glyph here is derived from `lifecycle.current` alone. Nothing in the
 * data says "this phase is done"; the ordering does. Move `current` one phase
 * and the ticks, the dot and the rings all follow together.
 *
 *   ✓  complete   the run has passed this phase
 *   ●  active     where the run is now
 *   ○  pending    not yet reached
 *
 * The glyphs are decorative duplicates of a written state, so they are hidden
 * from assistive technology and each stop carries its state in text instead.
 * A screen reader hears "Tooling, complete", not "Tooling, check mark".
 */

export interface ProjectStatusProps {
  lifecycle: Lifecycle;
  copy: ProjectCopy;
}

export default function ProjectStatus({ lifecycle, copy }: ProjectStatusProps) {
  const labels = copy.statusLabels;
  const stages = resolveStages(lifecycle);
  const active = stages.find((stage) => stage.state === "active");

  return (
    <section className="relative z-10 py-32 pl-16 pr-6 sm:pl-20 lg:ml-[50%] lg:pl-16 lg:pr-16">
      <header className="mb-12 flex items-baseline justify-between gap-6 border-b border-ink/20 pb-3">
        <h2 className="text-[10px] uppercase tracking-[0.34em]">
          {lifecycle.heading}
        </h2>
        <span className="text-[10px] uppercase tracking-[0.2em] text-ink/60">
          {labels.updated} {lifecycle.updatedOn}
        </span>
      </header>

      {active ? (
        <p className="mb-12 max-w-[46ch] text-sm leading-relaxed text-ink/80">
          <span className="text-ink">
            {labels.now}: {active.label}.
          </span>{" "}
          {active.description}
        </p>
      ) : null}

      <ol className="relative flex flex-col gap-0 lg:flex-row lg:gap-0">
        {stages.map((stage, index) => {
          const isLast = index === stages.length - 1;
          const reached = stage.state !== "pending";

          return (
            <li
              key={stage.id}
              className="relative flex gap-4 lg:flex-1 lg:flex-col lg:gap-3"
            >
              {/* Rail: vertical on mobile, horizontal from lg. */}
              <div className="relative flex w-4 shrink-0 justify-center lg:h-4 lg:w-full lg:justify-start">
                {!isLast ? (
                  <span
                    aria-hidden
                    className={`absolute left-1/2 top-3 h-full w-px -translate-x-1/2 lg:left-0 lg:top-1/2 lg:h-px lg:w-full lg:-translate-y-1/2 lg:translate-x-0 ${
                      stage.state === "complete"
                        ? "bg-line-primary"
                        : "bg-ink/25"
                    }`}
                  />
                ) : null}

                <span
                  aria-hidden
                  className={`relative z-10 flex h-4 w-4 items-center justify-center text-[10px] leading-none ${
                    reached ? "text-line-primary" : "text-ink/40"
                  }`}
                >
                  {stage.glyph}
                </span>
              </div>

              <div className="pb-8 lg:pb-0 lg:pr-6">
                <p
                  className={`text-[10px] uppercase tracking-[0.2em] tabular-nums ${
                    reached ? "text-ink/60" : "text-ink/35"
                  }`}
                >
                  {String(stage.index).padStart(2, "0")}
                </p>
                <p
                  className={`mt-1 text-sm tracking-tight ${
                    stage.state === "active"
                      ? "text-ink"
                      : reached
                        ? "text-ink/80"
                        : "text-ink/45"
                  }`}
                >
                  {stage.label}
                </p>
                {/* The state in words — this is what assistive tech reads. */}
                <p className="mt-1 text-[9px] uppercase tracking-[0.18em] text-ink/45">
                  <span className="sr-only">{labels.status}: </span>
                  {stage.state}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
