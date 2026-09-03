"use client";

import { useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "framer-motion";
import type { Kit, ProductSwatch, ProjectCopy, Station } from "@/types/project";
import AssetFrame from "@/components/ui/AssetFrame";
import Lightbox from "@/components/ui/Lightbox";
import StationHeader from "./StationHeader";
import { useStageProgress } from "@/components/layout/StageProgress";
import { countLabel, formatPrice } from "@/lib/format";

/**
 * Station 2 — the kits, as a vertical product sequence.
 *
 * The station's track is five viewports tall and this section choreographs
 * the pinned span of it. Each kit takes the centre of the screen in turn,
 * locks while you read it, then pushes up and out as the next slides in from
 * below. After the fourth, all four rearrange into an overview so the
 * collection can be seen at a glance before the station is left behind.
 *
 *   0%  – 20%   Kit 1 held
 *   20% – 40%   Kit 1 out / Kit 2 in
 *   40% – 60%   Kit 2 out / Kit 3 in
 *   60% – 80%   Kit 3 out / Kit 4 in
 *   80% – 95%   the four collapse into the overview grid
 *   95% – 100%  the stage itself recedes — `StationStage` owns that part
 *
 * The percentages come from `useStageProgress`, which reads 0 the instant the
 * pane pins and 1 when it unpins, so they mean what they say regardless of
 * how tall the track is.
 *
 * Slides are absolutely positioned inside one centred frame, so exactly one
 * is legible at a time and nothing reflows as the sequence runs — every step
 * is transform and opacity only.
 */

export interface KitsSectionProps {
  kits: Kit[];
  swatches: ProductSwatch[];
  station: Station;
  copy: ProjectCopy;
}

/** Each kit owns a fifth of the sequence; the overview takes the rest. */
const STEP = 0.2;
/** How far before and after its slot a slide travels. */
const LEAD = 0.06;
const LAG = 0.02;
/** Vertical travel of a slide entering and leaving, in percent of its height. */
const TRAVEL = 65;

const OVERVIEW_IN = 0.78;
const OVERVIEW_SET = 0.88;

function swatchesFor(kit: Kit, swatches: ProductSwatch[]) {
  return (kit.swatchIds ?? [])
    .map((id) => swatches.find((swatch) => swatch.id === id))
    .filter((swatch): swatch is ProductSwatch => Boolean(swatch));
}

/* ---------------------------------------------------------------------------
 * One slide
 * ------------------------------------------------------------------------- */

function KitSlide({
  kit,
  index,
  swatches,
  copy,
  progress,
  onOpenImage,
}: {
  kit: Kit;
  index: number;
  swatches: ProductSwatch[];
  copy: ProjectCopy;
  progress: MotionValue<number>;
  onOpenImage: (kit: Kit) => void;
}) {
  const enter = index * STEP;
  const leave = (index + 1) * STEP;
  const isFirst = index === 0;

  /* The first kit is already on screen when the station arrives — it has
     nothing to slide in from, so its entry keyframes sit at zero. */
  const stops = isFirst
    ? [0, 0.001, leave - LEAD, leave + LAG]
    : [enter - LEAD, enter + LAG, leave - LEAD, leave + LAG];

  const opacity = useTransform(
    progress,
    stops,
    isFirst ? [1, 1, 1, 0] : [0, 1, 1, 0],
    { clamp: true },
  );
  const y = useTransform(
    progress,
    stops,
    isFirst ? [0, 0, 0, -TRAVEL] : [TRAVEL, 0, 0, -TRAVEL],
    { clamp: true },
  );

  const kitSwatches = swatchesFor(kit, swatches);

  return (
    <motion.article
      style={{ opacity, y }}
      className="absolute inset-x-0 top-1/2 -translate-y-1/2 will-change-transform"
      data-kit-slide={kit.code}
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:gap-8">
        {kit.image ? (
          <button
            type="button"
            onClick={() => onOpenImage(kit)}
            className="group block w-full shrink-0 text-left outline-none focus-visible:ring-2 focus-visible:ring-line-primary lg:w-1/2"
            aria-label={`View ${kit.name} full size`}
          >
            <AssetFrame
              asset={kit.image}
              tag={kit.code}
              placeholderLabel={copy.labels.assetPlaceholder}
              className="transition-opacity group-hover:opacity-85"
              sizes="(min-width: 1024px) 24vw, 90vw"
            />
          </button>
        ) : null}

        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] tabular-nums text-ink/50">
            {String(index + 1).padStart(2, "0")} / {kit.code}
          </p>

          <h3 className="mt-2 text-[clamp(1.5rem,3vw,2.5rem)] font-bold leading-[1.02] tracking-[-0.02em]">
            {kit.name}
          </h3>

          <p className="mt-3 max-w-[40ch] text-sm leading-relaxed text-ink/80">
            {kit.summary}
          </p>

          <dl className="mt-5 flex flex-wrap items-baseline gap-x-6 gap-y-2 border-t-2 border-ink/25 pt-3 text-[11px] font-bold uppercase tracking-[0.12em] text-ink/60">
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

          {kitSwatches.length > 0 ? (
            <ul className="mt-4 flex flex-wrap items-center gap-2">
              {kitSwatches.map((swatch) => (
                <li key={swatch.id} className="flex items-center gap-1.5">
                  <span
                    className="block h-4 w-4 border border-ink/30"
                    style={{ backgroundColor: swatch.hex }}
                    aria-hidden
                  />
                  <span className="text-[10px] uppercase tracking-[0.1em] text-ink/55">
                    {swatch.name}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
}

/* ---------------------------------------------------------------------------
 * The section
 * ------------------------------------------------------------------------- */

export default function KitsSection({
  kits,
  swatches,
  station,
  copy,
}: KitsSectionProps) {
  const [activeKit, setActiveKit] = useState<Kit | null>(null);
  const prefersReducedMotion = useReducedMotion() ?? false;

  /* Outside a stage — or under reduced motion — there is no sequence to run.
     The fallback holds progress at the finale, so the section degrades to the
     full overview rather than to a blank frame. */
  const staged = useStageProgress();
  const fallback = useMotionValue(1);
  const progress = staged && !prefersReducedMotion ? staged : fallback;

  const overviewOpacity = useTransform(
    progress,
    [OVERVIEW_IN, OVERVIEW_SET],
    [0, 1],
    {
      clamp: true,
    },
  );
  const overviewScale = useTransform(
    progress,
    [OVERVIEW_IN, OVERVIEW_SET],
    [0.92, 1],
    {
      clamp: true,
    },
  );

  if (kits.length === 0) return null;

  return (
    <section className="relative py-24 pl-24 pr-6 sm:pl-28 lg:ml-[50%] lg:pl-16 lg:pr-16">
      <StationHeader
        station={station}
        meta={countLabel(kits.length, copy.counts.kit)}
      />

      {/* One centred frame. Slides and the overview stack inside it, so the
          sequence never changes the section's height. */}
      <div className="relative h-[58vh] min-h-[360px]">
        {kits.map((kit, index) => (
          <KitSlide
            key={kit.id}
            kit={kit}
            index={index}
            swatches={swatches}
            copy={copy}
            progress={progress}
            onOpenImage={setActiveKit}
          />
        ))}

        {/* Finale: the whole collection at a glance. */}
        <motion.ul
          style={{ opacity: overviewOpacity, scale: overviewScale }}
          className="absolute inset-x-0 top-1/2 grid -translate-y-1/2 grid-cols-2 gap-x-4 gap-y-5 will-change-transform"
          data-kit-overview
        >
          {kits.map((kit) => (
            <li key={kit.id} className="flex flex-col">
              {kit.image ? (
                <button
                  type="button"
                  onClick={() => setActiveKit(kit)}
                  className="group block w-full text-left outline-none focus-visible:ring-2 focus-visible:ring-line-primary"
                  aria-label={`View ${kit.name} full size`}
                >
                  <AssetFrame
                    asset={kit.image}
                    tag={kit.code}
                    placeholderLabel={copy.labels.assetPlaceholder}
                    className="transition-opacity group-hover:opacity-85"
                    sizes="(min-width: 1024px) 12vw, 45vw"
                  />
                </button>
              ) : null}
              <div className="mt-2 flex items-baseline justify-between gap-2 border-t border-ink/20 pt-1.5">
                <h3 className="text-xs font-bold tracking-tight">{kit.name}</h3>
                <span className="shrink-0 text-[10px] font-bold uppercase tabular-nums tracking-[0.1em] text-ink/50">
                  {kit.capCount}
                </span>
              </div>
            </li>
          ))}
        </motion.ul>
      </div>

      <Lightbox
        open={activeKit !== null}
        onClose={() => setActiveKit(null)}
        title={activeKit?.name ?? ""}
        meta={activeKit?.code}
        caption={activeKit?.summary}
      >
        {activeKit?.image ? (
          <AssetFrame
            asset={activeKit.image}
            tag={activeKit.code}
            placeholderLabel={copy.labels.assetPlaceholder}
            sizes="90vw"
          />
        ) : null}
      </Lightbox>
    </section>
  );
}
