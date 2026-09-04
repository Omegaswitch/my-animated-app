import type {
  ProjectCopy,
  Station,
  Vendor,
  VendorRegion,
} from "@/types/project";
import StationHeader from "./StationHeader";
import { countLabel } from "@/lib/format";

/**
 * Station 5 — where to buy, assembled line by line.
 *
 * A directory: the whole list at once, scannable, so a buyer can find their
 * own territory and compare it against the rest without waiting for anything.
 *
 * Region headings are rows in the same flat list as the vendors, so the
 * grouping is structural rather than a separate pass over the data.
 *
 * A vendor without a published listing prints a pending state — never a dead
 * link, and never an empty region heading.
 */

export interface VendorsSectionProps {
  vendors: Vendor[];
  station: Station;
  copy: ProjectCopy;
}

/** Scan order — largest markets first. */
const REGION_ORDER: readonly VendorRegion[] = [
  "north-america",
  "europe",
  "asia",
  "oceania",
  "south-america",
  "africa",
];

type Row =
  | { kind: "region"; key: string; region: VendorRegion }
  | { kind: "vendor"; key: string; vendor: Vendor };

/* ---------------------------------------------------------------------------
 * One row of the directory
 * ------------------------------------------------------------------------- */

function DirectoryRow({ row, copy }: { row: Row; copy: ProjectCopy }) {
  return (
    <li data-directory-row={row.kind}>
      {row.kind === "region" ? (
        <h3 className="mt-4 border-b-2 border-ink/25 pb-1 text-[11px] font-bold uppercase tracking-[0.16em] text-ink/60 first:mt-0">
          {copy.vendorRegion[row.region]}
        </h3>
      ) : (
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5 border-b border-ink/15 py-2">
          <div className="min-w-0">
            {row.vendor.url ? (
              <a
                href={row.vendor.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-bold tracking-tight underline decoration-ink/30 underline-offset-4 outline-none transition-colors hover:decoration-line-primary focus-visible:ring-2 focus-visible:ring-line-primary"
              >
                {row.vendor.name}
                {/* Spoken, not merely implied by an absent icon. */}
                <span className="sr-only"> ({copy.labels.opensInNewTab})</span>
              </a>
            ) : (
              <span className="text-sm font-bold tracking-tight text-ink/60">
                {row.vendor.name}
                <span className="ml-2 text-[10px] font-bold uppercase tracking-[0.12em] text-ink/45">
                  {copy.labels.listingPending}
                </span>
              </span>
            )}
          </div>

          {row.vendor.serves && row.vendor.serves.length > 0 ? (
            <p className="shrink-0 text-[10px] uppercase tracking-[0.12em] text-ink/45">
              {row.vendor.serves.join(" · ")}
            </p>
          ) : null}
        </div>
      )}
    </li>
  );
}

/* ---------------------------------------------------------------------------
 * The station
 * ------------------------------------------------------------------------- */

export default function VendorsSection({
  vendors,
  station,
  copy,
}: VendorsSectionProps) {
  /* Flattened to a single ordered list so headings and vendors share one
     reveal sequence. Regions with no vendor never produce a heading. */
  const rows: Row[] = REGION_ORDER.flatMap((region) => {
    const entries = vendors.filter((vendor) => vendor.region === region);
    if (entries.length === 0) return [];
    return [
      { kind: "region", key: `region-${region}`, region } as Row,
      ...entries.map((vendor) => ({
        kind: "vendor" as const,
        key: vendor.id,
        vendor,
      })),
    ];
  });

  if (rows.length === 0) return null;

  return (
    <section
      id="vendors"
      className="relative flex min-h-screen flex-col justify-center py-24 pl-24 pr-6 sm:pl-28 lg:ml-[50%] lg:pl-10 lg:pr-8 xl:pl-14 xl:pr-12"
    >
      <StationHeader
        station={station}
        meta={countLabel(vendors.length, copy.counts.vendor)}
      />

      <ul>
        {rows.map((row) => (
          <DirectoryRow key={row.key} row={row} copy={copy} />
        ))}
      </ul>
    </section>
  );
}
