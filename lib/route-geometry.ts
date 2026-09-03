/**
 * Route geometry — one source of truth for where the two lines live.
 *
 * Prague Metro proportions: two bold solid tracks running in parallel, with
 * white interchange discs sitting directly on them.
 *
 *   0 ├──── 10px ────┤ 10 ├── 6px gap ──┤ 16 ├──── 10px ────┤ 26
 *         orange track                        gold track
 *
 * Stroke centres sit at x=5 and x=21; the painted gap between them is 6px.
 *
 * Everything that has to land on the rails imports from here — the route
 * itself, the station discs, and the terminus. Repeating these numbers by
 * hand is what once threw the terminus 356px off the line.
 */

export const ROUTE_STROKE_WIDTH = 10;
export const ROUTE_GAP = 6;

/** Full width of the track: stroke + gap + stroke. */
export const ROUTE_TRACK_WIDTH = ROUTE_STROKE_WIDTH * 2 + ROUTE_GAP; // 26

/** Centre line of each stroke, in track-local pixels. */
export const ROUTE_PRIMARY_X = ROUTE_STROKE_WIDTH / 2; // 5
export const ROUTE_SECONDARY_X =
  ROUTE_STROKE_WIDTH + ROUTE_GAP + ROUTE_STROKE_WIDTH / 2; // 21

/** Centre of the track. */
export const ROUTE_CENTRE_X = ROUTE_TRACK_WIDTH / 2; // 13

/** Station disc: white fill, bold stroke in the track's own colour. */
export const STATION_RADIUS = 8;
export const STATION_RADIUS_ACTIVE = 10;
export const STATION_STROKE_WIDTH = 3;
export const STATION_FILL = "#FFFFFF";

/**
 * Where the track sits: pinned to the left margin on mobile so content keeps
 * the width, centred from `lg` where content offsets around it.
 *
 * Written out in full because Tailwind only sees literal class strings.
 */
export const ROUTE_POSITION_CLASS =
  "left-6 sm:left-8 lg:left-1/2 lg:-translate-x-1/2";

/** Track width as a utility. `w-[26px]` matches ROUTE_TRACK_WIDTH. */
export const ROUTE_TRACK_CLASS = "w-[26px]";
