// Capability rose: the homepage hero mover (Nightingale rose / polar area
// chart). Six petals breathe on unrelated periods so the shape never repeats,
// the rose turns once every 90s inside a fixed dial, and hovering or tapping a
// petal names the capability. Pauses offscreen and in hidden tabs; still under
// reduced motion. Markup: [data-rose] holding [data-rose-chart] (with a canvas)
// and [data-rose-readout] (four <p>s).

function initRose(root) {
  // ── Settings ────────────────────────────────────────────────────────────
  const TURN_SECONDS = 90;        // one full rotation
  const HOVER_SPEED  = 0.15;      // rotation slows to this while a petal is held
  const LINE_STEP    = 7;         // px between contour lines inside a petal
  const GAP_DEG      = 7;         // gap between petals
  const FPS_CAP      = 30;

  // Each petal: resting length (0-1), breathing period (s) and phase.
  // The periods share no common beat, so the shape never repeats.
  const PETALS = [
    { name: 'Paid Media',      sum: 'Ads on 500+ platforms, sent to people, not cookies.',   sig: '· clicked a Meta ad',            color: '#6FA8BF', len: .97, period: 13, phase: 0.0 },
    { name: 'Email',           sum: 'The right email, timed to what they just did.',          sig: '· opened your email',            color: '#B5C2C2', len: .62, period: 17, phase: 1.7 },
    { name: 'SMS',             sum: 'Texts sent when they are most likely to act.',           sig: '· didn’t open the text',     color: '#A99CE0', len: .46, period: 19, phase: 3.1 },
    { name: 'In-Store',        sum: 'Store visits, tied back to the marketing that drove them.', sig: '· visited the downtown store', color: '#7E86C9', len: .86, period: 23, phase: 4.4 },
    { name: 'Sales Outreach',  sum: 'Your reps arrive knowing what the buyer wants.',         sig: '· rep visit booked, Thu 10am',   color: '#A585C9', len: .70, period: 29, phase: 2.2 },
    { name: 'AI & Automation', sum: 'Picks the next best step for every customer.',           sig: '· next step picked: send the postcard', color: '#7C93C4', len: .54, period: 31, phase: 5.3 },
  ];

  const VIOLET = '#8E84F7', GOLD = '#D3A754';
  const TAU = Math.PI * 2, N = PETALS.length, SLICE = TAU / N, GAP = GAP_DEG * Math.PI / 180;

  const wrap = root.querySelector('[data-rose-chart]');
  const canvas = wrap.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  const out = root.querySelector('[data-rose-readout]');
  const [outK, outName, outSum, outSig] = out.children;
  const HINT = matchMedia('(hover: none)').matches ? 'Tap a petal to see what it does.' : 'Hover a petal to see what it does.';
  outSum.textContent = HINT;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  let W = 0, H = 0, R = 0, HUB = 0, dpr = 1, labelSize = 11;
  let rot = 0, t = 7, speed = 1, targetSpeed = 1;
  let sel = null, pinned = false;
  let running = false, inView = true, last = 0, raf = 0;
  const glow = PETALS.map(() => 1); // per-petal brightness, eased toward 1 or dimmed

  // ── Size ────────────────────────────────────────────────────────────────
  function resize() {
    const r = canvas.getBoundingClientRect();
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = r.width; H = r.height;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    // Outer reach of a full-length petal, shrunk on narrow screens so the
    // widest label still fits beside it.
    labelSize = Math.max(9.5, Math.min(12, H / 40));
    ctx.font = `400 ${labelSize}px "PT Mono", monospace`;
    const widest = Math.max(...PETALS.map(p => ctx.measureText(p.name.toUpperCase()).width));
    R = Math.min(H * 0.40, W / 2 - widest - 30);
    HUB = R * 0.2;
    draw();
  }

  const petalLength = i => {
    const p = PETALS[i];
    const breathe = reduce ? 1 : 0.78 + 0.22 * Math.sin(TAU * t / p.period + p.phase);
    return HUB + (R - HUB) * p.len * breathe;
  };

  // ── Draw ────────────────────────────────────────────────────────────────
  function draw() {
    if (!W) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.translate(W / 2, H / 2);

    // Bezel: fixed ticks, like an instrument dial. The rose turns inside it.
    ctx.strokeStyle = 'rgba(255,255,255,.14)'; ctx.lineWidth = 1;
    for (let d = 0; d < 360; d += 5) {
      const a = d * Math.PI / 180, long = d % 30 === 0;
      const r0 = R + 6, r1 = R + (long ? 14 : 9);
      ctx.beginPath(); ctx.moveTo(Math.cos(a) * r0, Math.sin(a) * r0); ctx.lineTo(Math.cos(a) * r1, Math.sin(a) * r1); ctx.stroke();
    }
    // Guide rings at 25 / 50 / 75 / 100%
    ctx.setLineDash([1, 5]); ctx.strokeStyle = 'rgba(255,255,255,.10)';
    for (const f of [.25, .5, .75, 1]) { ctx.beginPath(); ctx.arc(0, 0, HUB + (R - HUB) * f, 0, TAU); ctx.stroke(); }
    ctx.setLineDash([]);

    ctx.font = `400 ${labelSize}px "PT Mono", monospace`;
    ctx.textBaseline = 'middle';

    for (let i = 0; i < N; i++) {
      const p = PETALS[i];
      const a0 = -Math.PI / 2 + rot + i * SLICE + GAP / 2, a1 = a0 + SLICE - GAP, mid = (a0 + a1) / 2;
      const r = petalLength(i), on = sel === i, g = glow[i];
      const color = on ? VIOLET : p.color;
      ctx.strokeStyle = color;

      // Contour lines at fixed radii: as a petal grows, new lines fade in at
      // its tip; as it shrinks, they fade out. That is the data coming and going.
      for (let rho = HUB + LINE_STEP; rho < r; rho += LINE_STEP) {
        const depth = (rho - HUB) / (R - HUB);
        const edge = Math.min(1, (r - rho) / LINE_STEP);
        ctx.globalAlpha = (0.32 + 0.68 * depth) * edge * g;
        ctx.lineWidth = on ? 1.2 : 1;
        ctx.beginPath(); ctx.arc(0, 0, rho, a0, a1); ctx.stroke();
      }
      // Petal sides
      ctx.globalAlpha = 0.45 * g;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a0) * HUB, Math.sin(a0) * HUB); ctx.lineTo(Math.cos(a0) * r, Math.sin(a0) * r);
      ctx.moveTo(Math.cos(a1) * HUB, Math.sin(a1) * HUB); ctx.lineTo(Math.cos(a1) * r, Math.sin(a1) * r);
      ctx.stroke();

      // Gold tip marker: the reading for this petal
      ctx.globalAlpha = (on ? 1 : 0.75) * Math.max(g, .5);
      ctx.fillStyle = GOLD;
      ctx.beginPath(); ctx.arc(Math.cos(mid) * r, Math.sin(mid) * r, on ? 3 : 1.75, 0, TAU); ctx.fill();

      // Label stays upright while the rose turns under it
      const lr = R + 22, lx = Math.cos(mid) * lr, ly = Math.sin(mid) * lr;
      const c = Math.cos(mid);
      ctx.textAlign = c > 0.25 ? 'left' : c < -0.25 ? 'right' : 'center';
      ctx.globalAlpha = on ? 1 : 0.7 * Math.max(g, .6);
      ctx.fillStyle = on ? '#FFFFFF' : '#C2C2C2';
      ctx.fillText(p.name.toUpperCase(), lx, ly + (Math.abs(c) <= 0.25 ? Math.sign(Math.sin(mid)) * 4 : 0));
    }

    // Hub
    ctx.globalAlpha = 1;
    ctx.strokeStyle = 'rgba(255,255,255,.18)';
    ctx.beginPath(); ctx.arc(0, 0, HUB * 0.55, 0, TAU); ctx.stroke();
    ctx.fillStyle = GOLD;
    ctx.beginPath(); ctx.arc(0, 0, 1.75, 0, TAU); ctx.fill();
  }

  // ── Loop ────────────────────────────────────────────────────────────────
  function frame(now) {
    raf = requestAnimationFrame(frame);
    if (now - last < 1000 / FPS_CAP - 1) return;
    const dt = Math.min((now - last) / 1000, 0.1); last = now;
    speed += (targetSpeed - speed) * Math.min(1, dt * 3);
    rot += dt * speed * TAU / TURN_SECONDS;
    t += dt;
    easeGlow(dt);
    draw();
  }
  function easeGlow(dt) {
    for (let i = 0; i < N; i++) {
      const goal = sel === null || sel === i ? 1 : 0.32;
      glow[i] += (goal - glow[i]) * Math.min(1, dt * 8);
    }
  }
  function setRunning() {
    const should = !reduce && inView && !document.hidden;
    if (should && !running) { running = true; last = performance.now(); raf = requestAnimationFrame(frame); }
    if (!should && running) { running = false; cancelAnimationFrame(raf); }
  }

  // ── Selection ───────────────────────────────────────────────────────────
  function select(i) {
    if (i === sel) return;
    sel = i;
    targetSpeed = i === null ? 1 : HOVER_SPEED;
    out.classList.add('is-swap');
    setTimeout(() => {
      if (sel === null) {
        outK.textContent = 'Capabilities';
        outName.textContent = 'Six channels, one customer.';
        outSum.textContent = HINT;
        outSig.innerHTML = '&nbsp;';
      } else {
        const p = PETALS[sel];
        outK.textContent = `Capability 0${sel + 1} / 0${N}`;
        outName.textContent = p.name;
        outSum.textContent = p.sum;
        outSig.textContent = p.sig;
      }
      out.classList.remove('is-swap');
    }, 140);
    if (reduce) { for (let k = 0; k < N; k++) glow[k] = sel === null || sel === k ? 1 : 0.32; draw(); }
  }

  function petalAt(e) {
    const r = canvas.getBoundingClientRect();
    const x = e.clientX - r.left - W / 2, y = e.clientY - r.top - H / 2;
    const d = Math.hypot(x, y);
    if (d < HUB * 0.5 || d > R + 34) return null;
    let a = Math.atan2(y, x) + Math.PI / 2 - rot;
    a = ((a % TAU) + TAU) % TAU;
    return Math.floor(a / SLICE) % N;
  }

  canvas.addEventListener('pointermove', e => { if (e.pointerType === 'mouse') select(petalAt(e)); });
  canvas.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse' && !pinned) select(null); });
  canvas.addEventListener('pointerdown', e => {
    if (e.pointerType === 'mouse') return;
    const i = petalAt(e);
    pinned = i !== null && i !== sel;
    select(pinned ? i : null);
  });
  wrap.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { select(sel === null ? 0 : (sel + 1) % N); e.preventDefault(); }
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { select(sel === null ? N - 1 : (sel + N - 1) % N); e.preventDefault(); }
    else if (e.key === 'Escape') select(null);
  });
  wrap.addEventListener('blur', () => { if (!pinned) select(null); });

  // ── Start ───────────────────────────────────────────────────────────────
  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver(([en]) => { inView = en.isIntersecting; setRunning(); }).observe(canvas);
  document.addEventListener('visibilitychange', setRunning);
  document.fonts && document.fonts.ready.then(resize);
  resize();
  setRunning();
}

document.querySelectorAll('[data-rose]').forEach(initRose);
