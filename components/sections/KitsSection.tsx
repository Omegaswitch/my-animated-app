"use client";

import { useState } from "react";
import type { Kit, KitAvailability, ProductSwatch } from "@/types/project";
import AssetFrame from "@/components/ui/AssetFrame";
import Lightbox from "@/components/ui/Lightbox";
import { countLabel, formatPrice } from "@/lib/format";

/**
 * Kits — the configurations the line ships in.
 *
 * The layout is chosen by how many kits there are, not forced into a grid of
 * identical cards:
 *
 *   1 kit   — a single feature, image and specification side by side
 *   2 kits  — an asymmetric pair, 7/5, so neither reads as a repeat
 *   3+ kits — the first is featured, the rest run beneath it at a smaller
 *             emphasis, which also absorbs a fourth or tenth kit without
 *             changing shape
 *
 * A kit with no image is not given an empty frame; it simply lays out as text.
 */

export interface KitsSectionProps {
  kits: Kit[];
  swatches: ProductSwatch[];
  heading?: string;
}

type Emphasis = "feature" | "standard";

const AVAILABILITY_LABEL: Record<KitAvailability, string> = {
  "in-development": "In development",
  sampling: "Sampling",
  released: "Released",
  archived: "Archived",
};

function KitBlock({
  kit,
  swatches,
  emphasis,
  onOpenImage,
}: {
  kit: Kit;
  swatches: ProductSwatch[];
  emphasis: Emphasis;
  onOpenImage: (kit: Kit) => void;
}) {
  const isFeature = emphasis === "feature";
  const kitSwatches = (kit.swatchIds ?? [])
    .map((id) => swatches.find((swatch) => swatch.id === id))
    .filter((swatch): swatch is ProductSwatch => Boolean(swatch));

  return (
    <article className="flex flex-col gap-5">
      {kit.image ? (
        <button
          type="button"
          onClick={() => onOpenImage(kit)}
          className="group block w-full text-left outline-none focus-visible:ring-1 focus-visible:ring-line-primary"
          aria-label={`View ${kit.name} full size`}
        >
          <AssetFrame
            asset={kit.image}
            tag={kit.code}
            className="transition-opacity group-hover:opacity-85"
            sizes={isFeature ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 100vw"}
          />
        </button>
      ) : null}

      <div>
        <div className="flex items-baseline justify-between gap-4 border-b border-ink/20 pb-2">
          <h3
            className={
              isFeature
                ? "text-3xl tracking-tight lg:text-4xl"
                : "text-xl tracking-tight lg:text-2xl"
            }
          >
            {kit.name}
          </h3>
          <span className="shrink-0 text-[10px] uppercase tracking-[0.2em] text-ink/60 tabular-nums">
            {kit.code}
          </span>
        </div>

        <p
          className={`mt-4 leading-relaxed text-ink/80 ${
            isFeature ? "max-w-[52ch] text-base" : "max-w-[44ch] text-sm"
          }`}
        >
          {kit.summary}
        </p>

        <dl className="mt-6 flex flex-wrap items-baseline gap-x-8 gap-y-3 text-[10px] uppercase tracking-[0.2em] text-ink/60">
          <div>
            <dt className="sr-only">Availability</dt>
            <dd>{AVAILABILITY_LABEL[kit.availability]}</dd>
          </div>
          {/* Price is omitted entirely while a kit is unpriced. */}
          {kit.priceMinor !== undefined && kit.currency ? (
            <div>
              <dt className="sr-only">Price</dt>
              <dd className="tabular-nums text-ink">
                {formatPrice(kit.priceMinor, kit.currency)}
              </dd>
            </div>
          ) : null}
          <div>
            <dt className="sr-only">Line</dt>
            <dd>{kit.line === "primary" ? "Line A" : "Line B"}</dd>
          </div>
        </dl>

        {kitSwatches.length > 0 ? (
          <ul className="mt-5 flex flex-wrap items-center gap-2">
            {kitSwatches.map((swatch) => (
              <li key={swatch.id} className="flex items-center gap-2">
                <span
                  className="block h-3 w-3 border border-ink/25"
                  style={{ backgroundColor: swatch.hex }}
                  aria-hidden
                />
                <span className="text-[10px] uppercase tracking-[0.16em] text-ink/60">
                  {swatch.name}
                </span>
              </li>
            ))}
          </ul>
        ) : null}

        <ul className="mt-6 divide-y divide-ink/10 border-t border-ink/10">
          {kit.contents.map((component) => (
            <li
              key={component.name}
              className="flex items-baseline justify-between gap-4 py-2 text-sm"
            >
              <span className="text-ink/85">
                {component.name}
                {component.material ? (
                  <span className="text-ink/50"> — {component.material}</span>
                ) : null}
              </span>
              <span className="shrink-0 tabular-nums text-ink/60">×{component.quantity}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export default function KitsSection({ kits, swatches, heading = "Kits" }: KitsSectionProps) {
  const [activeKit, setActiveKit] = useState<Kit | null>(null);

  if (kits.length === 0) return null;

  const [first, ...rest] = kits;

  return (
    <section className="relative z-10 py-32 pl-16 pr-6 sm:pl-20 lg:ml-[50%] lg:pl-16 lg:pr-16">
      <header className="mb-16 flex items-baseline justify-between gap-6 border-b border-ink/20 pb-3">
        <h2 className="text-[10px] uppercase tracking-[0.34em]">{heading}</h2>
        <span className="text-[10px] uppercase tracking-[0.2em] tabular-nums text-ink/60">
          {countLabel(kits.length, "configuration")}
        </span>
      </header>

      {kits.length === 1 ? (
        <KitBlock kit={first} swatches={swatches} emphasis="feature" onOpenImage={setActiveKit} />
      ) : kits.length === 2 ? (
        // Deliberately unequal: a 7/5 split reads as an editorial pair rather
        // than two of the same thing.
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <KitBlock kit={first} swatches={swatches} emphasis="feature" onOpenImage={setActiveKit} />
          </div>
          <div className="lg:col-span-5 lg:pt-16">
            <KitBlock
              kit={rest[0]}
              swatches={swatches}
              emphasis="standard"
              onOpenImage={setActiveKit}
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-20">
          <KitBlock kit={first} swatches={swatches} emphasis="feature" onOpenImage={setActiveKit} />
          <div className="grid gap-x-12 gap-y-20 sm:grid-cols-2">
            {rest.map((kit) => (
              <KitBlock
                key={kit.id}
                kit={kit}
                swatches={swatches}
                emphasis="standard"
                onOpenImage={setActiveKit}
              />
            ))}
          </div>
        </div>
      )}

      <Lightbox
        open={activeKit !== null}
        onClose={() => setActiveKit(null)}
        title={activeKit?.name ?? ""}
        meta={activeKit?.code}
        caption={activeKit?.image?.caption ?? activeKit?.summary}
      >
        {activeKit?.image ? (
          <AssetFrame asset={activeKit.image} tag={activeKit.code} sizes="90vw" />
        ) : null}
      </Lightbox>
    </section>
  );
}
