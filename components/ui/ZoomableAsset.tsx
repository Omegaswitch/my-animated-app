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
 * Magnified, the image is moved under the pointer rather than put in a
 * scroll container. Scrollbars inside a modal are ugly, they fight the page's
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
 */

export interface ZoomableAssetProps {
  asset: ImageAsset;
  tag?: string;
  copy: ProjectCopy;
}

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
  const pan = (event: React.MouseEvent) => {
    if (!zoomed) return;
    const frame = frameRef.current;
    if (!frame) return;
    const rect = frame.getBoundingClientRect();
    const fromCentreX = (event.clientX - rect.left) / rect.width - 0.5;
    const fromCentreY = (event.clientY - rect.top) / rect.height - 0.5;
    const travelX = (rect.width * (ZOOM - 1)) / 2;
    const travelY = (rect.height * (ZOOM - 1)) / 2;
    setOffset({ x: -fromCentreX * 2 * travelX, y: -fromCentreY * 2 * travelY });
  };

  const toggle = () => {
    setZoomed((current) => !current);
    // Always re-enter the fitted state centred.
    setOffset({ x: 0, y: 0 });
  };

  return (
    <div className="flex h-full flex-col gap-3">
      <div
        ref={frameRef}
        onClick={toggle}
        onMouseMove={pan}
        onMouseLeave={() => setOffset({ x: 0, y: 0 })}
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
        className={`relative min-h-0 w-full flex-1 overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-line-primary ${
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
