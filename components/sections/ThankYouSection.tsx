import type { Logo, Meta } from "@/types/project";
import AssetFrame from "@/components/ui/AssetFrame";

/**
 * Thank you — the terminus.
 *
 * Both rails end here. The marker is two filled dots, one centred on each
 * rail, so it reads as `● ●` at the exact x of the lines above it. The
 * geometry is copied from `LineRoute`: a 8px-wide track with a rail on each
 * edge, positioned `left-6 / sm:left-8 / lg:centred`. If the route moves,
 * this must move with it — as must the hero's origin marker.
 *
 * Termini are drawn as circles where stations are squares, which is the
 * convention on a printed map: a stop you pass through is a tick, a stop the
 * line ends at is a disc.
 */

export interface ThankYouSectionProps {
  meta: Meta;
  logos: Logo[];
  /** Overrides the default closing line. */
  message?: string;
  /** Logo ids to print as credits, in order. Defaults to all logos. */
  creditIds?: string[];
}

export default function ThankYouSection({
  meta,
  logos,
  message,
  creditIds,
}: ThankYouSectionProps) {
  const credits = creditIds
    ? creditIds
        .map((id) => logos.find((logo) => logo.id === id))
        .filter((logo): logo is Logo => Boolean(logo))
    : logos;

  return (
    // The section stays full width so the terminal marker can be positioned
    // against the viewport, exactly as the rails are. The editorial offset is
    // applied to the content below instead. Putting `lg:ml-[50%]` on the
    // section itself would offset the marker a second time and throw it off
    // the line by half the viewport.
    <section className="relative z-10">
      {/* Terminal marker — the two rails, ended. */}
      <div className="pointer-events-none absolute left-6 top-32 sm:left-8 lg:left-1/2 lg:-translate-x-1/2">
        <div className="relative h-1.5 w-2">
          <span className="absolute left-0 top-0 block h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-line-primary" />
          <span className="absolute right-0 top-0 block h-1.5 w-1.5 translate-x-1/2 rounded-full bg-line-secondary" />
        </div>
      </div>

      <div className="pb-40 pl-16 pr-6 pt-32 sm:pl-20 lg:ml-[50%] lg:pl-16 lg:pr-16">
        <p className="text-[10px] uppercase tracking-[0.34em] text-ink/60">
          Terminus — {meta.code}
        </p>

        <h2 className="mt-8 max-w-[18ch] text-[clamp(2rem,4.5vw,3.5rem)] font-medium leading-[0.95] tracking-[-0.03em]">
          Thank you for riding Line A
        </h2>

        <p className="mt-8 max-w-[46ch] text-sm leading-relaxed text-ink/80">
          {message ??
            `${meta.name} exists because people backed it before it was a thing you could hold. ${meta.studio ? `Manufactured by ${meta.studio}.` : ""}`}
        </p>

        {credits.length > 0 ? (
          <div className="mt-20 border-t border-ink/20 pt-8">
            <h3 className="text-[10px] uppercase tracking-[0.28em] text-ink/50">
              Credits
            </h3>
            <ul className="mt-6 flex flex-wrap items-end gap-x-12 gap-y-8">
              {credits.map((logo) => (
                <li key={logo.id} className="flex flex-col gap-2">
                  <AssetFrame
                    asset={logo.asset}
                    tag={logo.variant}
                    className="w-32"
                    sizes="128px"
                  />
                  <span className="text-[9px] uppercase tracking-[0.18em] text-ink/50">
                    {logo.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <p className="mt-16 text-[10px] uppercase tracking-[0.2em] text-ink/45">
          {meta.name} · {meta.year}
        </p>
      </div>
    </section>
  );
}
