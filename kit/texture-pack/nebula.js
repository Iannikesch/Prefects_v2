/* Profectus nebula: breathing space background.

   Three layers:
     1. Cloud plate (img/NAME.webp): breathes via CSS, slow scale and light.
     2. Stars: redrawn sharp from img/NAME.stars.json, which
        tools/nebula-build.py found in the source photo. Every 3 to 6 seconds
        one star, picked at random with brighter stars likelier, swells and
        settles.
     3. Shooting star: each time the section scrolls into view, after 1s,
        one small bright streak crosses at most 350px and fades.

   Usage:
     <section style="position:relative;overflow:hidden">
       <div class="pf-nebula" data-src="img/nebula-violet"></div>
       ...content, z-index 2...
     </section>
     <script src="nebula.js" defer></script>

   Pauses offscreen and in hidden tabs. Under prefers-reduced-motion it shows
   the clouds and stars still: no breathing, glows or shooting star. */
(() => {
  const GLOW_EVERY = [3, 6];      // seconds between glow starts
  const GLOW_FOR = 2.6;           // seconds one glow takes to swell and settle
  const GLOW_MEMORY = 6;          // don't repeat any of the last 6 stars
  const SHOOT_DELAY = 1000;       // ms after entering view
  const SHOOT_MAX = 350;          // px, hard cap on the whole streak
  const EDGE = 40;                // px, keep glows and streaks off the edges
  const VIOLET = "142,132,247";   // --pf-violet
  const TINTS = ["255,255,255", "228,224,255", "220,232,238"];  // white, violet-white, mist-white

  const rand = (a, b) => a + Math.random() * (b - a);
  const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  async function makeNebula(host) {
    const src = host.dataset.src || "img/nebula-violet";
    let map = { width: 1, height: 1, stars: [] };
    try { map = await (await fetch(`${src}.stars.json`)).json(); } catch (e) { /* clouds only */ }

    // data-theme="light": for a white page. The cloud plate is shown as a
    // photo-negative in CSS; stars draw in ink, glints and the shooting star
    // in gold. Dark pages are unchanged.
    const theme = host.dataset.theme;                    // "light", "gold", or dark (default)
    const light = theme === "light", gold = theme === "gold";
    const ACC = light ? "201,154,66" : gold ? "211,167,84" : VIOLET;          // halo, glint, trail
    const CORE = light ? "112,82,28" : gold ? "255,242,205" : "255,255,255";  // glint core, shooting-star head
    const TT = light ? ["24,22,32", "52,44,78", "34,48,60"]
             : gold ? ["255,238,198", "247,225,127", "228,224,255", "229,186,97", "200,192,255"] : TINTS;

    const breath = document.createElement("div");
    breath.className = "pf-nebula__breath";
    const plate = new Image();
    plate.className = "pf-nebula__plate";
    plate.alt = ""; plate.decoding = "async"; plate.src = `${src}.webp`;
    const starCv = document.createElement("canvas");
    const shootCv = document.createElement("canvas");
    shootCv.className = "pf-nebula__shoot";
    [starCv, shootCv].forEach((c) => c.setAttribute("aria-hidden", "true"));
    breath.append(plate, starCv);
    host.append(breath, shootCv);

    const sctx = starCv.getContext("2d"), hctx = shootCv.getContext("2d");
    const base = document.createElement("canvas"), bctx = base.getContext("2d");
    let W = 0, H = 0, dpr = 1, stars = [];

    // Place stars exactly where object-fit: cover puts the plate's pixels.
    function layout() {
      const r = host.getBoundingClientRect();
      W = Math.max(1, r.width); H = Math.max(1, r.height);
      dpr = Math.min(2, window.devicePixelRatio || 1);
      for (const c of [starCv, shootCv, base]) { c.width = W * dpr; c.height = H * dpr; }
      for (const x of [sctx, hctx, bctx]) x.setTransform(dpr, 0, 0, dpr, 0, 0);

      const s = Math.max(W / map.width, H / map.height);
      const ox = (W - map.width * s) / 2, oy = (H - map.height * s) / 2;
      stars = map.stars.map(([nx, ny, b], i) => ({
        x: nx * map.width * s + ox, y: ny * map.height * s + oy, b,
        r: 0.45 + 1.35 * Math.pow(b, 1.2),
        tint: TT[i % TT.length],
        acc: gold && i % 2 ? VIOLET : ACC,   // gold theme: glints alternate gold and violet
      })).filter((p) => p.x > -4 && p.x < W + 4 && p.y > -4 && p.y < H + 4);

      // Static star layer, drawn once per size.
      bctx.clearRect(0, 0, W, H);
      for (const p of stars) {
        if (p.b > 0.55) {               // bright stars carry a faint halo
          const g = bctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5);
          g.addColorStop(0, `rgba(${p.acc},${0.22 * p.b})`); g.addColorStop(1, `rgba(${p.acc},0)`);
          bctx.fillStyle = g; bctx.fillRect(p.x - p.r * 5, p.y - p.r * 5, p.r * 10, p.r * 10);
        }
        bctx.fillStyle = `rgba(${p.tint},${0.35 + 0.65 * p.b})`;
        bctx.beginPath(); bctx.arc(p.x, p.y, p.r, 0, 6.2832); bctx.fill();
      }
    }

    // ---- glow: pick, weight by brightness squared, skip recent ones ----
    let glow = null, nextGlow = 0;
    const recent = [];
    function pickStar() {
      const pool = stars.filter((p) => p.x > EDGE && p.x < W - EDGE && p.y > EDGE && p.y < H - EDGE && !recent.includes(p));
      if (!pool.length) return null;
      let sum = 0; for (const p of pool) sum += p.b * p.b;
      let roll = Math.random() * sum;
      for (const p of pool) { roll -= p.b * p.b; if (roll <= 0) return p; }
      return pool[pool.length - 1];
    }
    function drawGlow(p, e) {
      // e: 0..1 envelope. Halo in violet, core swells, two faint spikes.
      const R = p.r * 4 + 22 * e;
      const g = sctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, R);
      g.addColorStop(0, `rgba(${p.acc},${0.55 * e})`); g.addColorStop(1, `rgba(${p.acc},0)`);
      sctx.fillStyle = g; sctx.fillRect(p.x - R, p.y - R, R * 2, R * 2);
      const L = 4 + 16 * e;
      sctx.lineWidth = 0.6;
      for (const [dx, dy] of [[1, 0], [0, 1]]) {
        const s = sctx.createLinearGradient(p.x - dx * L, p.y - dy * L, p.x + dx * L, p.y + dy * L);
        s.addColorStop(0, `rgba(${CORE},0)`); s.addColorStop(0.5, `rgba(${CORE},${0.45 * e})`); s.addColorStop(1, `rgba(${CORE},0)`);
        sctx.strokeStyle = s;
        sctx.beginPath(); sctx.moveTo(p.x - dx * L, p.y - dy * L); sctx.lineTo(p.x + dx * L, p.y + dy * L); sctx.stroke();
      }
      sctx.fillStyle = `rgba(${CORE},${0.6 + 0.4 * e})`;
      sctx.beginPath(); sctx.arc(p.x, p.y, p.r * (1 + 0.9 * e), 0, 6.2832); sctx.fill();
    }

    // ---- shooting star ----
    let shot = null, shootTimer = 0;
    let shotCount = 0;
    function launch() {
      const dist = rand(240, SHOOT_MAX);
      const dir = Math.random() < 0.5 ? 1 : -1;               // left or right
      const ang = rand(12, 30) * Math.PI / 180;               // falling, shallow
      const dx = Math.cos(ang) * dir, dy = Math.sin(ang);
      // start so the whole path stays inside the frame
      const x0 = dir > 0 ? rand(EDGE, Math.max(EDGE + 1, W - EDGE - dx * dist)) : rand(Math.min(W - EDGE - 1, EDGE - dx * dist), W - EDGE);
      const y0 = rand(H * 0.12, Math.max(H * 0.12 + 1, Math.min(H * 0.5, H - EDGE - dy * dist)));
      shotCount++;
      shot = { x0, y0, dx, dy, dist, trail: rand(70, 110), dur: rand(0.75, 1.0), t: 0,
               acc: gold && shotCount % 2 === 0 ? VIOLET : ACC };   // gold theme: alternate gold, violet
    }
    function drawShot(dt) {
      hctx.clearRect(0, 0, W, H);
      if (!shot) return;
      shot.t += dt;
      const p = shot.t / shot.dur;
      if (p >= 1) { shot = null; return; }
      const travel = shot.dist * (1 - Math.pow(1 - p, 2.2));       // ease-out
      const tail = Math.max(0, travel - shot.trail);                 // never behind the start
      const a = smooth(0, 0.12, p) * (1 - smooth(0.5, 1, p));        // fade in, fade off
      const hx = shot.x0 + shot.dx * travel, hy = shot.y0 + shot.dy * travel;
      const tx = shot.x0 + shot.dx * tail, ty = shot.y0 + shot.dy * tail;
      const g = hctx.createLinearGradient(hx, hy, tx, ty);
      g.addColorStop(0, `rgba(${CORE},${a})`);
      g.addColorStop(0.3, `rgba(${shot.acc},${0.55 * a})`);
      g.addColorStop(1, `rgba(${shot.acc},0)`);
      hctx.strokeStyle = g; hctx.lineWidth = 1.4; hctx.lineCap = "round";
      hctx.beginPath(); hctx.moveTo(tx, ty); hctx.lineTo(hx, hy); hctx.stroke();
      const hg = hctx.createRadialGradient(hx, hy, 0, hx, hy, 7);
      hg.addColorStop(0, `rgba(${CORE},${a})`); hg.addColorStop(0.35, `rgba(${shot.acc},${0.5 * a})`); hg.addColorStop(1, `rgba(${shot.acc},0)`);
      hctx.fillStyle = hg; hctx.fillRect(hx - 7, hy - 7, 14, 14);
    }

    // ---- loop ----
    let raf = 0, last = 0, clock = 0, visible = false;
    function frame(now) {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - (last || now)) / 1000); last = now; clock += dt;
      sctx.clearRect(0, 0, W, H);
      sctx.drawImage(base, 0, 0, W, H);
      if (!glow && clock >= nextGlow) {
        const p = pickStar();
        if (p) { glow = { p, t: 0 }; recent.push(p); if (recent.length > GLOW_MEMORY) recent.shift(); }
        nextGlow = clock + rand(...GLOW_EVERY);
      }
      if (glow) {
        glow.t += dt;
        const k = glow.t / GLOW_FOR;
        if (k >= 1) glow = null; else drawGlow(glow.p, Math.pow(Math.sin(Math.PI * k), 2));
      }
      if (shot || shootCv.dataset.dirty) { drawShot(dt); shootCv.dataset.dirty = shot ? "1" : ""; }
    }
    const run = () => { if (!raf && visible && !document.hidden && !reduced) { last = 0; raf = requestAnimationFrame(frame); } };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; };

    layout();
    sctx.drawImage(base, 0, 0, W, H);
    nextGlow = rand(0.8, 2);

    let wasIn = false;
    new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      const isIn = e.intersectionRatio >= 0.35;
      if (isIn && !wasIn && !reduced) {
        clearTimeout(shootTimer);
        shootTimer = setTimeout(() => { launch(); shootCv.dataset.dirty = "1"; }, SHOOT_DELAY);
      }
      if (!isIn && wasIn) clearTimeout(shootTimer);   // left before it fired
      wasIn = isIn;
      visible ? run() : stop();
    }, { threshold: [0, 0.35] }).observe(host);
    document.addEventListener("visibilitychange", () => (document.hidden ? stop() : run()));
    let rt;
    new ResizeObserver(() => {
      clearTimeout(rt);
      rt = setTimeout(() => { const r = host.getBoundingClientRect();
        if (Math.abs(r.width - W) > 1 || Math.abs(r.height - H) > 1) { layout(); sctx.drawImage(base, 0, 0, W, H); } }, 150);
    }).observe(host);
  }

  document.querySelectorAll(".pf-nebula:not([data-nebula-ready])").forEach((el) => {
    el.dataset.nebulaReady = "";
    makeNebula(el);
  });
})();
