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
          <span className="px-7 font-label text-xs tracking-[0.2em] whitespace-nowrap text-bone/45 uppercase">
            {word}
          </span>
          <span aria-hidden className="text-[0.6rem] text-bone/25">
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
      className="marquee-host relative overflow-hidden border-y border-bone/8 py-5"
    >
      {/* Fades into the page at both edges instead of being cut off by them. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-void via-transparent to-void"
      />
      {/* One row, small, quiet. This was two rows of 36px display type with a
          red wash across it, which competed with the headline directly above
          for no reason: it is a list of keywords. */}
      <div className="flex overflow-hidden">
        <Track />
      </div>
    </section>
  );
}
