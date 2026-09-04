"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { pauseSmoothScroll, resumeSmoothScroll } from "@/lib/smooth-scroll";

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

  /* `close` does not bubble, so it cannot be relied on to reach React's
     delegated handler. Escape closes the dialog natively and fires it, and if
     that never reaches us the component still believes it is open: the scroll
     lock is never released and the next click cannot reopen it, because the
     `open` prop has not changed. Listening on the element directly is the
     only version of this that survives Escape. */
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => onClose();
    /* Escape fires `cancel` first, and it is cancelable. Taking it here and
       closing through React keeps state authoritative: the DOM never closes
       behind the component's back, which would strand the scroll lock and
       leave `open` true so the next click could not reopen it. */
    const handleCancel = (event: Event) => {
      event.preventDefault();
      onClose();
    };
    dialog.addEventListener("close", handleClose);
    dialog.addEventListener("cancel", handleCancel);
    return () => {
      dialog.removeEventListener("close", handleClose);
      dialog.removeEventListener("cancel", handleCancel);
    };
  }, [onClose]);

  // Drive the native dialog from the `open` prop.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  /* `showModal` does not stop the page behind from scrolling, and neither
     does `overflow: hidden` once Lenis is running — it drives the scroll
     position programmatically and ignores overflow. Both are needed: the
     overflow lock for native scrolling, and pausing Lenis for smooth.

     Cleanup *removes* the property rather than restoring a captured value.
     There is a lightbox per gallery, so a second one opening while the first
     is still mounted would capture "hidden" as its own baseline and restore
     that on close, leaving the page permanently unscrollable. */
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    pauseSmoothScroll();
    return () => {
      root.style.removeProperty("overflow");
      resumeSmoothScroll();
    };
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
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

          <div className="min-h-0 flex-1 overflow-auto" data-lenis-prevent>
            {children}
          </div>

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
