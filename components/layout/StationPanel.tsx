"use client";

import {
  useCallback,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from "react";

/**
 * The content panel for a station, which takes over the page when you arrive.
 *
 * Away from a stop the panel sits in the right-hand column, narrow, with the
 * twin lines running free down the middle of the page. As the station reaches
 * the middle of the viewport it widens across the spine onto a paper ground,
 * so the thing you came to look at gets the room it deserves. Leaving, it
 * gives the width back.
 *
 * ## Why a discrete state rather than a scroll-linked width
 *
 * Width is a layout property: animating it per frame reflows the text on
 * every one of them, which is both expensive and visibly unstable — line
 * breaks shuffle as the panel grows. Instead the panel has two states and CSS
 * transitions between them, so the reflow happens once and the browser
 * interpolates the box.
 *
 * ## Why scroll position rather than IntersectionObserver
 *
 * `useInView` is the obvious tool and reads better, but it depends on the
 * observer actually delivering callbacks, which some embedded and background
 * contexts never do — leaving every panel stuck in its initial state with no
 * error to explain it. Reading the rectangle on scroll has no such dependency
 * and costs one measurement per event.
 *
 * Scroll is an external store, so it is read as one: the snapshot is the
 * boolean, not the position, so React re-renders only when a station actually
 * arrives or leaves rather than on every scroll event.
 *
 * The paper ground matters as much as the width: expanded on a wide screen the
 * panel crosses the spine, and without an opaque background the lines would
 * run through the type.
 *
 * Below `lg` neither applies. The panel already spans the width there and the
 * spine runs down the left margin, so a paper ground would simply paint over
 * the lines — the one thing that must stay visible.
 */

export interface StationPanelProps {
  children: ReactNode;
  /** The intro is arrived at immediately and never recedes. */
  alwaysExpanded?: boolean;
}

/**
 * Fraction of the viewport, centred, that counts as "at the station".
 * Deliberately narrow: a wider band leaves two panels expanded at once during
 * a handover.
 */
const BAND = 0.3;

export default function StationPanel({
  children,
  alwaysExpanded = false,
}: StationPanelProps) {
  const ref = useRef<HTMLDivElement>(null);

  const subscribe = useCallback((onChange: () => void) => {
    window.addEventListener("scroll", onChange, { passive: true });
    window.addEventListener("resize", onChange);
    return () => {
      window.removeEventListener("scroll", onChange);
      window.removeEventListener("resize", onChange);
    };
  }, []);

  const getSnapshot = useCallback(() => {
    const element = ref.current;
    if (!element) return false;
    const rect = element.getBoundingClientRect();
    const height = window.innerHeight;
    const top = height * (0.5 - BAND / 2);
    const bottom = height * (0.5 + BAND / 2);
    return rect.top < bottom && rect.bottom > top;
  }, []);

  /* Receded on the server: the panel has no rectangle to measure there, and
     starting expanded would make every station flash wide before hydration. */
  const inBand = useSyncExternalStore(subscribe, getSnapshot, () => false);
  const expanded = alwaysExpanded || inBand;

  return (
    <div
      ref={ref}
      data-station-panel={expanded ? "expanded" : "receded"}
      className={`transition-[margin,padding,background-color,border-color] duration-500 ease-out ${
        expanded
          ? "py-10 lg:ml-[6%] lg:mr-[4%] lg:border-y lg:border-ink/15 lg:bg-paper lg:pl-12 lg:pr-12"
          : "py-0 lg:ml-[50%] lg:mr-0 lg:border-y lg:border-transparent lg:bg-transparent lg:pl-10 lg:pr-8"
      } pl-24 pr-6 sm:pl-28`}
    >
      {children}
    </div>
  );
}
