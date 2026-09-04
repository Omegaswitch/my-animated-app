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
 * Clicking the image opens it full screen with click-to-zoom, for reading a
 * legend at 100%.
 *
 * ## The render owns the card
 *
 * It used to sit in a 56/44 split beside a column of copy, which is the wrong
 * way round: the render is the product. The frame is now square and runs the
 * card's full width, breaking out through its padding, because the card's
 * width is the hard ceiling here — it cannot widen without steepening the
 * route's bends (see `StationPanel`), so the only room left to give the image
 * was the padding.
 *
 * Square because the artwork is: a landscape frame would letterbox it back
 * down. `object-contain` still means nothing is cropped if a kit arrives in
 * another shape.
 *
 * ## Two facts
 *
 * The name and the price, and nothing else. It carried the kit code, its
 * availability, a cap count, a summary and a note; none of that is what
 * anyone is looking at this screen to find out, and all of it was competing
 * with the render for the space. The summary survives as the lightbox's
 * caption, where there is room and someone has asked for detail.
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

        {kit.image ? (
          <button
            type="button"
            onClick={() => setOpen(true)}
            /* Full-bleed from `lg`: the negative margin cancels the card's
               padding and the width adds it back, so the frame spans the card
               edge to edge. Not below `lg` — the card's left padding is there
               to clear the route, and breaking through it would put the image
               under the tracks. */
            className="group relative block aspect-square w-full cursor-zoom-in overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-line-primary lg:-mx-12 lg:w-[calc(100%+6rem)]"
            aria-label={`View ${kit.name} full screen`}
          >
            {/* Locked box, contained image: the artwork's own ratio is not
              known until it lands, so the frame must not take its shape from
              the declaration — a square photo in a 16:10 frame is a crop or a
              letterbox, and this file is square. */}
            <AssetFrame
              asset={kit.image}
              tag={kit.code}
              placeholderLabel={copy.labels.assetPlaceholder}
              className="transition-opacity group-hover:opacity-85"
              fill
              sizes="(min-width: 1024px) 900px, 100vw"
              priority={carousel.index === 0}
            />
          </button>
        ) : null}

        <div className="mt-6 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1">
          <h3 className="text-lg font-bold uppercase tracking-[0.06em] lg:text-xl">
            {kit.name}
          </h3>

          {kit.priceMinor !== undefined && kit.currency ? (
            <p className="text-lg font-bold tabular-nums lg:text-xl">
              {formatPrice(kit.priceMinor, kit.currency)}
            </p>
          ) : null}
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
