"use client";

import { useMemo, useState } from "react";
import type {
  ImageAsset,
  ProjectCopy,
  RenderItem,
  RenderGallery,
} from "@/types/project";
import AssetFrame from "@/components/ui/AssetFrame";
import Lightbox from "@/components/ui/Lightbox";
import { countLabel } from "@/lib/format";

/**
 * Renders — the gallery.
 *
 * The layout is asymmetric by derivation, not by decoration. Each plate's
 * shape comes from its own pixel dimensions, and its column span follows from
 * that shape: a landscape plate takes eight columns, a portrait five, a detail
 * four. Rows are left ragged on purpose — filling every row to twelve would
 * produce the uniform grid this is meant to avoid.
 *
 * Because the spans are derived, adding a plate re-flows the composition
 * without anyone choosing a size for it.
 */

export interface RendersSectionProps {
  renders: RenderGallery;
  copy: ProjectCopy;
}

type Shape = "landscape" | "portrait" | "square";

/** Tailwind needs literal class names, so spans are looked up, not built. */
const SPAN_CLASS: Record<Shape | "detail", string> = {
  landscape: "lg:col-span-8",
  portrait: "lg:col-span-5",
  square: "lg:col-span-6",
  detail: "lg:col-span-4",
};

function shapeOf(asset: ImageAsset): Shape {
  const ratio = asset.width / asset.height;
  if (ratio > 1.15) return "landscape";
  if (ratio < 0.87) return "portrait";
  return "square";
}

export default function RendersSection({ renders, copy }: RendersSectionProps) {
  const [activeItem, setActiveItem] = useState<RenderItem | null>(null);

  // `order` is the authored sequence; it is the only thing that decides
  // position in the flow.
  const items = useMemo(
    () => [...renders.items].sort((a, b) => a.order - b.order),
    [renders.items],
  );

  if (items.length === 0) return null;

  return (
    <section className="relative z-10 py-32 pl-16 pr-6 sm:pl-20 lg:ml-[50%] lg:pl-16 lg:pr-16">
      <header className="mb-6 flex items-baseline justify-between gap-6 border-b border-ink/20 pb-3">
        <h2 className="text-[10px] uppercase tracking-[0.34em]">
          {renders.heading}
        </h2>
        <span className="text-[10px] uppercase tracking-[0.2em] tabular-nums text-ink/60">
          {countLabel(items.length, copy.counts.plate)}
        </span>
      </header>

      {renders.intro ? (
        <p className="mb-16 max-w-[52ch] text-sm leading-relaxed text-ink/80">
          {renders.intro}
        </p>
      ) : null}

      <ul className="grid gap-x-8 gap-y-16 lg:grid-cols-12">
        {items.map((item, index) => {
          const shape = shapeOf(item.asset);
          const span =
            item.view === "detail" ? SPAN_CLASS.detail : SPAN_CLASS[shape];
          // Every third plate drops down the page, breaking the row rhythm.
          const offset = index % 3 === 2 ? "lg:mt-24" : "";

          return (
            <li key={item.id} className={`${span} ${offset}`}>
              <figure className="flex flex-col">
                <button
                  type="button"
                  onClick={() => setActiveItem(item)}
                  className="group block w-full text-left outline-none focus-visible:ring-1 focus-visible:ring-line-primary"
                  aria-label={`View ${item.title} full screen`}
                >
                  <AssetFrame
                    asset={item.asset}
                    tag={copy.renderView[item.view]}
                    className="transition-opacity group-hover:opacity-85"
                    sizes="(min-width: 1024px) 45vw, 100vw"
                  />
                </button>

                <figcaption className="mt-3 flex items-baseline justify-between gap-4 border-t border-ink/15 pt-2">
                  <span className="text-sm tracking-tight">{item.title}</span>
                  <span className="shrink-0 text-[10px] uppercase tracking-[0.18em] text-ink/55">
                    {copy.renderView[item.view]}
                  </span>
                </figcaption>

                {item.credit ? (
                  <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-ink/45">
                    {copy.renderLabels.credit}: {item.credit}
                  </p>
                ) : null}

                {item.asset.caption ? (
                  <p className="mt-2 max-w-[42ch] text-xs leading-relaxed text-ink/60">
                    {item.asset.caption}
                  </p>
                ) : null}
              </figure>
            </li>
          );
        })}
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
            sizes="90vw"
            className="mx-auto max-h-[70vh] w-auto"
          />
        ) : null}
      </Lightbox>
    </section>
  );
}
