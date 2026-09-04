"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Index state for a gallery, with arrow-key navigation.
 *
 * The listener is global on purpose — a gallery you are looking at should
 * answer the arrow keys without being focused first. It steps aside when a
 * modifier is held, when focus is in a field, or when a dialog is open, so it
 * never eats a shortcut or fights the lightbox.
 */
export interface Carousel {
  index: number;
  select: (next: number) => void;
  next: () => void;
  previous: () => void;
}

export function useCarousel(count: number, enabled = true): Carousel {
  const [index, setIndex] = useState(0);

  const select = useCallback(
    (next: number) => {
      if (count === 0) return;
      setIndex(((next % count) + count) % count);
    },
    [count],
  );

  const next = useCallback(() => select(index + 1), [index, select]);
  const previous = useCallback(() => select(index - 1), [index, select]);

  useEffect(() => {
    if (!enabled || count < 2) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey)
        return;
      // Never steal a key from a field, a modal, or a scrollable widget.
      if (document.querySelector("dialog[open]")) return;
      const active = document.activeElement;
      if (
        active instanceof HTMLElement &&
        (active.isContentEditable ||
          ["INPUT", "TEXTAREA", "SELECT"].includes(active.tagName))
      ) {
        return;
      }
      event.preventDefault();
      setIndex((current) => {
        const step = event.key === "ArrowRight" ? 1 : -1;
        return (((current + step) % count) + count) % count;
      });
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [count, enabled]);

  return { index, select, next, previous };
}
