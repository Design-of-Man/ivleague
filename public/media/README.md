# Hero media

The homepage hero plays `hero-infusion.mp4` over `hero-infusion.jpg`.

## Drop the film in here

`hero-infusion.mp4` is **not committed** — the render lives on Higgsfield's CDN
and this build environment's egress policy blocks that host, so it could not be
pulled in automatically. Download it and save it here under that exact name:

```
https://d8j0ntlcm91z4.cloudfront.net/user_3HkLI9IXLAxVdKIyIjEVhU0SAy9/hf_20260811_184245_c5b2145c-fb47-44ac-ab49-0eb1435e1375.mp4
```

Until it is present the hero shows the poster frame, which is the intended
fallback and looks finished — nothing breaks.

Before committing it, compress it. A hero that ships 8MB undoes the work that
got mobile Lighthouse to 92:

```bash
# target roughly 1.5-2.5 MB for a 5s 1280x720 loop
ffmpeg -i input.mp4 -an -vf "scale=1280:-2" \
  -c:v libx264 -crf 26 -preset slow -profile:v high -pix_fmt yuv420p \
  -movflags +faststart hero-infusion.mp4

# and a webm, which browsers will prefer and which is usually 30% smaller
ffmpeg -i input.mp4 -an -c:v libvpx-vp9 -crf 34 -b:v 0 hero-infusion.webm
```

`-an` matters: the clip has no audio track and stripping it saves a container
stream and stops iOS treating it as a media session.

If you add the webm, add a second `<source>` above the mp4 in
`src/components/ui/HeroVideo.tsx`.

## Poster

`hero-infusion.jpg` is the first-paint image and carries `fetchPriority="high"`.
It is also what reduced-motion, Save-Data and slow-connection visitors see
instead of the video, so it needs to look like a finished still on its own.

Keep it under ~180KB. Regenerate from a video frame once the mp4 is in place, so
the poster and the opening frame match exactly:

```bash
ffmpeg -i hero-infusion.mp4 -vf "select=eq(n\,0),scale=1600:-2" -frames:v 1 -q:v 4 hero-infusion.jpg
```

## Regenerating the footage

See `tools/hero-render/README.md` for the Higgsfield prompt, model settings and
job IDs, and for the Blender/Cycles scene that renders the same shot locally
with the real logo vector on the label.
