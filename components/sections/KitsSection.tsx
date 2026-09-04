"use client";

import { useState } from "react";
import type { Kit, ProjectCopy, Station } from "@/types/project";
import AssetFrame from "@/components/ui/AssetFrame";
import Lightbox from "@/components/ui/Lightbox";
import ZoomableAsset from "@/components/ui/ZoomableAsset";
import CarouselControls from "@/components/ui/CarouselControls";
import StationHeader from "./StationHeader";
import StationPanel from "@/components/layout/StationPanel";
import { useCarousel } from "@/lib/useCarousel";
import { formatPrice } from "@/lib/format";

/**
 * Station 2 — the kits.
 *
 * A picker, not a scroll sequence: one featured kit, pills for the rest,
 * arrows either side, and left/right keys. Choosing what to look at should
 * cost a click, not a measured amount of scrolling.
 *
 * Clicking the image opens it full screen with click-to-zoom, which is where
 * legends are actually legible.
 */

export interface KitsSectionProps {
  kits: Kit[];
  station: Station;
  copy: ProjectCopy;
}

export default function KitsSection({ kits, station, copy }: KitsSectionProps) {
  const [open, setOpen] = useState(false);
  const carousel = useCarousel(kits.length);

  if (kits.length === 0) return null;

  const kit = kits[carousel.index];

  return (
    <section
      id="kits"
      className="relative py-12 lg:py-[45vh]"
    >
      <StationPanel routeSide="right">
        <StationHeader station={station} />

        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-8">
          {kit.image ? (
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="group relative block aspect-[16/10] w-full shrink-0 cursor-zoom-in overflow-hidden text-left outline-none focus-visible:ring-2 focus-visible:ring-line-primary lg:w-[56%]"
              aria-label={`View ${kit.name} full screen`}
            >
              {/* Locked box, contained image: the artwork's own ratio is
                unknown until it lands, so the frame must not take its shape
                from it — a square photo in a ratio-derived frame crops hard. */}
              <AssetFrame
                asset={kit.image}
                tag={kit.code}
                placeholderLabel={copy.labels.assetPlaceholder}
                className="transition-opacity group-hover:opacity-85"
                fill
                sizes="(min-width: 1024px) 24vw, 90vw"
                priority={carousel.index === 0}
              />
            </button>
          ) : null}

          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold uppercase tabular-nums tracking-[0.18em] text-ink/50">
              {kit.code}
            </p>

            <h3 className="mt-2 text-[clamp(1.75rem,3.4vw,3rem)] font-bold leading-[1.02] tracking-[-0.02em]">
              {kit.name}
            </h3>

            <p className="mt-4 max-w-[42ch] text-base leading-relaxed text-ink/80">
              {kit.summary}
            </p>

            <dl className="mt-5 flex flex-wrap items-baseline gap-x-6 gap-y-2 border-t-2 border-ink/25 pt-3 text-xs font-bold uppercase tracking-[0.12em] text-ink/60">
              <dd>{copy.kitAvailability[kit.availability]}</dd>
              {kit.capCount !== undefined ? (
                <dd className="tabular-nums text-ink">
                  {kit.capCount} {copy.labels.caps}
                </dd>
              ) : null}
              {kit.priceMinor !== undefined && kit.currency ? (
                <dd className="tabular-nums text-ink">
                  {formatPrice(kit.priceMinor, kit.currency)}
                </dd>
              ) : null}
            </dl>

            {kit.note ? (
              <p className="mt-4 border-l-2 border-line-primary pl-3 text-[11px] font-bold uppercase leading-relaxed tracking-[0.1em] text-ink/60">
                {kit.note}
              </p>
            ) : null}
          </div>
        </div>

        <CarouselControls
          carousel={carousel}
          labels={kits.map((entry) => entry.name)}
          copy={copy}
        />

        <Lightbox
          open={open}
          onClose={() => setOpen(false)}
          closeLabel={copy.labels.close}
          title={kit.name}
          meta={kit.code}
          caption={kit.summary}
        >
          {kit.image ? (
            <ZoomableAsset asset={kit.image} tag={kit.code} copy={copy} />
          ) : null}
        </Lightbox>
      </StationPanel>
    </section>
  );
}
