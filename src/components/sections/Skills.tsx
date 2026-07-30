"use client";

import { motion, useScroll, useTransform, type Variants } from "motion/react";
import { useRef } from "react";
import { skills } from "@/content/profile";
import SectionHeading from "../SectionHeading";
import { Reveal } from "../motion/Reveal";

const EASE_PITCH = [0.16, 1, 0.3, 1] as const;

const listVariants: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.04 } },
};

const pillVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE_PITCH } },
};

/**
 * One row of pills. Alternate rows slide in opposite directions as the
 * section passes, so the block shears gently instead of sitting still.
 */
function Group({
  group,
  items,
  reverse,
}: {
  group: string;
  items: string[];
  reverse: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  /**
   * Read straight off scroll progress with no spring. Five springs, one per
   * row, meant five animations ticking through every scroll frame. Lenis
   * already smooths the scroll position itself, so the spring was buying
   * almost nothing for five times the cost.
   */
  const drift = useTransform(
    scrollYProgress,
    [0, 1],
    reverse ? [28, -28] : [-28, 28],
  );

  return (
    <div
      ref={ref}
      className="grid gap-5 border-b border-bone/12 py-8 md:grid-cols-12 md:gap-8 md:py-10"
    >
      <Reveal className="md:col-span-3" distance={16}>
        <h3 className="text-xl font-semibold tracking-tight text-glow">{group}</h3>
      </Reveal>

      <motion.ul
        variants={listVariants}
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true, amount: 0.3 }}
        style={{ x: drift }}
        className="flex flex-wrap gap-3 md:col-span-9"
      >
        {items.map((item) => (
          <motion.li
            key={item}
            variants={pillVariants}
            whileHover={{ y: -3, scale: 1.04 }}
            transition={{ type: "spring", stiffness: 420, damping: 22 }}
            className="rounded-md border border-bone/15 px-4 py-2 text-sm font-medium text-bone/85 transition-colors duration-150 hover:border-ember hover:bg-ember hover:text-bone"
          >
            {item}
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}

export default function Skills() {
  return (
    <section
      id="skills"
      className="relative scroll-mt-24 overflow-hidden border-y border-bone/10 bg-panel/40 py-24 md:py-30"
    >
      <div
        aria-hidden
        className="glow-ember pointer-events-none absolute -top-32 left-1/2 size-[38rem] -translate-x-1/2 rounded-full opacity-60"
      />

      <div className="shell relative">
        <SectionHeading
          index="04"
          label="Skills"
          lines={["What I", "work with"]}
        />

        <div className="border-t border-bone/12">
          {skills.map((group, index) => (
            <Group
              key={group.group}
              group={group.group}
              items={group.items}
              reverse={index % 2 === 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
