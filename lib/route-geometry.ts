/**
 * Route geometry — one source of truth for the spine and its stops.
 *
 * Official-schematic proportions: two heavy tracks running in parallel, with
 * a white interchange disc centred over the pair.
 *
 *   0 ├──── 14px ────┤ 14 ├── 10px gap ──┤ 24 ├──── 14px ────┤ 38
 *         orange track                         gold track
 *
 * The pair is described by its centre line and a ±12px offset, because the
 * route is no longer straight: it bypasses the station cards, and a curved
 * track has to be offset along its normal rather than along x. Offsetting a
 * curve by a constant x narrows the painted gap on every diagonal, which
 * reads as the two lines merging.
 *
 * Everything that has to land on the spine imports from here.
 */

export const ROUTE_STROKE_WIDTH = 14;
export const ROUTE_GAP = 10;

/** Full width of the track: stroke + gap + stroke. */
export const ROUTE_TRACK_WIDTH = ROUTE_STROKE_WIDTH * 2 + ROUTE_GAP; // 38

/** Distance from the centre line to each stroke's centre. */
export const ROUTE_OFFSET = (ROUTE_STROKE_WIDTH + ROUTE_GAP) / 2; // 12

/** Half the painted width — what the route needs to clear an edge. */
export const ROUTE_HALF_WIDTH = ROUTE_TRACK_WIDTH / 2; // 19

/**
 * Station disc: a white circle over the twin track with a thick coloured
 * ring. 28px across, per the schematic.
 */
export const STATION_RADIUS = 14;
export const STATION_STROKE_WIDTH = 4;
export const STATION_FILL = "#FFFFFF";

/** Outer edge of the disc, ring included. */
export const STATION_OUTER_RADIUS = STATION_RADIUS + STATION_STROKE_WIDTH / 2; // 16

/**
 * The pocket the rails open for the disc.
 *
 * The rail follows a true circle around the disc — concentric with it, so the
 * painted edge of the track is everywhere the same distance from the painted
 * edge of the disc. Earlier versions bulged on a bell curve, which is a wave
 * the disc happens to sit in rather than a pocket cut for it.
 *
 * The radius is the disc's outer edge, plus half the track's own stroke, plus
 * the air between them.
 */
export const DISC_POCKET_CLEARANCE = 3;
export const DISC_POCKET_RADIUS =
  STATION_OUTER_RADIUS + ROUTE_STROKE_WIDTH / 2 + DISC_POCKET_CLEARANCE; // 26

/**
 * Radius of the two fillets that carry the straight into that circle.
 *
 * A circle wrapping the disc meets the straight rail at a steep angle on its
 * own — the arc has to climb 14px in about 23 — so the pocket is three arcs,
 * not one: straight, a long fillet curving out, the circle, and back. The
 * fillet is what sets how sharp the whole thing looks, and it is large
 * because the eye reads the approach, not the hug.
 *
 * Bigger means gentler: the join moves closer to the disc, where the circle
 * is flatter. 90 puts the steepest part of the pocket at about 28 degrees off
 * vertical over a 55px approach.
 */
export const DISC_POCKET_FILLET = 90;

/**
 * How far the disc travels out of a card's span before the pocket is fully
 * open again.
 *
 * The rails lie flat while the disc is alongside a card — the train is at the
 * platform, and the tracks have nothing to make room for. They part as it
 * pulls away. The gaps between cards are most of a screen, so the pocket is
 * open for nearly all of the run between stations.
 */
export const STATION_FLATTEN_RAMP = 180;

/**
 * Where the spine sits below `lg`: pinned to the left margin, so content
 * keeps the width and the route is never in its way.
 *
 * Matches the `left-6 sm:left-8` the layout used before the route became a
 * measured path — the numbers now have to be read in JS, so they live here as
 * numbers rather than as class strings.
 */
export const RAIL_INSET_SM = 12;
export const RAIL_INSET = 32;
/** Above this width the route runs through the page and bypasses the cards. */
export const ROUTE_BYPASS_MIN_WIDTH = 1024;
/** `sm` — where the rail steps out from the very edge. */
export const RAIL_STEP_WIDTH = 640;

/** Clear air between a card's edge and the nearest painted track. */
export const ROUTE_CARD_CLEARANCE = 18;
/** The route never comes closer than this to the viewport edge. */
export const ROUTE_EDGE_INSET = 10;

/**
 * Left padding each section needs to clear the spine below `lg`.
 *
 * The track runs 12–50px on a phone and 32–70px from `sm`, so content starts
 * at 64px and 96px. On a 375px screen the old 96px gutter was a quarter of
 * the width, and everything inside it — the kit render most of all — was
 * paying for clearance the rail did not need.
 */
export const CONTENT_CLEARANCE_CLASS = "pl-16 pr-5 sm:pl-24 sm:pr-6";
