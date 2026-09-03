import type { ProductSwatch, ProjectCopy, Station } from "@/types/project";
import StationHeader from "./StationHeader";
import { countLabel } from "@/lib/format";

/**
 * Station 3 — the colourway.
 *
 * A vertical scan rather than a grid: a chip, its reference, its hex, and one
 * line on where it sits in the set. Five rows read faster than five cards and
 * hold comfortably inside a single viewport.
 *
 * A server component — a table of facts with no interaction.
 */

export interface ColorsSectionProps {
  swatches: ProductSwatch[];
  station: Station;
  copy: ProjectCopy;
}

export default function ColorsSection({
  swatches,
  station,
  copy,
}: ColorsSectionProps) {
  if (swatches.length === 0) return null;

  return (
    <section className="relative py-24 pl-24 pr-6 sm:pl-28 lg:ml-[50%] lg:pl-16 lg:pr-16">
      <StationHeader
        station={station}
        meta={countLabel(swatches.length, copy.counts.colour)}
      />

      <ul className="border-t border-ink/15">
        {swatches.map((swatch) => (
          <li
            key={swatch.id}
            className="flex items-center gap-5 border-b border-ink/15 py-3.5"
          >
            {/* The chip is the point: flat, unbroken, and large enough to read. */}
            <span
              className="h-12 w-12 shrink-0 border border-ink/30 sm:h-14 sm:w-14"
              style={{ backgroundColor: swatch.hex }}
              aria-hidden
            />

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                <h3 className="text-sm font-bold tracking-tight">
                  {swatch.name}
                </h3>
                <span className="shrink-0 text-[11px] font-bold uppercase tabular-nums tracking-[0.12em] text-ink/60">
                  {swatch.hex.toUpperCase()}
                </span>
              </div>
              {swatch.description ? (
                <p className="mt-1 text-xs leading-snug text-ink/70">
                  {swatch.description}
                </p>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
