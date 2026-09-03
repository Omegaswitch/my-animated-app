/**
 * Route geometry — one source of truth for where the two lines live.
 *
 * The rails are drawn by `LineRoute`, but three other places have to land on
 * them exactly: the hero's origin marker, the thank-you terminus, and any
 * future marker. Previously each repeated the positioning classes by hand,
 * and the terminus drifted 356px off the line the moment one of them changed.
 * Import from here instead of retyping the numbers.
 *
 * Track, left to right:
 *
 *   0 ├──── 8px stroke ────┤ 8 ┤── 8px gap ──┤ 16 ├──── 8px stroke ────┤ 24
 *              line 1                                      line 2
 *
 * Stroke centres therefore sit at x=4 and x=20, and the gap between the two
 * painted edges is exactly 8px.
 */

export const ROUTE_STROKE_WIDTH = 8;
export const ROUTE_GAP = 8;

/** Full width of the track: stroke + gap + stroke. */
export const ROUTE_TRACK_WIDTH = ROUTE_STROKE_WIDTH * 2 + ROUTE_GAP; // 24

/** Centre line of each stroke, in track-local pixels. */
export const ROUTE_PRIMARY_X = ROUTE_STROKE_WIDTH / 2; // 4
export const ROUTE_SECONDARY_X =
  ROUTE_STROKE_WIDTH + ROUTE_GAP + ROUTE_STROKE_WIDTH / 2; // 20

/** Centre of the track, where an interchange marker is drawn. */
export const ROUTE_CENTRE_X = ROUTE_TRACK_WIDTH / 2; // 12

/**
 * Where the track sits: pinned to the left margin on mobile so content keeps
 * the width, centred from `lg` where content offsets around it.
 *
 * Written out in full because Tailwind only sees literal class strings.
 */
export const ROUTE_POSITION_CLASS =
  "left-6 sm:left-8 lg:left-1/2 lg:-translate-x-1/2";

/** Track width as a utility. `w-6` is 24px — keep in step with ROUTE_TRACK_WIDTH. */
export const ROUTE_TRACK_CLASS = "w-6";
