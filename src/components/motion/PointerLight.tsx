"use client";

import { useEffect } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

/**
 * Drags the ambient red key light around with the cursor.
 *
 * Writes two CSS custom properties on <html> rather than animating a React
 * tree, so the whole effect costs one style mutation per frame and never
 * re-renders anything. The position is eased toward the pointer so the light
 * trails slightly instead of snapping, which reads as a physical lamp.
 *
 * Skipped on touch, where there is no cursor to follow and `.ambience` keeps
 * its static gradient position.
 */
export default function PointerLight() {
  const enabled = useMediaQuery("(hover: hover) and (pointer: fine)");

  useEffect(() => {
    if (!enabled) return;

    const root = document.documentElement;
    // Start where the static gradient sits so there is no visible jump.
    let currentX = 78;
    let currentY = 10;
    let targetX = currentX;
    let targetY = currentY;
    let frame = 0;

    const onMove = (event: PointerEvent) => {
      targetX = (event.clientX / window.innerWidth) * 100;
      targetY = (event.clientY / window.innerHeight) * 100;
    };

    const tick = () => {
      // Low factor means a long, lazy trail.
      currentX += (targetX - currentX) * 0.045;
      currentY += (targetY - currentY) * 0.045;
      root.style.setProperty("--light-x", `${currentX.toFixed(2)}%`);
      root.style.setProperty("--light-y", `${currentY.toFixed(2)}%`);
      frame = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    frame = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
      root.style.removeProperty("--light-x");
      root.style.removeProperty("--light-y");
    };
  }, [enabled]);

  return null;
}
