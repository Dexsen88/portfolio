"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const INTERACTIVE = 'a, button, [role="button"], input, textarea, [data-cursor-hover]';

/**
 * A two-part pointer: a hard dot that tracks exactly, and a soft ring that
 * trails behind and swells over anything interactive. Difference blending
 * keeps it legible on both the white canvas and the violet panels.
 *
 * Only mounts for real pointers, and never when reduced motion is requested.
 */
export default function Cursor() {
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const enabled = finePointer && !reduced;

  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const ringX = useSpring(x, { stiffness: 320, damping: 28, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 320, damping: 28, mass: 0.5 });
  const dotX = useSpring(x, { stiffness: 900, damping: 40, mass: 0.2 });
  const dotY = useSpring(y, { stiffness: 900, damping: 40, mass: 0.2 });

  useEffect(() => {
    if (!enabled) return;

    document.body.dataset.customCursor = "on";

    let seenPointer = false;

    const onMove = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);

      // Teleport on the very first move; otherwise the springs visibly
      // fly in from the top-left corner as the cursor fades up.
      if (!seenPointer) {
        seenPointer = true;
        ringX.jump(event.clientX);
        ringY.jump(event.clientY);
        dotX.jump(event.clientX);
        dotY.jump(event.clientY);
      }

      setVisible(true);
      setHovering(
        Boolean((event.target as HTMLElement | null)?.closest?.(INTERACTIVE)),
      );
    };

    const onLeave = () => setVisible(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      delete document.body.dataset.customCursor;
    };
  }, [enabled, x, y, ringX, ringY, dotX, dotY]);

  if (!enabled) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[70] mix-blend-difference"
    >
      {/* `initial` matters: without it both elements paint at full opacity
          in the top-left corner until the first pointermove arrives. */}
      <motion.div
        className="absolute top-0 left-0 rounded-full border border-white"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        initial={{ opacity: 0, width: 34, height: 34 }}
        animate={{
          width: hovering ? 56 : 34,
          height: hovering ? 56 : 34,
          opacity: visible ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.div
        className="absolute top-0 left-0 rounded-full bg-white"
        style={{ x: dotX, y: dotY, translateX: "-50%", translateY: "-50%" }}
        initial={{ opacity: 0, width: 7, height: 7 }}
        animate={{
          width: hovering ? 4 : 7,
          height: hovering ? 4 : 7,
          opacity: visible ? 1 : 0,
        }}
        transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}
