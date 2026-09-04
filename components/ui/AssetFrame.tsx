import Image from "next/image";
import type { ImageAsset } from "@/types/project";

/**
 * A framed asset that holds its aspect ratio whether or not the artwork
 * exists yet.
 *
 * The `src` paths in `data/project.ts` are placeholders — nothing is in
 * `/public` — so rendering `next/image` today would 404 once per render and
 * collapse the layout. Until the artwork lands, this draws a technical
 * stand-in at the asset's true aspect ratio, so the composition is real even
 * though the pictures are not.
 *
 * Flip ASSETS_AVAILABLE to true once the files exist. Nothing else changes.
 */

export const ASSETS_AVAILABLE = false;

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
  /** Passed to next/image once assets exist; ignored by the placeholder. */
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
  /* In fill mode the parent owns the box, so the frame must not also
     declare a ratio — two competing boxes is exactly the jump this avoids. */
  const box = fill
    ? { className: "absolute inset-0", style: undefined }
    : {
        className: "relative",
        style: { aspectRatio: `${asset.width} / ${asset.height}` },
      };

  if (ASSETS_AVAILABLE) {
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
