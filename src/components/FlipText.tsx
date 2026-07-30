import type { CSSProperties } from "react";

/**
 * Label whose glyphs roll over on hover: the visible copy slides up and out
 * while a duplicate rises into its place, each character delayed a little
 * behind the last.
 *
 * Deliberately CSS only. Two stacked copies plus a transition-delay per
 * character costs nothing, needs no client component, and cannot desync the
 * way a JS-timed stagger can. The parent supplies the `group` class.
 */
export default function FlipText({
  text,
  className = "",
  stagger = 22,
}: {
  text: string;
  className?: string;
  /** Milliseconds added per character. */
  stagger?: number;
}) {
  const chars = text.split("");

  return (
    <span className={`relative block overflow-hidden ${className}`}>
      {/* Holds the box height and gives assistive tech a single clean read. */}
      <span className="sr-only">{text}</span>

      <span aria-hidden className="block">
        {chars.map((char, index) => (
          <span
            key={index}
            className="inline-block transition-transform duration-[350ms] ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full group-focus-visible:-translate-y-full"
            style={{ transitionDelay: `${index * stagger}ms` } as CSSProperties}
          >
            {char === " " ? " " : char}
          </span>
        ))}
      </span>

      <span aria-hidden className="absolute inset-0 block">
        {chars.map((char, index) => (
          <span
            key={index}
            className="inline-block translate-y-full transition-transform duration-[350ms] ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-0 group-focus-visible:translate-y-0"
            style={{ transitionDelay: `${index * stagger}ms` } as CSSProperties}
          >
            {char === " " ? " " : char}
          </span>
        ))}
      </span>
    </span>
  );
}
