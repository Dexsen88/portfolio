# Dexsen — Portfolio

A single-page personal portfolio built with Next.js 16 (App Router), Tailwind CSS v4
and Motion, styled against the Pitch design system.

## Running it

```bash
npm run dev
```

Then open http://localhost:3000. `npm run build` produces the production bundle;
the whole page is statically prerendered.

## Editing your content

**Everything you need to change lives in one file: [`src/content/profile.ts`](src/content/profile.ts).**

It drives the nav, hero, About panel, experience/education timeline, project
cards, skill groups, contact block and the page metadata. Nothing else needs to
be touched to make the site yours.

Content comes from the LinkedIn export in `Dexsen Soepardi.md`. Anything still
marked `// TODO` was missing from that export — mostly start/end dates for the
Alignerr, Blibli, Cyber Smart Network Asia, IPEKA and Bakmi Karet Planet roles.
Fill a `period` in and the timeline shows it automatically; leave it empty and
the column stays blank rather than showing a placeholder.

A few notes on specific fields:

| Field | Notes |
| --- | --- |
| `identity.headline` | One array entry per rendered line. It sets at up to 180px, so keep each line to one or two short words. |
| `identity.availableForWork` | Set `false` to hide the pulsing availability chip. |
| `about.stats` | `value` must be a number — it animates from zero when scrolled into view and is thousands-separated. |
| `experience[].previously` | Earlier titles at the same organisation, listed under the current one. Used for the three The5ers roles. |
| `experience[].period` / `.location` | Optional. Omit and the timeline column is simply left empty. |
| `projects[].featured` | The featured card spans both grid columns and inverts to the dark surface. Use it on one project. |
| `seo.url` | Set this to your real domain once you have one; it backs the canonical and Open Graph URLs. |
| `photo.src` | Path inside `/public`. Set to `""` to drop the portrait entirely. |
| `photo.cutout` | `true` only if the file is a transparent PNG. See "The portrait" below. |

## The portrait

The photo lives at **`public/dex.jpg`**, pointed at by `photo.src`. If you rename
the file, update that field — a mismatch shows a lit red plate with a reminder
rather than a broken image.

The photograph is composited rather than framed: a red bloom sits behind it, the
square edges dissolve on a radial mask (`.portrait-fade`), a red gradient sits on
top in `soft-light` so it shares the page's key light, and the base fades into
the background. The point is that it reads as a lit subject, not a pasted-in
rectangle.

If you run the photo through a background remover and save a transparent PNG,
set `photo.cutout: true` — the dissolve mask is then skipped, since there is no
background left to hide.

## Design system

Tokens live in [`src/app/globals.css`](src/app/globals.css) under `@theme`.

The **structure** of the Pitch system is intact — the 8px spacing rhythm, the
1/10/16/24 radius ladder, 150/300/400ms decelerating motion, the 810/1200
breakpoints, and the extreme display-to-body type jump. The **palette and type**
are re-skinned to a dark, red-lit theme:

- **Colour** — `void` `#080406` (page), `panel` `#140a0c` (cards),
  `bone` `#f7f2f2` (text), `ember` `#e11d2e` (brand red), `glow` `#ff5a5f`
  (small text and hover), `blood` `#4a060e` (deep gradients).
- **Type** — the **native system UI stack**
  (`-apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial`).
  **No webfonts are loaded at all**: nothing to download, no layout shift, and it
  renders as SF Pro on Apple, Segoe UI on Windows, Roboto/Noto elsewhere.
  Headings sit at weight 600 with tight negative tracking; body is weight 450 at
  17px. The stack is declared once as `--font-system` in `globals.css`.
- **Display size** clamps up to 180px and scales against viewport *height* as
  well as width, so a three-line hero still clears the fold on a short laptop.
- **Light** — `.ambience` in `globals.css` is a fixed layer of red radial
  gradients plus a vignette. It is what makes the page feel lit from off-camera.
  Adjust the gradient stops there to move the light around.
- **Motion** — 150 / 300 / 400ms, all decelerating on `--ease-pitch`.

**No monospace.** Small labels use the `font-label` utility — the system stack at
weight 550 with tabular numerals. Changing that one utility in `globals.css`
restyles every label on the page at once.

### Contrast

`bone` on `void` is about 19:1. `glow` `#ff5a5f` clears AA on the dark background
and is used for small red text; `ember` `#e11d2e` is reserved for fills, large
type and accents, where its lower contrast is not a problem.

## Motion

- `SmoothScroll` — Lenis-driven scrolling, including in-page anchors.
- `Cursor` — dot-and-ring pointer, mounted only for fine pointers.
- `ScrollProgress` — red progress bar pinned to the top edge.
- `Reveal` / `RevealGroup` / `MaskLines` — scroll-triggered entrances.
- `Magnetic` — pointer-following CTAs.

All of it is wrapped in `MotionConfig reducedMotion="user"`, so anyone with
"reduce motion" enabled gets a still page rather than a moving one, and a
`<noscript>` rule unhides everything if JavaScript never runs.

## Deploying

The site is fully static. Push to a Git host and import the repo on Vercel,
Netlify or Cloudflare Pages — no configuration needed beyond the defaults.
