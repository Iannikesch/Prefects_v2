/* Profectus Motion System: the engine.
   One requestAnimationFrame loop drives every scroll-, time- and
   pointer-driven mover. Each mover only works while it is on screen, and
   under prefers-reduced-motion every mover shows its finished, still state.

   Markup hooks (see MOTION-SYSTEM.md for what each one is):
     .pm-marquee > .pm-marquee__track     05 infinite marquee
     .pm-stepper > .pm-stepper__track     06 stepped carousel
     .pm-parallax > .pm-parallax__plate   07 parallax
     .pm-scrub                            08 scroll-scrubbed words
     .pm-lag [data-speed]                 09 spring-smoothed lag
     body[data-pm-cursor]                 10 cursor follower
     .pm-rise                             11 scroll-triggered fade-up
     canvas[data-pm-globe]                03 continuous rotation
     canvas[data-pm-flow]                 04 flow field
   Smooth scroll (01) runs when Lenis is on the page. The aurora (02) is CSS. */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = getComputedStyle(document.documentElement);
  const token = (name) => root.getPropertyValue(name).trim();
  const num = (name) => parseFloat(token(name));
  const pair = (name) => token(name).split(/\s+/).map(Number);
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const easeOutCubic = (p) => 1 - Math.pow(1 - p, 3);

  /* ---- Visibility: movers sleep off screen ---- */
  const visible = new WeakMap();
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      visible.set(e.target, e.isIntersecting);
      e.target.classList.toggle('is-off', !e.isIntersecting);
    }
  }, { rootMargin: '100px 0px' });
  const watch = (el) => { visible.set(el, false); io.observe(el); };
  const onScreen = (el) => visible.get(el) === true;

  /* ---- The one loop ---- */
  const tickers = [];
  let last = 0;
  const loop = (now) => {
    const dt = Math.min(0.05, (now - (last || now)) / 1000);
    last = now;
    for (const tick of tickers) tick(dt, now);
    requestAnimationFrame(loop);
  };

  /* ---- Spring: stiffness k, damping c, mass 1. Sub-stepped so it
     stays stable at any frame rate. ---- */
  class Spring {
    constructor([k, c], x = 0) { this.k = k; this.c = c; this.x = x; this.v = 0; this.target = x; }
    step(dt) {
      const n = Math.max(1, Math.ceil(dt * 240)), h = dt / n;
      for (let i = 0; i < n; i++) {
        this.v += (-this.k * (this.x - this.target) - this.c * this.v) * h;
        this.x += this.v * h;
      }
      return this.x;
    }
  }

  /* ================= 01 Smooth scroll ================= */
  if (!reduce && window.Lenis) {
    // wheelMultiplier measured ≈2 on the source (see MOTION-SYSTEM.md);
    // 1 keeps trackpads calm. Raise it to match the source exactly.
    window.pmLenis = new Lenis({ lerp: num('--pm-scroll-lerp'), wheelMultiplier: 1, autoRaf: true });
  }

  /* ================= 05 Infinite marquee ================= */
  const marquees = [...document.querySelectorAll('.pm-marquee')];
  const sizeMarquees = () => marquees.forEach((m) => {
    const track = m.querySelector('.pm-marquee__track');
    track.style.setProperty('--pm-loop', Math.round(track.scrollWidth / 2));
  });
  marquees.forEach(watch);

  /* ================= 06 Stepped carousel ================= */
  document.querySelectorAll('.pm-stepper').forEach((box) => {
    const track = box.querySelector('.pm-stepper__track');
    const items = [...track.children];
    const copy = items.length / 2;                  // the track holds two copies
    let i = 0, since = 0;
    const every = num('--pm-step-every');
    const stepPx = () => items[1].offsetLeft - items[0].offsetLeft;
    const go = (snap) => {
      track.classList.toggle('is-snap', snap);
      track.style.transform = `translateX(${-i * stepPx()}px)`;
      if (snap) { track.offsetWidth; track.classList.remove('is-snap'); }
    };
    track.addEventListener('transitionend', () => { if (i >= copy) { i -= copy; go(true); } });
    watch(box);
    if (reduce) return;
    tickers.push((dt) => {
      if (!onScreen(box)) return;
      since += dt * 1000;
      if (since >= every) { since = 0; i++; go(false); }
    });
  });

  /* ================= 07 Parallax ================= */
  document.querySelectorAll('.pm-parallax').forEach((band) => {
    const plate = band.querySelector('.pm-parallax__plate');
    const from = num('--pm-parallax-from'), to = num('--pm-parallax-to');
    watch(band);
    if (reduce) return;
    // Runs while the band leaves through the top of the viewport: 0 when
    // its top edge reaches the top, 1 when its bottom edge does. On a 640px
    // band that is exactly the measured 0.2078px per px of scroll.
    tickers.push(() => {
      if (!onScreen(band)) return;
      const r = band.getBoundingClientRect();
      const p = clamp(-r.top / r.height, 0, 1);
      plate.style.setProperty('--pm-y', `${from + (to - from) * p}px`);
    });
  });

  /* ================= 08 Scroll-scrubbed words ================= */
  document.querySelectorAll('.pm-scrub').forEach((el) => {
    const text = el.textContent.trim();
    el.setAttribute('aria-label', text);
    const esc = (w) => w.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]);
    el.innerHTML = text.split(/\s+/).map((w) => `<span class="pm-w" aria-hidden="true">${esc(w)}</span>`).join(' ');
    const words = [...el.querySelectorAll('.pm-w')];
    const floor = num('--pm-scrub-floor'), per = num('--pm-scrub-per-word'), gap = num('--pm-scrub-stagger');
    watch(el);
    if (reduce) return;
    // Starts when the heading's top reaches 45% down the viewport.
    tickers.push(() => {
      if (!onScreen(el)) return;
      const scrolled = innerHeight * 0.45 - el.getBoundingClientRect().top;
      words.forEach((w, i) => {
        const p = clamp((scrolled - i * gap) / per, 0, 1);
        w.style.setProperty('--pm-o', (floor + (1 - floor) * easeOutCubic(p)).toFixed(3));
      });
    });
  });

  /* ================= 09 Spring-smoothed lag ================= */
  document.querySelectorAll('.pm-lag').forEach((el) => {
    const speed = parseFloat(el.dataset.speed || 0.15);
    const max = parseFloat(el.dataset.max || 200);
    const spring = new Spring(pair('--pm-spring-lag'));
    watch(el);
    if (reduce) return;
    // Target: pull toward the viewport centre in proportion to distance.
    // The spring is measured; this target mapping is reconstructed.
    tickers.push((dt) => {
      if (!onScreen(el)) return;
      const r = el.getBoundingClientRect();
      const off = r.top - spring.x + r.height / 2 - innerHeight / 2;   // untransformed position
      spring.target = clamp(-off * speed, -max, max);
      el.style.setProperty('--pm-y', `${spring.step(dt).toFixed(2)}px`);
    });
  });

  /* ================= 10 Cursor follower ================= */
  if (!reduce && document.body.hasAttribute('data-pm-cursor') && matchMedia('(pointer: fine)').matches) {
    const ring = document.createElement('div');
    ring.className = 'pm-cursor';
    ring.innerHTML = '<i class="pm-cursor-dot"></i>';
    document.body.append(ring);
    const sx = new Spring(pair('--pm-spring-cursor'), -100), sy = new Spring(pair('--pm-spring-cursor'), -100);
    let seen = false;
    addEventListener('pointermove', (e) => {
      if (!seen) { sx.x = e.clientX; sy.x = e.clientY; seen = true; }
      sx.target = e.clientX; sy.target = e.clientY;
    }, { passive: true });
    document.documentElement.addEventListener('pointerleave', () => { ring.style.opacity = 0; });
    document.documentElement.addEventListener('pointerenter', () => { ring.style.opacity = 1; });
    tickers.push((dt) => {
      if (!seen) return;
      ring.style.setProperty('--pm-x', `${sx.step(dt)}px`);
      ring.style.setProperty('--pm-y', `${sy.step(dt)}px`);
    });
  }

  /* ================= 11 Scroll-triggered fade-up ================= */
  const riser = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('is-in'); riser.unobserve(e.target); }
  }), { rootMargin: '0px 0px -15% 0px' });
  document.querySelectorAll('.pm-rise').forEach((el) => riser.observe(el));

  /* ---- Canvas helper: sized to its box, capped at 2× and 30fps ---- */
  const canvasMover = (canvas, setup, draw) => {
    const ctx = canvas.getContext('2d');
    let w = 0, h = 0, dpr = 1, acc = 0, state;
    const resize = () => {
      dpr = Math.min(2, devicePixelRatio || 1);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      state = setup(w, h);
      draw(ctx, w, h, state, 0, 0);
    };
    new ResizeObserver(resize).observe(canvas);
    watch(canvas);
    if (reduce) return;
    let t = 0;
    tickers.push((dt) => {
      if (!onScreen(canvas) || !state) return;
      t += dt; acc += dt;
      if (acc < 1 / 30) return;
      draw(ctx, w, h, state, t, acc); acc = 0;
    });
  };

  /* ================= 03 Continuous rotation: dotted globe ================= */
  document.querySelectorAll('canvas[data-pm-globe]').forEach((canvas) => {
    const rev = num('--pm-globe-rev');
    // Rough continents: caps at Earth-like spots, edges roughened. Not a real map.
    const caps = [[45, -100, .55], [-15, -60, .42], [50, 20, .42], [5, 20, .5], [45, 95, .62], [-25, 135, .32], [70, -40, .22]]
      .map(([la, lo, r]) => { la *= Math.PI / 180; lo *= Math.PI / 180;
        return [Math.cos(la) * Math.sin(lo), Math.sin(la), Math.cos(la) * Math.cos(lo), r]; });
    const land = (x, y, z) => caps.some(([cx, cy, cz, r]) =>
      Math.acos(clamp(x * cx + y * cy + z * cz, -1, 1)) <
      r * (1 + 0.2 * Math.sin(7 * x + 3 * y) + 0.14 * Math.sin(11 * z - 5 * y)));
    canvasMover(canvas, () => {
      const pts = [];
      for (let lat = -84; lat <= 84; lat += 2.2) {          // halftone rows
        const c = Math.cos(lat * Math.PI / 180), n = Math.max(1, Math.round(360 * c / 2.2));
        for (let j = 0; j < n; j++) {
          const lon = (j / n) * Math.PI * 2, la = lat * Math.PI / 180;
          const x = Math.cos(la) * Math.sin(lon), y = Math.sin(la), z = Math.cos(la) * Math.cos(lon);
          if (land(x, y, z)) pts.push([x, y, z]);
        }
      }
      return pts;
    }, (ctx, w, h, pts, t) => {
      const R = Math.min(w, h) * 0.4, cx = w / 2, cy = h / 2;
      const th = -1.66 + (t / rev) * Math.PI * 2, tilt = 0.35;   // start facing Asia (lon 95°), like the source
      const ct = Math.cos(th), st = Math.sin(th), ca = Math.cos(tilt), sa = Math.sin(tilt);
      ctx.clearRect(0, 0, w, h);
      const body = ctx.createRadialGradient(cx - R * .25, cy - R * .3, R * .1, cx, cy, R);
      body.addColorStop(0, '#1b1440'); body.addColorStop(1, '#0a0718');
      ctx.fillStyle = body; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.fill();
      ctx.fillStyle = '#6f5fc7';
      for (const [x, y, z] of pts) {
        const x1 = x * ct + z * st, z1 = -x * st + z * ct;   // spin: surface moves left → right
        const y2 = y * ca - z1 * sa, z2 = y * sa + z1 * ca;  // tilt the pole toward us
        if (z2 <= 0) continue;
        ctx.globalAlpha = 0.2 + 0.8 * z2;                    // dim toward the limb
        ctx.fillRect(cx + x1 * R - 0.8, cy - y2 * R - 0.8, 1.6, 1.6);
      }
      ctx.globalAlpha = 1;
      ctx.shadowColor = '#887bb8'; ctx.shadowBlur = 24;       // rim light
      ctx.strokeStyle = '#a89cf2'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke();
      ctx.shadowBlur = 0;
    });
  });

  /* ================= 04 Flow field: nebula ================= */
  document.querySelectorAll('canvas[data-pm-flow]').forEach((canvas) => {
    const colours = ['#8f7ad6', '#8f7ad6', '#8f7ad6', '#775e99', '#6fc4c9', '#8c9999'];
    const field = (x, y, t) =>                                // smooth pseudo-noise angle
      Math.sin(x * 0.004 + t * 0.05) * 2.1 + Math.cos(y * 0.005 - t * 0.04) * 1.7 +
      Math.sin((x + y) * 0.002 + t * 0.03) * 1.3;
    const gauss = () => Math.sqrt(-2 * Math.log(Math.random() || 1e-9)) * Math.cos(2 * Math.PI * Math.random());
    const spawn = (w, h) => ({                               // cluster toward the centre: a cloud, not a carpet
      x: clamp(w / 2 + gauss() * w * 0.2, 0, w), y: clamp(h / 2 + gauss() * h * 0.26, 0, h),
      life: 6 + Math.random() * 8, c: colours[(Math.random() * colours.length) | 0] });
    canvasMover(canvas, (w, h) => Array.from({ length: Math.round(w * h / 700) }, () => spawn(w, h)),
      (ctx, w, h, ps, t, dt) => {
        if (!dt) {                                             // still frame: scatter only
          ctx.clearRect(0, 0, w, h);
          for (const p of ps) { ctx.fillStyle = p.c; ctx.globalAlpha = .5; ctx.fillRect(p.x, p.y, 1, 1); }
          ctx.globalAlpha = 1; return;
        }
        ctx.globalCompositeOperation = 'destination-out';      // fade old trails
        ctx.fillStyle = 'rgba(0,0,0,0.06)'; ctx.fillRect(0, 0, w, h);
        ctx.globalCompositeOperation = 'lighter';
        for (let i = 0; i < ps.length; i++) {
          const p = ps[i], a = field(p.x, p.y, t);
          p.x += Math.cos(a) * 9 * dt; p.y += Math.sin(a) * 9 * dt; p.life -= dt;
          if (p.life < 0 || p.x < 0 || p.x > w || p.y < 0 || p.y > h) { ps[i] = spawn(w, h); continue; }
          ctx.globalAlpha = 0.5; ctx.fillStyle = p.c; ctx.fillRect(p.x, p.y, 1.2, 1.2);
        }
        ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
      });
  });

  /* ---- Start ---- */
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(sizeMarquees);
  addEventListener('resize', sizeMarquees);
  requestAnimationFrame(loop);
})();
