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
 */

export interface ZoomableAssetProps {
  asset: ImageAsset;
  tag?: string;
  copy: ProjectCopy;
}

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
          className={`block outline-none focus-visible:ring-2 focus-visible:ring-line-primary ${
            zoomed ? "cursor-zoom-out" : "mx-auto cursor-zoom-in"
          }`}
          style={zoomed ? { width: asset.width } : undefined}
        >
          <AssetFrame
            asset={asset}
            tag={tag}
            placeholderLabel={copy.labels.assetPlaceholder}
            sizes={zoomed ? `${asset.width}px` : "90vw"}
            className={zoomed ? "w-full" : "mx-auto max-h-[68vh] w-auto"}
          />
        </button>
      </div>

      <p className="shrink-0 text-[10px] font-bold uppercase tracking-[0.14em] text-ground/60">
        {zoomed ? copy.labels.zoomOut : copy.labels.zoomIn}
      </p>
    </div>
  );
}
