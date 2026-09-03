import type {
  ProjectCopy,
  Station,
  Vendor,
  VendorRegion,
} from "@/types/project";
import StationHeader from "./StationHeader";
import { countLabel } from "@/lib/format";

/**
 * Station 5 — where to buy, by region.
 *
 * Typographic and text-first. This is the station a buyer scans for their own
 * territory and nothing else, so it is a list of names and destinations, not
 * a grid of logo cards.
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

export default function VendorsSection({
  vendors,
  station,
  copy,
}: VendorsSectionProps) {
  const byRegion = REGION_ORDER.map((region) => ({
    region,
    // Regions with no vendor are skipped rather than printed empty.
    entries: vendors.filter((vendor) => vendor.region === region),
  })).filter((group) => group.entries.length > 0);

  if (byRegion.length === 0) return null;

  return (
    <section className="relative py-24 pl-24 pr-6 sm:pl-28 lg:ml-[50%] lg:pl-16 lg:pr-16">
      <StationHeader
        station={station}
        meta={countLabel(vendors.length, copy.counts.vendor)}
      />

      <div className="columns-1 gap-x-10 sm:columns-2">
        {byRegion.map((group) => (
          <div key={group.region} className="mb-6 break-inside-avoid">
            <h3 className="border-b-2 border-ink/25 pb-1 text-[11px] font-bold uppercase tracking-[0.16em] text-ink/60">
              {copy.vendorRegion[group.region]}
            </h3>
            <ul>
              {group.entries.map((vendor) => (
                <li key={vendor.id} className="border-b border-ink/15 py-2.5">
                  {vendor.url ? (
                    <a
                      href={vendor.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-bold tracking-tight underline decoration-ink/30 underline-offset-4 outline-none transition-colors hover:decoration-line-primary focus-visible:ring-2 focus-visible:ring-line-primary"
                    >
                      {vendor.name}
                      {/* Spoken, not merely implied by an absent icon. */}
                      <span className="sr-only">
                        {" "}
                        ({copy.labels.opensInNewTab})
                      </span>
                    </a>
                  ) : (
                    <span className="text-sm font-bold tracking-tight text-ink/60">
                      {vendor.name}
                      <span className="ml-2 text-[10px] font-bold uppercase tracking-[0.12em] text-ink/45">
                        {copy.labels.listingPending}
                      </span>
                    </span>
                  )}

                  {vendor.serves && vendor.serves.length > 0 ? (
                    <p className="mt-0.5 text-[10px] uppercase tracking-[0.12em] text-ink/45">
                      {vendor.serves.join(" · ")}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
