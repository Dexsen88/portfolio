"use client";

import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";
import {
  certifications,
  education,
  experience,
  languages,
} from "@/content/profile";
import SectionHeading from "../SectionHeading";
import { Reveal } from "../motion/Reveal";

/**
 * Vertical rail whose red fill is drawn by scroll position, so the timeline
 * appears to be traced as you read down it.
 */
function Rail({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 75%", "end 60%"],
  });
  const scaleY = useSpring(useTransform(scrollYProgress, [0, 1], [0, 1]), {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div ref={ref} className="relative">
      <span
        aria-hidden
        className="absolute inset-y-0 left-0 hidden w-px bg-bone/12 md:block"
      />
      <motion.span
        aria-hidden
        style={{ scaleY }}
        className="absolute inset-y-0 left-0 hidden w-px origin-top bg-ember md:block"
      />
      {children}
    </div>
  );
}

/**
 * Sits on the rail, not on the list item. The <ol> carries `md:pl-14`, so the
 * marker has to be pulled back by that same 3.5rem — otherwise it lands on the
 * padding edge and covers the first character of the date.
 */
function Marker() {
  return (
    <span
      aria-hidden
      className="absolute top-2.5 hidden size-3 -translate-x-1/2 rounded-full bg-ember ring-4 ring-void md:-left-14 md:block"
    />
  );
}

export default function Experience() {
  return (
    <section id="experience" className="shell scroll-mt-24 py-24 md:py-30">
      <SectionHeading index="02" label="Experience" lines={["Where I've", "been"]} />

      <Rail>
        <ol className="space-y-16 md:space-y-20 md:pl-14">
          {experience.map((role, index) => (
            <li key={`${role.company}-${index}`} className="relative">
              <Marker />
              <Reveal>
                <div className="grid gap-6 md:grid-cols-12 md:gap-8">
                  <div className="md:col-span-3">
                    {role.period && (
                      <p className="font-label text-xs tracking-[0.14em] text-glow uppercase">
                        {role.period}
                      </p>
                    )}
                    {role.location && (
                      <p className="mt-2 font-label text-[0.7rem] tracking-[0.12em] text-bone/40 uppercase">
                        {role.location}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-9">
                    <h3 className="font-display text-title text-bone">
                      {role.company}
                    </h3>
                    <p className="mt-1 text-lg font-semibold tracking-tight text-glow">
                      {role.title}
                    </p>

                    {role.previously && role.previously.length > 0 && (
                      <ul className="mt-3 space-y-1">
                        {role.previously.map((prior) => (
                          <li
                            key={prior.title}
                            className="flex flex-wrap items-baseline gap-x-3 text-sm text-bone/45"
                          >
                            <span className="text-sm font-semibold text-bone/70">
                              {prior.title}
                            </span>
                            <span className="font-label text-[0.7rem] tracking-[0.1em] uppercase">
                              {prior.period}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}

                    <p className="mt-4 max-w-[60ch] text-bone/65">{role.summary}</p>

                    <ul
                      className={
                        role.highlights.length > 0 ? "mt-6 space-y-3" : undefined
                      }
                    >
                      {role.highlights.map((highlight, hIndex) => (
                        <li
                          key={hIndex}
                          className="flex gap-3 text-bone/65 md:max-w-[62ch]"
                        >
                          <span
                            aria-hidden
                            className="mt-2.5 size-1.5 shrink-0 rounded-full bg-ember"
                          />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>

                    {role.links && role.links.length > 0 && (
                      <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
                        {role.links.map((link) => (
                          <li key={link.href}>
                            <a
                              href={link.href}
                              target="_blank"
                              rel="noreferrer noopener"
                              className="group/link inline-flex items-center gap-2 text-sm font-semibold text-bone/70 transition-colors duration-150 hover:text-glow"
                            >
                              {link.label}
                              <svg
                                viewBox="0 0 16 16"
                                aria-hidden
                                className="size-3.5 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
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
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}

                    <ul className="mt-6 flex flex-wrap gap-2">
                      {role.stack.map((item) => (
                        <li
                          key={item}
                          className="rounded-md border border-bone/12 px-3 py-1.5 font-label text-[0.7rem] tracking-[0.08em] text-bone/55 uppercase"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </Rail>

      {/* Education */}
      <div className="mt-24 md:mt-32">
        <Reveal className="mb-12 flex items-center gap-4">
          <span className="font-label text-xs tracking-[0.18em] text-bone/45 uppercase">
            Education
          </span>
          <span aria-hidden className="h-px flex-1 bg-bone/12" />
        </Reveal>

        <Rail>
          <ol className="space-y-12 md:pl-14">
            {education.map((study, index) => (
              <li key={`${study.school}-${index}`} className="relative">
                <Marker />
                <Reveal>
                  <div className="grid gap-6 md:grid-cols-12 md:gap-8">
                    <div className="md:col-span-3">
                      {study.period && (
                        <p className="font-label text-xs tracking-[0.14em] text-glow uppercase">
                          {study.period}
                        </p>
                      )}
                      {study.location && (
                        <p className="mt-2 font-label text-[0.7rem] tracking-[0.12em] text-bone/40 uppercase">
                          {study.location}
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-9">
                      <h3 className="text-2xl font-semibold tracking-[-0.02em] text-bone">
                        {study.school}
                      </h3>
                      <p className="mt-1 text-base font-semibold tracking-tight text-glow">
                        {study.qualification}
                      </p>
                      <p className="mt-4 max-w-[60ch] text-bone/65">
                        {study.detail}
                      </p>
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </Rail>
      </div>

      {/* Credentials */}
      <div className="mt-20 md:mt-24">
        <Reveal className="mb-10 flex items-center gap-4">
          <span className="font-label text-xs tracking-[0.18em] text-bone/45 uppercase">
            Credentials
          </span>
          <span aria-hidden className="h-px flex-1 bg-bone/12" />
        </Reveal>

        <div className="grid gap-10 md:grid-cols-2 md:gap-16">
          <Reveal>
            <h3 className="font-label text-[0.7rem] tracking-[0.14em] text-glow uppercase">
              Certifications
            </h3>
            <ul className="mt-4 border-t border-bone/12">
              {certifications.map((item) => (
                <li
                  key={item.name}
                  className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-bone/12 py-4"
                >
                  <span className="text-base font-semibold tracking-tight text-bone">
                    {item.name}
                  </span>
                  <span className="text-sm text-bone/50">
                    {item.issuer} · {item.date}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1}>
            <h3 className="font-label text-[0.7rem] tracking-[0.14em] text-glow uppercase">
              Languages
            </h3>
            <ul className="mt-4 border-t border-bone/12">
              {languages.map((item) => (
                <li
                  key={item.name}
                  className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-bone/12 py-4"
                >
                  <span className="text-base font-semibold tracking-tight text-bone">
                    {item.name}
                  </span>
                  <span className="text-sm text-bone/50">{item.level}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
