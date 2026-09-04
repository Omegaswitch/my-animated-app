"use client";

import { useEffect, useRef, useState } from "react";
import {
  RAIL_INSET,
  RAIL_INSET_SM,
  RAIL_STEP_WIDTH,
  ROUTE_BYPASS_MIN_WIDTH,
  ROUTE_CARD_CLEARANCE,
  ROUTE_EDGE_INSET,
  ROUTE_HALF_WIDTH,
  ROUTE_OFFSET,
  ROUTE_STROKE_WIDTH,
  ROUTE_TRACK_WIDTH,
  DISC_POCKET_FILLET,
  DISC_POCKET_RADIUS,
  STATION_FLATTEN_RAMP,
  STATION_FILL,
  STATION_RADIUS,
  STATION_STROKE_WIDTH,
} from "@/lib/route-geometry";

/**
 * The route — two heavy tracks and the disc riding them.
 *
 * The tracks used to be a straight fixed line down the middle of the page,
 * which meant every station card had to be painted opaque to hide the part of
 * the line running underneath it. A transit diagram does not do that: a line
 * goes *around* what is in its way. So the route is measured rather than
 * drawn: it runs down the page, swings out to clear each card, and comes back.
 *
 * ## How the shape is decided
 *
 * Each station panel publishes two things through data attributes: its box,
 * and which side the route should pass on. The route holds a constant x for
 * the height of a card — far enough out to clear its edge — and eases between
 * one card's x and the next across the gap between them. Nothing else decides
 * the shape, so a card that widens (a station taking over the page) pushes the
 * route out, and one that narrows lets it fall back toward the middle. Cards
 * alternate sides, so the line slaloms rather than wandering.
 *
 * Because the geometry is a function of y, the disc can be placed on it
 * exactly: its height is the scroll progress, and its x is the same function
 * the tracks are drawn from. There is no sampling of the rendered path and no
 * way for the two to disagree.
 *
 * ## The shape of a bend
 *
 * A transition is a single smooth S from one card's x to the next, spread
 * across the whole gap between them, which is most of a screen. It is a cubic
 * ease rather than the two circular fillets a schematic is usually drawn
 * with, because for a given box a circular S is much the steeper of the two:
 * an arc pair has to reach 85 degrees off vertical to cover a box a cubic
 * covers at 54. The tangent is vertical at both ends, so the bend leaves and
 * rejoins the straight without a corner.
 *
 * The gentleness of a bend is set by the layout, not by the curve: it is the
 * card's width against the gap below it. Both of those are chosen with this
 * in mind — see the note in `StationPanel`.
 *
 * ## The pocket
 *
 * At rest the pair runs 12px either side of the centre line, which a 32px
 * disc simply covers: it read as a bead threaded onto the tracks. So the rails
 * part as the disc passes — orange out to the left, gold out to the right —
 * and close again behind it, leaving the disc sitting in open air between
 * them.
 *
 * The part that hugs the disc is a true circle, concentric with it, so every
 * point of the track's painted edge is the same distance from the disc's.
 * Earlier versions bulged on a bell curve, which is a wave the disc happens
 * to sit in rather than a pocket cut for it.
 *
 * A circle alone would meet the straight at nearly 60 degrees, so the pocket
 * is three arcs: the straight runs into a long fillet curving outward, the
 * fillet hands over to the circle, and the whole thing mirrors below. Every
 * handover is at a shared tangent, so there is no corner anywhere in it. The
 * fillet is large — 90px against the circle's 26 — because what reads as
 * sharp is the approach, not the hug.
 *
 * The parting alone still leaves the disc's top and bottom open, so a ring of
 * the same radius closes the pocket into a circle — orange on the side the
 * orange rail runs, gold on the other, so it reads as the two tracks meeting
 * round the disc rather than a third thing drawn over them. Its radius is the
 * rails' own offset at the disc's height, so the three are tangent by
 * construction and cannot drift apart.
 *
 * The stroke is untouched: 14px throughout. Only the line's own path moves,
 * so the rails cannot thin as they bow.
 *
 * ## At a station the rails lie flat
 *
 * The pocket closes while the disc is alongside a card and opens again as it
 * pulls away: the train is at the platform, and the tracks have nothing to
 * make room for. One factor scales the whole shape, driven by the disc's
 * distance from the nearest card, so it breathes rather than switching.
 *
 * ## Why the pair is offset along the normal
 *
 * The two tracks are the centre line ±12px measured perpendicular to it. On a
 * diagonal, offsetting along x instead would squeeze the painted gap by the
 * cosine of the slope and the lines would appear to merge into one.
 *
 * ## Why the disc no longer has a spring
 *
 * It used to lag the scroll on a spring, which read as momentum. That only
 * works on a straight line: on a curve the lagged y belongs to a different x,
 * and the disc would leave the track through every bend. Lenis already
 * smooths the scroll itself, so the momentum is still there — it is in the
 * page rather than in the disc.
 */

/** Distance between path samples, in px. Small enough to read as a curve. */
const SAMPLE_STEP = 4;
/** Fraction of the viewport kept clear at each end of the disc's travel. */
const DISC_INSET = 0.06;

/* The three-arc pocket, solved once at module load.
 *
 * Read as offset-against-height: the rail is a straight line at `REST`, an arc
 * of `DISC_POCKET_RADIUS` centred on the disc, and a fillet joining them. The
 * fillet's centre sits `FILLET` out from the straight and `RADIUS + FILLET`
 * from the disc — tangent to both at once — and that is what fixes the height
 * of each handover. */
const REST = ROUTE_OFFSET;

/** Height at which the straight gives way to the fillet. */
const POCKET_APPROACH = Math.sqrt(
  (DISC_POCKET_RADIUS + DISC_POCKET_FILLET) ** 2 -
    (REST + DISC_POCKET_FILLET) ** 2,
);

/** Height at which the fillet gives way to the circle round the disc. */
const POCKET_HANDOVER =
  (DISC_POCKET_RADIUS * POCKET_APPROACH) /
  (DISC_POCKET_RADIUS + DISC_POCKET_FILLET);

/** How far the rails stand off the centre line, `dy` above or below the disc. */
function pocketOffset(dy: number): number {
  const d = Math.abs(dy);
  if (d >= POCKET_APPROACH) return REST;

  // Concentric with the disc.
  if (d <= POCKET_HANDOVER) {
    return Math.sqrt(DISC_POCKET_RADIUS ** 2 - d * d);
  }

  // The fillet, curving the other way.
  const k = POCKET_APPROACH - d;
  return (
    REST +
    DISC_POCKET_FILLET -
    Math.sqrt(Math.max(0, DISC_POCKET_FILLET ** 2 - k * k))
  );
}
interface Shape {
  primary: string;
  secondary: string;
  discX: number;
  discY: number;
  /** Radius of the ring closed around the disc. */
  ringRadius: number;
  /** 0 at a platform, 1 in transit. Fades the ring as the pocket shuts. */
  ringOpacity: number;
  /**
   * The route's normal where the disc is, in gradient box units.
   *
   * Both rings — the one round the disc and the disc's own stroke — are split
   * orange to gold along this, so the split lands where the two rails
   * actually are. A fixed left-to-right split only agrees with the tracks
   * where they happen to run vertically, and they are at up to 38 degrees off
   * that between cards.
   */
  gradient: { x1: number; y1: number; x2: number; y2: number };
}

interface Hold {
  top: number;
  bottom: number;
  x: number;
}

interface Panel {
  top: number;
  bottom: number;
  left: number;
  right: number;
  onRight: boolean;
}

const clamp = (value: number, low: number, high: number) =>
  Math.min(high, Math.max(low, value));

/** Ease with zero gradient at both ends, so holds join without a corner. */
const smoothstep = (t: number) => {
  const c = clamp(t, 0, 1);
  return c * c * (3 - 2 * c);
};

/** Path coordinates, in px. A tenth is well under a device pixel. */
const round = (value: number) => Math.round(value * 10) / 10;

/**
 * Gradient coordinates, which are fractions of a box rather than pixels.
 *
 * Rounding these to a tenth like a coordinate quantises the colour split to
 * about 11 degrees, so it visibly snapped between bends instead of turning
 * with the track.
 */
const roundUnit = (value: number) => Math.round(value * 1000) / 1000;

/**
 * The cards, in viewport pixels.
 *
 * Read at every width, not only where the route bypasses them: below `lg` the
 * route runs straight past the cards but still has to know where they are,
 * because the pocket closes while the disc is alongside one.
 */
function readPanels(): Panel[] {
  return Array.from(
    document.querySelectorAll<HTMLElement>("[data-station-panel]"),
  ).map((panel) => {
    const rect = panel.getBoundingClientRect();
    return {
      top: rect.top,
      bottom: rect.bottom,
      left: rect.left,
      right: rect.right,
      onRight: panel.dataset.routeSide === "right",
    };
  });
}

/** Where the route sits while it is clearing each card. */
function holdsFrom(panels: Panel[], viewportWidth: number): Hold[] {
  return panels.map((panel) => {
    const raw = panel.onRight
      ? panel.right + ROUTE_CARD_CLEARANCE + ROUTE_HALF_WIDTH
      : panel.left - ROUTE_CARD_CLEARANCE - ROUTE_HALF_WIDTH;

    return {
      top: panel.top,
      bottom: panel.bottom,
      x: clamp(
        raw,
        ROUTE_HALF_WIDTH + ROUTE_EDGE_INSET,
        viewportWidth - ROUTE_HALF_WIDTH - ROUTE_EDGE_INSET,
      ),
    };
  });
}

/**
 * How open the pocket is: 0 with the disc alongside a card, 1 well clear of
 * one. Applied to the whole shape at once, so it breathes rather than
 * switching.
 */
function transit(discY: number, panels: Panel[]): number {
  if (panels.length === 0) return 1;

  let nearest = Infinity;
  for (const panel of panels) {
    if (discY >= panel.top && discY <= panel.bottom) return 0;
    nearest = Math.min(
      nearest,
      discY < panel.top ? panel.top - discY : discY - panel.bottom,
    );
  }

  return smoothstep(nearest / STATION_FLATTEN_RAMP);
}

/**
 * The centre line, as a function of height.
 *
 * Holds arrive in document order and cannot overlap — they are the boxes of
 * sibling blocks — so the first hold whose bottom is below `y` is the one that
 * owns it, either as a hold or as the far end of the run in to it.
 */
function centreAt(holds: Hold[], fallback: number, y: number): number {
  if (holds.length === 0) return fallback;

  const first = holds[0];
  if (y <= first.top) return first.x;

  const last = holds[holds.length - 1];
  if (y >= last.bottom) return last.x;

  for (let i = 0; i < holds.length; i += 1) {
    const hold = holds[i];
    if (y > hold.bottom) continue;
    if (y >= hold.top) return hold.x;

    const previous = holds[i - 1];
    const span = hold.top - previous.bottom;
    if (span <= 0) return hold.x;
    return (
      previous.x +
      (hold.x - previous.x) * smoothstep((y - previous.bottom) / span)
    );
  }

  return last.x;
}

function measure(): Shape {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  /* Below `lg` the route is a rail in the left margin and never bypasses
     anything: the cards span the width there, so there is nothing to go
     around and nowhere to go. */
  const bypassing = viewportWidth >= ROUTE_BYPASS_MIN_WIDTH;
  const rail =
    (viewportWidth >= RAIL_STEP_WIDTH ? RAIL_INSET : RAIL_INSET_SM) +
    ROUTE_HALF_WIDTH;
  const fallback = bypassing ? viewportWidth / 2 : rail;
  const panels = readPanels();
  const holds = bypassing ? holdsFrom(panels, viewportWidth) : [];

  const centre = (y: number) => centreAt(holds, fallback, y);

  /* Read before the path is drawn: the rails bow around the disc, so where it
     is decides part of their shape. */
  const scrollable = document.documentElement.scrollHeight - viewportHeight;
  const progress = scrollable > 0 ? clamp(window.scrollY / scrollable, 0, 1) : 0;
  const discY = viewportHeight * (DISC_INSET + progress * (1 - DISC_INSET * 2));
  const open = transit(discY, panels);

  let primary = "";
  let secondary = "";

  /* Sampled a step beyond each edge so the strokes reach the top and bottom
     of the screen rather than stopping short of them. */
  for (
    let y = -SAMPLE_STEP;
    y <= viewportHeight + SAMPLE_STEP;
    y += SAMPLE_STEP
  ) {
    const x = centre(y);

    // Unit normal, from a central difference over 2px of height.
    const slope = centre(y + 1) - centre(y - 1);
    const length = Math.hypot(slope, 2);
    const nx = 2 / length;
    const ny = -slope / length;

    /* Offset along the normal, opened where the disc is passing — and scaled
       shut while it stands at a platform. */
    const offset = REST + open * (pocketOffset(y - discY) - REST);

    const command = primary === "" ? "M" : "L";
    primary += `${command}${round(x - offset * nx)} ${round(y - offset * ny)}`;
    secondary += `${command}${round(x + offset * nx)} ${round(y + offset * ny)}`;
  }

  /* The ring is always tangent to the parted rails: they stand `offset` off
     the centre line at the disc's own height, and that is exactly its radius.
     One number drives both, so they cannot come apart. */
  const ringRadius = REST + open * (DISC_POCKET_RADIUS - REST);

  /* Same central difference the strokes are offset by, taken at the disc, so
     the colour split is square to the track rather than to the screen. */
  const discSlope = centre(discY + 1) - centre(discY - 1);
  const discLength = Math.hypot(discSlope, 2);
  const nx = 2 / discLength;
  const ny = -discSlope / discLength;

  return {
    primary,
    secondary,
    discX: centre(discY),
    discY,
    ringRadius,
    ringOpacity: open,
    gradient: {
      x1: roundUnit(0.5 - nx / 2),
      y1: roundUnit(0.5 - ny / 2),
      x2: roundUnit(0.5 + nx / 2),
      y2: roundUnit(0.5 + ny / 2),
    },
  };
}

const same = (a: Shape, b: Shape) =>
  a.primary === b.primary &&
  a.secondary === b.secondary &&
  a.discX === b.discX &&
  a.discY === b.discY &&
  a.ringRadius === b.ringRadius &&
  a.ringOpacity === b.ringOpacity &&
  a.gradient.x1 === b.gradient.x1 &&
  a.gradient.y1 === b.gradient.y1 &&
  a.gradient.x2 === b.gradient.x2 &&
  a.gradient.y2 === b.gradient.y2;

export default function Route() {
  const [shape, setShape] = useState<Shape | null>(null);
  const shapeRef = useRef<Shape | null>(null);

  useEffect(() => {
    /* One measurement per event, and no animation frame loop behind it: the
       cards are static, so nothing about the shape can change between events.
       It used to need a loop to follow the cards' width transition. */
    const onChange = () => {
      const next = measure();
      const previous = shapeRef.current;
      if (previous && same(previous, next)) return;
      shapeRef.current = next;
      setShape(next);
    };

    /* Deferred rather than called here: the first measurement must not be a
       synchronous setState inside the effect, and the layout is worth letting
       settle before reading it. */
    const first = window.setTimeout(onChange, 0);

    window.addEventListener("scroll", onChange, { passive: true });
    window.addEventListener("resize", onChange);

    return () => {
      window.clearTimeout(first);
      window.removeEventListener("scroll", onChange);
      window.removeEventListener("resize", onChange);
    };
  }, []);

  /* Server render, and the first client frame: the straight rail the route
     used to be. The page is never without a spine, and the measured shape
     replaces this on the next tick. */
  if (!shape) {
    return (
      <div
        aria-hidden
        className="pointer-events-none fixed inset-y-0 left-6 z-0 w-[38px] sm:left-8 lg:left-1/2 lg:-translate-x-1/2"
      >
        <svg width={ROUTE_TRACK_WIDTH} height="100%" className="h-full">
          <line
            x1={ROUTE_HALF_WIDTH - ROUTE_OFFSET}
            y1={0}
            x2={ROUTE_HALF_WIDTH - ROUTE_OFFSET}
            y2="100%"
            stroke="var(--color-line-primary)"
            strokeWidth={ROUTE_STROKE_WIDTH}
          />
          <line
            x1={ROUTE_HALF_WIDTH + ROUTE_OFFSET}
            y1={0}
            x2={ROUTE_HALF_WIDTH + ROUTE_OFFSET}
            y2="100%"
            stroke="var(--color-line-secondary)"
            strokeWidth={ROUTE_STROKE_WIDTH}
          />
        </svg>
      </div>
    );
  }

  return (
    <>
      <svg
        aria-hidden
        data-route
        className="pointer-events-none fixed inset-0 z-0 h-full w-full"
      >
        {/* Split across the track, so the ring is the orange rail's colour on
            the side the orange rail runs and the gold's on the other — it
            reads as the two tracks closing round the disc, not as a third
            thing drawn on top of them. The axis is the route's normal, so the
            split stays square to the line through every bend. */}
        <defs>
          <linearGradient
            id="route-ring"
            x1={shape.gradient.x1}
            y1={shape.gradient.y1}
            x2={shape.gradient.x2}
            y2={shape.gradient.y2}
          >
            <stop offset="48%" stopColor="var(--color-line-primary)" />
            <stop offset="52%" stopColor="var(--color-line-secondary)" />
          </linearGradient>
        </defs>

        <path
          d={shape.primary}
          fill="none"
          stroke="var(--color-line-primary)"
          strokeWidth={ROUTE_STROKE_WIDTH}
          strokeLinejoin="round"
        />
        <path
          d={shape.secondary}
          fill="none"
          stroke="var(--color-line-secondary)"
          strokeWidth={ROUTE_STROKE_WIDTH}
          strokeLinejoin="round"
        />

        {/* Closes the pocket into a circle. Drawn under the disc, which is in
            its own layer above the cards, so the ring reads as track and the
            disc as the thing riding it. */}
        {shape.ringOpacity > 0 ? (
          <circle
            cx={shape.discX}
            cy={shape.discY}
            r={shape.ringRadius}
            fill="none"
            stroke="url(#route-ring)"
            strokeWidth={ROUTE_STROKE_WIDTH}
            opacity={shape.ringOpacity}
          />
        ) : null}
      </svg>

      <svg
        aria-hidden
        data-riding-disc
        className="pointer-events-none fixed inset-0 z-30 h-full w-full"
      >
        {/* The disc belongs to both tracks, so its ring runs from one line
            colour to the other rather than picking a side. */}
        <defs>
          <linearGradient
            id="disc-ring"
            x1={shape.gradient.x1}
            y1={shape.gradient.y1}
            x2={shape.gradient.x2}
            y2={shape.gradient.y2}
          >
            <stop offset="0%" stopColor="var(--color-line-primary)" />
            <stop offset="100%" stopColor="var(--color-line-secondary)" />
          </linearGradient>
        </defs>
        <circle
          cx={shape.discX}
          cy={shape.discY}
          r={STATION_RADIUS}
          fill={STATION_FILL}
          stroke="url(#disc-ring)"
          strokeWidth={STATION_STROKE_WIDTH}
        />
      </svg>
    </>
  );
}
