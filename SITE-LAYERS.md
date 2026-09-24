# Profectus site: build layers

The site was built as a plain, complete site first (**Layer 0**). Motion and
animated backgrounds were then added one layer at a time (**Layers 1–12**).
Each layer was checked in a real browser before the next went on, and each
has its own commit, so any one of them can be switched off or undone
without touching the others.

Branch: `build/site-frame`. Built with Astro (a tool that builds every page
from shared parts). The look comes from `kit/texture-pack/` and the motion
from `kit/motion-system/`.

---

## Two ways to remove a layer

**1. Switch it off (fastest, and it's what I'd use).** Open
`src/data/layers.js`, set that layer to `false`, and rebuild. Nothing else
changes. Every page reads this one file.

```js
export const LAYERS = {
  aurora: true,   // L1  set to false to remove the aurora everywhere
  ...
```

**2. Undo its commit (git).** `git revert <commit>` undoes exactly that
layer's change. Only Layer 9 changed more than the switch (it also fixed a
bug in the motion engine), so reverting 9 undoes that fix too.

---

## The layers

| Layer | What it adds (proper name) | Where | Commit | Switch |
|---|---|---|---|---|
| **0** | **The full static site.** 25 pages, all copy, layout, colours and fonts. No motion, no animated backgrounds | Everywhere | `d08d5eb` | — |
| **1** | **Aurora** (colour cycling): the glowing ring on the heroes and footer, colours travel around it every 21s | Home, page headers, footer | `5dad1cc` | `aurora` |
| **2** | **Code rain**: the falling "vintage code" in the brand violet | AI product hero, homepage AI band | `fd60185` | `codeRain` |
| **3** | **Galaxy**: breathing nebula, stars that glint, a shooting star each time you scroll to it | Homepage "Why Profectus" | `b7af989` | `galaxy` |
| **4** | **Globe** (continuous rotation): dotted globe, one turn every ~55s | Homepage "Firm Highlights" | `df9cbe9` | `globe` |
| **5** | **Infinite marquee**: industries sliding at 50px/s, paused off screen | Homepage "Target Industries" | `b743522` | `marquee` |
| **6** | **Smooth scroll** (inertial scrolling, Lenis): scrolling glides to a stop | Everywhere | `7ac60d4` | `smooth` |
| **7** | **Scroll-scrubbed text reveal**: headline words fill in as you scroll, one headline per page | Home, About, AI product | `f3f8fdc` | `scrub` |
| **8** | **Parallax**: photo moves slower than the page, −60px to +73px | Homepage mid-page band, case-study full-screen photo | `d2e4312` | `parallax` |
| **9** | **Spring-smoothed parallax** (lag): capability tiles drift by column and settle | Homepage capabilities grid | `af628c2` | `lag` |
| **10** | **Fade-up reveal**: "Ready to Make Progress?" rises in once | Footer, every page | `cf5021d` | `rise` |
| **11** | **Cursor follower**: thin ring with a violet dot trailing the mouse | Everywhere (mouse only) | `4e7a954` | `cursor` |
| **12** | **Hiding header** (Deloitte): slides away scrolling down, back scrolling up | Everywhere | `2bfab79` | `navHide` |

When off, each layer leaves a clean page behind: no aurora means a black
hero, and no marquee means the same industry tiles in a still grid.

---

## What each check confirmed (the failstops)

Every layer was checked in a browser at 1440px wide before it was
committed. If a check failed, the layer was fixed before moving on.

| Layer | Checked | Result |
|---|---|---|
| 0 | All 25 addresses load; unknown pages give 404; no sideways scroll at 1440 or 390; menu and contact pop-up open | Passed after 3 fixes: buttons under headings stretched full width, page headers were indented, the pop-up sat in the corner |
| 1 | Aurora present and animating on every page type; stops under reduced motion | Passed |
| 2 | Code rain drawing on both pages | Passed. Made the homepage panel see-through so the rain shows behind the glass |
| 3 | Galaxy image and star canvases load, no failed requests | Passed |
| 4 | Globe draws and changes frame to frame | Passed |
| 5 | Marquee speed and seamless loop | Passed: 51px/s measured, loop point exact |
| 6 | One wheel flick glides to a stop; page doesn't scroll behind the pop-up | Passed |
| 7 | Words fill in order on all three pages; screen readers still get the full sentence | Passed |
| 8 | Photo offset against scroll position | Passed: exactly −60px → +73px |
| 9 | Tiles never overlap while moving | **Failed first**: rows collided in the tight grid (up to 12px). Fixed by measuring the grid as one piece so tiles in a column move together, and switching the drift off on phones where the grid is one column. Re-checked: 0px overlap at 1440, 768 and 390 |
| 10 | Heading hidden, then fully visible after scrolling to it; visible at once under reduced motion | Passed. Added a failstop: if scripts don't load, the heading shows anyway |
| 11 | Ring trails and settles on the pointer; doesn't block clicks | Passed |
| 12 | Header hides and returns; the AI page's jump nav moves up in its place; header stays while the menu is open | Passed |

**Final pass, all layers on:**
- **One mover per screen:** scrolled every main page at 1440 and 390. A phone-only clash (galaxy and footer aurora both on screen) was fixed by making the mood band between them a full screen tall on phones.
- **Reduced motion:** all 25 pages load with no errors, and no heading is left hidden or dimmed.
- **Links:** all 23 internal links resolve.
- **Weight:** about 6KB of HTML, 12KB of scripts and 7KB of styles per page (compressed), plus the web fonts and a 125KB galaxy image on the homepage. The live Framer homepage is 26MB.

---

## Pages

Every live URL is kept, so old links and search ranking carry over.

- `/` home · `/about` · `/contact` · `/privacy`
- `/ai`: the AI product (name is a placeholder, set once in `src/data/site.js`)
- `/capabilities` and all **12** `/capabilities/<name>` pages, one shared template
- `/case-studies` and all **4** `/case-studies/<name>` pages, one shared template
- Redirects (in `vercel.json`): the old `/case-studies/filters/*` pages go to
  `/case-studies`, and the mobile menu's phantom pages (Portfolio, Vision,
  Team, Newsroom, FAQ) go to their nearest real page.

**Borrowed from the competitors** (structure only, restyled in Profectus):
- The hiding header and mood bands (Deloitte)
- The heading-left case rail and case-study page order (Merkle)
- The heading-plus-items blocks (IBM)
- Alternating rows, the jump nav and "Next pick for you" (Epsilon)
- The numbered accordions (Deloitte)
- The "what's this about?" contact chooser (Merkle)

---

## Still placeholder (everything is visibly marked on the site)

- **AI product name**: `[AI Product]` everywhere. Change `AI_NAME` in `src/data/site.js`.
- **Photos, logos, demo video**: striped boxes labelled with what goes there.
- **Contact form**: shows a "not connected yet" note on submit. Needs a Vercel function and the destination email (`contactEmail` in `src/data/site.js`).
- **Privacy policy**: the live one belongs to another company ("Anker"), so the client must supply one.
- **"Confirm" chips**: stats the live site contradicts (About vs homepage), two case-study figures the pages didn't state, the client quotes, the AI product's tool list, FAQ answers and founding-client offer.
- **Copy**: all taken from the live site with em dashes removed. The one-line capability summaries, theme names and AI product page copy are new.

---

## Running it

```
npm install
npm run dev        # live preview while editing: http://localhost:4321
npm run build      # builds the site into dist/
```
