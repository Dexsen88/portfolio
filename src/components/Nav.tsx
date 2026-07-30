"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { contact, identity, navLinks } from "@/content/profile";
import FlipText from "./FlipText";
import Magnetic from "./motion/Magnetic";

const EASE_PITCH = [0.16, 1, 0.3, 1] as const;

export default function Nav() {
  const { scrollY } = useScroll();
  const [condensed, setCondensed] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState("");
  const lastY = useRef(0);

  useMotionValueEvent(scrollY, "change", (current) => {
    setCondensed(current > 24);

    // Retreat on the way down, return the moment the visitor scrolls back up.
    const goingDown = current > lastY.current;
    setHidden(goingDown && current > 220 && !menuOpen);
    lastY.current = current;
  });

  // Never leave the page locked behind a menu that has closed.
  useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /**
   * Marks which section you are currently reading.
   *
   * Driven by IntersectionObserver rather than a scroll handler, so it costs
   * nothing per frame. The asymmetric rootMargin narrows the trigger to a band
   * across the middle of the screen, which is what makes the indicator change
   * when a section genuinely takes over rather than the instant its top edge
   * appears.
   */
  useEffect(() => {
    const sections = navLinks
      .map((link) => document.getElementById(link.href.slice(1)))
      .filter((node): node is HTMLElement => Boolean(node));

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const topMost = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          )[0];
        if (topMost) setActiveId(topMost.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: hidden ? -120 : 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: EASE_PITCH }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div
          className={`transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            condensed
              ? "border-b border-bone/10 bg-void/80 backdrop-blur-md"
              : "border-b border-transparent"
          }`}
        >
          <nav className="shell flex items-center justify-between gap-6 py-4">
            <Magnetic strength={0.2}>
              <a
                href="#top"
                className="group flex items-center gap-3"
                aria-label={`${identity.name}, back to top`}
              >
                <span className="grid size-10 place-items-center rounded-md bg-ember text-lg font-semibold text-bone shadow-ember transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-6">
                  {identity.name.charAt(0)}
                </span>
                <span className="text-lg font-semibold tracking-tight text-bone">
                  {identity.name}
                </span>
              </a>
            </Magnetic>

            <ul className="hidden items-center gap-8 md:flex">
              {navLinks.map((link) => (
                <li key={link.href} className="relative">
                  <a
                    href={link.href}
                    aria-current={
                      activeId === link.href.slice(1) ? "true" : undefined
                    }
                    className={`group font-label text-xs tracking-[0.14em] uppercase transition-colors duration-300 hover:text-bone ${
                      activeId === link.href.slice(1)
                        ? "text-bone"
                        : "text-bone/55"
                    }`}
                  >
                    <FlipText text={link.label} />
                  </a>
                  {activeId === link.href.slice(1) && (
                    /* One element shared across all the links: `layoutId`
                       makes Motion slide it from the previous link to this
                       one rather than cross-fading two separate bars. */
                    <motion.span
                      layoutId="nav-active"
                      aria-hidden
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 32,
                      }}
                      className="absolute -bottom-2 left-0 h-px w-full bg-ember"
                    />
                  )}
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-3">
              <Magnetic strength={0.25} className="hidden md:block">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-md border border-bone/20 px-5 py-2.5 text-sm font-semibold text-bone transition-colors duration-150 hover:border-ember hover:bg-ember"
                >
                  Get in touch
                  <span aria-hidden>→</span>
                </a>
              </Magnetic>

              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                aria-expanded={menuOpen}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                className="grid size-11 place-items-center rounded-md border border-bone/15 md:hidden"
              >
                <span className="relative block h-3 w-5">
                  <motion.span
                    animate={menuOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
                    transition={{ duration: 0.3, ease: EASE_PITCH }}
                    className="absolute inset-x-0 top-0 h-0.5 bg-bone"
                  />
                  <motion.span
                    animate={menuOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
                    transition={{ duration: 0.3, ease: EASE_PITCH }}
                    className="absolute inset-x-0 bottom-0 h-0.5 bg-bone"
                  />
                </span>
              </button>
            </div>
          </nav>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="menu"
            /* Slides rather than clipping. The menu appearing at all must not
               hinge on motion interpolating a clip-path string. */
            initial={{ y: "-100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.5, ease: EASE_PITCH }}
            className="fixed inset-0 z-40 flex flex-col justify-between bg-panel px-6 pt-28 pb-10 md:hidden"
          >
            <ul className="flex flex-col gap-2">
              {navLinks.map((link, index) => (
                <li key={link.href} className="mask-line">
                  <motion.a
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    initial={{ y: "110%" }}
                    animate={{ y: "0%" }}
                    exit={{ y: "110%" }}
                    transition={{
                      duration: 0.6,
                      delay: 0.08 + index * 0.06,
                      ease: EASE_PITCH,
                    }}
                    className="block py-2 text-5xl font-semibold tracking-[-0.03em] text-bone"
                  >
                    {link.label}
                  </motion.a>
                </li>
              ))}
            </ul>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.3, ease: EASE_PITCH }}
              className="space-y-4"
            >
              <a
                href="#contact"
                onClick={() => setMenuOpen(false)}
                className="block rounded-md bg-ember px-6 py-4 text-center text-base font-semibold text-bone"
              >
                Get in touch
              </a>
              <p className="font-label text-xs tracking-[0.14em] text-bone/45 uppercase">
                {contact.email}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
