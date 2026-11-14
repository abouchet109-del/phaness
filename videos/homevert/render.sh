#!/usr/bin/env sh
# Render the HOME Vert demo film (PHANESS watermark on) in 4K: 3840x2160, 25 fps, 750 frames, no audio track.
# Writes ../out/homevert-demo.mp4 (not versioned). Same lock, caches and encoder settings as ../render-4k.sh.
# Clean version, after approval only: add the attribute data-hidden to <div id="wm"> in index.html, then run this script.
set -e
HERE="$(cd "$(dirname "$0")" && pwd)"
VID="$(cd "$HERE/.." && pwd)"
FFMPEG="$VID/node_modules/ffmpeg-static/ffmpeg.exe"
MASTERS="D:/Temp/hyperframes/masters-4k"
LOCK="D:/Temp/hyperframes/render.lock"
mkdir -p "$VID/out" "$MASTERS" "D:/Temp/hyperframes"

echo "== waiting for render lock $LOCK"
until mkdir "$LOCK" 2>/dev/null; do sleep 15; done
trap 'rmdir "$LOCK" 2>/dev/null || true' EXIT INT TERM HUP
echo "== lock taken"

(cd "$HERE" && "$VID/hf.sh" render --fps 25 --quality looks --resolution landscape-4k --workers 2 --output "$MASTERS/homevert-demo.mp4")
"$FFMPEG" -y -loglevel error -i "$MASTERS/homevert-demo.mp4" -an -c:v copy -movflags +faststart "$VID/out/homevert-demo.mp4"
echo "== done $(wc -c < "$VID/out/homevert-demo.mp4") bytes"

# Email version (about 20 MB, same definition): two-pass H.264 High at a fixed average bitrate.
OUT20="$VID/out/homevert-demo-20mo.mp4"
PASSLOG="$MASTERS/homevert-2pass"
"$FFMPEG" -y -loglevel error -i "$VID/out/homevert-demo.mp4" -an -c:v libx264 -profile:v high -preset slow -b:v 5200k -pass 1 -passlogfile "$PASSLOG" -pix_fmt yuv420p -f null -
"$FFMPEG" -y -loglevel error -i "$VID/out/homevert-demo.mp4" -an -c:v libx264 -profile:v high -preset slow -b:v 5200k -pass 2 -passlogfile "$PASSLOG" -pix_fmt yuv420p -movflags +faststart "$OUT20"
echo "== email version $(wc -c < "$OUT20") bytes"
