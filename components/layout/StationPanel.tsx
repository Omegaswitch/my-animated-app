"use client";

import {
  useCallback,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from "react";

/**
 * The content panel for a station: a card that takes over the page when you
 * arrive at the stop, and gives the width back when you leave.
 *
 * Away from a stop the card sits in one half of the page with the route
 * running past it. As the station reaches the middle of the viewport the card
 * widens across most of the width; the route reads the card's box and swings
 * further out to clear it, so the two move together without either one
 * knowing anything about the other's internals.
 *
 * Cards alternate sides down the page — the route passes left of one and
 * right of the next — which is what turns a straight line into a slalom and
 * gives the page its editorial offset.
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
 * ## Why the card's ground is gated to `lg`
 *
 * Below `lg` the card already spans the width and the route runs down the
 * left margin, so a ground and a border would just be a box around the whole
 * screen with the route painted over. The bypass is a wide-screen idea and so
 * is the card.
 */

export interface StationPanelProps {
  children: ReactNode;
  /** Which side of the card the route passes on. Alternates down the page. */
  routeSide: "left" | "right";
  /** The intro is arrived at immediately and never recedes. */
  alwaysExpanded?: boolean;
}

/**
 * Fraction of the viewport, centred, that counts as "at the station".
 * Deliberately narrow: a wider band leaves two panels expanded at once during
 * a handover.
 */
const BAND = 0.3;

/**
 * Card margins.
 *
 * Expanded, the card leaves ~17% on the route's side — enough for the 38px
 * pair, its clearance, and air — and hugs the far edge. Receded, it takes
 * half the page on the side away from the route, which pulls the route back
 * toward the middle without any explicit "centre" ever being written down.
 */
const EXPANDED = {
  left: "lg:ml-[17%] lg:mr-[4%]",
  right: "lg:ml-[4%] lg:mr-[17%]",
} as const;

const RECEDED = {
  left: "lg:ml-[50%] lg:mr-0",
  right: "lg:ml-0 lg:mr-[50%]",
} as const;

export default function StationPanel({
  children,
  routeSide,
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
      // Read by the route, which measures this box and passes on this side.
      data-route-side={routeSide}
      className={`rounded-2xl transition-[margin,padding,background-color,border-color] duration-500 ease-out ${
        expanded
          ? `py-10 lg:border lg:border-ink/15 lg:bg-paper lg:px-12 ${EXPANDED[routeSide]}`
          : `py-0 lg:border lg:border-transparent lg:bg-transparent lg:px-10 ${RECEDED[routeSide]}`
      } pl-24 pr-6 sm:pl-28`}
    >
      {children}
    </div>
  );
}
