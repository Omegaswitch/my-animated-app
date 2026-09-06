"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { ProjectCopy, RenderGallery, Station } from "@/types/project";
import AssetFrame from "@/components/ui/AssetFrame";
import Lightbox from "@/components/ui/Lightbox";
import ZoomableAsset from "@/components/ui/ZoomableAsset";
import CarouselControls from "@/components/ui/CarouselControls";
import StationHeader from "./StationHeader";
import StationPanel from "@/components/layout/StationPanel";
import { useCarousel } from "@/lib/useCarousel";

/**
 * Station 4 — the renders.
 *
 * The picture and the position in the sequence, and nothing else.
 *
 * Each render used to carry a title, the view it was shot from and the board
 * it depicted — "Terminus novelty", "Detail", "Novelty, 1u" — beneath the
 * render that showed all three. Naming what the reader is already looking at
 * adds a line to read and a thing to keep true.
 *
 * The credit is the gallery's, not the item's, because it is the same hand
 * every time; it sits under the frame and does not change as you page.
 *
 * No pills either: with nothing to name them, they would have read 01 to 05
 * beneath a counter already reading 01 / 05. Arrows, the counter and the
 * arrow keys are the whole control.
 *
 * The lightbox is where a render is actually judged, so it opens at fit and
 * toggles to 100% on click.
 */

/** Pure opacity, no travel — anything else would reintroduce reflow. */
const FADE = { duration: 0.2, ease: "easeOut" } as const;

export interface RendersSectionProps {
  renders: RenderGallery;
  station: Station;
  copy: ProjectCopy;
}

export default function RendersSection({
  renders,
  station,
  copy,
}: RendersSectionProps) {
  const [open, setOpen] = useState(false);

  // `order` is the authored sequence and the only thing deciding position.
  const items = useMemo(
    () => [...renders.items].sort((a, b) => a.order - b.order),
    [renders.items],
  );

  const carousel = useCarousel(items.length);

  if (items.length === 0) return null;

  const item = items[carousel.index];
  const pad = (n: number) => String(n).padStart(2, "0");
  const position = `${pad(carousel.index + 1)} / ${pad(items.length)}`;

  return (
    <section id="renders" className="relative py-12 lg:py-[45vh]">
      <StationPanel routeSide="right">
        <StationHeader station={station} />

        <figure>
          {/* The kits' frame: full width of the card, 7:6, breaking out
            through the padding. It was 16:10 inside the padding, which on a
            square render left a 455px picture in a 729px box with a third of
            the width as bare ground — the render being the thing the station
            exists to show.

            Unlike the kits it contains rather than crops. These arrive in
            different shapes, and one is a tight detail with the caps at the
            frame edge; cropping to fill would cut the subject of the one shot
            that cannot spare it. So a render that is not 7:6 is letterboxed,
            which is the honest cost of a gallery that takes any shape. */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="group relative block aspect-[7/6] w-full cursor-zoom-in overflow-hidden text-left outline-none focus-visible:ring-2 focus-visible:ring-line-primary lg:-mx-12 lg:w-[calc(100%+6rem)]"
            aria-label={`${copy.labels.zoomIn} — ${renders.heading} ${position}`}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={FADE}
                className="absolute inset-0"
              >
                <AssetFrame
                  asset={item.asset}
                  tag={position}
                  placeholderLabel={copy.labels.assetPlaceholder}
                  className="transition-opacity group-hover:opacity-85"
                  fill
                  sizes="(min-width: 1024px) 900px, 100vw"
                  priority={carousel.index === 0}
                />
              </motion.div>
            </AnimatePresence>
          </button>

          {/* One line, and the same line on every render, so it needs neither
            a fixed height nor a crossfade. */}
          {renders.credit ? (
            <figcaption className="mt-6 w-full border-t-2 border-ink/25 pt-3 text-[11px] font-bold uppercase tracking-[0.12em] text-ink/55">
              {copy.labels.credit}: {renders.credit}
            </figcaption>
          ) : null}
        </figure>

        <CarouselControls
          carousel={carousel}
          count={items.length}
          copy={copy}
        />

        <Lightbox
          open={open}
          onClose={() => setOpen(false)}
          closeLabel={copy.labels.close}
          title={renders.heading}
          meta={position}
          caption={item.asset.caption}
        >
          <ZoomableAsset asset={item.asset} tag={position} copy={copy} />
        </Lightbox>
      </StationPanel>
    </section>
  );
}
