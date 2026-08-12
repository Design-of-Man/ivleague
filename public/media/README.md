# Hero media

The homepage hero is a film of the IV bag floating on rippling water, shot from
above. It loops, seamlessly. Driven by `src/components/sections/ScrollHero.tsx`.

| File | Size | Serves |
|---|---|---|
| `hero-infusion-2560.mp4` | 3.2 MB | 2560x1440. `min-width: 1500px`, or any retina screen. |
| `hero-infusion-1920.mp4` | 3.2 MB | 1920x1080. Everything else from `min-width: 1024px`. |
| `hero-infusion-1280.mp4` | 1.8 MB | 1280x720. The no-media-query fallback. |
| `hero-infusion-1920.webm` | 2.6 MB | VP9. Codec fallback — see the note at the bottom. |
| `hero-intro-portrait.mp4` | 1.2 MB | 720x1280, the phone intro. 5.6s. |
| `hero-intro-portrait.webm` | 904 KB | VP9 fallback for the same. |
| `hero-infusion-{640,960,1280,1920,2560}.jpg` | 20–197 KB | Poster ladder, via `srcset`. |
| `hero-infusion.jpg` | 79 KB | Copy of the 1280 rung, for a bare `src`. |

A visitor takes the poster plus **one** video: 3.2 MB on a desktop, 1.2 MB on a
phone.

**Source:** the client's own render — 1280x720, 24fps, 10.04s, with an audio
track and an attached cover image. It carries their real shield lockup on the
bag.

Three things about it shape the whole pipeline:

- **There is no drop and no impact.** The bag floats and the camera drifts.
  Nothing is slowed down or motion-interpolated.
- **The camera pulls away and comes back.** The bag is large and the wordmark
  legible at both ends of the clip and smallest around 5s. The cut below is
  built around that.
- **It has three streams.** Video, audio, and an mjpeg cover image. This bites
  in a specific way — see "the duplicate-stream trap".

## The pipeline

Everything is in `tools/hero-render/` alongside the archived source plate. The
whole thing runs in about six minutes.

### 1. Cut and loop

```bash
D=0.7
CUT="[0:0]split=2[a][b];\
[a]trim=start=0:end=4.20,setpts=PTS-STARTPTS,fps=24[A];\
[b]trim=start=5.40:end=10.04,setpts=PTS-STARTPTS,fps=24[B];\
[A][B]xfade=transition=fade:duration=${D}:offset=3.50[full]"
WRAP="[full]split=2[m][h];\
[m]trim=start=${D},setpts=PTS-STARTPTS,fps=24[main];\
[h]trim=end=${D},setpts=PTS-STARTPTS,fps=24[head];\
[main][head]xfade=transition=fade:duration=${D}:offset=6.74[v]"

ffmpeg -i source-plate.mp4 -an \
  -filter_complex "${CUT};${WRAP};[v]nlmeans=s=1.5:p=5:r=11[vd]" -map "[vd]" \
  -c:v libx264 -crf 11 -preset medium -pix_fmt yuv420p master.mp4
```

Two segments, two dissolves, 7.44s out.

- **`src[4.20 .. 5.40]` is dropped.** A sheet of water crosses the label there
  and the wordmark scrambles into an illegible smear. That is the part that
  read as "the hero is blurry", and no encoder setting touches it. The join is
  invisible because the bag is the same size in the same place either side of
  it — checked frame by frame before picking the in and out points.
- **The loop's own wrap** blends the tail back over `src[0 .. 0.70]`. Last
  frame against first frame comes out at 4.2/255 mean difference, which is the
  water's own motion between two adjacent frames, not a seam.
- **`fps=24` after every trim is required.** `trim`+`setpts` drops the
  constant-frame-rate flag and `xfade` refuses a variable-rate input with
  "current rate of 1/0 is invalid".
- **`nlmeans`, gently.** Non-local means is the one denoiser here that tells
  structure from noise. Without it the ladder comes out at 13.8 MB, because the
  sharpener downstream faithfully magnifies the source's own compression grain.
  Push `s` much past 1.5 and the caustics — the entire texture of this shot —
  turn to plastic. `hqdn3d` was tried at several strengths and is not a
  substitute: every setting that saved real bytes took the caustics with it.

The loop starts on `src 0.70`, which is a frame with the bag close and the
wordmark sharp. That matters because it is also the poster.

### 2. The ladder

```bash
CROP="crop=1024:576:78:0"
L="flags=lanczos+accurate_rnd+full_chroma_int+full_chroma_inp"
X264="aq-mode=3:aq-strength=1.0:psy-rd=1.00,0.15:deblock=-1,-1:\
ref=3:bframes=3:me=umh:subme=9:trellis=2"

ffmpeg -i master.mp4 -an -vf \
  "${CROP},scale=2048:1152:${L},cas=strength=0.55,scale=2560:1440:${L},\
cas=strength=0.25,format=yuv420p" \
  -c:v libx264 -crf 33 -preset slow -profile:v high \
  -x264-params "$X264" -pix_fmt yuv420p -movflags +faststart \
  hero-infusion-2560.mp4
```

CRF 33 at 2560, 30 at 1920, 29 at 1280 (single-step `cas=0.35` there — it is
only a 1.25x upscale, so there is nothing for the intermediate pass to do).

**Ship close to the paint size.** This is the single biggest thing on this page.
A full-bleed hero on a 1512x982 laptop at 2x is painted across 3491x1964 device
pixels; whatever the file does not supply, the GPU invents with a bilinear
filter, and bilinear is the softest resampler anywhere in the chain. Measured on
acutance across the label, upscaling to the paint size:

| | acutance |
|---|---|
| bilinear (what the browser does) | 2.306 |
| lanczos | 2.865 |
| lanczos + `cas` | 3.07 |
| lanczos 2x + `cas` + lanczos + `cas` | 3.31 |

**`cas` is free here.** An earlier pass dropped it on the theory that it adds
high-frequency energy the encoder pays for. That is false for this plate: at a
fixed CRF, `cas` at 0.20 / 0.35 / 0.55 encodes to 9.25 / 9.26 / 9.28 MB. The
sharpening cost 0.3% and buying it back cost real acutance.

**Sharpen at 2x, then resample down to the target.** Sharpening at the
intermediate scale works on real edges; sharpening at the final 3.4x works on
interpolation, and the last resample softens whatever ringing the first pass
left.

**CRF is nearly free and resolution is nearly free — pick either, not both.**
Across CRF 24→27 the label moves 2.999→2.917 while the file halves. At equal
bytes, 1920 and 2560 measure the same: the extra browser upscale on the 1920
costs about what the extra quantisation on the 2560 does. Both ship, so a
retina screen gets the pixels and a 1366 laptop does not pay for them.

**Do not lower `psy-rd` or `aq-strength` to buy bitrate back.** It saves 20% and
gives back exactly the detail this pass exists to add — acutance falls to 2.48,
barely above the file it replaced.

**AV1 was tried and rejected.** libaom at 2560 came out the same size as x264 at
2560, and software AV1 decode of 1440p is a real CPU cost on the kind of machine
that already found this page heavy. Zero byte saving for a decode risk.

**Do not pass `-level`.** Pinning it below what the stream needs still encodes,
but stamps a level the stream exceeds, and the result plays in software and
fails on a hardware decoder. `ref=3`/`bframes=3` stay modest for the same
reason: those are what decide whether 1440p takes the hardware fast path.

**The crop position is measured, not guessed.** The crest sits at (0.492, 0.484)
of the source; this crop puts it at (0.54, 0.61), which clears the headline on
desktop and stays inside the narrow strip `object-cover` leaves on a phone. Not
cropping at all would keep 25% more source width, but the framing is the shot.

### 3. The duplicate-stream trap

`-map 0:0` alongside `-filter_complex` does **not** select the graph's input. It
adds a *second* output stream — the raw, uncut source — and mp4 happily keeps
both. Every later `-i master.mp4` then reads stream 0 and silently gets the
unprocessed 10.04s clip. No error, anywhere. It cost a full pass of the ladder
here before the frame count gave it away.

Take the input inside the graph, as `[0:0]`, and pass no `-map` for it.
`[0:v]` is also wrong on this source, because the mjpeg cover image means `v`
matches two streams.

Sanity check any new master with:

```bash
ffmpeg -i master.mp4 2>&1 | grep "Stream #"   # exactly one line
```

### 4. Poster

The loop's **first** frame, off the near-lossless master, through the same
sharpening chain, at each rung's own width:

```bash
for w in 640 960 1280 1920 2560; do
  h=$((w*9/16)); q=6; [ "$w" -gt 1024 ] && q=5
  ffmpeg -i master.mp4 -frames:v 1 -update 1 -vf "<chain at ${w}x${h}>" \
    -q:v $q hero-infusion-$w.jpg
done
cp hero-infusion-1280.jpg hero-infusion.jpg
```

Cut it from the *delivered* video and the big rungs carry the delivery encode's
losses on top of an interpolated upscale — which is what they used to do, and
why the poster was soft on exactly the screens with the most pixels. This is the
LCP element, and it is the whole hero for a reduced-motion or slow-connection
visitor, so it should be the best frame on the page rather than the worst.

Three things about how it is served, each of which was measured:

- **A plain `<img>`, not next/image.** The optimizer runs per request and the
  browser ended up fetching both the optimized and the raw file, costing 10
  Lighthouse points and taking TBT from 108ms to 457ms.
- **A `srcset` ladder, not one big file.** A single 1920 poster is 137 KB for a
  412 px viewport. The ladder drops that to 43 KB — a throttled phone at DPR
  1.75 takes the 960 rung, so that is the one to watch, not the 640.
- **The `<video>` has no `poster` attribute.** The `<img>` behind it is already
  that frame, so a poster on the video is a second download of the same
  picture — and because it paints only when the element mounts after load, it
  became the Largest Contentful Paint at 4.1 s. Removing it: 86 → 91.

It is also preloaded from the component with `ReactDOM.preload`, using the same
`srcset` and `sizes`, so the browser starts it alongside the CSS rather than
when the parser reaches the tag. Pass the same values in both places or you
preload a rung the `<img>` will not use.

## The phone intro

On a phone's first visit of a session the film plays full-screen over the hero
and the copy phases in when it ends. A separate portrait cut, because
`object-cover` fits a 16:9 plate to a 9:19.5 viewport by height and shows only
the middle quarter of its width.

```bash
ffmpeg -ss 1.84 -i master.mp4 -an -t 5.6 \
  -vf "crop=406:720:427:0,scale=1216:2160:${L},cas=strength=0.55,\
scale=720:1280:${L},cas=strength=0.25,format=yuv420p" \
  -c:v libx264 -crf 30 -preset slow -profile:v high \
  -x264-params "$X264" -pix_fmt yuv420p -movflags +faststart \
  hero-intro-portrait.mp4
```

It is the **last** 5.6s of the loop, so its final frame is the poster frame. The
dissolve into the resting band is then the same moment in the film at a
different crop, rather than a jump backwards in time. `7.44 - 5.6 = 1.84`; if
the loop length changes, this offset has to change with it.

This file *replaces* the 16:9 one on a phone rather than adding to it — the band
under the copy is a still, and only `lg` and up mounts the full-bleed film.

The sequencing lives in three places that have to stay in step: the inline
script in `src/app/layout.tsx` (decides, pre-paint, whether the intro runs),
`.hero-copy` in `globals.css` (hides and then reveals the copy), and the `intro`
state in `ScrollHero.tsx`. Every failure path resolves to the copy being
visible — no JS, a refused autoplay, a decode error, a stalled start, or a
hydration failure.

## A note on the lockup

The bag carries the practice's real crest, and "IV LEAGUE / INFUSION SERVICES"
now reads cleanly on every frame that ships — which it did not before the
scramble was cut out. If it is ever not good enough, the fix is to composite the
real vector lockup over the label, not to re-prompt: generative video mangles
small type, and this render should never be asked to draw a wordmark.

## Why there is also a webm

Every shipping browser plays h264, and here the h264 tiers are what real
visitors take.

The webm exists because **Playwright's bundled Chromium is built without
proprietary codecs.** It reports `canPlayType('video/mp4')` as empty and fails
with `DEMUXER_ERROR_NO_SUPPORTED_STREAMS`. Without a webm fallback every
automated check of this hero reports a broken video that is in fact fine in
production — which cost an hour of debugging once already. Keep it, keep it last
in the `<source>` list, and keep it at the same resolution as the main desktop
tier, or every screenshot you take understates what the site actually looks
like.

```bash
ffmpeg -i master.mp4 -an -vf "<chain at 1920x1080>" \
  -c:v libvpx-vp9 -crf 42 -b:v 0 -row-mt 1 -deadline good -cpu-used 3 -g 240 \
  hero-infusion-1920.webm
```

## Replacing the footage

Any 16:9 clip works. Re-measure the subject's position before reusing the crop,
find the clip's own in and out points rather than reusing 4.20/5.40, regenerate
the poster, and check `Stream #` on the master before trusting anything
downstream of it.
