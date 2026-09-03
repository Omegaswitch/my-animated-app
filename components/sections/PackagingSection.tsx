import type { Dimensions, Packaging, Vendor } from "@/types/project";
import { countLabel } from "@/lib/format";

/**
 * Packaging — what the set arrives in.
 *
 * A spec table, not a gallery. Dimensions are printed in the drafting order
 * (W × H × D) with the weight kept separate, because weight is the figure
 * anyone reshipping a tray actually needs.
 */

export interface PackagingSectionProps {
  packaging: Packaging;
  vendors?: Vendor[];
}

function formatDimensions(dimensions: Dimensions): string {
  return `${dimensions.widthMm} × ${dimensions.heightMm} × ${dimensions.depthMm} mm`;
}

export default function PackagingSection({ packaging, vendors = [] }: PackagingSectionProps) {
  if (packaging.components.length === 0) return null;

  const totalWeight = packaging.components.reduce(
    (sum, component) => sum + (component.dimensions.weightG ?? 0),
    0,
  );

  return (
    <section className="relative z-10 py-32 pl-16 pr-6 sm:pl-20 lg:ml-[50%] lg:pl-16 lg:pr-16">
      <header className="mb-6 flex items-baseline justify-between gap-6 border-b border-ink/20 pb-3">
        <h2 className="text-[10px] uppercase tracking-[0.34em]">{packaging.heading}</h2>
        <span className="text-[10px] uppercase tracking-[0.2em] tabular-nums text-ink/60">
          {countLabel(packaging.components.length, "component")}
        </span>
      </header>

      {packaging.intro ? (
        <p className="mb-14 max-w-[52ch] text-sm leading-relaxed text-ink/80">{packaging.intro}</p>
      ) : null}

      <ul className="border-t border-ink/20">
        {packaging.components.map((component) => {
          const vendor = vendors.find((candidate) => candidate.id === component.vendorId);

          return (
            <li key={component.id} className="border-b border-ink/10 py-6">
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <h3 className="text-lg tracking-tight">{component.name}</h3>
                <span className="text-[10px] uppercase tracking-[0.18em] tabular-nums text-ink/55">
                  {formatDimensions(component.dimensions)}
                </span>
              </div>

              <dl className="mt-3 grid gap-x-8 gap-y-2 text-[10px] uppercase tracking-[0.18em] sm:grid-cols-2">
                <div className="flex justify-between gap-4">
                  <dt className="text-ink/50">Material</dt>
                  <dd className="text-right text-ink/85">{component.material}</dd>
                </div>
                {component.dimensions.weightG !== undefined ? (
                  <div className="flex justify-between gap-4">
                    <dt className="text-ink/50">Weight</dt>
                    <dd className="tabular-nums text-ink/85">{component.dimensions.weightG} g</dd>
                  </div>
                ) : null}
                {component.print ? (
                  <div className="flex justify-between gap-4">
                    <dt className="text-ink/50">Print</dt>
                    <dd className="text-right text-ink/85">{component.print}</dd>
                  </div>
                ) : null}
                {vendor ? (
                  <div className="flex justify-between gap-4">
                    <dt className="text-ink/50">Supplier</dt>
                    <dd className="text-right text-ink/85">{vendor.name}</dd>
                  </div>
                ) : null}
              </dl>
            </li>
          );
        })}
      </ul>

      <div className="mt-6 flex justify-between gap-4 text-[10px] uppercase tracking-[0.2em] text-ink/60">
        <span>Packed weight</span>
        <span className="tabular-nums text-ink">{totalWeight} g</span>
      </div>

      {packaging.notes && packaging.notes.length > 0 ? (
        <ul className="mt-12 flex flex-col gap-2 border-t border-ink/20 pt-6">
          {packaging.notes.map((note) => (
            <li key={note} className="flex gap-3 text-xs leading-relaxed text-ink/70">
              <span aria-hidden className="text-line-secondary">
                —
              </span>
              {note}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
