#!/bin/bash
# Builds every hero-juno-* asset from juno-source.mp4. Run it from this
# directory:
#   ./build-hero-juno.sh   (set FFMPEG=... if ffmpeg is not on PATH)
#
# Source: an aerial pass of the Juno Beach Pier, supplied by the client
# directly (Dropbox `/Juno.MP4`, 2688x1512, 59.94fps, 15.65s, no usable audio
# track kept). `juno-source.mp4` here is that footage re-encoded at CRF 23 for
# a git-friendly archive — the delivered file was ~168 MB.
#
# Unlike the earlier IV-bag plate this footage needed no rescue: it is native
# 2688x1512 (above every output rung already), shot in bright even daylight,
# with none of the compression grain or blur defect the bag plate had. So the
# pipeline is the simple half of build-hero.sh's — no denoise, no two-part cut
# to hide a bad seam, no crop offset (source is already 16:9). The only
# judgment call is which 7.5s span to use: the drone spends its first ~8s
# gliding toward the pier with it fully in frame, then passes close enough
# beneath the railing to clip it into shot, then continues down open beach
# with the pier gone. 0–7.5s is the span that keeps the pier (the whole point
# of the shot) in frame throughout and never shows the railing.
set -e
cd "$(dirname "$0")"
FF=${FFMPEG:-ffmpeg}
SRC=juno-source.mp4
OUT=out-juno

# ---------------------------------------------------------------- the cut ---
# A straight loop, not a two-part cut: take 0..7.5s, then crossfade its own
# tail back into its own head so the wrap is invisible. D is the crossfade
# width; the offset math mirrors build-hero.sh's WRAP step (offset = length of
# the post-crossfade span, minus D).
D=0.5
CUT="[0:0]trim=start=0:end=7.5,setpts=PTS-STARTPTS,fps=24[full]"
WRAP="[full]split=2[m][h];\
[m]trim=start=${D},setpts=PTS-STARTPTS,fps=24[main];\
[h]trim=end=${D},setpts=PTS-STARTPTS,fps=24[head];\
[main][head]xfade=transition=fade:duration=${D}:offset=6.5[v]"
# Result: 7.0s, starting on src 0.5 and blending back into it.

echo "=== looped master (7.0s) ==="
[ -f ${OUT}-master.mp4 ] || "$FF" -y -hide_banner -loglevel warning -i "$SRC" -an \
  -filter_complex "${CUT};${WRAP}" -map "[v]" \
  -c:v libx264 -crf 14 -preset medium -pix_fmt yuv420p ${OUT}-master.mp4

# ------------------------------------------------------------- the ladder ---
L="flags=lanczos+accurate_rnd+full_chroma_int+full_chroma_inp"
X264="aq-mode=3:aq-strength=1.0:psy-rd=1.00,0.15:deblock=-1,-1:ref=3:bframes=3:me=umh:subme=9:trellis=2"
# Lighter `cas` than the bag plate: the source is already sharp at native
# resolution, and this footage is full of water texture and sand grain that
# ring badly under strong contrast-adaptive sharpening.
enc () { # out  vf  crf
  "$FF" -y -hide_banner -loglevel warning -i ${OUT}-master.mp4 -an -vf "$2" \
    -c:v libx264 -crf "$3" -preset slow -profile:v high \
    -x264-params "$X264" -pix_fmt yuv420p -movflags +faststart "$1"; }

echo "=== 2560x1440 ==="; enc ${OUT}-2560.mp4 "scale=2560:1440:${L},cas=strength=0.25,format=yuv420p" 26
echo "=== 1920x1080 ==="; enc ${OUT}-1920.mp4 "scale=1920:1080:${L},cas=strength=0.25,format=yuv420p" 24
echo "=== 1280x720  ==="; enc ${OUT}-1280.mp4 "scale=1280:720:${L},cas=strength=0.30,format=yuv420p"  24

echo "=== 1920x1080 vp9 (codec fallback) ==="
"$FF" -y -hide_banner -loglevel warning -i ${OUT}-master.mp4 -an \
  -vf "scale=1920:1080:${L},cas=strength=0.25,format=yuv420p" \
  -c:v libvpx-vp9 -crf 36 -b:v 0 -row-mt 1 -deadline good -cpu-used 3 -g 240 ${OUT}-1920.webm

# ------------------------------------------------------------- the poster ---
echo "=== poster ladder ==="
for w in 640 960 1280 1920 2560; do
  h=$(python3 -c "print(int($w*9/16))")
  vf="scale=$w:$h:${L},format=yuvj420p"
  q=6; [ "$w" -gt 1024 ] && q=5
  "$FF" -y -hide_banner -loglevel error -i ${OUT}-master.mp4 -frames:v 1 -update 1 \
    -vf "$vf" -q:v $q ${OUT}-poster-${w}.jpg
done

# ------------------------------------------------------------ phone intro ---
# The pier spans the frame's full width near the top in every source frame,
# so a centred vertical strip keeps it in shot no matter where the drone is
# horizontally. Width = source height * 9/16, rounded to even.
echo "=== portrait intro ==="
CROP_P="crop=850:1512:919:0"
"$FF" -y -hide_banner -loglevel warning -i ${OUT}-master.mp4 -an -t 5.6 \
  -vf "${CROP_P},scale=720:1280:${L},cas=strength=0.25,format=yuv420p" \
  -c:v libx264 -crf 26 -preset slow -profile:v high \
  -x264-params "$X264" -pix_fmt yuv420p -movflags +faststart ${OUT}-intro.mp4
"$FF" -y -hide_banner -loglevel warning -i ${OUT}-master.mp4 -an -t 5.6 \
  -vf "${CROP_P},scale=608:1080:${L},cas=strength=0.25,format=yuv420p" \
  -c:v libvpx-vp9 -crf 38 -b:v 0 -row-mt 1 -deadline good -cpu-used 3 -g 240 ${OUT}-intro.webm

# ------------------------------------------------------------ seam checks ---
n=$("$FF" -hide_banner -i ${OUT}-master.mp4 2>&1 | grep -c "Stream #")
[ "$n" = "1" ] || { echo "FAIL: master has $n streams, expected 1"; exit 1; }
"$FF" -y -hide_banner -loglevel error -i ${OUT}-1920.mp4 -frames:v 1 -update 1 ${OUT}-seam-first.png
"$FF" -y -hide_banner -loglevel error -sseof -0.05 -i ${OUT}-1920.mp4 -frames:v 1 -update 1 ${OUT}-seam-last.png

for f in ${OUT}-2560.mp4 ${OUT}-1920.mp4 ${OUT}-1280.mp4 ${OUT}-1920.webm ${OUT}-intro.mp4 ${OUT}-intro.webm; do
  printf "%-20s %8s\n" "$f" "$(du -h $f | cut -f1)"
done
ls -la ${OUT}-poster-*.jpg | awk '{printf "%-24s %8d\n", $9, $5}'

cat <<'EOF'

Install with:
  cd public/media
  cp .../out-juno-2560.mp4      hero-juno-2560.mp4
  cp .../out-juno-1920.mp4      hero-juno-1920.mp4
  cp .../out-juno-1280.mp4      hero-juno-1280.mp4
  cp .../out-juno-1920.webm     hero-juno-1920.webm
  cp .../out-juno-intro.mp4     hero-juno-intro-portrait.mp4
  cp .../out-juno-intro.webm    hero-juno-intro-portrait.webm
  for w in 640 960 1280 1920 2560; do cp .../out-juno-poster-$w.jpg hero-juno-$w.jpg; done
  cp hero-juno-1280.jpg hero-juno.jpg
EOF
echo "=== DONE ==="
