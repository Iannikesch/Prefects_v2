// Motion and background layers. Each one sits on top of the static site and
// can be switched off here without touching any page: set it to false and
// rebuild. SITE-LAYERS.md records when each was added and how to revert it.
//
// The look itself (colours, fonts, glass, pills) is not a layer. It's the
// texture pack, and it's always on.

export const LAYERS = {
  aurora:    true,  // L1  hero, page-hero and footer aurora (texture pack, 21s colour cycle)
  codeRain:  true,  // L2  falling code behind the AI product sections (texture pack)
  galaxy:    true,  // L3  breathing nebula with glowing stars and shooting star (texture pack)
  globe:     true,  // L4  rotating dotted globe in Firm Highlights (motion system 03)
  marquee:   true,  // L5  industries marquee, 50px/s (motion system 05)
  smooth:    true,  // L6  smooth scroll with Lenis (motion system 01)
  scrub:     true,  // L7  word-by-word scroll-scrubbed headline (motion system 08)
  parallax:  true,  // L8  parallax photo bands (motion system 07)
  lag:       true,  // L9  spring-lagged capability tiles (motion system 09)
  rise:      true,  // L10 footer heading fade-up (motion system 11)
  cursor:    true,  // L11 cursor ring (motion system 10)
  navHide:   true,  // L12 header hides on scroll down, returns on scroll up (Deloitte)
};

// Class names pages use. Empty string when the layer is off, so the motion
// engine never finds the element.
export const mv = {
  scrub: LAYERS.scrub ? 'pm-scrub' : '',
  parallax: LAYERS.parallax ? 'pm-parallax' : '',
  lag: LAYERS.lag ? 'pm-lag' : '',
  rise: LAYERS.rise ? 'pm-rise' : '',
};
