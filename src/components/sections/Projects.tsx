"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { projects, type Project } from "@/content/profile";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import Gallery from "../Gallery";
import SectionHeading from "../SectionHeading";
import { RevealGroup, RevealItem } from "../motion/Reveal";

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden
      className="size-4 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
    >
      <path
        d="M4 12L12 4M12 4H6M12 4V10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const TILT = 9; // degrees at the very edge of the card

function Card({ project, index }: { project: Project; index: number }) {
  const featured = Boolean(project.featured);
  // Touch drags fire pointermove too, which would tip the card while the
  // visitor is simply trying to scroll past it.
  const tilt = useMediaQuery("(hover: hover) and (pointer: fine)");

  // Spotlight tracks the pointer across the card surface.
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spotlight = useMotionTemplate`radial-gradient(420px circle at ${mouseX}px ${mouseY}px, rgba(225,29,46,0.16), transparent 70%)`;

  // Pointer position as -0.5..0.5 of the card, driving the tilt.
  const offsetX = useMotionValue(0);
  const offsetY = useMotionValue(0);
  const spring = { stiffness: 200, damping: 22, mass: 0.5 };
  const rotateY = useSpring(
    useTransform(offsetX, [-0.5, 0.5], [-TILT, TILT]),
    spring,
  );
  const rotateX = useSpring(
    useTransform(offsetY, [-0.5, 0.5], [TILT, -TILT]),
    spring,
  );

  const handleMove = (event: React.PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    mouseX.set(event.clientX - rect.left);
    mouseY.set(event.clientY - rect.top);
    offsetX.set((event.clientX - rect.left) / rect.width - 0.5);
    offsetY.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const handleLeave = () => {
    offsetX.set(0);
    offsetY.set(0);
  };

  return (
    <RevealItem className={`min-w-0 ${featured ? "md:col-span-2" : ""}`}>
      {/* Perspective has to live on an ancestor, or each card's rotation is
          flattened and reads as a plain skew. */}
      <div className="h-full [perspective:1200px]">
        <motion.article
          onPointerMove={handleMove}
          onPointerLeave={handleLeave}
          style={
            tilt ? { rotateX, rotateY, transformStyle: "preserve-3d" } : undefined
          }
          whileHover={{ y: -6 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className={`panel-raised group relative flex h-full flex-col overflow-hidden rounded-xl p-8 transition-colors duration-300 will-change-transform md:p-10 ${
            featured
              ? "edge-lit bg-gradient-to-br from-blood/35 via-panel to-panel"
              : "border border-bone/10 bg-panel/60 hover:border-ember/35"
          }`}
        >
        <motion.div
          aria-hidden
          style={{ background: spotlight }}
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />

        <div className="relative flex items-center justify-between gap-4">
          <span className="font-label text-sm tracking-[0.08em] text-ember">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="flex items-center gap-3">
            {featured && (
              <span className="rounded-md bg-ember px-3 py-1 font-label text-[0.65rem] tracking-[0.12em] text-bone uppercase">
                Featured
              </span>
            )}
            {project.year && (
              <span className="font-label text-[0.7rem] tracking-[0.16em] text-bone/40 uppercase">
                {project.year}
              </span>
            )}
          </div>
        </div>

        <div className="relative mt-8 flex-1">
          <h3
            className={`font-semibold tracking-[-0.03em] text-bone ${
              featured
                ? "text-3xl sm:text-4xl md:text-5xl"
                : "text-2xl sm:text-3xl"
            }`}
          >
            {project.name}
          </h3>
          <p
            className={`mt-1 font-semibold tracking-tight text-glow ${
              featured ? "text-lg" : "text-base"
            }`}
          >
            {project.tagline}
          </p>
          <p className="mt-5 max-w-[58ch] text-bone/65">{project.description}</p>

          {project.images && project.images.length > 0 && (
            <Gallery shots={project.images} />
          )}
        </div>

        <ul className="relative mt-8 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-md border border-bone/15 px-3 py-1.5 font-label text-[0.7rem] tracking-[0.08em] text-bone/55 uppercase"
            >
              {tag}
            </li>
          ))}
        </ul>

        {(project.href || project.repo) && (
          <div className="relative mt-8 flex flex-wrap items-center gap-6 border-t border-bone/12 pt-6">
            {project.href && (
              <a
                href={project.href}
                target="_blank"
                rel="noreferrer noopener"
                className="group/link inline-flex items-center gap-2 text-sm font-semibold text-bone transition-colors duration-150 hover:text-glow"
              >
                {project.hrefLabel ?? "Live site"}
                <ArrowIcon />
              </a>
            )}
            {project.repo && (
              <a
                href={project.repo}
                target="_blank"
                rel="noreferrer noopener"
                className="group/link inline-flex items-center gap-2 text-sm font-semibold text-bone/60 transition-colors duration-150 hover:text-glow"
              >
                Source
                <ArrowIcon />
              </a>
            )}
          </div>
        )}
        </motion.article>
      </div>
    </RevealItem>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="shell scroll-mt-24 py-24 md:py-30">
      <SectionHeading
        index="03"
        label="Projects"
        lines={["Ventures &", "projects"]}
        lead="Two businesses I started, a routing system I helped build, and a campaign I ran. The common thread is owning something end to end."
      />

      <RevealGroup className="grid gap-6 md:grid-cols-2" stagger={0.1}>
        {projects.map((project, index) => (
          <Card key={project.name} project={project} index={index} />
        ))}
      </RevealGroup>
    </section>
  );
}
