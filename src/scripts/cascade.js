// Cascade: cards drift down a clipped lane, Silver Bullet style
// (kit/scouted/silverbulletagency-com-cascade.md, measured Oct 21).
// - Constant downward drift (default 14px/s), independent of frame rate.
// - Two columns offset by half a card pitch (one under 900px).
// - No fade at the top: the lane's clipped edge makes cards emerge from it.
// - Each card dissolves over the last 140px: opacity = 1 - t^2, keyed on
//   the card's centre, 0 exactly when the centre reaches the bottom.
// - Pauses off screen and in background tabs; big frame gaps are clamped,
//   not caught up. Reduced motion: one still, settled frame.
// Moves only transform and opacity, so it never repaints.
//
// Markup: <div class="cascade" data-speed="14" data-cols="1|2 (optional)"><article class="cascade__card">…</article>…</div>

const FADE = 140;     // px of dissolve at the bottom
const GAP = 40;       // px between cards
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

function setup(lane) {
  const speed = parseFloat(lane.dataset.speed) || 14;
  const source = [...lane.querySelectorAll(':scope > .cascade__card')];
  if (!source.length) return;
  source.forEach((c) => c.remove());
  const track = document.createElement('div');
  track.className = 'cascade__track';
  lane.append(track);

  let cols = [], H = 0, shift = 0;

  function build() {
    track.replaceChildren();
    H = lane.clientHeight;
    const W = lane.clientWidth;
    const n = lane.dataset.cols ? +lane.dataset.cols : (W >= 560 ? 2 : 1);
    const colW = (W - GAP * (n - 1)) / n;
    cols = [];
    for (let k = 0; k < n; k++) {
      // Clone the card set until one column is longer than the lane plus a
      // card, so the wrap jump always happens out of sight.
      const items = []; let len = 0, i = k;   // each column starts on a different card
      while (len < H + 600 || items.length < source.length) {
        const el = source[i % source.length].cloneNode(true);
        el.style.width = colW + 'px';
        el.style.left = k * (colW + GAP) + 'px';
        if (items.length >= source.length) el.setAttribute('aria-hidden', 'true');
        track.append(el);
        const h = el.offsetHeight;
        items.push({ el, base: len, h });
        len += h + GAP; i++;
      }
      const K = Math.max(...items.map((it) => it.h)) + GAP;   // one shared lead-in, so gaps stay even
      cols.push({ items, L: len, K, offset: k ? len / items.length / 2 : 0 });   // half a pitch
    }
    draw();
  }

  function draw() {
    for (const c of cols) {
      for (const it of c.items) {
        // wrap into [−K, L−K): the jump happens above the lane, out of sight
        const y = ((it.base + shift + c.offset) % c.L) - c.K;
        const centre = y + it.h / 2;
        const t = Math.min(1, Math.max(0, (centre - (H - FADE)) / FADE));
        it.el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
        it.el.style.opacity = (1 - t * t).toFixed(3);
      }
    }
  }

  let raf = 0, last = 0, visible = false;
  const frame = (now) => {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - (last || now)) / 1000);   // clamp hiccups
    last = now;
    shift += speed * dt;
    draw();
  };
  const run = () => { if (!raf && visible && !document.hidden && !reduce) { last = 0; raf = requestAnimationFrame(frame); } };
  const stop = () => { cancelAnimationFrame(raf); raf = 0; };

  build();
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; visible ? run() : stop(); }).observe(lane);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : run()));
  let rt; new ResizeObserver(() => { clearTimeout(rt); rt = setTimeout(build, 150); }).observe(lane);
}

document.querySelectorAll('.cascade').forEach(setup);
