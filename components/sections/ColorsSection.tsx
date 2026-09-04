"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type {
  ColorSample,
  Kit,
  ProductSwatch,
  ProjectCopy,
  Station,
} from "@/types/project";
import AssetFrame from "@/components/ui/AssetFrame";
import StationHeader from "./StationHeader";
import { countLabel } from "@/lib/format";

/**
 * Station 3 — the colourway.
 *
 * A strip of all five, always visible, with the detail updating in place.
 * A palette is compared, not paged through.
 *
 * ## Why the detail panel has a fixed height
 *
 * The five entries have different name lengths, description lengths and tag
 * counts, so the panel's natural height changes with the selection. Hovering
 * across the strip then resizes it under the pointer, which moves everything
 * below and reads as jitter. The panel is given a fixed height and the copy
 * cross-fades inside it, so nothing outside the panel moves at all.
 *
 * The cross-fade is `AnimatePresence mode="wait"` on opacity only — no spring,
 * no travel. Anything with overshoot would reintroduce the wobble the fixed
 * height is there to remove.
 *
 * Hover previews and click commits, but a click also clears the hover latch:
 * hover is a transient preview and must never outrank a deliberate choice.
 */

export interface ColorsSectionProps {
  swatches: ProductSwatch[];
  samples: ColorSample[];
  kits: Kit[];
  station: Station;
  copy: ProjectCopy;
}

function usedOn(swatch: ProductSwatch, kits: Kit[]): string[] {
  return kits
    .filter((kit) => (kit.swatchIds ?? []).includes(swatch.id))
    .map((kit) => kit.name);
}

const FADE = { duration: 0.16, ease: "easeOut" } as const;

/**
 * Chip frame: Pantone 447 C, faint at rest, full strength when active.
 *
 * Warm Gray 5 C is the page background, so without a frame that chip
 * dissolves into the canvas and reads as a gap in the strip. A hairline keeps
 * every chip architecturally framed; a shadow would just add haze.
 */
const CHIP_BORDER = "rgba(55, 58, 54, 0.2)";
const CHIP_BORDER_ACTIVE = "#373A36";

export default function ColorsSection({
  swatches,
  samples,
  kits,
  station,
  copy,
}: ColorsSectionProps) {
  const [selected, setSelected] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);

  if (swatches.length === 0) return null;

  const activeIndex = hovered ?? selected;
  const swatch = swatches[activeIndex];
  const tags = usedOn(swatch, kits);

  return (
    <section
      id="colors"
      className="relative flex min-h-screen flex-col justify-center py-24 pl-24 pr-6 sm:pl-28 lg:ml-[50%] lg:pl-10 lg:pr-8 xl:pl-14 xl:pr-12"
    >
      <StationHeader
        station={station}
        meta={countLabel(swatches.length, copy.counts.colour)}
      />

      {/* The strip: all five, side by side, always. Only the chip's own
          height eases — nothing around it depends on that height. */}
      <ul className="flex w-full" onMouseLeave={() => setHovered(null)}>
        {swatches.map((entry, index) => {
          const active = index === activeIndex;
          return (
            <li key={entry.id} className="min-w-0 flex-1">
              <button
                type="button"
                onClick={() => {
                  /* Clearing the hover latch matters: a hover that outlives
                     the pointer — focus, a stale enter with no matching
                     leave — would otherwise keep overriding the selection,
                     and every click after the first would look ignored. */
                  setSelected(index);
                  setHovered(null);
                }}
                onMouseEnter={() => setHovered(index)}
                onFocus={() => setHovered(index)}
                onBlur={() => setHovered(null)}
                aria-current={index === selected ? "true" : undefined}
                aria-label={`${entry.name}, ${entry.hex}`}
                className={`block w-full border border-solid outline-none transition-all duration-200 ease-out focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ink ${
                  active ? "h-28 lg:h-44" : "h-24 lg:h-36"
                }`}
                style={{
                  backgroundColor: entry.hex,
                  borderColor: active ? CHIP_BORDER_ACTIVE : CHIP_BORDER,
                }}
              />
            </li>
          );
        })}
      </ul>

      {/* Fixed height: the sole reason the strip can be swept without the
          page moving underneath. */}
      <div className="relative mt-5 h-[168px] sm:h-[148px]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={swatch.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={FADE}
            className="absolute inset-0 flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-10"
          >
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-ink/50">
                {swatch.code}
              </p>

              <h3 className="mt-1.5 text-[clamp(1.5rem,2.8vw,2.25rem)] font-bold leading-[1.04] tracking-[-0.02em]">
                {swatch.name}
              </h3>

              <p className="mt-2 text-lg font-bold tabular-nums tracking-[0.04em] text-ink/70">
                {swatch.hex.toUpperCase()}
              </p>

              {swatch.description ? (
                <p className="mt-2.5 max-w-[44ch] text-base leading-relaxed text-ink/80">
                  {swatch.description}
                </p>
              ) : null}
            </div>

            {tags.length > 0 ? (
              <div className="shrink-0 sm:w-52">
                <h4 className="border-t-2 border-ink/25 pt-2 text-[10px] font-bold uppercase tracking-[0.16em] text-ink/45">
                  {copy.labels.usedOn}
                </h4>
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {tags.map((name) => (
                    <li
                      key={name}
                      className="border border-ink/35 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-ink/75"
                    >
                      {name}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Physical chips, against the digital swatches above them. */}
      {samples.length > 0 ? (
        <div className="mt-8 border-t-2 border-ink/25 pt-4">
          <h4 className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink/45">
            {copy.labels.samples}
          </h4>
          <ul className="mt-3 grid grid-cols-5 gap-2">
            {samples.map((sample) => (
              <li key={sample.id}>
                <AssetFrame
                  asset={sample.image}
                  tag={sample.label}
                  placeholderLabel={copy.labels.assetPlaceholder}
                  sizes="(min-width: 1024px) 8vw, 18vw"
                />
                <p className="mt-1.5 truncate text-[9px] font-bold uppercase tracking-[0.08em] text-ink/60">
                  {sample.label}
                </p>
                {sample.caption ? (
                  <p className="truncate text-[9px] tracking-[0.06em] text-ink/40">
                    {sample.caption}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
