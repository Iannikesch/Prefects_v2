# Profectus texture pack

The layer that stays Profectus when every layout underneath comes from
somewhere else. Values live in `profectus-texture.css`; this file is the
rules for using them. `specimen.html` shows every token rendered.

Source: profectusagency.com, measured 2026-09-22/23. Full evidence in
`kit/scouted/profectusagency-com-fullpage.md` and `-homepage.md`.

---

## The look in one line

A black page, one enormous tight serif, one violet word, and a cool
aurora of light behind it. Everything else is quiet.

## Colour: 8 rules

1. **Ground is `#000`.** Not near-black. The only raised solid is `#121212`.
2. **Five text colours, no more:** white `#FFF` (headlines, UI), grey
   `#C2C2C2` (body, labels), `#E0E0E0` (a headline that sits back),
   `#F5F5F5` (hero eyebrow), violet `#8E84F7`.
3. **Violet is rationed.** In type it goes on one italic word, or on the closing
   period of a headline, and nowhere else. The source uses it 3 times in about
   1,400 text nodes. It is also the CTA pill tint at 30% alpha.
4. **The gradient is light, not paint.** It only appears as a glow behind
   content: aurora ring, globe, nebula. Never as a button fill, never
   behind a paragraph, never as gradient text (the source has none).
5. **The gradient is cool end to end.** Navy `#1C1F3C` → deep `#214567` →
   teal `#2F6476` → mist `#8C9999` → blue `#485384` → periwinkle
   `#5B588E` → violet `#775E99` → plum `#4C345E`. Pixel-sampled across four
   frames. **There is no gold.** Both scout reports mention a warm streak,
   but a sweep of every frame found zero warm pixels. It's the pale mist
   crown reading warm next to the blue.
6. **Glow always fades to black** below it (`--pf-fade-bottom`).
7. **Zero shadows, zero borders.** Depth comes from blur and alpha only.
   Hairlines are 3–6% white.
8. **Photos are dimmed plates**, `brightness(.45)`, overscaled 1.2×.

## Type: 4 families, each with one job

| family | job | never |
|---|---|---|
| **Erode** 400 | every headline, 32–96px | body copy |
| **Instrument Serif** italic | one word per headline, violet, 0.917× the roman | more than one word |
| **Geist** 400/500 | body, UI, card titles, **stat numbers** (112px) | headlines |
| **PT Mono** 400 | every eyebrow, label, numeral, date: 12.96px, uppercase | anything longer than a label |

- Display tracking is always tight: **−0.05em**. Line-height **0.9** at
  display sizes, **1.3** for body.
- Big serif, small mono: every section opens with a mono eyebrow over an
  Erode head. That pairing *is* the brand.
- Scale (1440 → 390): display 96→48 · h1 76→48 · stat 112→64 · h2 52→40 ·
  card h3 24→19.2 · lead 18.4 · body 16 · UI 15 · mono 12.96.

## Surface: one glass system

| surface | fill | blur | radius |
|---|---|---|---|
| CTA pill | violet 30% | 5px | 20 |
| Ghost pill | white 25% | 5px | 40 |
| Tag pill (eyebrow + violet dot) | white 13% | 9px | 20 |
| Glass card (+ corner ticks) | white 10% | 10px | 0 |
| Chip | `#303030` 30% | 4px | 4 |
| Nav bar | `#030303` 20% | 10px | 0 |

Pills are **41px tall at every width**. Cards sit **4px apart**. Photo
cards are 8px radius; glass and tiles are square.

## Motion: ambient, never choreographed

The feel: things drift slowly in the background forever, and the content
itself is still. Nothing bounces, nothing enters with a flourish, nothing
celebrates the scroll.

- **Aurora:** turns slowly (`--pf-aurora-turn`, 60s: the source's period
  couldn't be read, only that it's well over 4.5s). One per page region
  at most.
- **Marquee:** linear, right to left, **50px/s**, doesn't pause on hover.
- **Reveals:** allowed as a short rise and fade (16px, 700ms,
  `cubic-bezier(.22,1,.36,1)`) with little or no stagger. Don't choreograph
  more than that.
- **Hover:** alpha shift only, 240ms. No lift, no scale, no shadow.
- **Reduced motion stops everything.** The source only stops one marquee;
  we stop all of them.

Motion values marked `[c]` in the CSS were chosen, not measured. The
source's hover and reveal timings couldn't be captured.

## Code rain: the vintage-code plate

Falling glyph columns, recoloured from green to the pack's own ramps. Files
are in `img/`. Use the `.webp` files on the site; the `.png` files are the
lossless masters.

| file | ramp | use it when |
|---|---|---|
| `code-rain-violet` | black → navy → blue → periwinkle → **violet** → near-white | the section is about the product (Victor AI, tech) |
| `code-rain-aurora` | black → navy → deep → teal → mist | it sits near the aurora and should blend with it |

- **It's light, not paint** (colour rule 4). Use `.pf-code-rain` as a backdrop at
  ~55% opacity, faded to black top and bottom. `.pf-code-rain--side` keeps
  it to one edge so a headline can sit clear of it.
- **One per page region**, same as the aurora. Don't stack it with the aurora
  in the same section.
- **Never behind body copy** at full strength. Behind a display headline is
  fine; behind a paragraph, drop it under 30% or move it to the side.
- The violet in the glyphs is part of the glow, so it doesn't count against
  the violet word ration.
- **The still plate stays still.** It's a 668×893 screenshot and can't
  tile. For motion, use the live version below.

### Live version: `code-rain.js`

```html
<section style="position:relative;overflow:hidden">
  <div class="pf-rain" data-ramp="violet"></div>   <!-- or aurora -->
  ...content, z-index 2...
</section>
<script src="code-rain.js" defer></script>
```

A slow waterfall of glyphs drawn on canvas in the same colour ramps. It
needs no image, so it has no licensing problem and stays sharp at any size.

- **Fall:** three depth layers (small, dim and slow at the back; larger
  and faster in front), 9 to 38px/s. Each column's speed rises and falls
  by up to ±30% over 18 to 42 seconds, so the flow is never uniform.
- **Pattern:** columns fall in streams with gaps that travel down with
  them. Each stream gets brighter toward its lower end, and glyphs swap
  now and then.
- **Glow:** about one column in three carries a faint light pulse that
  slides down faster than the glyphs. A soft glow band crosses the whole
  field on a slow diagonal, about once a minute. Only the brightest
  glyphs get a glow.
- **Fade:** CSS mask on `.pf-rain`. It fades in over the top 22% and fades
  out from 50% to 92% down.
- **Tuning:** `data-speed` and `data-density` are multipliers (default 1).
  Overall strength is the `.pf-rain` opacity (0.7).
- **Cost:** capped at 30fps, pre-rendered glyph sheets, no per-frame text
  layout. It pauses when scrolled offscreen or in a hidden tab, and shows
  a single still frame under reduced motion.
- **Licence:** the source image came from a screenshot and its origin is
  unconfirmed. Clear it, or swap in a generated version, before it goes live.

## Nebula: breathing space background

```html
<section style="position:relative;overflow:hidden">
  <div class="pf-nebula" data-src="img/nebula-violet"></div>
  ...content, z-index 2...
</section>
<script src="nebula.js" defer></script>
```

Built from a photo in two parts. `tools/nebula-build.py` finds the stars,
paints them out of the photo, and recolours the clouds into the pack's
navy, periwinkle and violet (the warm pinks become violet). The stars are
then redrawn sharp in the browser at the exact spots they were found, so a
small source image still holds up.

- **Star detection:** a star is a point that is brighter than everything
  within 3px and rises well above the cloud level around it, measured at
  two scales so big haloed stars aren't missed. Clusters closer than 6px
  count as one. The source gave 273 stars, saved to
  `img/nebula-violet.stars.json` as position (0 to 1) and brightness (0 to 1).
- **Breathing:** clouds scale 1 → 1.045 over 23s and brighten 0.6 → 0.95
  over 14s. The two periods don't line up, so it never reads as a loop.
  Faded to black top and bottom by the mask.
- **Star glow:** every 3 to 6 seconds one star is picked at random,
  weighted by brightness squared (bright stars are likelier, faint ones
  still get a turn). It skips stars within 40px of the edge and the last
  6 picked. It swells and settles over 2.6s as sin²: a violet halo up to
  +22px, a slightly larger core and two faint cross spikes.
- **Shooting star:** fires each time the section is 35% in view, after 1s.
  If the viewer scrolls away first, it's cancelled. It picks a random
  direction (left or right, falling 12 to 30°) and travels 240 to 350px
  over 0.75 to 1s, easing out. It fades in over the first 12% and off over
  the last half. The trail never reaches behind the start point, so the
  whole streak stays within 350px (measured: 308px including the glow).
- **New backgrounds:** run
  `python3 tools/nebula-build.py SOURCE.png NAME --crop x0,y0,x1,y1`, then
  point `data-src` at `img/NAME`.
- **Rules:** one per page region, never in the same section as the aurora
  or code rain. It pauses offscreen and in hidden tabs. Under reduced
  motion, clouds and stars stay still with no glow and no shooting star.
- **Licence:** the source is a Google image result of unknown origin.
  Clear it or swap the source before launch; the tool rebuilds everything
  from any space photo.

## What borrowed layouts may change, and what they may not

**Free to change:** grid, section order, card shapes, image use, spacing
rhythm, new components.

**Locked:** the four fonts and their jobs, the five text colours, the violet
ration, the cool gradient and "gradient = light", black ground, no shadows,
the glass fills and blur steps, pill height, ambient motion.

If a borrowed piece needs something the pack lacks (a new surface, a new
mover), build it from these tokens. Don't import the other site's colour
or type with it.
