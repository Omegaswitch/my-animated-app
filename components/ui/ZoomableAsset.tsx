"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import type { ImageAsset, ProjectCopy } from "@/types/project";
import AssetFrame from "./AssetFrame";

/**
 * Full-screen asset with click-to-zoom and pointer panning.
 *
 * Two states only, deliberately: fit the screen, or magnified — which is the
 * one that matters for reading a keycap legend. A continuous zoom would need
 * a gesture model; a toggle answers the actual question in one click.
 *
 * ## Panning instead of scrolling
 *
 * Magnified, the image is moved under the pointer — or the finger — rather
 * than put in a scroll container. Scrollbars inside a modal are ugly, they fight the page's
 * smooth scroller, and reaching a corner takes two axes of dragging. Mapping
 * the pointer's position in the frame to the image's offset lets any corner
 * be reached by moving toward it, which is what the gesture already means.
 *
 * The frame itself never scrolls and never changes size — only the image
 * inside it transforms — so nothing reflows and no scrollbar can appear.
 *
 * ## Sizing
 *
 * The panel is viewport-relative and the image is contained inside it, so
 * neither state depends on the asset's declared dimensions. Those are
 * routinely wrong — a file supplied square against a 16:10 declaration is
 * normal — and sizing off them cropped the image or produced a box of the
 * wrong shape.
 *
 * The height is explicit rather than `flex-1`. The dialog's panel is
 * `max-h-full`, so it sizes to its content and offers no definite height for
 * a flex child to resolve against: the frame collapsed to zero and the modal
 * opened blank.
 */

export interface ZoomableAssetProps {
  asset: ImageAsset;
  tag?: string;
  copy: ProjectCopy;
}

/**
 * Fitted panel height. Explicit — see the note on sizing above.
 *
 * The width term is the one that matters on a phone: at `68vw` a 375px screen
 * gave the frame 255px of height while the panel was 343px wide, so a square
 * render sat in the middle of it at a third of the screen. `92vw` lets the
 * frame be as tall as the panel is wide, which is as large as a contained
 * square can be.
 */
const FIT_HEIGHT = "min(72vh, 92vw)";
/** Magnification when inspecting. */
const ZOOM = 2.4;
/** Matches the brief's 0.2s ease-out. */
const ZOOM_TRANSITION = { duration: 0.2, ease: "easeOut" } as const;

export default function ZoomableAsset({
  asset,
  tag,
  copy,
}: ZoomableAssetProps) {
  const [zoomed, setZoomed] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const frameRef = useRef<HTMLDivElement>(null);

  /* Pointer position maps to the hidden overflow: at the left edge the image
     sits at its left extreme, at the right edge its right. The travel is
     exactly the part of the scaled image that does not fit, so the pan can
     never reveal empty space beyond it. */
  const panTo = (clientX: number, clientY: number) => {
    if (!zoomed) return;
    const frame = frameRef.current;
    if (!frame) return;
    const rect = frame.getBoundingClientRect();
    const fromCentreX = (clientX - rect.left) / rect.width - 0.5;
    const fromCentreY = (clientY - rect.top) / rect.height - 0.5;
    const travelX = (rect.width * (ZOOM - 1)) / 2;
    const travelY = (rect.height * (ZOOM - 1)) / 2;
    setOffset({ x: -fromCentreX * 2 * travelX, y: -fromCentreY * 2 * travelY });
  };

  const pan = (event: React.MouseEvent) => panTo(event.clientX, event.clientY);

  /* The same gesture with a finger. Without this the zoom is reachable on a
     phone but useless: it magnifies the centre of the render and there is no
     way to reach a legend at the edge of it. */
  const panTouch = (event: React.TouchEvent) => {
    const touch = event.touches[0];
    if (!touch) return;
    panTo(touch.clientX, touch.clientY);
  };

  const toggle = () => {
    setZoomed((current) => !current);
    // Always re-enter the fitted state centred.
    setOffset({ x: 0, y: 0 });
  };

  return (
    <div className="flex flex-col gap-3">
      <div
        ref={frameRef}
        onClick={toggle}
        onMouseMove={pan}
        onMouseLeave={() => setOffset({ x: 0, y: 0 })}
        onTouchMove={panTouch}
        role="button"
        tabIndex={0}
        aria-label={zoomed ? copy.labels.zoomOut : copy.labels.zoomIn}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            toggle();
          }
        }}
        /* `overflow-hidden` is what keeps the magnified image from producing
           a scrollbar; the pan replaces scrolling entirely. */
        /* `touch-action: none` only while magnified: the drag is then a pan
           rather than a page scroll. Fitted, the frame must not swallow the
           gesture — the modal behind it still has to be scrollable past. */
        style={{ height: FIT_HEIGHT, touchAction: zoomed ? "none" : undefined }}
        className={`relative w-full shrink-0 overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-line-primary ${
          zoomed ? "cursor-zoom-out" : "cursor-zoom-in"
        }`}
      >
        <motion.div
          className="absolute inset-0"
          animate={{ scale: zoomed ? ZOOM : 1, x: offset.x, y: offset.y }}
          transition={ZOOM_TRANSITION}
        >
          <AssetFrame
            asset={asset}
            tag={tag}
            placeholderLabel={copy.labels.assetPlaceholder}
            fill
            sizes={zoomed ? "200vw" : "90vw"}
          />
        </motion.div>
      </div>

      <p className="shrink-0 text-[10px] font-bold uppercase tracking-[0.14em] text-ground/60">
        {zoomed ? copy.labels.zoomOut : copy.labels.zoomIn}
      </p>
    </div>
  );
}
