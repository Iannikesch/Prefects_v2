// L6 · Smooth scroll. The motion engine starts Lenis only if it finds it on
// window, so this is the switch: <html data-smooth="on"> (set from layers.js).
import Lenis from 'lenis';
if (document.documentElement.dataset.smooth === 'on') window.Lenis = Lenis;
