import type { ProductInfo } from "@/types/project";
import { countLabel } from "@/lib/format";

/**
 * Specification — the spec tables.
 *
 * Groups are authored, not fixed: a new block of rows appears here by being
 * added to `info.groups`, with no layout change. Each group declares which
 * line it belongs to, and takes its rule colour from that rather than from a
 * hard-coded value.
 */

export interface ProductInfoSectionProps {
  info: ProductInfo;
}

const LINE_RULE = {
  primary: "border-line-primary",
  secondary: "border-line-secondary",
} as const;

export default function ProductInfoSection({ info }: ProductInfoSectionProps) {
  if (info.groups.length === 0) return null;

  return (
    <section className="relative z-10 py-32 pl-16 pr-6 sm:pl-20 lg:ml-[50%] lg:pl-16 lg:pr-16">
      <header className="mb-6 flex items-baseline justify-between gap-6 border-b border-ink/20 pb-3">
        <h2 className="text-[10px] uppercase tracking-[0.34em]">{info.heading}</h2>
        <span className="text-[10px] uppercase tracking-[0.2em] tabular-nums text-ink/60">
          {countLabel(info.groups.length, "table")}
        </span>
      </header>

      {info.intro ? (
        <p className="mb-14 max-w-[52ch] text-sm leading-relaxed text-ink/80">{info.intro}</p>
      ) : null}

      <div className="grid gap-x-12 gap-y-14 sm:grid-cols-2">
        {info.groups.map((group) => (
          <div key={group.id}>
            <h3
              className={`border-t-2 pt-3 text-[10px] uppercase tracking-[0.28em] ${
                LINE_RULE[group.line ?? "primary"]
              }`}
            >
              {group.heading}
            </h3>
            <dl className="mt-4">
              {group.rows.map((row) => (
                <div
                  key={row.label}
                  className="flex items-baseline justify-between gap-4 border-b border-ink/10 py-2"
                >
                  <dt className="text-[10px] uppercase tracking-[0.18em] text-ink/50">
                    {row.label}
                  </dt>
                  <dd className="text-right text-sm tabular-nums text-ink/85">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>

      {info.materials && info.materials.length > 0 ? (
        <div className="mt-16 border-t border-ink/20 pt-6">
          <h3 className="text-[10px] uppercase tracking-[0.28em] text-ink/50">Materials</h3>
          <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
            {info.materials.map((material) => (
              <li key={material} className="text-xs text-ink/75">
                {material}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {info.dimensions ? (
        <p className="mt-8 text-[10px] uppercase tracking-[0.2em] tabular-nums text-ink/60">
          {info.dimensions.widthMm} × {info.dimensions.heightMm} × {info.dimensions.depthMm} mm
          {info.dimensions.weightG !== undefined ? ` · ${info.dimensions.weightG} g` : ""}
        </p>
      ) : null}
    </section>
  );
}
