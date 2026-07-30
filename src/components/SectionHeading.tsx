"use client";

import { motion } from "motion/react";
import { MaskChars } from "./motion/MaskText";
import { Reveal } from "./motion/Reveal";

/**
 * Shared section opener: a numeric index, a rule that draws itself across, a
 * quiet label, then the heading revealed character by character.
 *
 * The label used to decode from random glyphs on entry. It was the kind of
 * effect that gets noticed as an effect, which is the opposite of what a
 * section label is for.
 */
export default function SectionHeading({
  index,
  label,
  lines,
  lead,
}: {
  index: string;
  label: string;
  lines: string[];
  lead?: string;
}) {
  return (
    <div className="mb-20 md:mb-28">
      <div className="mb-10 flex items-baseline gap-5 md:mb-12">
        <Reveal distance={0}>
          <span className="font-label text-xs tracking-[0.2em] text-ember">
            {index}
          </span>
        </Reveal>

        <Reveal distance={0} delay={0.06}>
          <span className="font-label text-xs tracking-[0.2em] text-bone/40 uppercase">
            {label}
          </span>
        </Reveal>

        <motion.span
          aria-hidden
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="hairline h-px flex-1 origin-left"
        />
      </div>

      <h2 className="font-display text-heading text-bone">
        <MaskChars lines={lines} stagger={0.018} />
      </h2>

      {lead && (
        <Reveal delay={0.15}>
          <p className="mt-10 max-w-[52ch] text-lead text-bone/55">{lead}</p>
        </Reveal>
      )}
    </div>
  );
}
