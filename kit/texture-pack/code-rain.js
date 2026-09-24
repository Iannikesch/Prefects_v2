/* Profectus code rain: live background.
   Glyph columns drift down like a waterfall, in three depth layers. Streams
   break into runs and gaps that travel with the flow, each column's speed
   breathes, a faint light pulse slides down some columns, and a soft glow
   sweeps across the whole field. The fade in at the top and out at the
   bottom is a CSS mask on .pf-rain, not drawn here.

   Usage:
     <div class="pf-rain" data-ramp="violet"></div>   (violet | aurora)
     <script src="code-rain.js" defer></script>
   Optional: data-speed="1" (multiplier), data-density="1" (multiplier).

   Background rules: capped at 30fps, pauses offscreen and in hidden tabs,
   draws one still frame under prefers-reduced-motion. */
(() => {
  const RAMPS = {
    // Same stops as img/code-rain-*.webp, from the dim end up.
    violet: ["#1C1F3C", "#485384", "#5B588E", "#775E99", "#8E84F7", "#B9B2FA", "#EDEBFF"],
    aurora: ["#1C1F3C", "#214567", "#2F6476", "#48798E", "#8C9999", "#B8C4C6", "#E6EEF0"],
  };
  const LEVELS = 10;       // colour steps baked into the atlas
  const GLOW_FROM = 7;     // levels at and above this get a baked soft glow
  const FPS = 30;
  // Half-width katakana, digits and a few latin: the "vintage code" set.
  const GLYPHS = "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789:=+<>*ZXQ";
  const FONT = '"PT Mono", "MS Gothic", "Osaka", ui-monospace, monospace';
  // Far to near: smaller, dimmer, slower at the back.
  const LAYERS = [
    { fs: 11, speed: [9, 16],  alpha: 0.40, gap: 1.5, keep: 0.55 },
    { fs: 14, speed: [15, 26], alpha: 0.65, gap: 1.6, keep: 0.45 },
    { fs: 18, speed: [24, 38], alpha: 0.90, gap: 1.8, keep: 0.28 },
  ];

  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = () => (Math.random() * GLYPHS.length) | 0;
  const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const mix = (a, b, f) => a.map((v, i) => Math.round(v + (b[i] - v) * f));

  function rampColours(stops) {
    const rgb = stops.map(hex);
    return Array.from({ length: LEVELS }, (_, l) => {
      const t = (l / (LEVELS - 1)) * (rgb.length - 1);
      const i = Math.min(rgb.length - 2, Math.floor(t));
      return `rgb(${mix(rgb[i], rgb[i + 1], t - i).join(",")})`;
    });
  }

  // One pre-coloured sprite sheet per layer: rows = levels, cols = glyphs.
  function buildAtlas(fs, colours, dpr) {
    const cw = Math.ceil(fs * 1.6), ch = Math.ceil(fs * 1.6);
    const c = document.createElement("canvas");
    c.width = GLYPHS.length * cw * dpr;
    c.height = LEVELS * ch * dpr;
    const x = c.getContext("2d");
    x.scale(dpr, dpr);
    x.font = `${fs}px ${FONT}`;
    x.textAlign = "center";
    x.textBaseline = "middle";
    colours.forEach((col, l) => {
      x.fillStyle = col;
      x.shadowColor = col;
      x.shadowBlur = l >= GLOW_FROM ? fs * 0.5 * ((l - GLOW_FROM + 1) / (LEVELS - GLOW_FROM)) : 0;
      [...GLYPHS].forEach((g, i) => x.fillText(g, i * cw + cw / 2, l * ch + ch / 2));
    });
    return { img: c, cw, ch };
  }

  // A column's cells come in runs (a stream) and gaps, so breaks travel down
  // with the flow. Brightness rises toward the leading (lower) end of a run.
  function nextCell(col) {
    if (col.left <= 0) {
      col.on = !col.on;
      col.runLen = col.left = col.on ? (rand(5, 26) | 0) : (rand(3, 22) | 0);
    }
    col.left--;
    if (!col.on) return null;
    const p = 1 - col.left / col.runLen;             // 0 at tail, 1 at head
    const head = col.left === 0 && Math.random() < 0.6;
    return { g: pick(), base: head ? 1 : 0.18 + 0.55 * p * p };
  }

  function makeField(host) {
    const ramp = RAMPS[host.dataset.ramp] || RAMPS.violet;
    const speedMul = parseFloat(host.dataset.speed) || 1;
    const densityMul = parseFloat(host.dataset.density) || 1;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    host.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    const colours = rampColours(ramp);

    let w = 0, h = 0, dpr = 1, layers = [], t = 0;

    function build() {
      const r = host.getBoundingClientRect();
      w = Math.max(1, r.width); h = Math.max(1, r.height);
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      layers = LAYERS.map((L) => {
        const atlas = buildAtlas(L.fs, colours, dpr);
        const lineH = L.fs * 1.15;
        const cols = [];
        for (let x = rand(0, L.fs); x < w; x += L.fs * L.gap * rand(0.85, 1.25)) {
          if (Math.random() > L.keep * densityMul) continue;
          const col = {
            x, lineH, on: Math.random() < 0.5, left: 0, runLen: 1,
            speed: rand(...L.speed) * speedMul,
            breathP: rand(18, 42), breathA: rand(0.12, 0.3), phase: rand(0, 6.28),
            // a light pulse slides down roughly one column in three
            pulse: Math.random() < 0.35 ? { v: rand(60, 110), cycle: rand(1.6, 3.5), off: rand(0, 1) } : null,
            cells: [], y0: 0,
          };
          // Pre-fill the full height so the field starts already flowing.
          const n = Math.ceil(h / lineH) + 2;
          for (let i = 0; i < n; i++) col.cells.unshift(nextCell(col));
          col.y0 = -lineH;
          cols.push(col);
        }
        return { ...L, atlas, cols };
      });
    }

    function step(dt) {
      t += dt;
      for (const L of layers) for (const c of L.cols) {
        const breath = 1 + c.breathA * Math.sin((t / c.breathP) * 6.283 + c.phase);
        c.y0 += c.speed * breath * dt;
        while (c.y0 > -c.lineH) { c.cells.unshift(nextCell(c)); c.y0 -= c.lineH; }
        while (c.y0 + (c.cells.length - 1) * c.lineH > h + c.lineH) c.cells.pop();
        // occasional glyph swaps so the text never sits still
        for (const cell of c.cells) if (cell && Math.random() < 0.12 * dt) cell.g = pick();
      }
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      // A soft glow band sweeping across the field on a slow diagonal.
      const R = w * 0.18, sweepX = ((t * 34) % (w + 4 * R)) - 2 * R;
      for (const L of layers) {
        const { img, cw, ch } = L.atlas;
        for (const c of L.cols) {
          const py = c.pulse ? (((t / (h / c.pulse.v)) / c.pulse.cycle + c.pulse.off) % 1) * h * c.pulse.cycle : -1e9;
          for (let i = 0; i < c.cells.length; i++) {
            const cell = c.cells[i];
            if (!cell) continue;
            const y = c.y0 + i * c.lineH;
            const dp = (y - py) / 70, dx = (c.x - sweepX + y * 0.35) / R;
            let I = cell.base * 0.8 + 0.45 * Math.exp(-dp * dp) + 0.22 * Math.exp(-dx * dx);
            if (I < 0.05) continue;
            if (I > 1) I = 1;
            const l = Math.min(LEVELS - 1, (I * (LEVELS - 1)) | 0);
            ctx.globalAlpha = L.alpha * Math.min(1, 0.25 + I);
            ctx.drawImage(img, cell.g * cw * dpr, l * ch * dpr, cw * dpr, ch * dpr,
                          c.x - cw / 2, y - ch / 2, cw, ch);
          }
        }
      }
      ctx.globalAlpha = 1;
    }

    // ---- lifecycle ----
    let raf = 0, last = 0, acc = 0, visible = false;
    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.1, (now - (last || now)) / 1000);
      last = now; acc += dt;
      if (acc < 1 / FPS) return;
      step(acc); draw(); acc = 0;
    };
    const run = () => { if (!raf && visible && !document.hidden && !reduced) { last = 0; raf = requestAnimationFrame(frame); } };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; };

    build();
    if (reduced) { step(8); draw(); }  // one settled still frame
    else draw();

    new IntersectionObserver(([e]) => { visible = e.isIntersecting; visible ? run() : stop(); }).observe(host);
    document.addEventListener("visibilitychange", () => (document.hidden ? stop() : run()));
    let rt;
    new ResizeObserver(() => {
      clearTimeout(rt);
      rt = setTimeout(() => { const r = host.getBoundingClientRect();
        if (Math.abs(r.width - w) > 1 || Math.abs(r.height - h) > 1) { build(); draw(); } }, 150);
    }).observe(host);
  }

  const init = () => document.querySelectorAll(".pf-rain:not([data-rain-ready])").forEach((el) => {
    el.dataset.rainReady = "";
    makeField(el);
  });
  // Wait for PT Mono so the atlas isn't baked in the fallback face.
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(init);
})();
