"use client";

import type { Carousel } from "@/lib/useCarousel";
import type { ProjectCopy } from "@/types/project";

/**
 * Arrows and thumbnail pills for a gallery.
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

export default function CarouselControls({
  carousel,
  labels,
  copy,
}: CarouselControlsProps) {
  if (labels.length < 2) return null;

  return (
    <div className="mt-5 flex items-center gap-3 border-t-2 border-ink/25 pt-4">
      <div className="flex shrink-0 gap-1.5">
        <button
          type="button"
          onClick={carousel.previous}
          aria-label={copy.labels.previous}
          className="flex h-8 w-8 items-center justify-center border-2 border-ink/30 text-sm font-bold leading-none outline-none transition-colors hover:border-line-primary hover:text-line-primary focus-visible:ring-2 focus-visible:ring-line-primary"
        >
          &lt;
        </button>
        <button
          type="button"
          onClick={carousel.next}
          aria-label={copy.labels.next}
          className="flex h-8 w-8 items-center justify-center border-2 border-ink/30 text-sm font-bold leading-none outline-none transition-colors hover:border-line-primary hover:text-line-primary focus-visible:ring-2 focus-visible:ring-line-primary"
        >
          &gt;
        </button>
      </div>

      <ul className="flex min-w-0 flex-1 flex-wrap gap-1.5">
        {labels.map((label, index) => {
          const active = index === carousel.index;
          return (
            <li key={label}>
              <button
                type="button"
                onClick={() => carousel.select(index)}
                aria-current={active ? "true" : undefined}
                className={`border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-line-primary ${
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
