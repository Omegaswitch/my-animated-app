"use client";

import type { Carousel } from "@/lib/useCarousel";
import type { ProjectCopy } from "@/types/project";

/**
 * Arrows and thumbnail pills for a gallery.
 *
 * Centred under the image rather than ranged left: the control belongs to the
 * picture above it, and a centred picture with left-hung arrows reads as two
 * unrelated blocks.
 *
 * The arrows are 48px. They were 32px, which is under every touch-target
 * guideline going and awkward with a mouse too — this is the primary way to
 * move through a gallery, so it should be the easiest thing on the page to
 * hit.
 *
 * The pills carry `aria-current`, so the active item is announced rather than
 * only shown by its fill. Arrow keys are handled globally by `useCarousel`;
 * these are the pointer equivalents.
 */

export interface CarouselControlsProps {
  carousel: Carousel;
  /** One short label per item, in order. */
  labels: string[];
  copy: ProjectCopy;
}

const ARROW_CLASS =
  "flex h-12 w-12 shrink-0 items-center justify-center border-2 border-ink/40 text-lg font-bold leading-none text-ink outline-none transition-colors hover:border-line-primary hover:bg-line-primary hover:text-paper focus-visible:ring-2 focus-visible:ring-line-primary";

export default function CarouselControls({
  carousel,
  labels,
  copy,
}: CarouselControlsProps) {
  if (labels.length < 2) return null;

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="mt-6 flex flex-col items-center gap-4 border-t-2 border-ink/25 pt-5">
      <div className="flex items-center justify-center gap-4">
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
          {pad(carousel.index + 1)} / {pad(labels.length)}
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

      <ul className="flex flex-wrap justify-center gap-2">
        {labels.map((label, index) => {
          const active = index === carousel.index;
          return (
            <li key={label}>
              <button
                type="button"
                onClick={() => carousel.select(index)}
                aria-current={active ? "true" : undefined}
                className={`border px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.1em] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-line-primary ${
                  active
                    ? "border-line-primary bg-line-primary text-paper"
                    : "border-ink/30 text-ink/60 hover:border-ink/60 hover:text-ink"
                }`}
              >
                {label}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
