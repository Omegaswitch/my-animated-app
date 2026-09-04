import type { Station } from "@/types/project";

/**
 * The header every station carries: stop number, name, and a counter.
 *
 * The number is the station's own `index`, so the sequence down the page is
 * the sequence in the data and cannot drift from it. It used to be absent
 * here, which left the counter on the right — "06 renders" — reading as the
 * section number and putting two different sixes on the page.
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
      <h2 className="flex items-baseline gap-3 text-2xl font-bold uppercase tracking-[0.08em] lg:text-3xl">
        <span className="tabular-nums text-line-primary">
          {String(station.index).padStart(2, "0")}
        </span>
        <span aria-hidden className="text-ink/30">
          —
        </span>
        <span>{station.label}</span>
      </h2>
      {meta ? (
        <span className="text-[11px] font-bold uppercase tracking-[0.1em] tabular-nums text-ink/55">
          {meta}
        </span>
      ) : null}
    </header>
  );
}
