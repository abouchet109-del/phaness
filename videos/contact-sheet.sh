#!/usr/bin/env sh
# Build a 4x4 contact sheet from a rendered film, for review. Writes D:/Temp/hyperframes/<name>/planche.jpg.
# Usage: sh contact-sheet.sh <name>
set -e
HERE="$(cd "$(dirname "$0")" && pwd)"
FFMPEG="$HERE/node_modules/ffmpeg-static/ffmpeg.exe"
FFPROBE="$HERE/node_modules/ffprobe-static/bin/win32/x64/ffprobe.exe"
name="$1"
OUTD="D:/Temp/hyperframes/$name"
mkdir -p "$OUTD"
dur=$("$FFPROBE" -v error -show_entries format=duration -of csv=p=0 "$HERE/out/$name.mp4")
rate=$(awk "BEGIN { printf \"%.4f\", 16 / $dur }")
"$FFMPEG" -y -loglevel error -i "$HERE/out/$name.mp4" -vf "fps=$rate,scale=640:360:flags=lanczos,tile=4x4:padding=6:color=0x222222" \
  -frames:v 1 -q:v 3 "$OUTD/planche.jpg"
echo "$OUTD/planche.jpg"
