# Hero render — how the IV bag footage was made

Everything needed to reproduce or vary the hero shot. Two independent routes to
the same idea, kept because they are good at different things.

| | Higgsfield (Seedance 2.0) | Blender / Cycles (`ivbag.py`) |
|---|---|---|
| Water realism | Excellent — this is what the model is for | Modelled, convincing but stylised |
| Logo fidelity | Approximate; it interprets the emblem | Exact — renders the real vector |
| Cost | ~22.5 credits per 5s at 720p | Free, unlimited re-renders |
| Control | Prompt only | Every parameter, deterministic |
| Turnaround | ~2 minutes | ~25 min still, ~1 hr for a 48-frame loop |

The shipped hero is the Higgsfield overhead take. Cycles is the fallback and the
way to get a frame with a perfectly sharp label.

**To rebuild the shipped assets from the archived plate, run `./build-hero.sh`
in this directory.** It does the cut, the loop, the whole encode ladder, the
poster rungs and the phone intro, and it verifies the master before going on.
The reasoning behind every setting in it — including the four approaches that
were tried and rejected — is in `public/media/README.md`.

---

## 1. Higgsfield — the shot we shipped

**Model:** `seedance_2_0` · 5s · 16:9 · 720p · `mode: std` · `generate_audio: false`
**Reference image:** the droplet mark, imported from `https://ivlinfusions.com/icon-512.png`
(any public URL of `public/icon-512.png` works; the model needs to fetch it)

Two things that mattered:

- **Decline the preset.** The prompt trips Higgsfield's "IN THE DARK" preset
  recommendation, which is a dark, moody look — the opposite of a white-ground
  product shot. Pass `declined_preset_id` and generate literally.
- **Feed the emblem as `image_references`.** Never ask the model to render the
  wordmark; generative video mangles small type. Get a clean plate and composite
  the real lockup over it if you need text.

### Overhead take (the approved one)

Job `c5b2145c-fb47-44ac-ab49-0eb1435e1375`

```
Overhead top-down shot. The camera is mounted directly above the water, pointing
straight down at a 90-degree bird's-eye angle for the entire shot. We look down
onto the water surface from above.

Extreme slow motion, photorealistic, high-speed camera. A single sealed medical
IV fluid bag — clear soft polymer filled with crystal-clear liquid, a white
printed label on its front face carrying the teal-and-cyan water-droplet emblem
from the reference image — drops flat and lands squarely on its back on the
surface of still, glass-clear water. It falls perfectly flat, back-first, so the
labelled front face ends up pointing straight up at the overhead camera, fully
readable, filling the centre of the frame.

On impact a symmetrical crown of white aerated water bursts outward around the
bag in a perfect ring, seen from directly above. Fine droplets fly outward,
concentric ripples race away from the bag toward the edges of frame, silver
bubbles swirl under the surface. The bag settles floating flat at the waterline,
label facing up at the camera.

Camera motion: the overhead camera stays directly above and rotates slowly and
smoothly around the vertical axis, a gentle top-down orbit, motorized-gimbal
steady, no tilt, no cuts, no shake. It never drops to a side view.

The pool floor beneath the clear water is pure seamless white, so the whole frame
is bright white with the clear bag and clear water on top of it. High-key studio
lighting from above, large soft diffusion, caustic light patterns on the white
floor. Crisp macro detail on the droplets, teal the only colour in an otherwise
white and clear frame, immaculate product-visualization finish, bright, clean,
clinical, expensive.

No people, no hands, no text overlays, no other logos, no side angles, no dark
grading.
```

### Side-orbit take (superseded)

Job `4664e0cd-defd-4054-ab65-011b61f47179`. Same prompt with the overhead
paragraphs replaced by a low three-quarter orbit gliding just above the
waterline. Kept as a second angle.

### To get it tighter in frame

The current take sits a little wide. Add to the overhead prompt:

> Tight macro framing: the bag fills roughly seventy percent of the frame width.
> The camera is close to the water. Crop in so the crown ring reaches the edges
> of frame.

The site does this for free with a CSS transform (see `HeroVideo`), so only
regenerate if you want real resolution rather than an upscale.

---

## 2. Blender / Cycles — `ivbag.py`

Needs `pip install bpy imageio-ffmpeg`. Blender ships as a Python module, so no
GUI and no system install. Renders on CPU; 4 cores is enough but slow.

```bash
# label art, from the real lockup (writes label.png)
node label.mjs

# single frame, overhead
python3 ivbag.py --mode still --label ./label.png --out ./hero.png \
  --width 2560 --height 1440 --samples 110 --topdown --camheight 1.62 --lens 80

# 360° top-down spin, seamless loop, then encode
python3 ivbag.py --mode orbit --label ./label.png --out ./spin \
  --width 960 --height 540 --samples 40 --frames 48 --arc 360 --start 0 \
  --topdown --camheight 1.62 --lens 80
```

`--camheight` is the zoom for the overhead rig: **lower is tighter**. 1.30 is a
tight crop on the bag, 1.62 fits the whole crown ring.

For the side view, drop `--topdown` and use `--dist` (horizontal orbit radius),
`--camheight` and `--arc`.

### Things that cost time to learn, so they are written down

- **The crown must not be glass.** Shading it like the pool renders black voids —
  a stack of thin transmissive sheets exhausts the bounce budget. It is also
  wrong: water thrown into air entrains bubbles and reads as white foam.
- **The pool needs depth.** With the water surface and the floor both at z=0,
  refracted rays land on nothing and the middle of the frame goes black.
  `POOL_DEPTH` fixes it and is where the caustics fall.
- **The bag needs its four tells** — welded flange, hanger hole, twin outlet
  ports, soft translucent film. Without them a rounded translucent rectangle
  reads as an ice cube. And medical bag stock is hazy, not optical glass.
- **The label is a separate card**, not a texture on the bag. Projected through
  a mix shader keyed on image alpha, opaque artwork gives a mix factor of 1
  everywhere and paints the whole bag white.
- **Keep the label above the bulge.** It sits at `BAG_D/2 * 1.15 + 0.0022`; raise
  the pillow inflation without raising the card and the label vanishes inside
  the film.
- **A 360° loop runs at constant speed.** Ease-in-out is right for a short arc
  that gets mirrored, but it visibly stutters at the seam of a full revolution.
