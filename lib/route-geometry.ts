/**
 * Route geometry — one source of truth for the spine and its stops.
 *
 * Official-schematic proportions: two heavy tracks running in parallel, with
 * a white interchange disc centred over the pair.
 *
 *   0 ├──── 14px ────┤ 14 ├── 10px gap ──┤ 24 ├──── 14px ────┤ 38
 *         orange track                         gold track
 *
 * Stroke centres sit at x=7 and x=31; the painted gap between them is 10px.
 * The disc is centred at x=19, so a 30px disc spans 4–34 and sits cleanly
 * over both tracks rather than on one of them.
 *
 * Everything that has to land on the spine imports from here.
 */

export const ROUTE_STROKE_WIDTH = 14;
export const ROUTE_GAP = 10;

/** Full width of the track: stroke + gap + stroke. */
export const ROUTE_TRACK_WIDTH = ROUTE_STROKE_WIDTH * 2 + ROUTE_GAP; // 38

/** Centre line of each stroke, in track-local pixels. */
export const ROUTE_PRIMARY_X = ROUTE_STROKE_WIDTH / 2; // 7
export const ROUTE_SECONDARY_X =
  ROUTE_STROKE_WIDTH + ROUTE_GAP + ROUTE_STROKE_WIDTH / 2; // 31

/** Centre of the pair — where a stop disc sits. */
export const ROUTE_CENTRE_X = ROUTE_TRACK_WIDTH / 2; // 19

/**
 * Station disc: a white circle over the twin track with a thick coloured
 * ring. 30px across, inside the 28–32px the schematic calls for.
 */
export const STATION_RADIUS = 14; // 28px disc
export const STATION_STROKE_WIDTH = 4;
export const STATION_FILL = "#FFFFFF";

/**
 * Where the spine sits: pinned to the left margin on small screens so content
 * keeps the width, centred from `lg` where content offsets around it.
 *
 * Written out in full because Tailwind only sees literal class strings.
 */
export const ROUTE_POSITION_CLASS =
  "left-6 sm:left-8 lg:left-1/2 lg:-translate-x-1/2";

/** Track width as a utility. `w-[38px]` matches ROUTE_TRACK_WIDTH. */
export const ROUTE_TRACK_CLASS = "w-[38px]";

/**
 * Left padding each section needs to clear the spine on small screens.
 * The track runs 24–62px at `left-6`, so content starts at 96px.
 */
export const CONTENT_CLEARANCE_CLASS =
  "pl-24 pr-6 sm:pl-28 lg:ml-[50%] lg:pl-16 lg:pr-16";
