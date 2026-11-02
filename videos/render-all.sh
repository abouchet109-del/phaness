#!/usr/bin/env sh
# Render the V3 films one at a time, then encode the web delivery files into out/:
#   out/<name>.mp4  H.264, yuv420p, faststart, silent, 25 fps, under the size cap (CRF raised until it fits)
#   out/<name>.webp 1280x720 poster
# Usage: sh render-all.sh [name ...]   (masters go to D:/Temp/hyperframes/masters)
# Parallel sessions queue on a lock directory; the lock is removed on exit, even after an error.
set -e
HERE="$(cd "$(dirname "$0")" && pwd)"
FFMPEG="$HERE/node_modules/ffmpeg-static/ffmpeg.exe"
MASTERS="D:/Temp/hyperframes/masters"
LOCK="D:/Temp/hyperframes/render.lock"
mkdir -p "$HERE/out" "$MASTERS"

poster_time() {
  case "$1" in
    presentation-phaness) echo 21.6 ;;
    former-electricite) echo 9.9 ;;
    securiser-usine) echo 13.7 ;;
    expliquer-pac) echo 23.95 ;;
    accompagner-solaire) echo 13.4 ;;
    *) echo 12.0 ;; # replace with the film's strongest settled frame
  esac
}
max_bytes() {
  case "$1" in
    presentation-phaness) echo 8000000 ;;
    *) echo 6000000 ;;
  esac
}

ALL="presentation-phaness former-electricite securiser-usine expliquer-pac accompagner-solaire"
NAMES="${*:-$ALL}"

echo "== waiting for render lock $LOCK"
until mkdir "$LOCK" 2>/dev/null; do sleep 15; done
trap 'rmdir "$LOCK" 2>/dev/null || true' EXIT INT TERM HUP
echo "== lock taken"

for name in $NAMES; do
  echo "== $name: build + render"
  node "$HERE/build.mjs" "$name"
  (cd "$HERE/$name" && "$HERE/hf.sh" render --fps 25 --quality looks --workers 2 --output "$MASTERS/$name.mp4")
  cap=$(max_bytes "$name")
  for crf in 20 22 24 26 28 30; do
    "$FFMPEG" -y -loglevel error -i "$MASTERS/$name.mp4" -an -c:v libx264 -preset slow -crf $crf \
      -tune animation -x264-params aq-mode=3 -profile:v high -pix_fmt yuv420p -r 25 -movflags +faststart \
      "$HERE/out/$name.mp4"
    size=$(wc -c < "$HERE/out/$name.mp4")
    echo "   crf $crf -> $size bytes"
    [ "$size" -le "$cap" ] && break
  done
  "$FFMPEG" -y -loglevel error -ss "$(poster_time "$name")" -i "$MASTERS/$name.mp4" -frames:v 1 \
    -vf "scale=1280:720:flags=lanczos" -c:v libwebp -quality 88 "$HERE/out/$name.webp"
  echo "== $name: done"
done
echo "Render complete"
