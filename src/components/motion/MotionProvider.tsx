"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/**
 * `reducedMotion="never"`: animations play for every visitor rather than
 * deferring to the OS setting, by explicit request.
 *
 * A deliberate accessibility trade-off, and it also removes a real failure.
 * With the setting honoured, the hero headline's glyphs stayed hidden and the
 * page showed nothing but the red full stop after "code". Reveals now animate
 * transform only and never gate visibility, so that class of bug cannot recur
 * either way.
 */
export default function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="never">{children}</MotionConfig>;
}
