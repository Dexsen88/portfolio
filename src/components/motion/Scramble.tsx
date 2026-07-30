"use client";

import { useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/\\<>[]{}*#%$";

/**
 * Decodes its text when scrolled into view: every character churns through
 * random glyphs, then locks in from left to right.
 *
 * The churn runs on one interval for the whole string rather than a timer per
 * character, and the real text is always present for assistive tech.
 */
export default function Scramble({
  text,
  className,
  /** Milliseconds each character stays scrambled before locking. */
  lockStep = 55,
  tickMs = 42,
}: {
  text: string;
  className?: string;
  lockStep?: number;
  tickMs?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (!inView || reduced) return;

    const started = Date.now();
    const total = text.length * lockStep + 260;

    const interval = window.setInterval(() => {
      const elapsed = Date.now() - started;
      const locked = Math.floor(elapsed / lockStep);

      setDisplay(
        text
          .split("")
          .map((char, index) => {
            if (index < locked || char === " ") return char;
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join(""),
      );

      if (elapsed >= total) {
        window.clearInterval(interval);
        setDisplay(text);
      }
    }, tickMs);

    return () => window.clearInterval(interval);
  }, [inView, reduced, text, lockStep, tickMs]);

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>{reduced ? text : display}</span>
    </span>
  );
}
