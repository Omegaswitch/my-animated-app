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
 * ## Three ways to size a frame
 *
 * `fill` locks the box and contains the image in it — for anything that has
 * to stay one shape across assets of differing ratios.
 *
 * `natural` does the opposite: both axes are auto and the caller caps them,
 * so the file keeps its own proportions and grows until it meets whichever
 * bound it meets first. That is what a logo needs — a set of marks can be
 * portrait, square and landscape at once, and only a box normalises them
 * without distortion. Capping the height alone is the usual instinct and is
 * wrong for a tall mark: at 56px a 1:2 logo is 28px across.
 *
 * The default reserves the declared ratio, for plates that are not yet in.
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
  /**
   * Fill the frame and crop the overflow, rather than containing the image
   * inside it.
   *
   * Only for a frame whose shape is chosen against artwork already in hand,
   * where the crop is known to fall on empty ground. A frame that has to hold
   * whatever arrives must contain, or it will cut the subject in half.
   */
  cover?: boolean;
  /**
   * Take the height from `className` and the width from the file.
   *
   * The declared width and height are still passed to the image, but only as
   * the placeholder ratio held before it loads; once it has loaded, `w-auto`
   * against a fixed height resolves against the real thing.
   */
  natural?: boolean;
  sizes?: string;
  priority?: boolean;
}

export default function AssetFrame({
  asset,
  tag,
  placeholderLabel,
  className = "",
  fill = false,
  cover = false,
  natural = false,
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

  if (natural) {
    if (missing) {
      /* Its own box, not the caller's. The caller's is a pair of maximums,
         which a mark fills from its own dimensions — and a stand-in has
         none, so it would collapse to a line. */
      return (
        <div
          className="h-10 w-28 shrink-0 border border-ink/25 bg-ink/[0.04] sm:h-12 sm:w-36"
          aria-hidden
        />
      );
    }
    return (
      <Image
        src={asset.src}
        alt={asset.alt}
        width={asset.width}
        height={asset.height}
        sizes={sizes}
        priority={priority}
        onError={() => setMissingSrc(asset.src)}
        /* Both axes auto: with only one set, the image would be laid out
           from the *declared* dimensions, which are routinely wrong. Auto on
           both makes it use the file's own size, capped by the caller's box.
           Next also warns when exactly one axis is overridden. */
        className={`h-auto w-auto shrink-0 object-contain ${className}`}
      />
    );
  }

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
          /* Contain in a locked frame by default: cropping to fill would
             hide part of a render whose ratio differs from the frame's. */
          className={fill && !cover ? "object-contain" : "object-cover"}
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
