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
import { countLabel } from "@/lib/format";

/**
 * Station 4 — the gallery.
 *
 * Same picker as the kits: one featured plate, pills beneath, arrows, and
 * left/right keys. Caption anchored under the image — title, board, credit.
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

  return (
    <section
      id="renders"
      className="relative flex min-h-screen flex-col justify-center py-16"
    >
      <StationPanel routeSide="right">
        <StationHeader
          station={station}
          meta={countLabel(items.length, copy.counts.render)}
        />

        <figure>
          {/* Hard-locked box: one shape for every plate, whatever its ratio. */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="group relative mx-auto block aspect-[16/10] w-full max-w-5xl cursor-zoom-in overflow-hidden text-left outline-none focus-visible:ring-2 focus-visible:ring-line-primary"
            aria-label={`View ${item.title} full screen`}
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
                  tag={copy.renderView[item.view]}
                  placeholderLabel={copy.labels.assetPlaceholder}
                  className="transition-opacity group-hover:opacity-85"
                  fill
                  sizes="(min-width: 1024px) 40vw, 90vw"
                  priority={carousel.index === 0}
                />
              </motion.div>
            </AnimatePresence>
          </button>

          {/* Anchored beneath the plate, at a fixed height so a two-line title
            cannot push the controls down. */}
          <figcaption className="relative mx-auto mt-4 h-20 w-full max-w-5xl border-t-2 border-ink/25 pt-3">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={FADE}
                className="absolute inset-x-0 top-3 flex flex-col justify-start"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="truncate text-base font-bold tracking-tight lg:text-lg">
                    {item.title}
                  </h3>
                  <span className="shrink-0 text-[10px] font-bold uppercase tabular-nums tracking-[0.14em] text-ink/50">
                    {copy.renderView[item.view]}
                  </span>
                </div>

                <div className="mt-1.5 flex flex-wrap items-baseline gap-x-5 gap-y-1 text-[11px] font-bold uppercase tracking-[0.12em] text-ink/55">
                  {item.model ? (
                    <span className="text-ink/75">{item.model}</span>
                  ) : null}
                  {item.credit ? (
                    <span>
                      {copy.labels.credit}: {item.credit}
                    </span>
                  ) : null}
                </div>
              </motion.div>
            </AnimatePresence>
          </figcaption>
        </figure>

        <CarouselControls
          carousel={carousel}
          labels={items.map((entry) => entry.title)}
          copy={copy}
        />

        <Lightbox
          open={open}
          onClose={() => setOpen(false)}
          closeLabel={copy.labels.close}
          title={item.title}
          meta={copy.renderView[item.view]}
          caption={item.asset.caption}
        >
          <ZoomableAsset
            asset={item.asset}
            tag={copy.renderView[item.view]}
            copy={copy}
          />
        </Lightbox>
      </StationPanel>
    </section>
  );
}
