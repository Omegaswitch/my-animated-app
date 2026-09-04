import Image from "next/image";
import type { ImageAsset } from "@/types/project";

/**
 * A framed asset that holds its aspect ratio whether or not the artwork
 * exists yet.
 *
 * Rendering `next/image` for a file that is not in `/public` 404s on every
 * paint, so anything not yet uploaded gets a technical stand-in drawn at the
 * asset's true aspect ratio. The composition is real even when the pictures
 * are not.
 *
 * ## Adding artwork
 *
 * Upload the file, then add its path to `AVAILABLE_ASSETS`. Per-file rather
 * than one global switch, because the artwork arrives a few pieces at a time:
 * a single flag would mean either every placeholder stays until the last file
 * lands, or every missing file starts 404ing the moment the first one does.
 *
 * Set it to `true` instead of a list once everything is in — that skips the
 * lookup and treats all assets as present.
 */

export const AVAILABLE_ASSETS: true | readonly string[] = [
  // Add each path as its file lands in `public/`.
];

function isAvailable(src: string): boolean {
  return AVAILABLE_ASSETS === true || AVAILABLE_ASSETS.includes(src);
}

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

  if (isAvailable(asset.src)) {
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
