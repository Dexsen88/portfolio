import { about, identity } from "@/content/profile";
import Portrait from "../Portrait";
import SectionHeading from "../SectionHeading";
import CountUp from "../motion/CountUp";
import { Reveal, RevealGroup, RevealItem } from "../motion/Reveal";

export default function About() {
  return (
    <section id="about" className="shell scroll-mt-24 py-32 md:py-44">
      <SectionHeading index="01" label="About" lines={["The short", "version"]} />

      <div className="grid gap-20 md:grid-cols-12 md:gap-16">
        <div className="md:col-span-7">
          <div className="space-y-7">
            {about.paragraphs.map((paragraph, index) => (
              <Reveal key={index} delay={index * 0.08}>
                <p className="text-lead text-bone/70">{paragraph}</p>
              </Reveal>
            ))}
          </div>

          <RevealGroup className="mt-16 grid grid-cols-1 gap-10 border-t border-bone/10 pt-12 sm:grid-cols-3 sm:gap-6">
            {about.stats.map((stat) => (
              <RevealItem key={stat.label}>
                <p className="font-display text-title text-bone">
                  <CountUp value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-3 font-label text-[0.7rem] leading-relaxed tracking-[0.14em] text-bone/40 uppercase">
                  {stat.label}
                </p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>

        <div className="md:col-span-5">
          <div className="md:sticky md:top-28">
            <Reveal delay={0.1}>
              <Portrait />
            </Reveal>

            <Reveal delay={0.18}>
              <div className="panel-raised mt-8 overflow-hidden rounded-xl border border-bone/10 bg-panel/70">
                <dl className="divide-y divide-bone/10 px-7">
                  {[
                    { term: "Full name", detail: identity.fullName },
                    { term: "Role", detail: identity.currentRole },
                    { term: "Location", detail: identity.location },
                    {
                      term: "Status",
                      detail: identity.availableForWork
                        ? identity.availabilityNote
                        : "Not currently available",
                    },
                  ].map((row) => (
                    <div
                      key={row.term}
                      className="flex items-baseline justify-between gap-6 py-4"
                    >
                      <dt className="font-label text-[0.7rem] tracking-[0.14em] text-bone/40 uppercase">
                        {row.term}
                      </dt>
                      <dd className="text-right text-sm font-semibold tracking-tight text-bone">
                        {row.detail}
                      </dd>
                    </div>
                  ))}
                </dl>

                <div className="px-7 pt-1 pb-6">
                  <a
                    href="#contact"
                    className="group flex items-center justify-between rounded-md border border-bone/15 px-5 py-3.5 transition-colors duration-150 hover:border-ember hover:bg-ember/10"
                  >
                    <span className="text-sm font-semibold text-bone">
                      Start a conversation
                    </span>
                    <span
                      aria-hidden
                      className="text-bone/50 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
