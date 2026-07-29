"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/**
 * `reducedMotion="user"` makes every transform and layout animation on the
 * page defer to the visitor's OS setting, while still allowing opacity to
 * cross-fade — so content never simply fails to appear.
 */
export default function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
