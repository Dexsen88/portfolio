"use client";

import { motion } from "motion/react";
import { useCallback, useState } from "react";
import type { Shot } from "@/content/profile";

/**
 * Grid of supporting photographs for a role or venture.
 *
 * Each tile always reserves its 4:3 box. An earlier version only applied the
 * aspect ratio once the image had decoded, to keep missing files from leaving
 * empty frames — but combined with the clip-path reveal that deadlocked: a
 * lazy image inside a zero-height, fully-clipped tile is never fetched, so it
 * never loads, so the tile never gains height, so the reveal never fires.
 * Layout must not depend on load state.
 *
 * Files that 404 still drop out of the grid entirely. As with the portrait,
 * the error fires before hydration, so the decoded size is re-checked when
 * each node attaches rather than trusting `onError` alone.
 */
export default function Gallery({ shots }: { shots: Shot[] }) {
  const [broken, setBroken] = useState<string[]>([]);

  const markBroken = useCallback((src: string) => {
    setBroken((current) => (current.includes(src) ? current : [...current, src]));
  }, []);

  const visible = shots.filter((shot) => !broken.includes(shot.src));
  if (visible.length === 0) return null;

  const single = visible.length === 1;

  return (
    <ul
      className={`mt-8 grid gap-3 ${
        single ? "max-w-xl" : "sm:grid-cols-2 lg:grid-cols-3"
      }`}
    >
      {visible.map((shot, index) => (
        <li key={shot.src}>
          <motion.figure
            data-cursor-label="View"
            /* Wipes open from the bottom rather than fading, so the grid
               builds itself tile by tile. */
            initial={{ clipPath: "inset(100% 0 0 0)", y: 24 }}
            whileInView={{ clipPath: "inset(0% 0 0 0)", y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            whileHover={{ y: -4 }}
            transition={{
              duration: 0.8,
              delay: index * 0.09,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="group/shot relative aspect-[4/3] overflow-hidden rounded-lg border border-bone/12 bg-panel"
          >
            {/* eslint-disable-next-line @next/next/no-img-element --
                see the note above: this needs onError plus an attach-time
                check, which the Image optimiser does not give us. */}
            <img
              ref={(node) => {
                if (node?.complete && node.naturalWidth === 0) {
                  markBroken(shot.src);
                }
              }}
              src={shot.src}
              alt={shot.alt}
              loading="lazy"
              onError={() => markBroken(shot.src)}
              className={`size-full transition-transform duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/shot:scale-[1.03] ${
                shot.fit === "contain" ? "object-contain p-2" : "object-cover"
              }`}
            />

            {/* Ties the photographs into the red-lit page without washing
                out faces or certificate text. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-ember/10 opacity-100 transition-opacity duration-300 group-hover/shot:opacity-0"
            />
          </motion.figure>
        </li>
      ))}
    </ul>
  );
}
