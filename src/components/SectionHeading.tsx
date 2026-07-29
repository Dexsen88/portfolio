import type { ReactNode } from "react";
import { MaskLines } from "./motion/MaskText";
import { Reveal } from "./motion/Reveal";

/**
 * Shared section opener: a numeric index, the masked heading, and an optional
 * lead paragraph.
 */
export default function SectionHeading({
  index,
  label,
  lines,
  lead,
}: {
  index: string;
  label: string;
  lines: ReactNode[];
  lead?: string;
}) {
  return (
    <div className="mb-16 md:mb-24">
      <Reveal className="mb-8 flex items-center gap-4">
        <span className="font-label text-sm tracking-[0.08em] text-ember">
          {index}
        </span>
        <span aria-hidden className="h-px flex-1 bg-bone/12" />
        <span className="font-label text-xs tracking-[0.18em] text-bone/45 uppercase">
          {label}
        </span>
      </Reveal>

      <h2 className="font-display text-heading text-bone">
        <MaskLines lines={lines} stagger={0.08} />
      </h2>

      {lead && (
        <Reveal delay={0.15}>
          <p className="mt-8 max-w-[54ch] text-lead text-bone/60">{lead}</p>
        </Reveal>
      )}
    </div>
  );
}
