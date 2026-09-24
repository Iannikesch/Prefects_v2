"""Nebula builder: turns a space photo into the two things nebula.js needs.

  1. A star map (JSON): every point of light that stands out from the
     cloud around it, with position (0-1 of the plate) and brightness (0-1).
  2. A cloud plate (webp + png): the photo with those stars painted out,
     softened, and gradient-mapped into the pack's cool ramp.

The stars are then redrawn sharp in the browser, so a small or soft source
still works: only the clouds come from the pixels, and blur hides the
resolution.

  python3 tools/nebula-build.py SOURCE.png NAME [--crop x0,y0,x1,y1]

Writes img/NAME.webp, img/NAME.png and img/NAME.stars.json. Needs Pillow.
"""
import json, sys, math
from PIL import Image, ImageFilter, ImageChops

MAX_STARS = 320
CONTRAST_MIN = 38    # how far a point must rise above its surroundings (0-255)
BRIGHT_MIN = 120     # and how bright it must be at its peak

# Two pack ramps. Bluer parts of the source lean deep and teal; redder,
# pinker parts lean periwinkle and violet. No warm colour survives.
RAMP_VIOLET = [(0, "#000000"), (.10, "#06071A"), (.22, "#15163A"), (.36, "#21164D"),
               (.52, "#485384"), (.66, "#5B588E"), (.80, "#775E99"), (.92, "#887BB8"), (1, "#B9B2FA")]
RAMP_BLUE   = [(0, "#000000"), (.10, "#050A1A"), (.22, "#111C3A"), (.36, "#1C1F3C"),
               (.52, "#214567"), (.66, "#2F6476"), (.80, "#485384"), (.92, "#8C9999"), (1, "#C9D6E0")]


def ramp_lut(stops):
    rgb = [(t, tuple(int(h[i:i + 2], 16) for i in (1, 3, 5))) for t, h in stops]
    out = []
    for i in range(256):
        t = i / 255
        for (a, ca), (b, cb) in zip(rgb, rgb[1:]):
            if a <= t <= b:
                f = (t - a) / (b - a)
                out.append(tuple(round(ca[k] + (cb[k] - ca[k]) * f) for k in range(3)))
                break
    return out


def ground_of(img):
    """The cloud level under each pixel, at two scales: a 15px median for
    small stars and a ~60px one (median on a quarter-size copy) so big,
    haloed stars don't fill their own window. Darker of the two wins."""
    near = img.filter(ImageFilter.MedianFilter(15))
    w, h = img.size
    far = (img.resize((w // 4, h // 4), Image.BILINEAR)
              .filter(ImageFilter.MedianFilter(15))
              .resize((w, h), Image.BILINEAR))
    return ImageChops.darker(near, far)


def find_stars(img):
    """A star is a local maximum that is bright and far above the median of
    its neighbourhood. Clouds are broad, so their peaks barely clear it."""
    L = img.convert("L")
    w, h = L.size
    peak = L.filter(ImageFilter.MaxFilter(7))
    ground = ground_of(L)
    lum, pk, gr = L.load(), peak.load(), ground.load()
    found = []
    for y in range(4, h - 4):
        for x in range(4, w - 4):
            v = lum[x, y]
            if v < BRIGHT_MIN or v != pk[x, y]:
                continue
            c = v - gr[x, y]
            if c < CONTRAST_MIN:
                continue
            # size: pixels in a 9x9 box above the half-contrast level
            half = gr[x, y] + c / 2
            size = sum(1 for dy in range(-4, 5) for dx in range(-4, 5) if lum[x + dx, y + dy] > half)
            found.append((c * (v / 255), x, y, c, size))
    found.sort(reverse=True)
    stars = []
    for score, x, y, c, size in found:          # keep one per 6px cluster
        if all((x - s[0]) ** 2 + (y - s[1]) ** 2 > 36 for s in stars):
            stars.append((x, y, c, size))
        if len(stars) >= MAX_STARS:
            break
    return stars


def paint_out(img, stars):
    """Replace each star with the median ground around it."""
    ground = Image.merge("RGB", [ground_of(ch) for ch in img.split()])
    out = img.copy()
    op, gp = out.load(), ground.load()
    w, h = img.size
    for x, y, c, size in stars:
        # the halo reaches further than the core: scale with brightness too
        r = max(3, int(math.sqrt(size) * 1.1) + 2 + int(c / 16))
        for dy in range(-r, r + 1):
            for dx in range(-r, r + 1):
                if dx * dx + dy * dy <= r * r and 0 <= x + dx < w and 0 <= y + dy < h:
                    op[x + dx, y + dy] = gp[x + dx, y + dy]
    return out


def colour(img):
    """Gradient-map luminance, blending the two ramps by how blue the source is."""
    lv, lb = ramp_lut(RAMP_VIOLET), ramp_lut(RAMP_BLUE)
    src = img.load()
    L = img.convert("L").load()
    w, h = img.size
    out = Image.new("RGB", (w, h))
    op = out.load()
    for y in range(h):
        for x in range(w):
            r, g, b = src[x, y]
            # red against blue: deep blue sky ~0.3, purple ~0.6, pink ~1
            blue = max(0.0, min(1.0, (0.62 - r / (b + 1)) / 0.3))
            a, c = lv[L[x, y]], lb[L[x, y]]
            op[x, y] = tuple(round(a[k] + (c[k] - a[k]) * blue) for k in range(3))
    return out


def main():
    src, name = sys.argv[1], sys.argv[2]
    img = Image.open(src).convert("RGB")
    if "--crop" in sys.argv:
        box = tuple(int(v) for v in sys.argv[sys.argv.index("--crop") + 1].split(","))
        img = img.crop(box)
    w, h = img.size

    stars = find_stars(img)
    clouds = paint_out(img, stars)
    clouds = clouds.filter(ImageFilter.MedianFilter(5)).filter(ImageFilter.GaussianBlur(3))
    plate = colour(clouds)
    # a whisper of noise stops webp blocking the dark, near-flat sky
    noise = Image.effect_noise((w, h), 6).convert("RGB")
    plate = Image.blend(plate, ImageChops.add(plate, noise, 1, -128), 0.5)
    plate.save(f"img/{name}.png", optimize=True)
    plate.save(f"img/{name}.webp", quality=92, method=6)

    top = max(s[2] for s in stars)
    data = {
        "width": w, "height": h,
        "stars": [[round(x / w, 4), round(y / h, 4), round((c / top) ** 0.8, 3)] for x, y, c, _ in stars],
    }
    with open(f"img/{name}.stars.json", "w") as f:
        json.dump(data, f, separators=(",", ":"))
    print(f"{name}: plate {w}x{h}, {len(stars)} stars")


if __name__ == "__main__":
    main()
