import type {
  Kit,
  ProductSwatch,
  ProjectCopy,
  RenderGallery,
  Vendor,
} from "@/types/project";
import { countLabel, plainCount } from "@/lib/format";

/**
 * Colours — the finishes the line is made in.
 *
 * The "used on" badges are derived, never authored. A swatch knows nothing
 * about where it is used; the kits and renders point at it, and this section
 * reads those references back. Assign a swatch to a new kit and its badge
 * appears here with no edit to the colour data.
 *
 * A server component: it is a table of facts with no interaction.
 */

export interface ColorsSectionProps {
  swatches: ProductSwatch[];
  kits: Kit[];
  renders: RenderGallery;
  vendors?: Vendor[];
  copy: ProjectCopy;
}

interface SwatchUsage {
  kitNames: string[];
  renderCount: number;
}

function resolveUsage(
  swatch: ProductSwatch,
  kits: Kit[],
  renders: RenderGallery,
): SwatchUsage {
  return {
    kitNames: kits
      .filter((kit) => (kit.swatchIds ?? []).includes(swatch.id))
      .map((kit) => kit.name),
    renderCount: renders.items.filter((item) => item.swatchId === swatch.id)
      .length,
  };
}

function Badge({
  children,
  muted = false,
}: {
  children: string;
  muted?: boolean;
}) {
  return (
    <li
      className={`border px-2 py-1 text-[9px] uppercase tracking-[0.18em] ${
        muted ? "border-ink/20 text-ink/45" : "border-ink/35 text-ink/75"
      }`}
    >
      {children}
    </li>
  );
}

export default function ColorsSection({
  swatches,
  kits,
  renders,
  vendors = [],
  copy,
}: ColorsSectionProps) {
  const labels = copy.swatchLabels;
  if (swatches.length === 0) return null;

  return (
    <section className="relative z-10 py-32 pl-16 pr-6 sm:pl-20 lg:ml-[50%] lg:pl-16 lg:pr-16">
      <header className="mb-16 flex items-baseline justify-between gap-6 border-b border-ink/20 pb-3">
        <h2 className="text-[10px] uppercase tracking-[0.34em]">
          {copy.headings.colors}
        </h2>
        <span className="text-[10px] uppercase tracking-[0.2em] tabular-nums text-ink/60">
          {countLabel(swatches.length, copy.counts.finish)}
        </span>
      </header>

      <ul className="grid gap-x-10 gap-y-16 sm:grid-cols-2">
        {swatches.map((swatch) => {
          const usage = resolveUsage(swatch, kits, renders);
          const vendor = vendors.find(
            (candidate) => candidate.id === swatch.vendorId,
          );
          const hasUsage = usage.kitNames.length > 0 || usage.renderCount > 0;

          return (
            <li key={swatch.id} className="flex flex-col">
              {/* The block is the point — large, flat, unbroken by type. */}
              <div
                className={`h-40 w-full border border-ink/25 lg:h-56 ${
                  swatch.available ? "" : "opacity-45"
                }`}
                style={{ backgroundColor: swatch.hex }}
                aria-hidden
              />

              <div className="mt-4 flex items-baseline justify-between gap-4 border-b border-ink/20 pb-2">
                <h3 className="text-lg tracking-tight">{swatch.name}</h3>
                <span className="shrink-0 text-[10px] uppercase tracking-[0.2em] tabular-nums text-ink/60">
                  {swatch.code}
                </span>
              </div>

              {swatch.description ? (
                <p className="mt-3 max-w-[38ch] text-xs leading-relaxed text-ink/65">
                  {swatch.description}
                </p>
              ) : null}

              {/* Codes: hex always, RAL and Pantone where a match exists. */}
              <dl className="mt-4 space-y-2 text-[10px] uppercase tracking-[0.18em]">
                <div className="flex justify-between gap-4">
                  <dt className="text-ink/50">{labels.hex}</dt>
                  <dd className="tabular-nums text-ink/85">
                    {swatch.hex.toUpperCase()}
                  </dd>
                </div>
                {swatch.references?.ral ? (
                  <div className="flex justify-between gap-4">
                    <dt className="text-ink/50">{labels.ral}</dt>
                    <dd className="text-ink/85">{swatch.references.ral}</dd>
                  </div>
                ) : null}
                {swatch.references?.pantone ? (
                  <div className="flex justify-between gap-4">
                    <dt className="text-ink/50">{labels.pantone}</dt>
                    <dd className="text-ink/85">{swatch.references.pantone}</dd>
                  </div>
                ) : null}
                <div className="flex justify-between gap-4">
                  <dt className="text-ink/50">{labels.finish}</dt>
                  <dd className="text-ink/85">
                    {copy.swatchFinish[swatch.finish]}
                  </dd>
                </div>
                {vendor ? (
                  <div className="flex justify-between gap-4">
                    <dt className="text-ink/50">{labels.finisher}</dt>
                    <dd className="text-ink/85">{vendor.name}</dd>
                  </div>
                ) : null}
              </dl>

              <div className="mt-5">
                <h4 className="text-[9px] uppercase tracking-[0.22em] text-ink/45">
                  {labels.usedOn}
                </h4>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {usage.kitNames.map((name) => (
                    <Badge key={name}>{name}</Badge>
                  ))}
                  {usage.renderCount > 0 ? (
                    <Badge>
                      {plainCount(usage.renderCount, labels.renderCount)}
                    </Badge>
                  ) : null}
                  {!swatch.available ? (
                    <Badge muted>{labels.notReleased}</Badge>
                  ) : null}
                  {!hasUsage ? <Badge muted>{labels.unassigned}</Badge> : null}
                </ul>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
