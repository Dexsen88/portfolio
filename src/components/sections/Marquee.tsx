import { marqueeWords } from "@/content/profile";

function Track({ reverse = false }: { reverse?: boolean }) {
  // The list is rendered twice so the -50% keyframe lands on a seamless join.
  const words = [...marqueeWords, ...marqueeWords];

  return (
    <div
      className={`flex w-max shrink-0 items-center ${
        reverse ? "marquee-track-reverse" : "marquee-track"
      }`}
    >
      {words.map((word, index) => (
        <span key={index} className="flex items-center">
          <span className="px-8 text-3xl font-semibold tracking-[-0.03em] whitespace-nowrap text-bone md:text-4xl">
            {word}
          </span>
          <span aria-hidden className="text-lg text-ember">
            ✦
          </span>
        </span>
      ))}
    </div>
  );
}

/**
 * Full-bleed band, two tracks running against each other.
 *
 * Deliberately a server component with nothing but a CSS keyframe. It used to
 * skew with scroll velocity, which meant a `useVelocity` reading plus a spring
 * ticking after every scroll event, and it re-rasterised two very wide text
 * layers while doing it. That is a lot of budget for a gimmick, and a band
 * that lurches when you scroll reads as busy rather than expensive. The plain
 * constant drift is calmer and free: transform-only, composited, no JS.
 */
export default function Marquee() {
  return (
    <section
      aria-hidden
      className="marquee-host relative overflow-hidden border-y border-bone/10 bg-panel/60 py-10 md:py-14"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ember/12 via-transparent to-ember/12"
      />
      <div className="relative">
        <div className="flex overflow-hidden">
          <Track />
        </div>
        <div className="mt-3 flex overflow-hidden opacity-40">
          <Track reverse />
        </div>
      </div>
    </section>
  );
}
