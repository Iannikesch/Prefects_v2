// Site behaviour that isn't part of the motion system: the hiding header,
// the mobile menu, the contact pop-up, the case rail and the form.
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const lenis = () => window.pmLenis;

/* ---- L12 · Header hides on the way down, returns on the way up (Deloitte).
   Switch: <html data-nav-hide="on">, set from layers.js. ---- */
const nav = document.querySelector('.site-nav');
if (nav && document.documentElement.dataset.navHide === 'on') {
  let lastY = scrollY;
  const onScroll = () => {
    const y = scrollY, dy = y - lastY;
    if (Math.abs(dy) < 6) return;
    const hide = dy > 0 && y > 120 && !document.body.classList.contains('menu-open');
    nav.classList.toggle('is-hidden', hide);
    document.documentElement.classList.toggle('nav-hidden', hide);
    lastY = y;
  };
  addEventListener('scroll', onScroll, { passive: true });
}

/* ---- Mobile menu: instant open and close, like the source ---- */
const toggle = document.querySelector('.site-nav__toggle');
const menu = document.getElementById('site-menu');
if (toggle && menu) {
  const set = (open) => {
    menu.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    open ? lenis()?.stop() : lenis()?.start();
  };
  toggle.addEventListener('click', () => set(!menu.classList.contains('is-open')));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) set(false); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape') set(false); });
}

/* ---- Contact pop-up: every [data-contact] opens it (Deloitte / Epsilon).
   Links still point at /contact, so it works without JS too. ---- */
const modal = document.getElementById('contact-modal');
if (modal) {
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-contact]');
    if (!trigger || e.metaKey || e.ctrlKey) return;
    e.preventDefault();
    modal.showModal();
    lenis()?.stop();
  });
  modal.addEventListener('close', () => lenis()?.start());
  modal.addEventListener('click', (e) => { if (e.target === modal || e.target.closest('.modal__close')) modal.close(); });
}

/* ---- Case rail: one card per click, 250ms (Merkle) ---- */
document.querySelectorAll('.rail').forEach((rail) => {
  const track = rail.querySelector('.rail__track');
  const viewport = rail.querySelector('.rail__viewport');
  const [prev, next] = rail.querySelectorAll('.rail__btn');
  if (!track || !prev || !next) return;
  let i = 0;
  const step = () => {
    const a = track.children[0], b = track.children[1];
    return b ? b.offsetLeft - a.offsetLeft : 0;
  };
  const max = () => {
    const overflow = track.scrollWidth - viewport.clientWidth;
    return Math.max(0, Math.ceil(overflow / Math.max(1, step())));
  };
  const go = (n) => {
    i = Math.min(max(), Math.max(0, n));
    track.style.transform = `translateX(${-i * step()}px)`;
    prev.disabled = i === 0;
    next.disabled = i >= max();
  };
  prev.addEventListener('click', () => go(i - 1));
  next.addEventListener('click', () => go(i + 1));
  addEventListener('resize', () => go(i));
  go(0);
});

/* ---- Contact form: posts to /api/contact (Resend) ---- */
document.querySelectorAll('form[data-contact-form]').forEach((form) => {
  const opened = Date.now();
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const note = form.querySelector('.form__note');
    const btn = form.querySelector('button[type="submit"]');
    if (!form.reportValidity()) return;
    const data = Object.fromEntries(new FormData(form));
    data.elapsed = Date.now() - opened;
    btn.disabled = true;
    note.textContent = 'Sending…';
    try {
      const r = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      const j = await r.json();
      if (!j.ok) throw new Error(j.error);
      form.reset();
      note.textContent = "Thanks, we've got your message and will be in touch within one business day.";
    } catch (err) {
      note.textContent = err.message || 'Something went wrong. Please email hello@profectusagency.com.';
    } finally {
      btn.disabled = false;
    }
  });
});

if (reduce) document.documentElement.classList.add('reduce-motion');
