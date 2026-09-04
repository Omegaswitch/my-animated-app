"use client";

import type { Identity } from "@/types/project";
import AssetFrame from "@/components/ui/AssetFrame";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

/**
 * The identity — manufacturer and project marks, held together by the line.
 *
 * It is not a navbar. There is no bar, no backdrop, no menu: the two marks
 * simply ride at the top of the document, prominent while you are in the hero
 * and compact once you have left it.
 *
 * The whole transition is `scale` and `y` on a single element, so it never
 * reflows the hero beneath it — the type does not shift as you scroll. The
 * element is `sticky`, so it occupies real space at the top of the page and
 * the hero lays out around it rather than under it.
 */

export interface StickyIdentityProps {
  manufacturerLabel: string;
  projectLabel: string;
  /**
   * Real artwork, from `project.identity`. Either side may be missing, and
   * that side falls back to its geometric placeholder — so dropping in one
   * logo does not require having the other ready.
   */
  identity?: Identity;
}

/** Both marks render at this height, whatever their intrinsic size. */
const MARK_HEIGHT = 48;

/** Scroll distance, in px, over which the identity settles into its anchor. */
const SETTLE_DISTANCE = 300;
/** Compact size relative to the hero size. */
const COMPACT_SCALE = 0.42;
/** How far the marks sit down into the hero at rest. */
const HERO_DROP = 96;

const SETTLE_SPRING = { stiffness: 120, damping: 28, restDelta: 0.001 };

/* -------------------------------------------------------------------------
 * Placeholder marks
 *
 * Transparent, stroke-only, drawn in `currentColor` so they take the ink and
 * line colours from their container. Geometric stand-ins — replace with the
 * real SVGs, keeping the viewBox aspect so the scaling maths still holds.
 * ----------------------------------------------------------------------- */

function ManufacturerPlaceholder() {
  return (
    <svg
      viewBox="0 0 120 48"
      fill="none"
      role="img"
      aria-label="Manufacturer mark (placeholder)"
      className="h-12 w-auto"
      preserveAspectRatio="xMidYMid meet"
    >
      <rect
        x="0.5"
        y="0.5"
        width="119"
        height="47"
        stroke="currentColor"
        strokeOpacity="0.35"
      />
      <path
        d="M18 34V14l12 13 12-13v20"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
      <path
        d="M54 14v20M54 24h14M68 14v20"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="92" cy="24" r="5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function ProjectPlaceholder() {
  return (
    <svg
      viewBox="0 0 120 48"
      fill="none"
      role="img"
      aria-label="Project mark (placeholder)"
      className="h-12 w-auto"
      preserveAspectRatio="xMidYMid meet"
    >
      <rect
        x="0.5"
        y="0.5"
        width="119"
        height="47"
        stroke="currentColor"
        strokeOpacity="0.35"
      />
      {/* A route with two stops — the project mark echoes the page itself. */}
      <path d="M14 24h92" stroke="currentColor" strokeWidth="1.5" />
      <rect x="26" y="19" width="10" height="10" fill="currentColor" />
      <rect
        x="84"
        y="19"
        width="10"
        height="10"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export default function StickyIdentity({
  manufacturerLabel,
  projectLabel,
  identity,
}: StickyIdentityProps) {
  /* Width is derived from the asset's own ratio at a fixed height, so the two
     marks sit on one baseline no matter how differently they are drawn. */
  const mark = (
    asset: NonNullable<Identity["manufacturer"]>,
    label: string,
  ) => (
    <span
      className="block"
      style={{
        width: (asset.width / asset.height) * MARK_HEIGHT,
        height: MARK_HEIGHT,
      }}
    >
      <AssetFrame
        asset={asset}
        tag={label}
        fill
        sizes={`${MARK_HEIGHT * 4}px`}
      />
    </span>
  );
  const prefersReducedMotion = useReducedMotion() ?? false;

  const { scrollY } = useScroll();
  const settle = useSpring(scrollY, SETTLE_SPRING);

  const scale = useTransform(settle, [0, SETTLE_DISTANCE], [1, COMPACT_SCALE], {
    clamp: true,
  });
  const y = useTransform(settle, [0, SETTLE_DISTANCE], [HERO_DROP, 0], {
    clamp: true,
  });
  // The caption under the marks is hero-only; it fades before the marks finish
  // shrinking so the compact anchor is just the two marks and the rule.
  const captionOpacity = useTransform(
    settle,
    [0, SETTLE_DISTANCE * 0.45],
    [1, 0],
    {
      clamp: true,
    },
  );

  const motionStyle = prefersReducedMotion
    ? { scale: COMPACT_SCALE, y: 0 }
    : { scale, y };

  return (
    <div className="pointer-events-none sticky top-0 z-40 flex w-fit justify-start pt-6 ml-24 mr-6 sm:ml-28 lg:ml-[calc(50%+4rem)] lg:mr-16">
      <motion.div
        className="flex origin-top-left flex-col items-start gap-3 text-ink"
        style={motionStyle}
      >
        <div className="flex items-center gap-6">
          {identity?.manufacturer ? (
            mark(identity.manufacturer, manufacturerLabel)
          ) : (
            <span className="block">
              <ManufacturerPlaceholder />
            </span>
          )}

          {/* The rule between the marks is the line, in miniature. */}
          <span className="block h-10 w-px bg-line-primary" aria-hidden />

          {identity?.project ? (
            mark(identity.project, projectLabel)
          ) : (
            <span className="block">
              <ProjectPlaceholder />
            </span>
          )}
        </div>

        <motion.p
          className="text-[10px] uppercase tracking-[0.34em]"
          style={
            prefersReducedMotion ? { opacity: 0 } : { opacity: captionOpacity }
          }
        >
          {manufacturerLabel} — {projectLabel}
        </motion.p>
      </motion.div>
    </div>
  );
}
