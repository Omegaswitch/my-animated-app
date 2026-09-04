"use client";

import { useState } from "react";
import type { ImageAsset, ProjectCopy } from "@/types/project";
import AssetFrame from "./AssetFrame";

/**
 * Full-screen asset with click-to-zoom.
 *
 * Two states only, deliberately: fit the screen, or 100% detail — which is the
 * one that matters for reading a keycap legend. A continuous zoom would need
 * pan handling and a gesture model; a toggle answers the actual question in
 * one click.
 *
 * At 100% the frame scrolls, and is marked `data-lenis-prevent` so the smooth
 * scroller does not steal the wheel while you are inspecting.
 *
 * ## Sizing
 *
 * Both states give the frame an explicit box. `AssetFrame` positions its
 * image absolutely, so a parent sized `w-auto` against an aspect ratio has no
 * width to resolve against and collapses to zero — the modal opened empty.
 *
 * The box is a fixed viewport-relative panel in both states and the image is
 * contained inside it, so neither state depends on the asset's declared
 * dimensions. Those are frequently wrong — a file supplied square against a
 * 16:10 declaration is normal — and sizing off them cropped the image or
 * produced a box of the wrong shape.
 *
 * Zoom is a multiple of the fitted size rather than true 100%: real pixel
 * dimensions are not known here, and a scale factor gives the same "inspect
 * the legend" result without pretending to know them.
 */

export interface ZoomableAssetProps {
  asset: ImageAsset;
  tag?: string;
  copy: ProjectCopy;
}

/** Fitted panel, leaving room for the dialog's own chrome. */
const FIT_HEIGHT = "68vh";
/** How much bigger the inspected view is than the fitted one. */
const ZOOM_FACTOR = 2.5;

export default function ZoomableAsset({
  asset,
  tag,
  copy,
}: ZoomableAssetProps) {
  const [zoomed, setZoomed] = useState(false);

  return (
    <div className="flex h-full flex-col gap-3">
      <div
        className={`min-h-0 flex-1 ${zoomed ? "overflow-auto" : "overflow-hidden"}`}
        data-lenis-prevent
      >
        <button
          type="button"
          onClick={() => setZoomed((current) => !current)}
          aria-label={zoomed ? copy.labels.zoomOut : copy.labels.zoomIn}
          className={`relative block overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-line-primary ${
            zoomed ? "cursor-zoom-out" : "mx-auto cursor-zoom-in"
          }`}
          style={
            zoomed
              ? {
                  width: `${ZOOM_FACTOR * 100}%`,
                  height: `calc(${FIT_HEIGHT} * ${ZOOM_FACTOR})`,
                }
              : { width: "100%", height: FIT_HEIGHT }
          }
        >
          <AssetFrame
            asset={asset}
            tag={tag}
            placeholderLabel={copy.labels.assetPlaceholder}
            fill
            sizes={zoomed ? "200vw" : "90vw"}
          />
        </button>
      </div>

      <p className="shrink-0 text-[10px] font-bold uppercase tracking-[0.14em] text-ground/60">
        {zoomed ? copy.labels.zoomOut : copy.labels.zoomIn}
      </p>
    </div>
  );
}
