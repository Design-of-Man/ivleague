# Hero media

The homepage hero is a slow-motion film of the bag meeting still water. It
plays once and holds. Driven by `src/components/sections/ScrollHero.tsx`.

| File | Size | Serves |
|---|---|---|
| `hero-infusion-1440.mp4` | 3.6 MB | `min-width: 1600px` |
| `hero-infusion-1080.mp4` | 3.0 MB | `min-width: 1024px` |
| `hero-infusion.mp4` | 1.8 MB | everything else, and the h264 default |
| `hero-infusion.webm` | 820 KB | VP9 fallback. See the codec note below. |
| `hero-infusion-{640,960,1280,1920,2560}.jpg` | 23–133 KB | Poster ladder, via `srcset`. |
| `hero-infusion.jpg` | 54 KB | Copy of the 1280 rung, for a bare `src`. |

Source is a 1280x720 24fps Higgsfield clip, 5.04s. Everything below is about
getting the most out of that, because **no amount of local processing invents
detail that was never captured** — 1440p here is a very good upscale, not real
1440p, and 4K would be a bigger file showing the same information.

## The pipeline

Two stages. `tools/hero-render/README.md` has the prompt that produced the
source; these are the scripts that turn it into what ships.

### Stage A — denoise, then synthesise slow motion

```bash
ffmpeg -i overhead.mp4 -an \
  -vf "nlmeans=s=2.0:p=5:r=11,\
minterpolate=fps=60:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:me=epzs:vsbmc=1,\
setpts=2.5*PTS" \
  -r 24 -c:v libx264 -crf 10 -preset medium -pix_fmt yuv420p slow_master.mp4
```

Three things worth keeping in that order:

- **Slow motion is baked in, not `playbackRate`.** Halving the rate of 24fps
  footage leaves twelve real frames a second and it judders. `minterpolate`
  synthesises intermediate frames from motion vectors, so a 2.5x slowdown still
  lands on 24 genuine frames per second. 60 ÷ 2.5 = 24 exactly.
- **Denoise before interpolating.** Motion estimation is confused by grain, so
  a clean input gives better vectors and fewer artifacts. Grain magnified 2.5x
  in time and 2x in space was the single ugliest thing about the first encode.
- **`nlmeans`, not `hqdn3d`.** The camera orbits, so anything with a temporal
  component smears. `s=2.0` is gentle enough to leave the bubbles and the film
  texture on the bag intact — check that before raising it.

Stage A is the expensive part (~4 min on 4 cores) and its output is reusable.
Keep `slow_master.mp4` if you are iterating on the delivery encodes.

### Stage B — reframe, upscale, encode

```bash
CROP="crop=1024:576:78:0"
SWS="flags=lanczos+accurate_rnd+full_chroma_int+full_chroma_inp"
X264="aq-mode=3:aq-strength=1.0:psy-rd=1.00,0.15:deblock=-1,-1:\
ref=5:bframes=6:me=umh:subme=9:trellis=2"

ffmpeg -i slow_master.mp4 -an -t 11.0 \
  -vf "${CROP},scale=2560:1440:${SWS},cas=strength=0.42,format=yuv420p" \
  -c:v libx264 -crf 25 -preset veryslow -profile:v high \
  -x264-params "$X264" -pix_fmt yuv420p -movflags +faststart \
  hero-infusion-1440.mp4
```

CRF per tier: 25 at 1440p, 23 at 1080p, 22 at 720p. More pixels hide more
quantisation, so the biggest file does not need the lowest CRF.

- **The reframe is in the encode, not in CSS.** A `transform: scale()` magnifies
  pixels the decoder has already produced; cropping the source and scaling once
  magnifies the original. Same framing, more detail.
- **The crop position is not arbitrary.** The mark measures at (0.501, 0.469)
  of the source; this crop puts it at (0.55, 0.59). Desktop needs it clear of
  the headline, where the white lift is down to ~0.15. A phone needs it inside
  x 0.45–0.63, because `object-cover` fits a 16:9 film to a tall viewport by
  height and only the middle quarter of the width survives. Move it outside
  that band and the logo is simply not on screen on a phone.
- **`cas`, not `unsharp`.** Contrast Adaptive Sharpen backs off where local
  contrast is already high — the hard black logo edge, which `unsharp` rings —
  and works hardest on the low-contrast water detail the upscale softened.
- **`aq-mode=3` with a high strength.** Nearly the whole frame is flat bright
  water, which is exactly where 8-bit banding shows. That is where the
  perceived quality is, so that is where the bits should go.
- **Do not pass `-level`.** Pinning it below what the stream needs still
  encodes, but stamps a level the stream exceeds, and the result plays in
  software and fails on a hardware decoder. Let x264 write the truth.

## Why there is also a webm

Every shipping browser plays h264, and here the h264 tiers are what real
visitors take.

The webm exists because **Playwright's bundled Chromium is built without
proprietary codecs.** It reports `canPlayType('video/mp4')` as empty and fails
with `DEMUXER_ERROR_NO_SUPPORTED_STREAMS`. Without a webm fallback every
automated check of this hero reports a broken video that is in fact fine in
production — which cost an hour of debugging once already. Keep it, and keep it
last in the `<source>` list.

```bash
ffmpeg -i slow_master.mp4 -an -t 11.0 \
  -vf "${CROP},scale=1280:720:${SWS},cas=strength=0.42,format=yuv420p" \
  -c:v libvpx-vp9 -crf 34 -b:v 0 -row-mt 1 -deadline good -cpu-used 3 -g 240 \
  hero-infusion.webm
```

## Poster

The film's **final** frame, not a frame from the middle, at five widths:

```bash
for w in 640 960 1280 1920 2560; do
  ffmpeg -sseof -0.1 -i hero-infusion-1440.mp4 -frames:v 1 -update 1 \
    -vf "scale=$w:-2:${SWS}" -q:v 4 hero-infusion-$w.jpg
done
cp hero-infusion-1280.jpg hero-infusion.jpg
```

Because the film plays once and holds, the last frame is what stays on screen.
Making the poster that same frame means the hero comes to rest on exactly the
image that was there before playback began, and reduced-motion visitors get the
composed still rather than a mid-action freeze.

Three things about how it is served, each of which was measured:

- **A plain `<img>`, not next/image.** The optimizer runs per request and the
  browser ended up fetching both the optimized and the raw file, costing 10
  Lighthouse points and taking TBT from 108ms to 457ms.
- **A `srcset` ladder, not one big file.** A single 1920 poster is 91 KB for a
  412 px viewport. The ladder drops that to 37 KB and took the homepage from
  83 to 86.
- **The `<video>` has no `poster` attribute.** The `<img>` behind it is already
  that frame, so a poster on the video is a second download of the same
  picture — and because it paints only when the element mounts after load, it
  became the Largest Contentful Paint at 4.1 s. Removing it: 86 → 91.

The poster is also preloaded from the component with `ReactDOM.preload`, using
the same `srcset` and `sizes`, so the browser starts it alongside the CSS
rather than when the parser reaches the tag. Pass the same values in both
places or you preload a rung the `<img>` will not use.

## Replacing the footage

Any 16:9 clip works. Run both stages, regenerate the poster, keep the
filenames — and re-measure the subject's position before reusing the crop, since
it is tuned to where the bag lands in this particular take.
