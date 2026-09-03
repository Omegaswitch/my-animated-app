import type { Hero, Meta } from "@/types/project";

/**
 * The hero — where the line starts.
 *
 * A server component: it holds no state and reads no scroll, so it stays out
 * of the client bundle. The motion on this screen belongs to `StickyIdentity`
 * above it and `LineRoute` behind it.
 *
 * The origin marker deliberately repeats the rail's positioning classes
 * (`left-6 sm:left-8 lg:left-1/2 lg:-translate-x-1/2`) so the node lands on
 * the rail at every breakpoint. If the route ever moves, both must move.
 */

export interface HeroSectionProps {
  hero: Hero;
  meta: Meta;
}

export default function HeroSection({ hero, meta }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen">
      {/* Content clears the rail on mobile and sits right of centre on desktop,
          leaving the left half as whitespace. */}
      <div className="flex min-h-screen flex-col justify-end pb-32 pl-16 pr-6 pt-40 sm:pl-20 lg:ml-[50%] lg:pl-16 lg:pr-16">
        {hero.eyebrow ? (
          <p className="text-[10px] uppercase tracking-[0.34em] text-ink/70">{hero.eyebrow}</p>
        ) : null}

        <h1 className="mt-8 max-w-[16ch] text-[clamp(2.5rem,6vw,5.25rem)] font-medium leading-[0.92] tracking-[-0.03em]">
          {hero.headline}
        </h1>

        {hero.subhead ? (
          <p className="mt-8 max-w-[32ch] text-lg leading-snug tracking-tight">{hero.subhead}</p>
        ) : null}

        <p className="mt-6 max-w-[46ch] text-sm leading-relaxed text-ink/80">{hero.lead}</p>

        {hero.keyline && hero.keyline.length > 0 ? (
          <dl className="mt-16 grid max-w-lg grid-cols-2 gap-x-8 gap-y-6 border-t border-ink/20 pt-6 sm:grid-cols-4">
            {hero.keyline.map((fact) => (
              <div key={fact.label}>
                <dt className="text-[10px] uppercase tracking-[0.22em] text-ink/60">
                  {fact.label}
                </dt>
                <dd className="mt-2 text-sm tabular-nums">{fact.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>

      {/* Line origin — the first node of the route, printed like a datum. */}
      <div className="pointer-events-none absolute bottom-10 left-6 sm:left-8 lg:left-1/2 lg:-translate-x-1/2">
        <div className="relative flex w-2 justify-center">
          <span className="block h-2 w-2 bg-line-primary" aria-hidden />
          <span className="absolute left-5 top-1/2 -translate-y-1/2 whitespace-nowrap text-[10px] uppercase tracking-[0.22em] text-ink/60">
            Origin — {meta.code} / {meta.year}
          </span>
        </div>
      </div>
    </section>
  );
}
