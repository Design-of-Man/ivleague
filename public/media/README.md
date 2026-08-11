# Hero media

The homepage hero is a film of the IV bag floating on rippling water, shot from
above. It plays once and holds. Driven by `src/components/sections/ScrollHero.tsx`.

| File | Size | Serves |
|---|---|---|
| `hero-infusion-desktop.mp4` | 3.5 MB | 1600x900, `min-width: 1024px` |
| `hero-infusion.mp4` | 2.8 MB | 1280x720, everything else and the h264 default |
| `hero-infusion.webm` | 2.3 MB | VP9 fallback. See the codec note below. |
| `hero-intro-portrait.mp4` | 1.7 MB | 720x1280, the phone intro. 5.6s. |
| `hero-intro-portrait.webm` | 1.2 MB | VP9 fallback for the same. |
| `hero-infusion-{640,960,1280,1920,2560}.jpg` | 20–132 KB | Poster ladder, via `srcset`. |
| `hero-infusion.jpg` | 52 KB | Copy of the 1280 rung, for a bare `src`. |

**Source:** the client's own render — 1280x720, 24fps, 10.04s, with an audio
track and an attached cover image. It carries their real shield lockup on the
bag, which is why it replaced the previous Higgsfield plate and the traced
droplet that was on it.

Two things about it shape the whole pipeline:

- **There is no drop and no impact.** The bag floats and the camera drifts for
  all ten seconds. Nothing is slowed down or motion-interpolated — the previous
  plate was 5s of fast action stretched 2.5x, this one is already calm. Simpler,
  and none of `minterpolate`'s artifacts.
- **It has three streams.** Every read needs an explicit `-map 0:0` or ffmpeg
  muxes the mjpeg cover image in as a video stream.

## The pipeline

### Master — denoise only

```bash
ffmpeg -i source.mp4 -map 0:0 -an -vf "nlmeans=s=1.5:p=5:r=11" \
  -c:v libx264 -crf 10 -preset medium -pix_fmt yuv420p master.mp4
```

Gentle on purpose. The source is 11.4 Mbps so it is already clean; this is about
bitrate efficiency, not rescuing grain. Push `s` much higher and the caustics —
which are the entire texture of this shot — turn to plastic.

### Delivery

```bash
CROP="crop=1024:576:78:0"          # desktop / base
CROP_P="crop=406:720:427:0"        # portrait intro
SWS="flags=lanczos+accurate_rnd+full_chroma_int+full_chroma_inp"
X264="aq-mode=3:aq-strength=1.0:psy-rd=1.00,0.15:deblock=-1,-1:\
ref=3:bframes=3:me=umh:subme=9:trellis=2"

ffmpeg -i master.mp4 -an -t 8.0 \
  -vf "${CROP},scale=1600:900:${SWS},format=yuv420p" \
  -c:v libx264 -crf 28 -preset slow -profile:v high \
  -x264-params "$X264" -pix_fmt yuv420p -movflags +faststart \
  hero-infusion-desktop.mp4
```

**This plate is far more expensive to encode than the last one.** Every pixel is
moving caustic detail where the previous one was mostly flat white. At the old
settings the desktop tier came out at 12 MB. Three changes brought it to 3.5 MB
with no visible difference at 1:1 — checked frame by frame against the 12 MB
version:

- **CRF 23 → 28.** Low-contrast content hides quantisation extremely well.
- **1920x1080 → 1600x900.** The crop is 1024px wide, so 1080p was a 1.875x
  upscale spending bits on interpolated pixels. 1600 is 1.56x.
- **`cas` sharpening dropped.** On busy water it adds high-frequency energy the
  encoder then pays for, and there is nothing soft here to rescue.

Other things that are load-bearing:

- **The crop position is measured, not guessed.** The crest sits at (0.492,
  0.484) of the source; this crop puts it at (0.54, 0.61), which clears the
  headline on desktop and stays inside the narrow strip `object-cover` leaves on
  a phone.
- **No tier above 1600x900, and `ref=3/bframes=3`.** A 2560x1440 stream with a
  five-frame reference buffer is what falls out of a hardware decoder's fast
  path and into software. That was a real, reported lag bug.
- **Do not pass `-level`.** Pinning it below what the stream needs still
  encodes, but stamps a level the stream exceeds, and the result plays in
  software and fails on a hardware decoder.

## The phone intro

On a phone's first visit of a session the film plays full-screen over the hero
and the copy phases in when it ends. A separate portrait cut, because
`object-cover` fits a 16:9 plate to a 9:19.5 viewport by height and shows only
the middle quarter of its width.

```bash
ffmpeg -ss 2.4 -i master.mp4 -an -t 5.6 \
  -vf "${CROP_P},scale=720:1280:${SWS},format=yuv420p" \
  -c:v libx264 -crf 28 -preset slow -profile:v high \
  -x264-params "$X264" -pix_fmt yuv420p -movflags +faststart \
  hero-intro-portrait.mp4
```

It is the **last** 5.6s of the eight-second window, so its final frame is the
poster frame. The dissolve into the resting band is then the same moment in the
film at a different crop, rather than a jump backwards in time.

This file *replaces* the 16:9 one on a phone rather than adding to it — the band
under the copy is a still, and only `lg` and up mounts the full-bleed film.

The sequencing lives in three places that have to stay in step: the inline
script in `src/app/layout.tsx` (decides, pre-paint, whether the intro runs),
`.hero-copy` in `globals.css` (hides and then reveals the copy), and the `intro`
state in `ScrollHero.tsx`. Every failure path resolves to the copy being
visible — no JS, a refused autoplay, a decode error, a stalled start, or a
hydration failure.

## A note on the lockup

The bag carries the practice's real crest. "IV LEAGUE" reads correctly at every
size. The "INFUSION SERVICES" sub-line under it is legible on the settled frame
but warps into an illegible blur on frames where the bag is deformed — generative
video mangles small type, and it is why the render should never be asked to
produce a wordmark. It is small enough that it reads as out-of-focus fine print
rather than as a misspelling. If that is ever not good enough, the fix is to
composite the real vector lockup over the label, not to re-prompt.

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
ffmpeg -i master.mp4 -an -t 8.0 \
  -vf "${CROP},scale=1280:720:${SWS},format=yuv420p" \
  -c:v libvpx-vp9 -crf 38 -b:v 0 -row-mt 1 -deadline good -cpu-used 3 -g 240 \
  hero-infusion.webm
```

## Poster

The film's **final** frame, not a frame from the middle, at five widths:

```bash
for w in 640 960 1280 1920 2560; do
  ffmpeg -sseof -0.1 -i hero-infusion-desktop.mp4 -frames:v 1 -update 1 \
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
- **A `srcset` ladder, not one big file.** A single 1920 poster is 90 KB for a
  412 px viewport. The ladder drops that to 20 KB and took the homepage from
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
