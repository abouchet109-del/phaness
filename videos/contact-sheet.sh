#!/usr/bin/env sh
# Build out/planche.webp: one row per film, five frames per row (opening, three chapters, logo).
# Usage: sh contact-sheet.sh   (after render-all.sh)
set -e
HERE="$(cd "$(dirname "$0")" && pwd)"
FFMPEG="$HERE/node_modules/ffmpeg-static/ffmpeg.exe"
TMPD="D:/Temp/hyperframes/planche"
rm -rf "$TMPD" && mkdir -p "$TMPD"

times() {
  case "$1" in
    expliquer-pac) echo "1.6 8.6 14.6 20.6 27.0" ;;
    *) echo "1.6 8.6 13.6 19.8 25.0" ;;
  esac
}

i=0
for name in expliquer-pac securiser-usine accompagner-solaire former-electricite; do
  for t in $(times "$name"); do
    n=$(printf "%03d" $i)
    "$FFMPEG" -y -loglevel error -ss "$t" -i "$HERE/out/$name.mp4" -frames:v 1 -vf "scale=480:270:flags=lanczos" "$TMPD/f$n.png"
    i=$((i + 1))
  done
done
"$FFMPEG" -y -loglevel error -framerate 1 -i "$TMPD/f%03d.png" -vf "tile=5x4:padding=8:margin=8:color=0xF5F7FB" -frames:v 1 -c:v libwebp -quality 86 "$HERE/out/planche.webp"
echo "out/planche.webp"
