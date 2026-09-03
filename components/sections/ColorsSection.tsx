"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "framer-motion";
import type { Kit, ProductSwatch, ProjectCopy, Station } from "@/types/project";
import StationHeader from "./StationHeader";
import { useStageProgress } from "@/components/layout/StageProgress";
import { FINALE_IN, FINALE_SET, useSequenceSlide } from "@/lib/sequence";
import { countLabel } from "@/lib/format";

/**
 * Station 3 — the colourway, one swatch at a time.
 *
 * The same mechanism as the kits station, deliberately: each colour floats
 * into focus with its reference, hex and the kits it appears on, holds while
 * you read it, then pushes up and out as the next arrives. After the last,
 * all five collapse into a palette strip so the set can be judged together
 * before the line moves on.
 *
 * Timing comes from `useSequenceSlide`, so both stations divide their stage
 * the same way and stay in step if either is ever retimed.
 *
 * The "used on" tags are derived, never authored: a swatch knows nothing
 * about where it is used, the kits point at it, and this reads those
 * references back. Assign a colour to a kit and its tag appears here with no
 * edit to the colour data.
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

/* ---------------------------------------------------------------------------
 * One swatch, in focus
 * ------------------------------------------------------------------------- */

function SwatchSlide({
  swatch,
  index,
  count,
  kits,
  copy,
  progress,
}: {
  swatch: ProductSwatch;
  index: number;
  count: number;
  kits: Kit[];
  copy: ProjectCopy;
  progress: MotionValue<number>;
}) {
  const { opacity, y } = useSequenceSlide(progress, index, count);
  const tags = usedOn(swatch, kits);

  return (
    <motion.article
      style={{ opacity, y }}
      className="absolute inset-x-0 top-1/2 -translate-y-1/2 will-change-transform"
      data-swatch-slide={swatch.code}
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:gap-8">
        {/* The chip is the point: flat, unbroken, large. */}
        <div
          className="h-36 w-full shrink-0 border border-ink/30 lg:h-52 lg:w-1/2"
          style={{ backgroundColor: swatch.hex }}
          aria-hidden
        />

        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] tabular-nums text-ink/50">
            {String(index + 1).padStart(2, "0")} / {swatch.code}
          </p>

          <h3 className="mt-2 text-[clamp(1.35rem,2.6vw,2.15rem)] font-bold leading-[1.04] tracking-[-0.02em]">
            {swatch.name}
          </h3>

          <p className="mt-2 text-lg font-bold tabular-nums tracking-[0.04em] text-ink/70">
            {swatch.hex.toUpperCase()}
          </p>

          {swatch.description ? (
            <p className="mt-3 max-w-[40ch] text-sm leading-relaxed text-ink/80">
              {swatch.description}
            </p>
          ) : null}

          {tags.length > 0 ? (
            <div className="mt-5 border-t-2 border-ink/25 pt-3">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink/45">
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
      </div>
    </motion.article>
  );
}

/* ---------------------------------------------------------------------------
 * The station
 * ------------------------------------------------------------------------- */

export default function ColorsSection({
  swatches,
  kits,
  station,
  copy,
}: ColorsSectionProps) {
  const prefersReducedMotion = useReducedMotion() ?? false;

  /* Outside a stage — or under reduced motion — there is no sequence to run.
     The fallback holds progress at the finale, so the station degrades to the
     full palette strip rather than to a blank frame. */
  const staged = useStageProgress();
  const fallback = useMotionValue(1);
  const progress = staged && !prefersReducedMotion ? staged : fallback;

  const stripOpacity = useTransform(progress, [FINALE_IN, FINALE_SET], [0, 1], {
    clamp: true,
  });
  const stripScale = useTransform(
    progress,
    [FINALE_IN, FINALE_SET],
    [0.92, 1],
    { clamp: true },
  );

  if (swatches.length === 0) return null;

  return (
    <section className="relative py-24 pl-24 pr-6 sm:pl-28 lg:ml-[50%] lg:pl-16 lg:pr-16">
      <StationHeader
        station={station}
        meta={countLabel(swatches.length, copy.counts.colour)}
      />

      {/* One centred frame. Slides and the strip stack inside it, so the
          sequence never changes the section's height. */}
      <div className="relative h-[58vh] min-h-[360px]">
        {swatches.map((swatch, index) => (
          <SwatchSlide
            key={swatch.id}
            swatch={swatch}
            index={index}
            count={swatches.length}
            kits={kits}
            copy={copy}
            progress={progress}
          />
        ))}

        {/* Finale: the whole palette, side by side. */}
        <motion.div
          style={{ opacity: stripOpacity, scale: stripScale }}
          className="absolute inset-x-0 top-1/2 -translate-y-1/2 will-change-transform"
          data-palette-strip
        >
          <ul className="flex w-full border border-ink/30">
            {swatches.map((swatch) => (
              <li key={swatch.id} className="flex-1">
                <div
                  className="h-28 w-full lg:h-40"
                  style={{ backgroundColor: swatch.hex }}
                  aria-hidden
                />
              </li>
            ))}
          </ul>
          <ul className="mt-3 flex w-full gap-2">
            {swatches.map((swatch) => (
              <li key={swatch.id} className="min-w-0 flex-1">
                <p className="truncate text-[10px] font-bold uppercase tracking-[0.08em]">
                  {swatch.name}
                </p>
                <p className="mt-0.5 text-[10px] tabular-nums tracking-[0.04em] text-ink/55">
                  {swatch.hex.toUpperCase()}
                </p>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
