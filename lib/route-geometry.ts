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
 * At rest the pair sits 12px either side of the centre line, so a 32px disc
 * covers both of them — it reads as a bead pushed onto the tracks rather than
 * a train running between them. Each rail bows a further 14px apart as the
 * disc passes, which puts their inner edges at 19px against the disc's outer
 * edge at 16: a 3px pocket, open but tight.
 *
 * The window is deliberately short. Any longer and the pair is never quite
 * parallel anywhere on screen, which is the one thing a schematic has to be.
 */
export const DISC_POCKET_DEPTH = 14;
export const DISC_POCKET_RADIUS = 32;

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
