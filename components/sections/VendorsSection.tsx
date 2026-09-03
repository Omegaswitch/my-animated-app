import type { Vendor, VendorRegion } from "@/types/project";
import { countLabel } from "@/lib/format";

/**
 * Vendors — where to buy, by region.
 *
 * Text first, deliberately. This is the section a buyer scans for their own
 * territory and nothing else, so it is a list of names and destinations, not
 * a grid of logo cards.
 *
 * Only sales channels appear. The manufacturer and the packaging and print
 * suppliers are in the same vendor list but are not places you can buy from,
 * so they are filtered out by role rather than by a second hand-kept list.
 *
 * A confirmed vendor without a published listing prints a pending state. It
 * is never a dead link and never an empty region.
 */

export interface VendorsSectionProps {
  vendors: Vendor[];
  heading?: string;
}

/** Scan order — largest markets first, `global` last as a catch-all. */
const REGION_ORDER: readonly VendorRegion[] = [
  "europe",
  "north-america",
  "south-america",
  "asia",
  "oceania",
  "africa",
  "global",
];

const REGION_LABEL: Record<VendorRegion, string> = {
  europe: "Europe",
  "north-america": "North America",
  "south-america": "South America",
  asia: "Asia",
  oceania: "Oceania",
  africa: "Africa",
  global: "Worldwide",
};

function VendorRow({ vendor }: { vendor: Vendor }) {
  const isPending = vendor.status === "pending";

  return (
    <li className="border-b border-ink/10 py-4">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        {vendor.url ? (
          <a
            href={vendor.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-base tracking-tight underline decoration-ink/30 underline-offset-4 outline-none transition-colors hover:decoration-line-primary focus-visible:ring-1 focus-visible:ring-line-primary"
          >
            {vendor.name}
            {/* The destination is spoken, not just implied by the icon-less link. */}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        ) : (
          <span className="text-base tracking-tight text-ink/70">{vendor.name}</span>
        )}

        <span
          className={`text-[10px] uppercase tracking-[0.2em] ${
            vendor.url ? "text-ink/55" : "text-ink/40"
          }`}
        >
          {vendor.url ? "Listing open" : isPending ? "Allocation pending" : "Listing pending"}
        </span>
      </div>

      {vendor.serves && vendor.serves.length > 0 ? (
        <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-ink/45">
          {vendor.serves.join(" · ")}
        </p>
      ) : null}

      {vendor.location ? (
        <p className="mt-1 text-xs text-ink/50">{vendor.location}</p>
      ) : null}

      {vendor.notes ? <p className="mt-2 max-w-[46ch] text-xs text-ink/55">{vendor.notes}</p> : null}
    </li>
  );
}

export default function VendorsSection({ vendors, heading = "Vendors" }: VendorsSectionProps) {
  const salesChannels = vendors.filter((vendor) => vendor.role === "vendor");

  const byRegion = REGION_ORDER.map((region) => ({
    region,
    // Regions with no vendor are skipped entirely rather than printed empty.
    entries: salesChannels.filter((vendor) => vendor.region === region),
  })).filter((group) => group.entries.length > 0);

  if (byRegion.length === 0) return null;

  const manufacturer = vendors.find((vendor) => vendor.role === "manufacturer");

  return (
    <section className="relative z-10 py-32 pl-16 pr-6 sm:pl-20 lg:ml-[50%] lg:pl-16 lg:pr-16">
      <header className="mb-16 flex items-baseline justify-between gap-6 border-b border-ink/20 pb-3">
        <h2 className="text-[10px] uppercase tracking-[0.34em]">{heading}</h2>
        <span className="text-[10px] uppercase tracking-[0.2em] tabular-nums text-ink/60">
          {countLabel(salesChannels.length, "channel")}
        </span>
      </header>

      <div className="flex flex-col gap-12">
        {byRegion.map((group) => (
          <div key={group.region}>
            <h3 className="text-[10px] uppercase tracking-[0.28em] text-ink/50">
              {REGION_LABEL[group.region]}
            </h3>
            <ul className="mt-3 border-t border-ink/20">
              {group.entries.map((vendor) => (
                <VendorRow key={vendor.id} vendor={vendor} />
              ))}
            </ul>
          </div>
        ))}
      </div>

      {manufacturer ? (
        <p className="mt-16 border-t border-ink/20 pt-4 text-[10px] uppercase tracking-[0.2em] text-ink/50">
          Manufactured by{" "}
          {manufacturer.url ? (
            <a
              href={manufacturer.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-ink/30 underline-offset-4 hover:decoration-line-primary"
            >
              {manufacturer.name}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ) : (
            manufacturer.name
          )}
        </p>
      ) : null}
    </section>
  );
}
