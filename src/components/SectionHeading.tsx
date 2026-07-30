"use client";

import { motion } from "motion/react";
import { MaskChars } from "./motion/MaskText";
import { Reveal } from "./motion/Reveal";
import Scramble from "./motion/Scramble";

/**
 * Shared section opener: a numeric index, a rule that draws itself across,
 * a scramble-decoded label, and the heading revealed character by character.
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
    <div className="mb-16 md:mb-24">
      <div className="mb-8 flex items-center gap-4">
        <Reveal distance={0}>
          <span className="font-label text-sm tracking-[0.08em] text-ember">
            {index}
          </span>
        </Reveal>

        <motion.span
          aria-hidden
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="h-px flex-1 origin-left bg-gradient-to-r from-ember/80 via-bone/14 to-transparent"
        />

        <Reveal distance={0} delay={0.1}>
          <Scramble
            text={label}
            className="font-label text-xs tracking-[0.18em] text-bone/45 uppercase"
          />
        </Reveal>
      </div>

      <h2 className="font-display text-heading text-bone">
        <MaskChars lines={lines} stagger={0.02} />
      </h2>

      {lead && (
        <Reveal delay={0.15}>
          <p className="mt-8 max-w-[54ch] text-lead text-bone/60">{lead}</p>
        </Reveal>
      )}
    </div>
  );
}
