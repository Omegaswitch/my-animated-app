import type { Station } from "@/types/project";

/**
 * The header every station carries: stop number and name.
 *
 * The number is the station's own `index`, so the sequence down the page is
 * the sequence in the data and cannot drift from it.
 *
 * There is no counter opposite it any more. "04 kits" beside station 02 was
 * read as the section number — it was set in the same padded two-digit style,
 * and for four of the six stations it was the only number on the card. A count
 * nobody asked for is not worth a second number on the page.
 *
 * Set in the heavy, tightly-tracked capitals a metro map uses for station
 * names, so the page and the diagram speak the same typographic language.
 */

export interface StationHeaderProps {
  station: Station;
}

export default function StationHeader({ station }: StationHeaderProps) {
  return (
    <header className="mb-8 border-b-2 border-ink/25 pb-3">
      <h2 className="flex items-baseline gap-3 text-2xl font-bold uppercase tracking-[0.08em] lg:text-3xl">
        <span className="tabular-nums text-line-primary">
          {String(station.index).padStart(2, "0")}
        </span>
        <span aria-hidden className="text-ink/30">
          —
        </span>
        <span>{station.label}</span>
      </h2>
    </header>
  );
}
