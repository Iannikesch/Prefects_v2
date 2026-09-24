# Profectus Motion System

Every movement on profectusagency.com, measured, rebuilt, and given its
proper name. Colour and type come from `kit/texture-pack/`; this is the
motion layer that goes with them.

Open `demo.html` to see each movement playing, with an explanation beside it.
It needs to be served, not opened as a file. From `kit/`, run
`python3 -m http.server` and visit `localhost:8000/motion-system/demo.html`.

| file | what it is |
|---|---|
| `demo.html` | live demo and lesson: every movement, named and explained |
| `motion-system.css` | the tokens (every timing) and the CSS-only movers |
| `motion-system.js` | the engine: one animation loop for everything scroll-, time- and pointer-driven |

Evidence: `kit/scouted/profectusagency-com-motion.md` (the scout's
measurements) and `kit/scouted/profectusagency-com-motion-analysis.md` (my
fits on top of them).

---

## The one idea: name the trigger first

Every movement on any site belongs to one of four families, decided by
what makes it move:

| trigger | family | what it means |
|---|---|---|
| **A · Time** | ambient loop | runs on a clock, no input needed |
| **B · Scroll position** | scroll-scrubbed | tied to how far you've scrolled; rewinds when you scroll back |
| **C · Scroll event** | scroll-triggered | fires once when something enters view, then plays on its own |
| **D · Pointer** | pointer-driven | follows the mouse; hover effects live here too |

Plus a **smoothing layer** (springs, lerps, Lenis) that can sit between any
input and any movement.

## The eleven movements

Status: **M** measured on the live page · **F** fitted from logged samples · **R** reconstructed (couldn't be measured).

| # | proper name | also called | trigger | key values | status | hook |
|---|---|---|---|---|---|---|
| 01 | **Smooth scroll** | inertial / momentum scrolling, Lenis | smoothing | lerp 0.135, settles ~830ms | F / M | Lenis on the page |
| 02 | **Colour cycling** | hue flow, gradient animation, aurora | time | 21s per cycle, clockwise, linear | F | `.pm-aurora` |
| 03 | **Continuous rotation** | idle spin, auto-rotate, turntable | time | ≈55s per turn, surface moves left → right | F | `canvas[data-pm-globe]` |
| 04 | **Flow field** | noise drift, particle flow, Perlin field | time | layer opacity .37, near-static overall | M / R | `canvas[data-pm-flow]` |
| 05 | **Infinite marquee** | ticker, logo loop, crawl | time | 50px/s linear, pauses off screen, not on hover | M | `.pm-marquee` |
| 06 | **Stepped carousel** | auto-advancing carousel, autoplay slider | time | one item every 2531ms, 600ms move, expo-out | M / F | `.pm-stepper` |
| 07 | **Parallax** | scroll-linked translate, depth scrolling | scroll position | −60 → +73px over the band's exit (0.2078px/px) | M | `.pm-parallax` |
| 08 | **Scroll-scrubbed text reveal** | word-by-word reveal, text scrub | scroll position | 0.2 → 1, 100px per word, 50px stagger, ease-out | M / F | `.pm-scrub` |
| 09 | **Spring-smoothed parallax** | lagged parallax, smooth follow | scroll position + spring | spring 80 / 20, no overshoot | F / R | `.pm-lag` |
| 10 | **Cursor follower** | custom cursor, cursor ring | pointer | spring 150 / 30; 28px ring, 3px violet dot | F / M | `body[data-pm-cursor]` |
| 11 | **Fade-up reveal** | reveal on scroll, entrance animation | scroll event | from 48px below, once | M / R | `.pm-rise` |

## 12 · What stays still (on purpose)

These absences are measured. Don't add them back by accident:

- **No load-in.** Everything is fully visible 20ms after the page appears.
  No preloader, no hero entrance.
- **No hover motion.** Buttons, links and cards don't react at all.
- **No menu transition.** The mobile menu opens and closes instantly.
- **No letter animation.** Two headlines are split into letters, but they
  never move.

**The personality in one line:** the background is always gently alive, and
the content is calm and still. Nothing bounces (both springs are tuned not to
overshoot), nothing greets you, nothing celebrates the scroll.

## Using it on the new site

```html
<link rel="stylesheet" href="texture-pack/profectus-texture.css">
<link rel="stylesheet" href="motion-system/motion-system.css">
…
<script src="https://cdn.jsdelivr.net/npm/lenis@1.3.26/dist/lenis.min.js"></script>
<script src="motion-system/motion-system.js"></script>
```

Then add the hook from the table to any element. Borrowed layouts can use
any of these; every timing comes from the `--pm-*` tokens, so change a token
and it changes everywhere.

**Budget:** at most one time-driven mover per screen (02–06) and one
scroll-scrubbed headline (08) per page. That's the density the source
runs at.

## Reduced motion

When someone has "reduce motion" switched on, every mover stops and shows
its finished state: headlines at full strength, reveals already revealed, the
globe a still frame, no cursor ring, native scrolling. The source stops only
one of its movers, and leaves its scrubbed headline stuck at 20% opacity;
this system fixes both.

## Things to decide

- **The texture pack's aurora speed is a guess.** `--pf-aurora-turn` in
  `kit/texture-pack/profectus-texture.css` is 60s (tagged "chosen"). The
  measured cycle is **21s**. This system uses 21s and leaves the texture
  pack as it is; updating it is your call.
- **Scroll speed.** The source's wheel multiplier measured ≈2 (each wheel
  notch scrolls twice as far). This system uses 1, because 2 feels jumpy on
  trackpads. To match the source exactly, change it in `motion-system.js`.
- **Hover.** Profectus has none. If the new site wants hover feedback,
  that's a new decision, not a Profectus trait. Keep it to a small fill
  change (the texture pack's 240ms alpha shift) to stay in character.
