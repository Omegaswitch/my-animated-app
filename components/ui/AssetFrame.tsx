"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { ImageAsset } from "@/types/project";

/**
 * A framed asset that holds its aspect ratio whether or not the artwork
 * exists yet.
 *
 * ## Adding artwork
 *
 * Drop the file into `public/` at the path the data names. That is the whole
 * procedure — no list to maintain, no flag to flip, and files can be added
 * one at a time.
 *
 * The frame asks the server whether the file is there and falls back to a
 * technical stand-in only if it is genuinely missing. Detection happens at
 * runtime rather than at build because this component is used from client
 * components, so it cannot read the filesystem, and a hand-kept manifest is
 * one more thing to forget to update.
 *
 * A HEAD request rather than the image's own `onError`: `next/image` routes
 * through the optimiser, which answers 400 for a missing source, and the
 * error event is not reliably delivered in every environment. Asking the raw
 * path directly gives a clean 404 and one unambiguous answer. The response is
 * cached by the browser, so the cost is one small request per distinct asset.
 *
 * The stand-in is drawn at the asset's declared aspect ratio, so the
 * composition is real even when the pictures are not.
 *
 * Filenames are case-sensitive on Linux hosting even though Windows resolves
 * them either way: `Render-01.png` will work locally and 404 in production.
 */

export interface AssetFrameProps {
  asset: ImageAsset;
  /** Rendered small on the placeholder, e.g. a view or kit code. */
  tag?: string;
  className?: string;
  /** Printed when no `tag` is given. Comes from project copy. */
  placeholderLabel?: string;
  /**
   * Fill the parent instead of reserving the asset's own aspect ratio.
   *
   * The parent must be `relative` and size itself. Use this wherever a frame
   * has to stay one shape across assets of differing ratios — otherwise the
   * frame resizes per image and everything below it jumps.
   */
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
}

export default function AssetFrame({
  asset,
  tag,
  placeholderLabel,
  className = "",
  fill = false,
  sizes,
  priority,
}: AssetFrameProps) {
  /* Tracked by src, not as a boolean: the galleries reuse one frame across
     assets, so a bare flag would let one missing file suppress every image
     shown after it, and a stale result would be read against the wrong file. */
  const [missingSrc, setMissingSrc] = useState<string | null>(null);
  const missing = missingSrc === asset.src;

  useEffect(() => {
    let cancelled = false;
    /* Assume present until proven otherwise: the common case once the art is
       in is that every file exists, and starting from the placeholder would
       flash one on every load. */
    fetch(asset.src, { method: "HEAD" })
      .then((response) => {
        if (!cancelled && !response.ok) setMissingSrc(asset.src);
      })
      .catch(() => {
        if (!cancelled) setMissingSrc(asset.src);
      });
    return () => {
      cancelled = true;
    };
  }, [asset.src]);

  /* In fill mode the parent owns the box, so the frame must not also
     declare a ratio — two competing boxes is exactly the jump this avoids. */
  const box = fill
    ? { className: "absolute inset-0", style: undefined }
    : {
        className: "relative",
        style: { aspectRatio: `${asset.width} / ${asset.height}` },
      };

  if (!missing) {
    return (
      <div
        className={`${box.className} overflow-hidden ${className}`}
        style={box.style}
      >
        <Image
          src={asset.src}
          alt={asset.alt}
          fill
          sizes={sizes}
          priority={priority}
          onError={() => setMissingSrc(asset.src)}
          /* Contain in a locked frame: cropping to fill would hide part of a
             render whose ratio differs from the frame's. */
          className={fill ? "object-contain" : "object-cover"}
        />
      </div>
    );
  }

  return (
    <div
      className={`${box.className} overflow-hidden border border-ink/25 bg-ink/[0.04] ${className}`}
      style={box.style}
      // The placeholder carries no information the caption does not; the alt
      // text belongs to the real image, so this is hidden from assistive tech.
      aria-hidden
    >
      {/* Crossed diagonals — the drafting convention for a reserved plate. */}
      <svg
        className="absolute inset-0 h-full w-full text-ink/15"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
        fill="none"
      >
        <path
          d="M0 0 L100 100 M100 0 L0 100"
          stroke="currentColor"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col justify-between p-3">
        <span className="text-[9px] uppercase tracking-[0.2em] text-ink/45">
          {tag ?? placeholderLabel}
        </span>
        <span className="text-[9px] tabular-nums tracking-[0.12em] text-ink/45">
          {asset.width}×{asset.height}
        </span>
      </div>
    </div>
  );
}
