# Hero media

The homepage hero is an aerial pass over the Juno Beach Pier, supplied
directly by the client. It loops, seamlessly. Driven by
`src/components/sections/ScrollHero.tsx`.

| File | Size | Serves |
|---|---|---|
| `hero-juno-2560.mp4` | 7.6 MB | 2560x1440. `min-width: 1500px`, or any retina screen. |
| `hero-juno-1920.mp4` | 6.6 MB | 1920x1080. Everything else from `min-width: 1024px`. |
| `hero-juno-1280.mp4` | 3.4 MB | 1280x720. The no-media-query fallback. |
| `hero-juno-1920.webm` | 4.5 MB | VP9. Codec fallback — see the note below. |
| `hero-juno-intro-portrait.mp4` | 1.8 MB | 720x1280, the phone intro. 5.6s. |
| `hero-juno-intro-portrait.webm` | 1.2 MB | VP9 fallback for the same. |
| `hero-juno-{640,960,1280,1920,2560}.jpg` | 23–274 KB | Poster ladder, via `srcset`. |
| `hero-juno.jpg` | 98 KB | Copy of the 1280 rung, for a bare `src`. |

A visitor takes the poster plus **one** video: up to 7.6 MB on a desktop, 1.8 MB
on a phone — larger than the previous IV-bag plate because this footage is
full of wave and sand texture, which compresses far worse than the old plate's
flat white studio background.

**Source:** the client's own drone footage — 2688x1512, 59.94fps, 15.65s, no
usable audio track. `tools/hero-render/juno-source.mp4` is that footage
re-encoded at CRF 23 for a git-friendly archive (the delivered file was
~168 MB).

Two things about it shape the pipeline, both the opposite of the old plate's:

- **The source needed no rescue.** It is native 2688x1512 — above every output
  rung already — shot in bright even daylight, with none of the compression
  grain or defect the bag plate had. No denoise, no upscale-then-sharpen
  chain to recover detail that was never lost.
- **It's a single continuous drone move, not a loopable shot.** The drone
  glides toward the pier for ~8s with it fully in frame, passes close enough
  to clip the railing into shot, then continues down open beach with the pier
  gone. Only the first ~8s keeps the pier — the point of the shot — in frame
  and clear of the railing; see `build-hero-juno.sh` for exactly where it's
  cut.

## The pipeline

Everything is in `tools/hero-render/build-hero-juno.sh`, alongside the
archived source. It's a shorter run than the bag pipeline: cut a 7.5s span,
crossfade it into its own head as a loop, then the same encode ladder, poster
ladder and portrait intro as before, with lighter sharpening throughout since
the source doesn't need to be rescued.

```bash
cd tools/hero-render
./build-hero-juno.sh
# then copy out-juno-* into public/media/ per the script's own instructions
```

### The loop

```bash
D=0.5
CUT="[0:0]trim=start=0:end=7.5,setpts=PTS-STARTPTS,fps=24[full]"
WRAP="[full]split=2[m][h];\
[m]trim=start=${D},setpts=PTS-STARTPTS,fps=24[main];\
[h]trim=end=${D},setpts=PTS-STARTPTS,fps=24[head];\
[main][head]xfade=transition=fade:duration=${D}:offset=6.5[v]"
```

7.0s out, starting on source 0.5s and dissolving back into it. Checked by eye
side-by-side (first frame vs. last frame of the encoded master) before
shipping — the wave pattern differs frame to frame regardless, so the bar is
"reads as continuous motion," not a pixel match.

### The ladder and poster

Same shape as the bag pipeline (lanczos scale, light `cas` sharpening, the
same x264 params tuned for hardware-decode-friendly `ref`/`bframes`), just
gentler: `cas` at 0.25–0.30 instead of 0.55, because this footage is full of
water and sand texture that rings under strong contrast-adaptive sharpening
the way the bag plate's flat background never did. See `build-hero.sh` (the
original) for the full reasoning behind the shared parts of this chain if
changing them.

### The portrait crop

```bash
CROP_P="crop=850:1512:919:0"
```

The pier spans the frame's full width near the top in every source frame, so
a centred vertical strip (source height × 9/16, rounded even) keeps it in shot
regardless of where the drone is horizontally — unlike the bag plate, this
didn't need a measured, off-centre crop position.

## Why there is also a webm

Every shipping browser plays h264, and here the h264 tiers are what real
visitors take. The webm exists because Playwright's bundled Chromium is built
without proprietary codecs and fails outright without it — see the original
`build-hero.sh` for the full story. Keep it last in the `<source>` list and at
the same resolution as the main desktop tier, or a screenshot understates
what the site actually looks like.

## Replacing the footage again

Any 16:9 clip works. Find the new clip's own loopable span rather than
reusing 0–7.5s, re-check whether the subject needs a measured crop position
(the pier didn't; the earlier bag did), regenerate the poster, and check
`Stream #` on the master before trusting anything downstream of it — see "the
duplicate-stream trap" in git history of this file for what goes wrong if a
`-filter_complex` graph's input is also passed to `-map`.

## Previous hero

The site previously used a generated shot of an IV bag meeting still water,
built from `tools/hero-render/source-plate.mp4` via `build-hero.sh` and
documented in earlier revisions of this file (see git history). That pipeline
and its source are left in place in case the plate is wanted again; nothing
here currently references it.
