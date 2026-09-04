import type { Station } from "@/types/project";

/**
 * The header every station carries: stop number, name, and a counter.
 *
 * Set in the heavy, tightly-tracked capitals a metro map uses for station
 * names, so the page and the diagram speak the same typographic language.
 */

export interface StationHeaderProps {
  station: Station;
  /** Right-hand counter, e.g. "04 kits". */
  meta?: string;
}

export default function StationHeader({ station, meta }: StationHeaderProps) {
  return (
    <header className="mb-8 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b-2 border-ink/25 pb-3">
      <div className="flex items-baseline gap-4">
        <span className="text-[11px] font-bold tabular-nums tracking-[0.1em] text-ink/45">
          {String(station.index).padStart(2, "0")}
        </span>
        <h2 className="text-xl font-bold uppercase tracking-[0.08em] lg:text-2xl">
          {station.label}
        </h2>
      </div>
      {meta ? (
        <span className="text-[11px] font-bold uppercase tracking-[0.1em] tabular-nums text-ink/55">
          {meta}
        </span>
      ) : null}
    </header>
  );
}
