#!/usr/bin/env sh
# Render every demo video, then encode the web delivery files into out/:
#   out/<name>.mp4  H.264, yuv420p, faststart, silent, <= 4 MB (CRF raised until it fits)
#   out/<name>.webp 1280x720 poster
# Usage: sh render-all.sh [name ...]   (masters go to D:/Temp/hyperframes/masters)
set -e
HERE="$(cd "$(dirname "$0")" && pwd)"
FFMPEG="$HERE/node_modules/ffmpeg-static/ffmpeg.exe"
MASTERS="D:/Temp/hyperframes/masters"
MAX_BYTES=4000000
mkdir -p "$HERE/out" "$MASTERS"

poster_time() {
  case "$1" in
    former-pas) echo 13.5 ;;
    securiser-epi) echo 19.5 ;;
    expliquer-pac) echo 19.5 ;;
    accompagner-radiateur) echo 16.8 ;;
  esac
}

NAMES="${*:-former-pas securiser-epi expliquer-pac accompagner-radiateur}"
for name in $NAMES; do
  echo "== $name: render"
  (cd "$HERE/$name" && "$HERE/hf.sh" render --quality looks --workers 2 --output "$MASTERS/$name.mp4")
  for crf in 20 22 24 26 28 30; do
    "$FFMPEG" -y -loglevel error -i "$MASTERS/$name.mp4" -an -c:v libx264 -preset slow -crf $crf \
      -tune animation -x264-params aq-mode=3 -profile:v high -pix_fmt yuv420p -movflags +faststart \
      "$HERE/out/$name.mp4"
    size=$(wc -c < "$HERE/out/$name.mp4")
    echo "   crf $crf -> $size bytes"
    [ "$size" -le "$MAX_BYTES" ] && break
  done
  "$FFMPEG" -y -loglevel error -ss "$(poster_time "$name")" -i "$MASTERS/$name.mp4" -frames:v 1 \
    -vf "scale=1280:720:flags=lanczos" -c:v libwebp -quality 88 "$HERE/out/$name.webp"
  echo "== $name: done"
done
echo "Render complete"
