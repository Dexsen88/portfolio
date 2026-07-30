"use client";

import { motion, useInView, type Variants } from "motion/react";
import { useRef } from "react";

const EASE_PITCH = [0.16, 1, 0.3, 1] as const;

/** Each column spins through this many 0-9 cycles before landing. */
const CYCLES = 3;
const STRIP = Array.from({ length: CYCLES * 10 }, (_, i) => i % 10);

function Digit({ digit, delay, spin }: { digit: number; delay: number; spin: boolean }) {
  // Land on the matching face in the final cycle, so the column spins
  // through two full revolutions on the way there.
  const offset = spin ? (CYCLES - 1) * 10 + digit : digit;

  const variants: Variants = {
    rest: { y: "0em" },
    roll: {
      y: `-${offset}em`,
      transition: {
        duration: spin ? 1.6 : 0.5,
        delay,
        ease: EASE_PITCH,
      },
    },
  };

  return (
    <span
      aria-hidden
      className="inline-block h-[1em] overflow-hidden leading-none"
    >
      <motion.span variants={variants} className="flex flex-col leading-none">
        {STRIP.map((face, index) => (
          <span key={index} className="block h-[1em] leading-none">
            {face}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

/**
 * Odometer counter. Digit columns spin up to the target the first time the
 * stat scrolls into view, staggered left to right.
 *
 * Two deliberate choices, both from this failing on mobile before:
 *  - `amount` rather than a negative `margin`, which is far more reliable
 *    across mobile browsers than a shrunken IntersectionObserver root.
 *  - Reduced motion shortens the roll instead of skipping it. A number
 *    changing is not a vestibular trigger, and phones report reduced motion
 *    for things like battery saver, which silently killed the whole effect.
 */
export default function CountUp({
  value,
  suffix = "",
}: {
  value: number;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  const formatted = value.toLocaleString("en-US");
  const chars = formatted.split("");
  const digitCount = formatted.replace(/\D/g, "").length;

  // Position of each character among the digits only, so separators do not
  // consume a stagger slot. Derived rather than accumulated, because a
  // counter mutated inside the render callback is not safe across re-renders.
  const digitPositions = chars.map((char, index) =>
    /\d/.test(char)
      ? chars.slice(0, index).filter((prior) => /\d/.test(prior)).length
      : -1,
  );

  return (
    <span ref={ref} className="inline-flex items-baseline tabular-nums">
      {/* Screen readers get the plain figure, not thirty spinning faces. */}
      <span className="sr-only">
        {formatted}
        {suffix}
      </span>

      <motion.span
        aria-hidden
        variants={{}}
        initial="rest"
        animate={inView ? "roll" : "rest"}
        className="inline-flex items-baseline leading-none"
      >
        {chars.map((char, index) => {
          const position = digitPositions[index];
          if (position < 0) {
            return (
              <span key={index} className="leading-none">
                {char}
              </span>
            );
          }
          return (
            <Digit
              key={index}
              digit={Number(char)}
              delay={position * 0.08}
              spin={digitCount <= 6}
            />
          );
        })}
      </motion.span>

      {suffix && (
        <motion.span
          aria-hidden
          initial={{ opacity: 0, scale: 0.4 }}
          animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.4 }}
          transition={{
            duration: 0.5,
            delay: 0.9,
            ease: EASE_PITCH,
          }}
          className="leading-none"
        >
          {suffix}
        </motion.span>
      )}
    </span>
  );
}
