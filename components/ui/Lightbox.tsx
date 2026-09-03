"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Lightbox — a modal built on the native `<dialog>` element.
 *
 * `showModal()` is doing the heavy lifting deliberately. The browser gives us
 * the focus trap, Escape-to-close, the top layer (so nothing can z-index above
 * it), inert background content, and focus returned to the trigger on close.
 * A hand-rolled trap would be more code and worse.
 *
 * What is left to us: closing on backdrop click, locking the page behind it,
 * and labelling the dialog.
 */

export interface LightboxProps {
  open: boolean;
  onClose: () => void;
  /** Announced as the dialog's accessible name. */
  title: string;
  caption?: string;
  /** Small monospace detail printed opposite the title, e.g. a code. */
  meta?: string;
  children: ReactNode;
}

export default function Lightbox({
  open,
  onClose,
  title,
  caption,
  meta,
  children,
}: LightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const prefersReducedMotion = useReducedMotion() ?? false;
  const titleId = useId();

  // Drive the native dialog from the `open` prop.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // `showModal` does not stop the page behind from scrolling.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      // Fires for Escape as well as `close()`, so this is the single exit path.
      onClose={onClose}
      onClick={(event) => {
        // The dialog element fills the viewport; a click landing on it rather
        // than on its contents is a backdrop click.
        if (event.target === dialogRef.current) onClose();
      }}
      // The backdrop itself is styled in globals.css; ::backdrop cannot read
      // the element's own custom properties, so it needs a real rule.
      className="m-0 h-full max-h-none w-full max-w-none bg-transparent p-0"
    >
      <div className="flex h-full w-full items-center justify-center p-4 sm:p-8">
        <motion.div
          className="flex max-h-full w-full max-w-5xl flex-col gap-4"
          initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.985 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { duration: 0.22, ease: "easeOut" }
          }
        >
          <div className="flex items-baseline justify-between gap-6 border-b border-ground/30 pb-3">
            <h2
              id={titleId}
              className="text-sm uppercase tracking-[0.22em] text-ground"
            >
              {title}
            </h2>
            <div className="flex items-baseline gap-6">
              {meta ? (
                <span className="hidden text-[10px] uppercase tracking-[0.2em] text-ground/60 sm:block">
                  {meta}
                </span>
              ) : null}
              <button
                type="button"
                onClick={onClose}
                className="text-[10px] uppercase tracking-[0.2em] text-ground underline underline-offset-4 outline-none focus-visible:ring-1 focus-visible:ring-line-primary"
              >
                Close
              </button>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-auto">{children}</div>

          {caption ? (
            <p className="max-w-prose text-xs leading-relaxed text-ground/80">
              {caption}
            </p>
          ) : null}
        </motion.div>
      </div>
    </dialog>
  );
}
