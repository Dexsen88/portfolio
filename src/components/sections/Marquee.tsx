"use client";

import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { marqueeWords } from "@/content/profile";

function Track({ reverse = false }: { reverse?: boolean }) {
  // The list is rendered twice so the -50% keyframe lands on a seamless join.
  const words = [...marqueeWords, ...marqueeWords];

  return (
    <div
      className={`flex w-max shrink-0 items-center ${
        reverse ? "marquee-track-reverse" : "marquee-track"
      }`}
    >
      {words.map((word, index) => (
        <span key={index} className="flex items-center">
          <span className="px-8 text-3xl font-semibold tracking-[-0.03em] whitespace-nowrap text-bone md:text-4xl">
            {word}
          </span>
          <span aria-hidden className="text-lg text-ember">
            ✦
          </span>
        </span>
      ))}
    </div>
  );
}

/**
 * Full-bleed band, two tracks running against each other.
 *
 * The CSS animation supplies the constant drift; scroll velocity is layered
 * on top as a skew and a slight horizontal shove, so throwing the page
 * around visibly drags the type with it. Velocity is spring-smoothed, or a
 * fast flick would snap the skew instead of easing it.
 */
export default function Marquee() {
  const { scrollY } = useScroll();
  const rawVelocity = useVelocity(scrollY);
  const velocity = useSpring(rawVelocity, {
    stiffness: 260,
    damping: 42,
    mass: 0.4,
  });

  const skew = useTransform(velocity, [-2500, 0, 2500], [5, 0, -5], {
    clamp: true,
  });
  const shove = useTransform(velocity, [-2500, 0, 2500], [44, 0, -44], {
    clamp: true,
  });

  const style = { skewX: skew, x: shove };

  return (
    <section
      aria-hidden
      className="marquee-host relative overflow-hidden border-y border-bone/10 bg-panel/60 py-10 md:py-14"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ember/12 via-transparent to-ember/12"
      />
      <motion.div style={style} className="relative will-change-transform">
        <div className="flex overflow-hidden">
          <Track />
        </div>
        <div className="mt-3 flex overflow-hidden opacity-40">
          <Track reverse />
        </div>
      </motion.div>
    </section>
  );
}
