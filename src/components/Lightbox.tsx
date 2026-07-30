"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import type { Shot } from "@/content/profile";

const EASE_PITCH = [0.16, 1, 0.3, 1] as const;

/**
 * Full-screen viewer for a gallery.
 *
 * Rendered through a portal to <body> on purpose. Project cards sit inside a
 * `perspective` / `preserve-3d` ancestor, and `position: fixed` inside a
 * transformed element is contained by that element rather than the viewport,
 * so an in-place overlay would be trapped inside the card.
 */
export default function Lightbox({
  shots,
  index,
  onClose,
  onIndexChange,
}: {
  shots: Shot[];
  /** null closes the viewer. */
  index: number | null;
  onClose: () => void;
  onIndexChange: (next: number) => void;
}) {
  const open = index !== null;

  const step = useCallback(
    (delta: number) => {
      if (index === null) return;
      onIndexChange((index + delta + shots.length) % shots.length);
    },
    [index, shots.length, onIndexChange],
  );

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };

    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);

    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, step]);

  // createPortal needs a real document; there is none while rendering on the
  // server. The overlay only ever has content after a click, so nothing is
  // lost by rendering nothing here.
  if (typeof document === "undefined") return null;

  const shot = index === null ? null : shots[index];

  return createPortal(
    <AnimatePresence>
      {shot && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={shot.alt}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: EASE_PITCH }}
          onClick={onClose}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-void/92 p-4 backdrop-blur-md md:p-10"
        >
          <motion.img
            key={shot.src}
            src={shot.src}
            alt={shot.alt}
            initial={{ scale: 0.94, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE_PITCH }}
            /* Stop the backdrop handler firing when the picture itself is
               clicked, or the viewer closes the moment you touch it. */
            onClick={(event) => event.stopPropagation()}
            className="max-h-full max-w-full rounded-lg object-contain shadow-elevated"
          />

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-5 right-5 grid size-11 place-items-center rounded-md border border-bone/20 bg-void/70 text-bone transition-colors duration-150 hover:border-ember hover:bg-ember"
          >
            <svg viewBox="0 0 16 16" aria-hidden className="size-4">
              <path
                d="M3 3l10 10M13 3L3 13"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>
          </button>

          {shots.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous image"
                onClick={(event) => {
                  event.stopPropagation();
                  step(-1);
                }}
                className="absolute left-3 grid size-11 place-items-center rounded-md border border-bone/20 bg-void/70 text-bone transition-colors duration-150 hover:border-ember hover:bg-ember md:left-6"
              >
                <svg viewBox="0 0 16 16" aria-hidden className="size-4">
                  <path
                    d="M10 3L5 8l5 5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                type="button"
                aria-label="Next image"
                onClick={(event) => {
                  event.stopPropagation();
                  step(1);
                }}
                className="absolute right-3 grid size-11 place-items-center rounded-md border border-bone/20 bg-void/70 text-bone transition-colors duration-150 hover:border-ember hover:bg-ember md:right-6"
              >
                <svg viewBox="0 0 16 16" aria-hidden className="size-4">
                  <path
                    d="M6 3l5 5-5 5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <p className="absolute bottom-5 font-label text-xs tracking-[0.14em] text-bone/60 uppercase">
                {(index ?? 0) + 1} / {shots.length}
              </p>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
