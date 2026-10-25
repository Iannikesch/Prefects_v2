// Coverflow: Epsilon's "Reach real people, drive real results" carousel,
// measured Oct 21 (kit/scouted/epsilon-com-results-section.md).
// - Centred active card; side cards scaled to 0.8. Slides overlap by 50px
//   (pitch = card width - 50). Track moves in 300ms `ease`, scale in 350ms
//   ease-in-out (both in CSS).
// - Endless: the slides are rendered three times and the index jumps back to
//   the middle copy, invisibly, after each move.
// - Arrows, dots, keyboard (left/right), and swipe or drag to change slides.
// Markup: <div class="cflow" data-cflow><div class="cflow__track">slides x3</div>…</div>

document.querySelectorAll('[data-cflow]').forEach((root) => {
  const track = root.querySelector('.cflow__track');
  const slides = [...track.children];
  const N = slides.length / 3;
  const dots = [...root.querySelectorAll('.cflow__dot')];
  let i = N;                                   // first slide of the middle copy

  const pitch = () => slides[1].offsetLeft - slides[0].offsetLeft;
  const place = (animate) => {
    track.classList.toggle('is-jumping', !animate);
    const w = slides[0].offsetWidth;
    const x = root.clientWidth / 2 - (slides[0].offsetLeft + i * pitch() + w / 2);
    track.style.transform = `translate3d(${x.toFixed(1)}px, 0, 0)`;
    slides.forEach((s, k) => {
      const on = k === i;
      s.classList.toggle('is-active', on);
      s.setAttribute('aria-hidden', String(!on));
      s.querySelectorAll('a').forEach((a) => (a.tabIndex = on ? 0 : -1));
    });
    dots.forEach((d, k) => d.setAttribute('aria-current', String(k === i % N)));
    if (!animate) { track.offsetWidth; track.classList.remove('is-jumping'); }
  };
  const go = (n) => { i = n; place(true); };
  track.addEventListener('transitionend', (e) => {
    if (e.target !== track || e.propertyName !== 'transform') return;
    if (i < N || i >= 2 * N) { i = N + (((i - N) % N) + N) % N; place(false); }   // back to the middle copy
  });

  root.querySelector('.cflow__prev')?.addEventListener('click', () => go(i - 1));
  root.querySelector('.cflow__next')?.addEventListener('click', () => go(i + 1));
  dots.forEach((d, k) => d.addEventListener('click', () => go(N + k)));
  root.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(i - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); go(i + 1); }
  });
  // Clicking a side card brings it to the centre instead of following its link.
  slides.forEach((s, k) => s.addEventListener('click', (e) => { if (k !== i) { e.preventDefault(); go(k); } }));

  // Swipe or drag sideways
  let x0 = null, moved = false;
  root.addEventListener('pointerdown', (e) => { x0 = e.clientX; moved = false; });
  root.addEventListener('pointermove', (e) => { if (x0 !== null && Math.abs(e.clientX - x0) > 8) moved = true; });
  root.addEventListener('pointerup', (e) => {
    if (x0 === null) return;
    const dx = e.clientX - x0; x0 = null;
    if (Math.abs(dx) > 50) go(i + (dx < 0 ? 1 : -1));
  });
  root.addEventListener('click', (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);

  addEventListener('resize', () => place(false));
  place(false);
});
