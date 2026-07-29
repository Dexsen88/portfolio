"use client";

import { motion, type Variants } from "motion/react";
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

export default function Skills() {
  return (
    <section
      id="skills"
      className="relative scroll-mt-24 overflow-hidden border-y border-bone/10 bg-panel/40 py-24 md:py-30"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 size-[38rem] -translate-x-1/2 rounded-full bg-ember/12 blur-[130px]"
      />

      <div className="shell relative">
        <SectionHeading
          index="04"
          label="Skills"
          lines={["What I", "work with"]}
        />

        <div className="border-t border-bone/12">
          {skills.map((group) => (
            <div
              key={group.group}
              className="grid gap-5 border-b border-bone/12 py-8 md:grid-cols-12 md:gap-8 md:py-10"
            >
              <Reveal className="md:col-span-3" distance={16}>
                <h3 className="text-xl font-semibold tracking-tight text-glow">
                  {group.group}
                </h3>
              </Reveal>

              <motion.ul
                variants={listVariants}
                initial="hidden"
                whileInView="shown"
                viewport={{ once: true, margin: "-60px" }}
                className="flex flex-wrap gap-3 md:col-span-9"
              >
                {group.items.map((item) => (
                  <motion.li
                    key={item}
                    variants={pillVariants}
                    className="rounded-md border border-bone/15 px-4 py-2 text-sm font-medium text-bone/85 transition-colors duration-150 hover:border-ember hover:bg-ember hover:text-bone"
                  >
                    {item}
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
