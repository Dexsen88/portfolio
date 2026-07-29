"use client";

import { motion, useScroll, useSpring } from "motion/react";

/** Hairline violet bar pinned to the top edge, tracking page progress. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[65] h-[3px] origin-left bg-ember"
    />
  );
}
