"use client";

import { useEffect, useRef } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

/**
 * A soft red key light that trails the cursor.
 *
 * This used to write CSS custom properties on <html> that fed the radial
 * gradients in `.ambience`. That looked identical and was very expensive:
 * changing a variable used inside a background gradient invalidates the
 * paint of that entire full-screen layer, so the browser repainted three
 * huge gradients every single frame.
 *
 * Now the gradient is painted once into its own fixed element and only ever
 * moved with `translate3d`, which the compositor handles without repainting
 * anything. The easing toward the pointer is what makes it feel like a lamp
 * being carried rather than a cursor decoration.
 *
 * Skipped on touch, where there is no cursor to follow.
 */
export default function PointerLight() {
  const enabled = useMediaQuery("(hover: hover) and (pointer: fine)");
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;
    const layer = layerRef.current;
    if (!layer) return;

    let currentX = window.innerWidth * 0.75;
    let currentY = window.innerHeight * 0.15;
    let targetX = currentX;
    let targetY = currentY;
    let frame = 0;
    let idle = 0;

    const onMove = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      idle = 0;
      if (!frame) frame = requestAnimationFrame(tick);
    };

    function tick() {
      const dx = targetX - currentX;
      const dy = targetY - currentY;
      currentX += dx * 0.05;
      currentY += dy * 0.05;

      layer!.style.transform = `translate3d(${currentX.toFixed(1)}px, ${currentY.toFixed(1)}px, 0) translate(-50%, -50%)`;

      // Park the loop once it has effectively caught up, so an idle page is
      // not burning a frame callback forever.
      if (Math.abs(dx) < 0.4 && Math.abs(dy) < 0.4) {
        idle += 1;
        if (idle > 12) {
          frame = 0;
          return;
        }
      } else {
        idle = 0;
      }

      frame = requestAnimationFrame(tick);
    }

    layer.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
    window.addEventListener("pointermove", onMove, { passive: true });
    frame = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={layerRef}
      aria-hidden
      className="glow-ember pointer-events-none fixed top-0 left-0 -z-[1] size-[80rem] rounded-full opacity-70 will-change-transform"
    />
  );
}
