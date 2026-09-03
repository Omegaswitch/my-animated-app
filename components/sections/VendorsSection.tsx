"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import type {
  ProjectCopy,
  Station,
  Vendor,
  VendorRegion,
} from "@/types/project";
import StationHeader from "./StationHeader";
import { useStageProgress } from "@/components/layout/StageProgress";
import { useAccumulatingReveal } from "@/lib/sequence";
import { countLabel } from "@/lib/format";

/**
 * Station 5 — where to buy, assembled line by line.
 *
 * Deliberately *not* the slide mechanic the other stations use. A vendor list
 * is a directory: you want to end up looking at all of it, and compare your
 * own region against the rest. So each row drops into place and stays, and by
 * the end of the track the complete list is on screen at once.
 *
 * `useAccumulatingReveal` supplies that timing — the same module the sequenced
 * stations use, so the two behaviours stay in one place and read as a pair of
 * deliberate choices rather than two unrelated implementations.
 *
 * Region headings are rows in the same reveal order as the vendors, so a
 * territory heading arrives with the first vendor under it rather than the
 * whole scaffold appearing up front.
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

function DirectoryRow({
  row,
  index,
  count,
  copy,
  progress,
}: {
  row: Row;
  index: number;
  count: number;
  copy: ProjectCopy;
  progress: MotionValue<number>;
}) {
  const { opacity, y } = useAccumulatingReveal(progress, index, count);

  return (
    <motion.li
      style={{ opacity, y }}
      className="will-change-transform"
      data-directory-row={row.kind}
    >
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
    </motion.li>
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
  const prefersReducedMotion = useReducedMotion() ?? false;

  /* Outside a stage — or under reduced motion — there is nothing to reveal.
     The fallback holds progress at the end, so the station degrades to the
     complete directory rather than to an empty frame. */
  const staged = useStageProgress();
  const fallback = useMotionValue(1);
  const progress = staged && !prefersReducedMotion ? staged : fallback;

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
    <section className="relative py-24 pl-24 pr-6 sm:pl-28 lg:ml-[50%] lg:pl-16 lg:pr-16">
      <StationHeader
        station={station}
        meta={countLabel(vendors.length, copy.counts.vendor)}
      />

      <ul>
        {rows.map((row, index) => (
          <DirectoryRow
            key={row.key}
            row={row}
            index={index}
            count={rows.length}
            copy={copy}
            progress={progress}
          />
        ))}
      </ul>
    </section>
  );
}
