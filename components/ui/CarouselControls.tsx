"use client";

import type { Carousel } from "@/lib/useCarousel";
import type { ProjectCopy } from "@/types/project";

/**
 * Arrows and a counter for a gallery.
 *
 * Centred under the image rather than ranged left: the control belongs to the
 * picture above it, and a centred picture with left-hung arrows reads as two
 * unrelated blocks.
 *
 * There used to be a row of pills as well, one per item. Both galleries name
 * what they are showing directly above these controls — the kit with its
 * price, the render with its board — so the pills repeated a name already on
 * screen, under a counter already giving the position. Four labelled boxes to
 * say what the line above them said better.
 *
 * The arrows are 48px. They were 32px, which is under every touch-target
 * guideline going and awkward with a mouse too — with the pills gone this is
 * the only way through a gallery by pointer, so it should be the easiest thing
 * on the page to hit.
 *
 * Arrow keys are handled globally by `useCarousel`; these are the pointer
 * equivalents.
 */

export interface CarouselControlsProps {
  carousel: Carousel;
  /** How many items there are. Drives the counter. */
  count: number;
  copy: ProjectCopy;
}

const ARROW_CLASS =
  "flex h-12 w-12 shrink-0 items-center justify-center border-2 border-ink/40 text-lg font-bold leading-none text-ink outline-none transition-colors hover:border-line-primary hover:bg-line-primary hover:text-paper focus-visible:ring-2 focus-visible:ring-line-primary";

export default function CarouselControls({
  carousel,
  count,
  copy,
}: CarouselControlsProps) {
  if (count < 2) return null;

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="mt-6 flex items-center justify-center gap-4 border-t-2 border-ink/25 pt-5">
      <button
        type="button"
        onClick={carousel.previous}
        aria-label={copy.labels.previous}
        className={ARROW_CLASS}
      >
        &lt;
      </button>

      {/* Numerals only — position is not a word, so this needs no copy. */}
      <p className="w-20 text-center text-xs font-bold tabular-nums tracking-[0.16em] text-ink/60">
        {pad(carousel.index + 1)} / {pad(count)}
      </p>

      <button
        type="button"
        onClick={carousel.next}
        aria-label={copy.labels.next}
        className={ARROW_CLASS}
      >
        &gt;
      </button>
    </div>
  );
}
