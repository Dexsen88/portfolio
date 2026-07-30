"use client";

import { motion } from "motion/react";
import { contact, identity } from "@/content/profile";
import Magnetic from "../motion/Magnetic";
import { MaskChars } from "../motion/MaskText";
import { Reveal } from "../motion/Reveal";

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative scroll-mt-24 overflow-hidden py-32 md:py-44"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="glow-ember absolute -top-24 right-0 size-[36rem] rounded-full" />
        <div className="glow-blood absolute -bottom-40 -left-20 size-[30rem] rounded-full" />
      </div>

      <div className="shell">
        <div className="mb-10 flex items-baseline gap-5 md:mb-12">
          <Reveal distance={0}>
            <span className="font-label text-xs tracking-[0.2em] text-ember">05</span>
          </Reveal>
          <Reveal distance={0} delay={0.06}>
            <span className="font-label text-xs tracking-[0.2em] text-bone/40 uppercase">
              Contact
            </span>
          </Reveal>
          <motion.span
            aria-hidden
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="hairline h-px flex-1 origin-left"
          />
        </div>

        <h2 className="text-bloom font-display text-display text-bone">
          <MaskChars
            lines={contact.heading}
            tail={<span className="text-ember">.</span>}
          />
        </h2>

        <div className="mt-14 grid gap-12 md:mt-20 md:grid-cols-12">
          <div className="min-w-0 md:col-span-7">
            <Reveal>
              <p className="max-w-[46ch] text-lead text-bone/65">{contact.blurb}</p>
            </Reveal>

            <Reveal delay={0.1}>
              <a
                href={`mailto:${contact.email}`}
                className="group mt-10 inline-block text-xl font-semibold tracking-[-0.03em] break-words text-bone transition-colors duration-150 hover:text-glow sm:text-2xl md:text-4xl"
              >
                <span className="link-draw">{contact.email}</span>
              </a>
            </Reveal>

            <Reveal delay={0.18}>
              <Magnetic strength={0.3} className="mt-12 inline-block">
                <a
                  href={`mailto:${contact.email}`}
                  className="btn-ember group inline-flex items-center gap-3 rounded-md bg-ember px-8 py-4 text-base font-semibold text-bone transition-colors duration-200 hover:bg-glow"
                >
                  Send an email
                  <span
                    aria-hidden
                    className="transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
                  >
                    →
                  </span>
                </a>
              </Magnetic>
            </Reveal>
          </div>

          <div className="min-w-0 md:col-span-5">
            <Reveal delay={0.12}>
              <p className="font-label text-xs tracking-[0.18em] text-bone/45 uppercase">
                Elsewhere
              </p>

              <ul className="mt-6 border-t border-bone/12">
                {contact.socials.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="group flex items-center justify-between gap-6 border-b border-bone/12 py-5 transition-colors duration-150 hover:text-glow"
                    >
                      <span className="text-lg font-semibold tracking-tight">
                        {social.label}
                      </span>
                      <span className="flex items-center gap-3">
                        <span className="font-label text-xs tracking-[0.1em] text-bone/35">
                          {social.handle}
                        </span>
                        <span
                          aria-hidden
                          className="transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
                        >
                          →
                        </span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>

              <p className="mt-8 max-w-[34ch] text-sm text-bone/50">
                Based in {identity.location}
                {identity.availableForWork
                  ? `. ${identity.availabilityNote}.`
                  : "."}
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
