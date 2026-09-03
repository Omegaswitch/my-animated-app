"use client";

import { useMemo, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "framer-motion";
import type {
  ProjectCopy,
  RenderItem,
  RenderGallery,
  Station,
} from "@/types/project";
import AssetFrame from "@/components/ui/AssetFrame";
import Lightbox from "@/components/ui/Lightbox";
import StationHeader from "./StationHeader";
import { useStageProgress } from "@/components/layout/StageProgress";
import { FINALE_IN, FINALE_SET, useSequenceSlide } from "@/lib/sequence";
import { countLabel } from "@/lib/format";

/**
 * Station 4 — the gallery, one plate at a time.
 *
 * The same mechanism as Kits and Colours: each render floats into focus with
 * its caption anchored beneath it, holds, then pushes up and out as the next
 * arrives. After the last, the set settles into an editorial grid so it reads
 * together before the line moves on.
 *
 * Timing comes from `useSequenceSlide`, shared with the other two sequenced
 * stations, so retiming one retimes all three.
 *
 * The caption sits under the plate rather than beside it: a gallery is read
 * image-first, and a caption in the margin competes with the image for the
 * same horizontal attention.
 */

export interface RendersSectionProps {
  renders: RenderGallery;
  station: Station;
  copy: ProjectCopy;
}

/* ---------------------------------------------------------------------------
 * One plate
 * ------------------------------------------------------------------------- */

function RenderSlide({
  item,
  index,
  count,
  copy,
  progress,
  onOpen,
}: {
  item: RenderItem;
  index: number;
  count: number;
  copy: ProjectCopy;
  progress: MotionValue<number>;
  onOpen: (item: RenderItem) => void;
}) {
  const { opacity, y } = useSequenceSlide(progress, index, count);

  return (
    <motion.figure
      style={{ opacity, y }}
      className="absolute inset-x-0 top-1/2 -translate-y-1/2 will-change-transform"
      data-render-slide={item.id}
    >
      <button
        type="button"
        onClick={() => onOpen(item)}
        className="group mx-auto block w-full text-left outline-none focus-visible:ring-2 focus-visible:ring-line-primary lg:w-[82%]"
        aria-label={`View ${item.title} full screen`}
      >
        <AssetFrame
          asset={item.asset}
          tag={copy.renderView[item.view]}
          placeholderLabel={copy.labels.assetPlaceholder}
          className="transition-opacity group-hover:opacity-85"
          sizes="(min-width: 1024px) 36vw, 90vw"
        />
      </button>

      {/* Anchored beneath the plate: title, board, then who made it. */}
      <figcaption className="mx-auto mt-4 w-full border-t-2 border-ink/25 pt-3 lg:w-[82%]">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h3 className="text-base font-bold tracking-tight lg:text-lg">
            {item.title}
          </h3>
          <span className="shrink-0 text-[10px] font-bold uppercase tabular-nums tracking-[0.14em] text-ink/50">
            {String(index + 1).padStart(2, "0")} / {copy.renderView[item.view]}
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
      </figcaption>
    </motion.figure>
  );
}

/* ---------------------------------------------------------------------------
 * The station
 * ------------------------------------------------------------------------- */

export default function RendersSection({
  renders,
  station,
  copy,
}: RendersSectionProps) {
  const [activeItem, setActiveItem] = useState<RenderItem | null>(null);
  const prefersReducedMotion = useReducedMotion() ?? false;

  /* Outside a stage — or under reduced motion — there is no sequence to run.
     The fallback holds progress at the finale, so the station degrades to the
     full grid rather than to a blank frame. */
  const staged = useStageProgress();
  const fallback = useMotionValue(1);
  const progress = staged && !prefersReducedMotion ? staged : fallback;

  const gridOpacity = useTransform(progress, [FINALE_IN, FINALE_SET], [0, 1], {
    clamp: true,
  });
  const gridScale = useTransform(progress, [FINALE_IN, FINALE_SET], [0.92, 1], {
    clamp: true,
  });

  // `order` is the authored sequence and the only thing deciding position.
  const items = useMemo(
    () => [...renders.items].sort((a, b) => a.order - b.order),
    [renders.items],
  );

  if (items.length === 0) return null;

  return (
    <section className="relative py-24 pl-24 pr-6 sm:pl-28 lg:ml-[50%] lg:pl-16 lg:pr-16">
      <StationHeader
        station={station}
        meta={countLabel(items.length, copy.counts.plate)}
      />

      {/* One centred frame. Plates and the grid stack inside it, so the
          sequence never changes the section's height. */}
      <div className="relative h-[58vh] min-h-[360px]">
        {items.map((item, index) => (
          <RenderSlide
            key={item.id}
            item={item}
            index={index}
            count={items.length}
            copy={copy}
            progress={progress}
            onOpen={setActiveItem}
          />
        ))}

        {/* Finale: the set as an editorial grid. */}
        <motion.ul
          style={{ opacity: gridOpacity, scale: gridScale }}
          className="absolute inset-x-0 top-1/2 grid -translate-y-1/2 grid-cols-3 gap-x-3 gap-y-4 will-change-transform"
          data-render-grid
        >
          {items.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => setActiveItem(item)}
                className="group block w-full text-left outline-none focus-visible:ring-2 focus-visible:ring-line-primary"
                aria-label={`View ${item.title} full screen`}
              >
                <AssetFrame
                  asset={item.asset}
                  tag={copy.renderView[item.view]}
                  placeholderLabel={copy.labels.assetPlaceholder}
                  className="transition-opacity group-hover:opacity-85"
                  sizes="(min-width: 1024px) 12vw, 30vw"
                />
              </button>
              <p className="mt-1.5 truncate border-t border-ink/20 pt-1 text-[10px] font-bold uppercase tracking-[0.08em]">
                {item.title}
              </p>
            </li>
          ))}
        </motion.ul>
      </div>

      <Lightbox
        open={activeItem !== null}
        onClose={() => setActiveItem(null)}
        title={activeItem?.title ?? ""}
        meta={activeItem ? copy.renderView[activeItem.view] : undefined}
        caption={activeItem?.asset.caption}
      >
        {activeItem ? (
          <AssetFrame
            asset={activeItem.asset}
            tag={copy.renderView[activeItem.view]}
            placeholderLabel={copy.labels.assetPlaceholder}
            sizes="90vw"
            className="mx-auto max-h-[70vh] w-auto"
          />
        ) : null}
      </Lightbox>
    </section>
  );
}
