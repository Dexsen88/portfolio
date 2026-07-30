"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useCallback, useRef, useState } from "react";
import { photo } from "@/content/profile";

/**
 * The portrait is composited into the page rather than framed on it: a red
 * light blooms behind it, the square edges dissolve on a radial mask, and a
 * red gradient sits on top in `soft-light` so the photograph shares the same
 * key light as the rest of the site.
 *
 * If `photo.cutout` is true the mask is skipped — a transparent PNG already
 * has no background to hide.
 */
export default function Portrait() {
  const ref = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["6%", "-6%"]);

  // The <img> is server-rendered, so a 404 fires its error event before React
  // hydrates and `onError` is never seen. Re-check the decoded size on attach.
  const checkLoaded = useCallback((node: HTMLImageElement | null) => {
    if (node?.complete && node.naturalWidth === 0) setFailed(true);
  }, []);

  if (!photo.src) return null;

  return (
    <div ref={ref} className="relative">
      {/* Bloom behind the subject */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 scale-125"
      >
        <div className="absolute inset-0 rounded-full bg-ember/28 blur-[90px]" />
        <div className="absolute inset-x-8 bottom-0 h-1/2 rounded-full bg-blood/50 blur-[70px]" />
      </div>

      <motion.div
        style={{ y }}
        className="group relative aspect-square w-full"
      >
        {/* Fallback panel: if the file is missing you get a lit red plate,
            not a broken-image icon. */}
        {failed ? (
          <div
            aria-hidden
            className="absolute inset-0 rounded-xl bg-gradient-to-br from-blood via-panel to-void"
          />
        ) : (
          /* The mask lives on this wrapper, not on the <img>. Anything left
             outside it keeps its own hard rectangle and shows through the
             faded edges of the photo. */
          <div
            className={`relative size-full ${photo.cutout ? "" : "portrait-fade"}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element --
                a plain img degrades to the fallback plate via onError; the
                Image optimiser throws a dev overlay instead. */}
            <img
              ref={checkLoaded}
              src={photo.src}
              alt={photo.alt}
              onError={() => setFailed(true)}
              className="size-full object-cover contrast-[1.08] saturate-[1.05] transition-transform duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
            />

            {/* Shared key light over the photograph */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 mix-blend-soft-light"
              style={{
                background:
                  "radial-gradient(70% 60% at 75% 15%, rgba(225,29,46,0.85), transparent 70%)",
              }}
            />
            {/* Sink the base into the page */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-void to-transparent"
            />
          </div>
        )}
      </motion.div>

      {failed && (
        <p className="absolute inset-0 grid place-items-center px-8 text-center text-sm text-bone/50">
          Save your photo to{" "}
          <span className="font-label text-glow">public{photo.src}</span> to show
          it here.
        </p>
      )}
    </div>
  );
}
