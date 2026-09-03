import type { Intro } from "@/types/project";

/**
 * Station 1 — where the line starts.
 *
 * A server component: no state, no scroll. The motion on this screen belongs
 * to the identity above it and the route behind it.
 *
 * The origin marker takes its geometry from `lib/route-geometry`, so it lands
 * on the tracks at every breakpoint. If the route moves, this moves with it.
 */

export interface IntroSectionProps {
  intro: Intro;
}

export default function IntroSection({ intro }: IntroSectionProps) {
  return (
    <section className="relative py-24">
      <div className="pl-16 pr-6 sm:pl-20 lg:ml-[50%] lg:pl-16 lg:pr-16">
        {intro.eyebrow ? (
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-ink/60">
            {intro.eyebrow}
          </p>
        ) : null}

        <h1 className="mt-6 max-w-[16ch] text-[clamp(2.25rem,5vw,4.25rem)] font-bold leading-[0.94] tracking-[-0.03em]">
          {intro.headline}
        </h1>

        {intro.subhead ? (
          <p className="mt-6 max-w-[34ch] text-lg leading-snug tracking-tight">
            {intro.subhead}
          </p>
        ) : null}

        <p className="mt-5 max-w-[48ch] text-sm leading-relaxed text-ink/80">
          {intro.lead}
        </p>

        {intro.keyline && intro.keyline.length > 0 ? (
          <dl className="mt-10 grid max-w-lg grid-cols-2 gap-x-8 gap-y-5 border-t-2 border-ink/25 pt-5 sm:grid-cols-4">
            {intro.keyline.map((fact) => (
              <div key={fact.label}>
                <dt className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink/55">
                  {fact.label}
                </dt>
                <dd className="mt-1.5 text-sm font-bold tabular-nums">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>
    </section>
  );
}
