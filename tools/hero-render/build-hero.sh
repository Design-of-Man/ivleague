#!/bin/bash
# Builds every hero asset from source-plate.mp4. Run it from this directory:
#   ./build-hero.sh   (set FFMPEG=... if ffmpeg is not on PATH)
#
# Why it is shaped the way it is — the full set of measurements, and the four
# things that were tried and rejected — is in public/media/README.md. The short
# version, for whoever is reading this while changing it:
#
# Three separate causes, measured rather than guessed:
#
#  1. THE BROWSER WAS DOING THE UPSCALE. The delivered file was 1600x900 and a
#     full-bleed hero on a 1512x982 laptop at 2x paints it at 3491x1964 — a
#     2.18x bilinear upscale done on the GPU, which is the softest resampler in
#     the chain. Doing the upscale offline with lanczos and delivering at or
#     near the paint size is worth more than everything else here combined:
#     acutance over the label goes 2.31 -> 2.87 on the resampler alone.
#
#  2. NO SHARPENING. The previous pass dropped `cas` on the theory that it adds
#     high-frequency energy the encoder pays for. Measured, that is false for
#     this plate: cas 0.20 / 0.35 / 0.55 at the same CRF come out within 0.3%
#     of each other on filesize (9.25 / 9.26 / 9.28 MB). It was free, and
#     taking it out cost real acutance. Sharpen at an intermediate 2x scale and
#     again lightly at the target: sharpening at the intermediate works on real
#     edges, and the final resample softens the ringing.
#
#  3. THE PLATE ITSELF, for 1.2 seconds. Between src 4.2s and 5.4s a sheet of
#     water crosses the label and the wordmark scrambles into illegibility. No
#     encoder setting rescues that; the fix is to not use those frames. They
#     are cut, and the join is hidden in a dissolve — src 4.2 and src 5.4 have
#     the bag at the same size in the same place, so it is invisible.
#
# What was tried and rejected:
#  - Denoise before the upscale (hqdn3d). Spatial denoise eats the caustics.
#    Temporal-only is honest but costs more acutance than it saves bytes:
#    no-denoise CRF 27 beats temporal-denoise CRF 25 on both counts.
#  - Lower psy-rd / aq-strength to buy bitrate back. Saves 20% and gives back
#    exactly the detail this whole pass exists to add. Label acutance drops to
#    2.48, barely above the file being replaced.
#  - AV1. libaom at 2560 came out the same size as x264 at 2560 here, and
#    software AV1 decode of 1440p is a real CPU cost on the kind of machine
#    that already found this page heavy. Not worth it for zero byte saving.
#  - Losing the crop to keep the extra 25% of source width. The crop is the
#    framing the bag sits in and it was chosen with the client.
set -e
cd "$(dirname "$0")"
FF=${FFMPEG:-ffmpeg}
SRC=source-plate.mp4
OUT=out

# ---------------------------------------------------------------- the cut ---
# A = src[0 .. 4.20]   the approach: bag large, wordmark legible
# B = src[5.40 .. 10.04] the drift back: bag medium, wordmark legible
# The 1.2s between them is the part that reads as "blurry"; it is dropped.
# Two joins, both dissolved: A->B at src 4.20/5.40, and the loop's own wrap at
# src 10.04 -> 0.
#
# `fps=24` after every trim: trim+setpts drops the constant-frame-rate flag and
# xfade refuses a variable-rate input ("current rate of 1/0 is invalid").
D=0.7
CUT="[0:0]split=2[a][b];\
[a]trim=start=0:end=4.20,setpts=PTS-STARTPTS,fps=24[A];\
[b]trim=start=5.40:end=10.04,setpts=PTS-STARTPTS,fps=24[B];\
[A][B]xfade=transition=fade:duration=${D}:offset=3.50[full]"
# full is 8.14s and runs src 0 -> src 10.04.
WRAP="[full]split=2[m][h];\
[m]trim=start=${D},setpts=PTS-STARTPTS,fps=24[main];\
[h]trim=end=${D},setpts=PTS-STARTPTS,fps=24[head];\
[main][head]xfade=transition=fade:duration=${D}:offset=6.74[v]"
# Result: 7.44s, starting on src 0.70 and blending back into it.

# nlmeans on the master, gentle, exactly as the previous pipeline did it. Non-
# local means because it is the one denoiser that tells structure from noise:
# hqdn3d at any strength that saved real bytes took the caustics with it, and
# measured, cost more label acutance than it bought. Without this step the
# ladder comes out at 13.8 MB / 10.3 MB, because the sharpener downstream is
# faithfully magnifying the source's own compression grain.
echo "=== looped master (7.44s, the scramble cut out) ==="
# NO `-map 0:0` here. With -filter_complex it does not select the input for the
# graph, it adds a SECOND output stream — the raw uncut source — and mp4 keeps
# both. Every downstream `-i h-master.mp4` then reads stream 0 and gets the
# unprocessed 10.04s clip, silently, with no error anywhere. The graph takes
# its input as [0:0] instead. (`[0:v]` is also wrong here: the source carries an
# mjpeg cover image, so `v` matches two streams.)
[ -f ${OUT}-master.mp4 ] || "$FF" -y -hide_banner -loglevel warning -i "$SRC" -an \
  -filter_complex "${CUT};${WRAP};[v]nlmeans=s=1.5:p=5:r=11[vd]" -map "[vd]" \
  -c:v libx264 -crf 11 -preset medium -pix_fmt yuv420p ${OUT}-master.mp4

# ------------------------------------------------------------- the ladder ---
CROP="crop=1024:576:78:0"
CROP_P="crop=406:720:427:0"
L="flags=lanczos+accurate_rnd+full_chroma_int+full_chroma_inp"
# psy-rd and aq-strength stay high on purpose: they are what makes the encoder
# spend bits keeping the acutance the sharpener just added.
X264="aq-mode=3:aq-strength=1.0:psy-rd=1.00,0.15:deblock=-1,-1:ref=3:bframes=3:me=umh:subme=9:trellis=2"

# Two-step for anything above ~1.5x, single step below it.
big  () { echo "$1,scale=2048:1152:${L},cas=strength=0.55,scale=$2:$3:${L},cas=strength=0.25,format=yuv420p"; }
small() { echo "$1,scale=$2:$3:${L},cas=strength=0.35,format=yuv420p"; }

enc () { # out  vf  crf
  "$FF" -y -hide_banner -loglevel warning -i ${OUT}-master.mp4 -an -vf "$2" \
    -c:v libx264 -crf "$3" -preset slow -profile:v high \
    -x264-params "$X264" -pix_fmt yuv420p -movflags +faststart "$1"; }

echo "=== 2560x1440 ==="; enc ${OUT}-2560.mp4 "$(big  "$CROP" 2560 1440)" 33
echo "=== 1920x1080 ==="; enc ${OUT}-1920.mp4 "$(big  "$CROP" 1920 1080)" 30
echo "=== 1280x720  ==="; enc ${OUT}-1280.mp4 "$(small "$CROP" 1280 720)"  29

# Same resolution as the main desktop tier on purpose: this is what Playwright
# sees, so anything smaller makes every screenshot understate the real site.
echo "=== 1920x1080 vp9 (codec fallback) ==="
"$FF" -y -hide_banner -loglevel warning -i ${OUT}-master.mp4 -an \
  -vf "$(big "$CROP" 1920 1080)" \
  -c:v libvpx-vp9 -crf 42 -b:v 0 -row-mt 1 -deadline good -cpu-used 3 -g 240 ${OUT}-1920.webm

# ------------------------------------------------------------- the poster ---
# Straight off the near-lossless master through the same sharpening chain, at
# each rung's own width. The rungs used to be cut from the *delivered* 1600x900
# file and then upscaled, so the 1920 and 2560 posters were carrying the
# delivery encode's losses on top of an interpolated 1.6x. This is the LCP
# element and it is what a reduced-motion or slow-connection visitor sees
# instead of the film, so it should be the best frame on the page, not the
# worst.
echo "=== poster ladder ==="
for w in 640 960 1280 1920 2560; do
  h=$(python3 -c "print(int($w*9/16))")
  if [ "$w" -gt 1024 ]; then vf="$(big "$CROP" $w $h)"; else vf="$(small "$CROP" $w $h)"; fi
  # q6 below 1024, q5 above. Checked at 4x against q4: indistinguishable, and
  # it puts the small rungs *under* what the unsharpened ladder cost, which
  # matters because the 960 rung is the LCP resource on a throttled phone.
  q=6; [ "$w" -gt 1024 ] && q=5
  "$FF" -y -hide_banner -loglevel error -i ${OUT}-master.mp4 -frames:v 1 -update 1 \
    -vf "$vf" -q:v $q ${OUT}-poster-${w}.jpg
done

# ------------------------------------------------------------ phone intro ---
# Ends on the loop's first frame, so the dissolve into the resting band lands
# on the poster. 7.44 - 5.6 = 1.84.
echo "=== portrait intro ==="
"$FF" -y -hide_banner -loglevel warning -ss 1.84 -i ${OUT}-master.mp4 -an -t 5.6 \
  -vf "$(big "$CROP_P" 720 1280)" \
  -c:v libx264 -crf 30 -preset slow -profile:v high \
  -x264-params "$X264" -pix_fmt yuv420p -movflags +faststart ${OUT}-intro.mp4
"$FF" -y -hide_banner -loglevel warning -ss 1.84 -i ${OUT}-master.mp4 -an -t 5.6 \
  -vf "$(big "$CROP_P" 608 1080)" \
  -c:v libvpx-vp9 -crf 41 -b:v 0 -row-mt 1 -deadline good -cpu-used 3 -g 240 ${OUT}-intro.webm

# ------------------------------------------------------------ seam checks ---
# The master must have exactly one video stream. See the duplicate-stream trap
# in public/media/README.md: two streams here is silent and poisons everything
# downstream.
n=$("$FF" -hide_banner -i ${OUT}-master.mp4 2>&1 | grep -c "Stream #")
[ "$n" = "1" ] || { echo "FAIL: master has $n streams, expected 1"; exit 1; }
"$FF" -y -hide_banner -loglevel error -i ${OUT}-1920.mp4 -frames:v 1 -update 1 ${OUT}-seam-first.png
"$FF" -y -hide_banner -loglevel error -sseof -0.05 -i ${OUT}-1920.mp4 -frames:v 1 -update 1 ${OUT}-seam-last.png

for f in ${OUT}-2560.mp4 ${OUT}-1920.mp4 ${OUT}-1280.mp4 ${OUT}-1920.webm ${OUT}-intro.mp4 ${OUT}-intro.webm; do
  printf "%-16s %8s\n" "$f" "$(du -h $f | cut -f1)"
done
ls -la ${OUT}-poster-*.jpg | awk '{printf "%-22s %8d\n", $9, $5}'

cat <<'EOF'

Install with:
  cd public/media
  cp .../out-2560.mp4      hero-infusion-2560.mp4
  cp .../out-1920.mp4      hero-infusion-1920.mp4
  cp .../out-1280.mp4      hero-infusion-1280.mp4
  cp .../out-1920.webm     hero-infusion-1920.webm
  cp .../out-intro.mp4     hero-intro-portrait.mp4
  cp .../out-intro.webm    hero-intro-portrait.webm
  for w in 640 960 1280 1920 2560; do cp .../out-poster-$w.jpg hero-infusion-$w.jpg; done
  cp hero-infusion-1280.jpg hero-infusion.jpg
EOF
echo "=== DONE ==="
