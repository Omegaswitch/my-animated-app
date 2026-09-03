"use client";

import { useMemo, useState } from "react";
import type {
  ProjectCopy,
  RenderItem,
  RenderGallery,
  Station,
} from "@/types/project";
import AssetFrame from "@/components/ui/AssetFrame";
import Lightbox from "@/components/ui/Lightbox";
import StationHeader from "./StationHeader";
import { countLabel } from "@/lib/format";

/**
 * Station 4 — the gallery.
 *
 * A three-up grid of plates. The station holds inside one viewport, so the
 * plates are thumbnails and the full-size view is the lightbox — which is
 * where a render wants to be looked at anyway.
 */

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
  const [activeItem, setActiveItem] = useState<RenderItem | null>(null);

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

      {renders.intro ? (
        <p className="mb-6 max-w-[52ch] text-xs leading-relaxed text-ink/75">
          {renders.intro}
        </p>
      ) : null}

      <ul className="grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3">
        {items.map((item) => (
          <li key={item.id}>
            <figure>
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
                  sizes="(min-width: 1024px) 15vw, 45vw"
                />
              </button>
              <figcaption className="mt-2 border-t border-ink/15 pt-1.5">
                <span className="block text-xs font-bold tracking-tight">
                  {item.title}
                </span>
                {item.credit ? (
                  <span className="mt-0.5 block text-[10px] uppercase tracking-[0.12em] text-ink/50">
                    {copy.labels.credit}: {item.credit}
                  </span>
                ) : null}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>

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
