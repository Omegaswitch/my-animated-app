"use client";

import { useState } from "react";
import type { Kit, ProductSwatch, ProjectCopy, Station } from "@/types/project";
import StationHeader from "./StationHeader";
import { countLabel } from "@/lib/format";

/**
 * Station 3 — the colourway.
 *
 * A strip of all five, always visible, with the detail panel updating in
 * place. A palette is compared, not paged through: seeing them together is
 * the whole point, so nothing here hides the set to show one member of it.
 *
 * Hover previews and click commits, so a pointer can sweep the strip and read
 * each one without a trail of clicks — but the committed choice survives the
 * pointer leaving.
 *
 * The "used on" tags are derived: a swatch knows nothing about where it is
 * used, the kits point at it, and this reads those references back.
 */

export interface ColorsSectionProps {
  swatches: ProductSwatch[];
  kits: Kit[];
  station: Station;
  copy: ProjectCopy;
}

function usedOn(swatch: ProductSwatch, kits: Kit[]): string[] {
  return kits
    .filter((kit) => (kit.swatchIds ?? []).includes(swatch.id))
    .map((kit) => kit.name);
}

export default function ColorsSection({
  swatches,
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
      className="relative flex min-h-screen flex-col justify-center py-24 pl-24 pr-6 sm:pl-28 lg:ml-[50%] lg:pl-16 lg:pr-16"
    >
      <StationHeader
        station={station}
        meta={countLabel(swatches.length, copy.counts.colour)}
      />

      {/* The strip: all five, side by side, always. */}
      <ul
        className="flex w-full border-2 border-ink/30"
        onMouseLeave={() => setHovered(null)}
      >
        {swatches.map((entry, index) => {
          const active = index === activeIndex;
          return (
            <li key={entry.id} className="min-w-0 flex-1">
              <button
                type="button"
                onClick={() => setSelected(index)}
                onMouseEnter={() => setHovered(index)}
                onFocus={() => setHovered(index)}
                onBlur={() => setHovered(null)}
                aria-current={index === selected ? "true" : undefined}
                aria-label={`${entry.name}, ${entry.hex}`}
                className={`block w-full outline-none transition-[height] duration-200 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ink ${
                  active ? "h-28 lg:h-40" : "h-24 lg:h-32"
                }`}
                style={{ backgroundColor: entry.hex }}
              />
            </li>
          );
        })}
      </ul>

      {/* Detail, updated in place. */}
      <div className="mt-6 flex flex-col gap-5 lg:flex-row lg:items-start lg:gap-10">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold uppercase tabular-nums tracking-[0.18em] text-ink/50">
            {String(activeIndex + 1).padStart(2, "0")} / {swatch.code}
          </p>

          <h3 className="mt-2 text-[clamp(1.35rem,2.6vw,2.15rem)] font-bold leading-[1.04] tracking-[-0.02em]">
            {swatch.name}
          </h3>

          <p className="mt-2 text-lg font-bold tabular-nums tracking-[0.04em] text-ink/70">
            {swatch.hex.toUpperCase()}
          </p>

          {swatch.description ? (
            <p className="mt-3 max-w-[42ch] text-sm leading-relaxed text-ink/80">
              {swatch.description}
            </p>
          ) : null}
        </div>

        {tags.length > 0 ? (
          <div className="shrink-0 lg:w-52">
            <h4 className="border-t-2 border-ink/25 pt-3 text-[10px] font-bold uppercase tracking-[0.16em] text-ink/45">
              {copy.labels.usedOn}
            </h4>
            <ul className="mt-2 flex flex-wrap gap-2">
              {tags.map((name) => (
                <li
                  key={name}
                  className="border border-ink/35 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-ink/75"
                >
                  {name}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}
