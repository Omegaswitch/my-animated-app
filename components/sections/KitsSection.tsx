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
 * It used to sit in a 56/44 split beside the copy, which is the wrong way
 * round: the copy is four short facts and a sentence, and the render is the
 * product. Worse, the kit files are square and the frame was 16:10, so the
 * image contained itself into a 256px square in a 409px box — a thumbnail of
 * the thing the page exists to show.
 *
 * The frame is now square and as wide as the card or the viewport's height
 * allows, whichever binds first, so the render is the largest it can be
 * without scrolling the card off screen. Square because the artwork is: a
 * landscape frame would letterbox it back down. `object-contain` still means
 * nothing is ever cropped if a kit arrives in another shape.
 *
 * What was a column of copy is a spec strip under the image — code and name
 * on one side, the numbers on the other, one rule beneath. Read as a data
 * sheet rather than a headline.
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
            /* `max-w-[68vh]` is what keeps the card on one screen: the frame
               is square, so its width is also its height, and the viewport is
               the binding constraint on a wide display. */
            className="group relative mx-auto block aspect-square w-full max-w-[68vh] cursor-zoom-in overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-line-primary"
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
              sizes="(min-width: 1024px) 640px, 90vw"
              priority={carousel.index === 0}
            />
          </button>
        ) : null}

        {/* The spec strip. Identity left, numbers right, one rule under it. */}
        <div className="mt-6 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 border-b border-ink/15 pb-3">
          <div className="flex min-w-0 flex-wrap items-baseline gap-x-4 gap-y-1">
            <span className="text-[11px] font-bold uppercase tabular-nums tracking-[0.18em] text-ink/50">
              {kit.code}
            </span>
            <h3 className="text-base font-bold uppercase tracking-[0.06em] lg:text-lg">
              {kit.name}
            </h3>
          </div>

          <dl className="flex flex-wrap items-baseline gap-x-6 gap-y-1 text-[11px] font-bold uppercase tracking-[0.12em] text-ink/60">
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
        </div>

        <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
          <p className="max-w-[54ch] text-sm leading-relaxed text-ink/80">
            {kit.summary}
          </p>

          {kit.note ? (
            <p className="border-l-2 border-line-primary pl-3 text-[10px] font-bold uppercase leading-relaxed tracking-[0.1em] text-ink/60">
              {kit.note}
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
