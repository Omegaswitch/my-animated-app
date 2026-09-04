import type { Intro, Meta, ProjectCopy, Station } from "@/types/project";
import StationHeader from "./StationHeader";
import StationPanel from "@/components/layout/StationPanel";

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
  meta: Meta;
  station: Station;
  copy: ProjectCopy;
}

export default function IntroSection({
  intro,
  meta,
  station,
  copy,
}: IntroSectionProps) {
  return (
    <section className="relative flex min-h-screen flex-col justify-center py-24">
      <StationPanel routeSide="left" alwaysExpanded>
        <StationHeader station={station} meta={meta.year} />

        {intro.eyebrow ? (
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-ink/60">
            {intro.eyebrow}
          </p>
        ) : null}

        <h1 className="max-w-[16ch] max-w-[16ch] text-[clamp(2.5rem,5.6vw,5rem)] font-bold leading-[0.94] tracking-[-0.03em]">
          {intro.headline}
        </h1>

        {intro.subhead ? (
          <p className="mt-7 max-w-[34ch] text-xl leading-snug tracking-tight">
            {intro.subhead}
          </p>
        ) : null}

        <p className="mt-6 max-w-[50ch] text-base leading-relaxed text-ink/80">
          {intro.lead}
        </p>

        {/* Omitted entirely when no invite is set in the data. */}
        {meta.discordUrl ? (
          <a
            href={meta.discordUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex w-fit items-center gap-2.5 border-2 border-ink/30 px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.16em] outline-none transition-colors hover:border-line-primary hover:text-line-primary focus-visible:ring-2 focus-visible:ring-line-primary"
          >
            <svg
              viewBox="0 0 24 18"
              className="h-4 w-auto"
              fill="currentColor"
              aria-hidden
            >
              <path d="M20.3 1.6A19.8 19.8 0 0 0 15.4.2l-.3.5c1.6.4 3 1 4.4 1.8a16.7 16.7 0 0 0-14.9 0A17 17 0 0 1 9 .7L8.6.2A19.7 19.7 0 0 0 3.7 1.6C.6 6.2-.3 10.7.2 15.1a19.9 19.9 0 0 0 6 3l1.2-1.9c-1-.4-2-.9-2.8-1.5l.7-.5a14.2 14.2 0 0 0 13.4 0l.7.5c-.9.6-1.8 1.1-2.8 1.5l1.3 1.9a19.8 19.8 0 0 0 6-3c.6-5.1-.9-9.6-3.6-13.5ZM8 12.3c-1.2 0-2.1-1.1-2.1-2.4C5.9 8.6 6.8 7.5 8 7.5s2.2 1.1 2.2 2.4c0 1.3-1 2.4-2.2 2.4Zm8 0c-1.2 0-2.1-1.1-2.1-2.4 0-1.3.9-2.4 2.1-2.4s2.2 1.1 2.2 2.4c0 1.3-1 2.4-2.2 2.4Z" />
            </svg>
            {copy.labels.discord}
            <span className="sr-only"> ({copy.labels.opensInNewTab})</span>
          </a>
        ) : null}

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
      </StationPanel>
    </section>
  );
}
