import {
  ROUTE_POSITION_CLASS,
  ROUTE_PRIMARY_X,
  ROUTE_SECONDARY_X,
  ROUTE_STROKE_WIDTH,
  ROUTE_TRACK_CLASS,
  ROUTE_TRACK_WIDTH,
} from "@/lib/route-geometry";

/**
 * The spine — two heavy tracks, always on screen.
 *
 * This is the rail you travel along, so it is `fixed` and never animates:
 * no draw, no fade, no scroll linkage. It carries no stations and no labels,
 * which is the point — the stops belong to the station that is currently in
 * view, not to a permanent list down the side of the page.
 *
 * A server component. There is nothing here to react to.
 *
 * Crisp by construction: the `<svg>` carries no viewBox, so user units are
 * CSS pixels and `strokeWidth={14}` is exactly 14 device-independent pixels
 * at every viewport, with no scaling to soften the edge. No filters, no
 * dash pattern, no opacity.
 *
 * It sits at `z-0`; station content is `z-20` and the stop disc `z-30`.
 */
export default function RouteBackbone() {
  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-y-0 z-0 ${ROUTE_TRACK_CLASS} ${ROUTE_POSITION_CLASS}`}
    >
      <svg width={ROUTE_TRACK_WIDTH} height="100%" className="h-full">
        <line
          x1={ROUTE_PRIMARY_X}
          y1={0}
          x2={ROUTE_PRIMARY_X}
          y2="100%"
          stroke="var(--color-line-primary)"
          strokeWidth={ROUTE_STROKE_WIDTH}
        />
        <line
          x1={ROUTE_SECONDARY_X}
          y1={0}
          x2={ROUTE_SECONDARY_X}
          y2="100%"
          stroke="var(--color-line-secondary)"
          strokeWidth={ROUTE_STROKE_WIDTH}
        />
      </svg>
    </div>
  );
}
