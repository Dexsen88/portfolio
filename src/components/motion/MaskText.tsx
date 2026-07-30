"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";

const EASE_PITCH = [0.16, 1, 0.3, 1] as const;

/* ------------------------------------------------------------------
   Line-level reveal: the whole line rises out of a clipping mask.
   Used where the content is arbitrary nodes rather than plain text.
   ------------------------------------------------------------------ */

const lineVariants: Variants = {
  hidden: { y: "110%" },
  shown: { y: "0%", transition: { duration: 0.9, ease: EASE_PITCH } },
};

const trackVariants: Variants = {
  hidden: {},
  shown: (stagger: number = 0.09) => ({
    transition: { staggerChildren: stagger },
  }),
};

type MaskLinesProps = {
  /** One entry per rendered line. */
  lines: ReactNode[];
  className?: string;
  lineClassName?: string;
  /** "mount" for above-the-fold type, "view" for everything below. */
  trigger?: "mount" | "view";
  delay?: number;
  stagger?: number;
};

export function MaskLines({
  lines,
  className,
  lineClassName,
  trigger = "view",
  delay = 0,
  stagger = 0.09,
}: MaskLinesProps) {
  const activation =
    trigger === "mount"
      ? { animate: "shown" as const }
      : {
          whileInView: "shown" as const,
          viewport: { once: true, amount: 0.35 },
        };

  return (
    <motion.span
      className={className}
      variants={trackVariants}
      custom={stagger}
      initial="hidden"
      transition={{ delayChildren: delay }}
      {...activation}
    >
      {lines.map((line, index) => (
        <span key={index} className="mask-line">
          <motion.span
            className={`block ${lineClassName ?? ""}`}
            variants={lineVariants}
          >
            {line}
            {/* Each line is its own block, so without this the accessible
                name runs together as "Communitymeetscode". */}{" "}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

/* ------------------------------------------------------------------
   Character-level reveal: every glyph swings up on its own hinge.
   The showpiece treatment, for the hero and contact headlines.
   ------------------------------------------------------------------ */

const charTrack: Variants = {
  hidden: {},
  shown: (stagger: number = 0.028) => ({
    transition: { staggerChildren: stagger },
  }),
};

const charVariants: Variants = {
  hidden: { y: "115%", rotateX: -75, opacity: 0 },
  shown: {
    y: "0%",
    rotateX: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 220, damping: 24, mass: 0.9 },
  },
};

/** Reduced motion: no hinge, no travel, just a soft fade in place. */
const charVariantsCalm: Variants = {
  hidden: { opacity: 0 },
  shown: { opacity: 1, transition: { duration: 0.4, ease: EASE_PITCH } },
};

type MaskCharsProps = {
  /** One string per rendered line. Split into characters internally. */
  lines: string[];
  /** Appended to the final line, outside the split (e.g. a coloured full stop). */
  tail?: ReactNode;
  className?: string;
  trigger?: "mount" | "view";
  delay?: number;
  stagger?: number;
};

export function MaskChars({
  lines,
  tail,
  className,
  trigger = "view",
  delay = 0,
  stagger = 0.028,
}: MaskCharsProps) {
  const reduced = useReducedMotion();
  const variants = reduced ? charVariantsCalm : charVariants;

  const activation =
    trigger === "mount"
      ? { animate: "shown" as const }
      : {
          whileInView: "shown" as const,
          viewport: { once: true, amount: 0.3 },
        };

  return (
    <motion.span
      className={className}
      variants={charTrack}
      custom={reduced ? 0.012 : stagger}
      initial="hidden"
      transition={{ delayChildren: delay }}
      {...activation}
    >
      {lines.map((line, lineIndex) => (
        <span key={lineIndex} className="mask-line">
          {/* Perspective on the line makes the per-glyph rotateX read as a
              hinge rather than a vertical squash. */}
          <span
            className="block [perspective:600px] [transform-style:preserve-3d]"
          >
            {/* Spaces are swapped for U+00A0 below: a normal space collapses
                to nothing once each glyph becomes an inline-block. */}
            {line.split("").map((char, charIndex) => (
              /* Two nested spans on purpose. Motion owns the inner
                 transform for the reveal, so the hover lift has to live on
                 an outer element or the inline style it writes wins. */
              <span
                key={charIndex}
                className="inline-block transition-[transform,color] duration-300 ease-out hover:-translate-y-[0.07em] hover:text-ember"
              >
              <motion.span
                variants={variants}
                className="inline-block origin-bottom will-change-transform"
              >
                {char === " " ? " " : char}
              </motion.span>
              </span>
            ))}
            {lineIndex === lines.length - 1 && tail}
            {/* Keeps the accessible name from running lines together. */}{" "}
          </span>
        </span>
      ))}
    </motion.span>
  );
}
