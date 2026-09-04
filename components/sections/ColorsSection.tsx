"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type {
  ColorSample,
  ProductSwatch,
  ProjectCopy,
  Station,
} from "@/types/project";
import AssetFrame from "@/components/ui/AssetFrame";
import StationHeader from "./StationHeader";
import StationPanel from "@/components/layout/StationPanel";

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
 *
 * ## Why the detail is a row rule and not a list of kits
 *
 * Every kit carries all five colours, so "used on" would have printed the
 * same four kit names under every swatch. What actually varies is the row:
 * the set is row-locked, and the rule is the same wherever that row appears.
 */

export interface ColorsSectionProps {
  swatches: ProductSwatch[];
  samples: ColorSample[];
  /** The standing line above the strip: how the five are applied. */
  note: string;
  station: Station;
  copy: ProjectCopy;
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
  note,
  station,
  copy,
}: ColorsSectionProps) {
  const [selected, setSelected] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);

  if (swatches.length === 0) return null;

  const activeIndex = hovered ?? selected;
  const swatch = swatches[activeIndex];

  return (
    <section
      id="colors"
      className="relative py-12 lg:py-[45vh]"
    >
      <StationPanel routeSide="left">
        <StationHeader station={station} />

        <p className="mb-5 max-w-[62ch] text-base leading-relaxed text-ink/80">
          {note}
        </p>

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
          page moving underneath. It has to be measured per breakpoint, since
          the detail is one column on a phone and two from `sm`, and the
          column is much narrower. Too short and the copy is simply cut off —
          the panel clips, it does not scroll. */}
        <div className="relative mt-5 h-[280px] sm:h-[190px] lg:h-[164px]">
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

              {swatch.appliesTo ? (
                <div className="shrink-0 sm:w-60">
                  <h4 className="border-t-2 border-ink/25 pt-2 text-[10px] font-bold uppercase tracking-[0.16em] text-ink/45">
                    {copy.labels.appliedTo}
                  </h4>
                  <p className="mt-2 text-[11px] font-bold uppercase leading-relaxed tracking-[0.1em] text-ink/75">
                    {swatch.appliesTo}
                  </p>

                  {swatch.legendHex && swatch.legendName ? (
                    <p className="mt-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.1em] text-ink/55">
                      <span
                        className="block h-3.5 w-3.5 shrink-0 border"
                        style={{
                          backgroundColor: swatch.legendHex,
                          borderColor: CHIP_BORDER,
                        }}
                        aria-hidden
                      />
                      {copy.labels.legend}: {swatch.legendName}
                    </p>
                  ) : null}
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
            {/* Three across on a phone: at five, each chip is 52px and the
              stand-in's own labels do not fit inside it. */}
            <ul className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
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
      </StationPanel>
    </section>
  );
}
