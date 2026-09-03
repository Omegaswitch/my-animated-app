"use client";

import { useState } from "react";
import type { Kit, ProductSwatch, ProjectCopy, Station } from "@/types/project";
import AssetFrame from "@/components/ui/AssetFrame";
import Lightbox from "@/components/ui/Lightbox";
import StationHeader from "./StationHeader";
import { countLabel, formatPrice } from "@/lib/format";

/**
 * Station 2 — the kits.
 *
 * A two-up grid rather than a stack: the station has to hold inside a single
 * viewport, so each kit shows a plate, a name, and the three figures that
 * decide a purchase. The full contents list belongs on a vendor listing, not
 * on a map.
 */

export interface KitsSectionProps {
  kits: Kit[];
  swatches: ProductSwatch[];
  station: Station;
  copy: ProjectCopy;
}

export default function KitsSection({
  kits,
  swatches,
  station,
  copy,
}: KitsSectionProps) {
  const [activeKit, setActiveKit] = useState<Kit | null>(null);

  if (kits.length === 0) return null;

  return (
    <section className="relative py-24 pl-16 pr-6 sm:pl-20 lg:ml-[50%] lg:pl-16 lg:pr-16">
      <StationHeader
        station={station}
        meta={countLabel(kits.length, copy.counts.kit)}
      />

      <ul className="grid gap-x-8 gap-y-8 sm:grid-cols-2">
        {kits.map((kit) => {
          const kitSwatches = (kit.swatchIds ?? [])
            .map((id) => swatches.find((swatch) => swatch.id === id))
            .filter((swatch): swatch is ProductSwatch => Boolean(swatch));

          return (
            <li key={kit.id} className="flex flex-col">
              {kit.image ? (
                <button
                  type="button"
                  onClick={() => setActiveKit(kit)}
                  className="group block w-full text-left outline-none focus-visible:ring-2 focus-visible:ring-line-primary"
                  aria-label={`View ${kit.name} full size`}
                >
                  <AssetFrame
                    asset={kit.image}
                    tag={kit.code}
                    placeholderLabel={copy.labels.assetPlaceholder}
                    className="transition-opacity group-hover:opacity-85"
                    sizes="(min-width: 1024px) 22vw, 100vw"
                  />
                </button>
              ) : null}

              <div className="mt-3 flex items-baseline justify-between gap-3 border-b border-ink/20 pb-1.5">
                <h3 className="text-base font-bold tracking-tight">
                  {kit.name}
                </h3>
                <span className="shrink-0 text-[10px] font-bold uppercase tracking-[0.14em] tabular-nums text-ink/55">
                  {kit.code}
                </span>
              </div>

              <p className="mt-2 text-xs leading-relaxed text-ink/75">
                {kit.summary}
              </p>

              <dl className="mt-3 flex flex-wrap items-baseline gap-x-5 gap-y-1 text-[10px] font-bold uppercase tracking-[0.14em] text-ink/55">
                <dd>{copy.kitAvailability[kit.availability]}</dd>
                {kit.capCount !== undefined ? (
                  <dd className="tabular-nums">
                    {kit.capCount} {copy.labels.caps}
                  </dd>
                ) : null}
                {/* Price is omitted entirely while a kit is unpriced. */}
                {kit.priceMinor !== undefined && kit.currency ? (
                  <dd className="tabular-nums text-ink">
                    {formatPrice(kit.priceMinor, kit.currency)}
                  </dd>
                ) : null}
              </dl>

              {kitSwatches.length > 0 ? (
                <ul className="mt-3 flex flex-wrap items-center gap-1.5">
                  {kitSwatches.map((swatch) => (
                    <li key={swatch.id}>
                      <span
                        className="block h-3.5 w-3.5 border border-ink/30"
                        style={{ backgroundColor: swatch.hex }}
                        title={swatch.name}
                      />
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          );
        })}
      </ul>

      <Lightbox
        open={activeKit !== null}
        onClose={() => setActiveKit(null)}
        title={activeKit?.name ?? ""}
        meta={activeKit?.code}
        caption={activeKit?.summary}
      >
        {activeKit?.image ? (
          <AssetFrame
            asset={activeKit.image}
            tag={activeKit.code}
            placeholderLabel={copy.labels.assetPlaceholder}
            sizes="90vw"
          />
        ) : null}
      </Lightbox>
    </section>
  );
}
