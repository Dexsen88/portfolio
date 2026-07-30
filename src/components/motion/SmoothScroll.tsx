"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Wraps the page in Lenis so wheel and anchor scrolling share the same
 * eased, slightly weighted feel as the rest of the motion system.
 * Runs for every visitor, by explicit request.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      // A touch longer with a softer tail: the page feels weighted rather
      // than slippery, which is most of the "expensive" feeling in scroll.
      duration: 1.25,
      easing: (t: number) => 1 - Math.pow(1 - t, 5),
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
      // Native scrolling on touch. Hijacking it there costs frames on
      // exactly the devices with the least to spare.
      syncTouch: false,
    });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    // Route in-page anchor clicks through Lenis so they ease rather than jump.
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as HTMLElement | null)?.closest?.("a");
      const href = anchor?.getAttribute("href");
      if (!anchor || !href || !href.startsWith("#") || href === "#") return;

      const target = document.querySelector(href);
      if (!target) return;

      event.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -80 });
      window.history.replaceState(null, "", href);
    };

    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return null;
}
