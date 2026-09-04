import type {
  Identity,
  Intro,
  Meta,
  ProjectCopy,
  Station,
} from "@/types/project";
import AssetFrame from "@/components/ui/AssetFrame";
import StationHeader from "./StationHeader";
import StationPanel from "@/components/layout/StationPanel";

/**
 * Station 1 — where the line starts.
 *
 * A server component: no state, no scroll. Nothing on this screen moves; the
 * route behind it does.
 *
 * The two marks are centred at the top of the card. They used to ride the
 * page in a sticky header, shrinking as you scrolled away from the hero,
 * which put a scroll-driven scale on the one element that should be the
 * steadiest thing here — and left them small by the time you could read
 * anything. They are full size and still, stated once.
 *
 * The origin marker takes its geometry from `lib/route-geometry`, so it lands
 * on the tracks at every breakpoint. If the route moves, this moves with it.
 */

export interface IntroSectionProps {
  intro: Intro;
  meta: Meta;
  station: Station;
  /**
   * Real artwork. Either side may be missing, and that side falls back to
   * a frame, so dropping in one mark does not require having the other.
   */
  identity: Identity;
  copy: ProjectCopy;
}

/**
 * The box both marks are fitted into, rather than a height they are set to.
 * A mark keeps its own proportions and grows until it meets one of these.
 */
const MARK_BOX =
  "max-h-9 max-w-[130px] sm:max-h-12 sm:max-w-[200px] lg:max-h-14 lg:max-w-[240px]";

export default function IntroSection({
  intro,
  meta,
  station,
  identity,
  copy,
}: IntroSectionProps) {
  return (
    <section className="relative py-12 lg:py-[45vh]">
      <StationPanel routeSide="left">
        {identity.manufacturer || identity.project ? (
          <div className="mb-10 flex w-full flex-wrap items-center justify-center gap-x-5 gap-y-4 sm:gap-x-8 lg:mb-12">
            {identity.manufacturer ? (
              <AssetFrame
                asset={identity.manufacturer}
                tag={meta.studio ?? meta.name}
                className={MARK_BOX}
                natural
                priority
                sizes="240px"
              />
            ) : null}

            {/* The rule between the marks is the line, in miniature. */}
            {identity.manufacturer && identity.project ? (
              <span
                className="hidden h-8 w-px shrink-0 bg-line-primary sm:block sm:h-10"
                aria-hidden
              />
            ) : null}

            {identity.project ? (
              <AssetFrame
                asset={identity.project}
                tag={meta.name}
                className={MARK_BOX}
                natural
                priority
                sizes="240px"
              />
            ) : null}
          </div>
        ) : null}

        <StationHeader station={station} />

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
