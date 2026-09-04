import type { ReactNode } from "react";

/**
 * The content panel for a station: a card in the normal document flow.
 *
 * Static, deliberately. It used to widen as you arrived at a stop and narrow
 * again as you left, which read as the card popping open — the page moved
 * while you were trying to read it. Nothing about the card moves now. The
 * only things that respond to the scroll are the route and the disc riding
 * it, which is the whole conceit of the page: you are what is moving.
 *
 * A server component, with no state and no hooks. That is the point.
 *
 * ## Sides
 *
 * Cards alternate: the route passes left of one and right of the next, which
 * is what gives the line something to do between stops and the page its
 * editorial offset. The route reads the card's box and clears its edge; it is
 * told nothing else about it.
 *
 * ## Width, and why the card is not wider
 *
 * The card takes 58% of the page. It could take 80%, and did, but the two
 * numbers are not independent: a card that wide on alternating sides leaves
 * the route a horizontal swing of well over a thousand pixels between stops,
 * and no amount of curve fitting makes that gentle — the line ends up nearly
 * horizontal in the middle of every transition. The swing is roughly twice
 * the card's width over half the page, so a few percent of card width costs a
 * lot of angle. 58% is where the card is still the dominant thing on screen
 * and the line still reads as a metro line.
 *
 * ## Vertical rhythm belongs to the section, not the card
 *
 * The gap between cards is what the route has to turn in, so it is generous —
 * most of a screen. It lives in the sections' padding rather than in margins
 * here, because adjacent margins collapse into one and would have quietly
 * halved every gap.
 *
 * ## Why the ground is gated to `lg`
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
}

/**
 * Card margins. The near margin — the route's side — has to hold the 38px
 * pair, its clearance, and enough air that the line is not hugging the card.
 */
const MARGINS = {
  left: "lg:ml-[38%] lg:mr-[4%]",
  right: "lg:ml-[4%] lg:mr-[38%]",
} as const;

export default function StationPanel({
  children,
  routeSide,
}: StationPanelProps) {
  return (
    <div
      data-station-panel
      // Read by the route, which measures this box and passes on this side.
      data-route-side={routeSide}
      className={`rounded-2xl pl-24 pr-6 sm:pl-28 lg:border lg:border-ink/15 lg:bg-paper lg:px-12 lg:py-12 ${MARGINS[routeSide]}`}
    >
      {children}
    </div>
  );
}
