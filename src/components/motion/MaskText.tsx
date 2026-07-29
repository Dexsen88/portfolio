"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";

const EASE_PITCH = [0.16, 1, 0.3, 1] as const;

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

/**
 * Renders each line inside a clipping mask and slides it up into place,
 * so the type appears to rise out of the page rather than fade onto it.
 */
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
          viewport: { once: true, margin: "-70px" },
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
                name runs together as "Designmeetsengineering". */}{" "}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
