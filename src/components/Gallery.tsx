"use client";

import { motion } from "motion/react";
import { useCallback, useState } from "react";
import type { Shot } from "@/content/profile";
import Lightbox from "./Lightbox";

/**
 * Grid of supporting photographs for a role or venture. Tiles are buttons
 * that open the image full screen.
 *
 * Two hard-won constraints:
 *
 *  - Tiles always reserve their 4:3 box. An earlier version only applied the
 *    aspect ratio once the image had decoded, which deadlocked with the
 *    reveal: a tile with no height is never intersected, so the reveal never
 *    fires and the image never appears. Layout must not depend on load state.
 *
 *  - The entrance animates only transform, never opacity or clip-path. If the
 *    reveal never runs the photo must still be plainly visible.
 *
 * Images are also deliberately eager. With loading="lazy" they were never
 * fetched at all in a real browser, verified via naturalWidth staying 0.
 */
export default function Gallery({ shots }: { shots: Shot[] }) {
  const [broken, setBroken] = useState<string[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const markBroken = useCallback((src: string) => {
    setBroken((current) => (current.includes(src) ? current : [...current, src]));
  }, []);

  const visible = shots.filter((shot) => !broken.includes(shot.src));
  if (visible.length === 0) return null;

  const single = visible.length === 1;

  return (
    <>
      <ul
        className={`mt-8 grid gap-3 ${
          single ? "max-w-xl" : "sm:grid-cols-2 lg:grid-cols-3"
        }`}
      >
        {visible.map((shot, index) => (
          <motion.li
            key={shot.src}
            initial={{ y: 14, scale: 0.97 }}
            whileInView={{ y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.7,
              delay: index * 0.09,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <motion.button
              type="button"
              onClick={() => setOpenIndex(index)}
              aria-label={`View larger: ${shot.alt}`}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.985 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="panel-raised group/shot relative block aspect-[4/3] w-full cursor-pointer overflow-hidden rounded-lg border border-bone/10 bg-panel transition-colors duration-300 hover:border-ember/40"
            >
              {/* eslint-disable-next-line @next/next/no-img-element --
                  needs onError plus an attach-time check, which the Image
                  optimiser does not give us. */}
              <img
                ref={(node) => {
                  if (node?.complete && node.naturalWidth === 0) {
                    markBroken(shot.src);
                  }
                }}
                src={shot.src}
                alt={shot.alt}
                decoding="async"
                fetchPriority="low"
                onError={() => markBroken(shot.src)}
                className={`size-full transition-transform duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/shot:scale-[1.03] ${
                  shot.fit === "contain" ? "object-contain p-2" : "object-cover"
                }`}
              />

              {/* A neutral scrim rather than the red one that used to sit
                  here. Tinting every photograph made them look filtered, and
                  a portfolio's photographs should be shown, not styled. */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-void/25 transition-opacity duration-300 group-hover/shot:opacity-0"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 flex items-end justify-end p-3 opacity-0 transition-opacity duration-300 group-hover/shot:opacity-100"
              >
                {/* Solid rather than backdrop-blurred: seven of these sit in
                    the DOM at all times, and a backdrop filter composites
                    even while the chip is hidden. */}
                <span className="rounded-md bg-void/90 px-3 py-1.5 font-label text-[0.65rem] tracking-[0.16em] text-bone uppercase">
                  View
                </span>
              </span>
            </motion.button>
          </motion.li>
        ))}
      </ul>

      <Lightbox
        shots={visible}
        index={openIndex}
        onClose={() => setOpenIndex(null)}
        onIndexChange={setOpenIndex}
      />
    </>
  );
}
