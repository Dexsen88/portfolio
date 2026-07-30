"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { identity } from "@/content/profile";
import Magnetic from "../motion/Magnetic";
import { MaskChars } from "../motion/MaskText";

const EASE_PITCH = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // The light drifts faster than the type, so the hero gains depth as it leaves.
  const lightY = useTransform(scrollYProgress, [0, 1], ["0%", "38%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  // Recedes as it leaves. There was a blur() here too, animated on every
  // scroll frame across the whole hero including 180px type. Filters cannot
  // be composited, so each frame re-rasterised the entire subtree, which was
  // the single largest cause of scroll jank. Opacity, scale and translate
  // are all GPU-composited and cost effectively nothing.
  const contentScale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden pt-28 pb-20 md:pb-16"
    >
      {/* Off-camera red key light */}
      <motion.div
        aria-hidden
        style={{ y: lightY }}
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="glow-ember absolute -top-40 right-[-10%] size-[40rem] rounded-full" />
        <div className="glow-blood absolute top-1/3 -left-40 size-[34rem] rounded-full" />
      </motion.div>

      <motion.div
        style={{
          y: contentY,
          opacity: contentOpacity,
          scale: contentScale,
        }}
        className="shell relative w-full"
      >
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_PITCH }}
          className="mb-8 flex flex-wrap items-center gap-x-5 gap-y-3"
        >
          <span className="font-label text-xs tracking-[0.2em] text-bone/40 uppercase">
            {identity.eyebrow}
          </span>

          {identity.availableForWork && (
            /* The one place red earns its keep above the fold: a single lit
               dot. This used to be a bordered, tinted, pulsing pill with red
               text, which shouted louder than the headline it sat above. */
            <span className="inline-flex items-center gap-2.5">
              <span className="relative grid size-1.5 place-items-center">
                <span className="pulse-ring absolute size-1.5 rounded-full bg-ember" />
                <span className="relative size-1.5 rounded-full bg-ember" />
              </span>
              <span className="font-label text-[0.7rem] tracking-[0.16em] text-bone/50 uppercase">
                {identity.availabilityNote}
              </span>
            </span>
          )}
        </motion.div>

        {/* The headline — the whole page is built around this block */}
        <h1 className="text-bloom font-display text-display text-bone">
          <MaskChars
            lines={identity.headline}
            tail={<span className="text-ember">.</span>}
            trigger="mount"
            delay={0.55}
          />
        </h1>

        {/* Intro + actions */}
        <div className="mt-12 grid gap-10 md:grid-cols-12 md:items-end">
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55, ease: EASE_PITCH }}
            className="max-w-[44ch] text-lead text-bone/55 md:col-span-7"
          >
            {identity.intro}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.68, ease: EASE_PITCH }}
            className="flex flex-wrap items-center gap-4 md:col-span-5 md:justify-end"
          >
            <Magnetic strength={0.3}>
              <a
                href="#projects"
                className="btn-ember group inline-flex items-center gap-3 rounded-md bg-ember px-7 py-4 text-base font-semibold text-bone transition-colors duration-200 hover:bg-glow"
              >
                See the work
                <span
                  aria-hidden
                  className="transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
                >
                  →
                </span>
              </a>
            </Magnetic>

            <Magnetic strength={0.3}>
              <a
                href="#contact"
                className="inline-flex items-center gap-3 rounded-md border border-bone/20 px-7 py-4 text-base font-semibold text-bone transition-colors duration-150 hover:border-bone hover:bg-bone hover:text-void"
              >
                Contact
              </a>
            </Magnetic>
          </motion.div>
        </div>

        {/* Status strip */}
        <motion.dl
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.85 }}
          className="mt-16 grid gap-6 border-t border-bone/12 pt-6 sm:grid-cols-3 md:mt-14"
        >
          {[
            { term: "Currently", detail: identity.currentRole },
            { term: "At", detail: identity.currentCompany },
            { term: "Based in", detail: identity.location },
          ].map((item) => (
            <div key={item.term}>
              <dt className="font-label text-[0.7rem] tracking-[0.18em] text-bone/35 uppercase">
                {item.term}
              </dt>
              <dd className="mt-2 text-base font-medium tracking-tight text-bone/85">
                {item.detail}
              </dd>
            </div>
          ))}
        </motion.dl>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.1 }}
        className="shell absolute inset-x-0 bottom-6 hidden items-center gap-3 md:flex"
      >
        <span className="font-label text-[0.7rem] tracking-[0.18em] text-bone/35 uppercase">
          Scroll
        </span>
        <span className="relative h-px w-24 overflow-hidden bg-bone/15">
          <motion.span
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-y-0 w-1/2 bg-bone/50"
          />
        </span>
      </motion.div>
    </section>
  );
}
