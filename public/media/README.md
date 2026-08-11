# Hero media

The homepage hero is a scroll-scrubbed film: the bag meets the water as you
scroll. Driven by `src/components/sections/ScrollHero.tsx`.

| File | Size | Role |
|---|---|---|
| `hero-infusion.mp4` | ~2.0 MB | h264, all-intra. What real browsers play. |
| `hero-infusion.webm` | ~2.6 MB | VP9 fallback. See the codec note below. |
| `hero-infusion.jpg` | ~68 KB | Poster, and the whole hero under reduced motion. |

## Why the mp4 is all-intra

Scrubbing seeks to an arbitrary timestamp on every scroll frame. With a normal
GOP the decoder walks back to the previous keyframe for each seek, which
stutters visibly. Encoding every frame as a keyframe (`-g 1`) makes each seek
independent. It doubles the file, and that is the trade being made.

```bash
ffmpeg -i source.mp4 -an -c:v libx264 -crf 26 -preset slow \
  -g 1 -keyint_min 1 -sc_threshold 0 \
  -profile:v high -pix_fmt yuv420p -movflags +faststart hero-infusion.mp4
```

## Why there is also a webm, even though it is bigger

Every shipping browser plays h264, and here the h264 is the smaller file, so
the mp4 is listed first and real visitors take it.

The webm exists because **Playwright's bundled Chromium is built without
proprietary codecs.** It reports `canPlayType('video/mp4')` as empty and fails
with `DEMUXER_ERROR_NO_SUPPORTED_STREAMS`. Without a webm fallback every
automated check of this hero reports a broken video that is in fact fine in
production — which cost an hour of debugging once already. Keep it.

```bash
ffmpeg -i source.mp4 -an -c:v libvpx-vp9 -crf 42 -b:v 0 -g 1 \
  -row-mt 1 -deadline good -cpu-used 4 hero-infusion.webm
```

## Poster

Pulled from 3.6s, where the bag has settled and the concentric rings are at
their widest — the most composed frame, and the right thing to show anyone who
never loads the video.

```bash
ffmpeg -ss 3.6 -i source.mp4 -vf "scale=1600:-2" -frames:v 1 -q:v 4 hero-infusion.jpg
```

It is served by a plain `<img>` with `fetchPriority="high"`, **not** next/image.
That was measured: the optimizer runs per request and the browser ended up
fetching both the optimized and the raw file, costing 10 Lighthouse points and
taking TBT from 108ms to 457ms. Do not switch it without re-measuring.

## Replacing the footage

Any 16:9 clip works. Re-encode with the commands above, regenerate the poster,
and keep the filenames. `tools/hero-render/README.md` has the Higgsfield prompt
and job ids that produced this one, plus a Blender scene that renders the same
shot locally with the real logo vector on the label.
