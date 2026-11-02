#!/usr/bin/env sh
# Render the 4K delivery masters into out-4k/ (not versioned). The site keeps the 1080p files of out/.
# Usage: sh render-4k.sh [name ...]
set -e
HERE="$(cd "$(dirname "$0")" && pwd)"
FFMPEG="$HERE/node_modules/ffmpeg-static/ffmpeg.exe"
MASTERS="D:/Temp/hyperframes/masters-4k"
LOCK="D:/Temp/hyperframes/render.lock"
mkdir -p "$HERE/out-4k" "$MASTERS" "D:/Temp/hyperframes"

ALL="presentation-phaness former-electricite securiser-usine expliquer-pac accompagner-solaire"
NAMES="${*:-$ALL}"

echo "== waiting for render lock $LOCK"
until mkdir "$LOCK" 2>/dev/null; do sleep 15; done
trap 'rmdir "$LOCK" 2>/dev/null || true' EXIT INT TERM HUP
echo "== lock taken"

for name in $NAMES; do
  echo "== $name: build + render 4K"
  node "$HERE/build.mjs" "$name"
  (cd "$HERE/$name" && "$HERE/hf.sh" render --fps 25 --quality looks --resolution landscape-4k --workers 2 --output "$MASTERS/$name.mp4")
  "$FFMPEG" -y -loglevel error -i "$MASTERS/$name.mp4" -an -c:v copy -movflags +faststart "$HERE/out-4k/$name.mp4"
  echo "== $name: done $(wc -c < "$HERE/out-4k/$name.mp4") bytes"
done
echo "Render complete"
