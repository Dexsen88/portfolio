"use client";

import { useEffect, useState } from "react";
import { identity } from "@/content/profile";

/** CSS animation is 250ms delay + 900ms travel. Clear it well after that. */
const LIFT_MS = 1150;
const SAFETY_MS = 2600;

/**
 * Opening reveal.
 *
 * The wipe itself is a CSS keyframe (see `.curtain` in globals.css) so it
 * still plays with JavaScript disabled and cannot be broken by a render
 * error. This component only tears the node down afterwards, as a safety
 * net: if the keyframe somehow never advanced, the overlay would otherwise
 * sit on top of the entire site forever.
 */
export default function Curtain() {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setGone(true), SAFETY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  if (gone) return null;

  return (
    <div aria-hidden className="curtain" style={{ animationDuration: `${LIFT_MS - 250}ms` }}>
      <span className="text-4xl md:text-6xl">{identity.name}</span>
    </div>
  );
}
