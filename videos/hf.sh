#!/usr/bin/env sh
# Run the project-local HyperFrames CLI with every cache kept on D: (scoped to this command).
HERE="$(cd "$(dirname "$0")" && pwd -W 2>/dev/null || pwd)"
CACHE="D:/Tools/hyperframes-cache"
mkdir -p "$CACHE/home" "$CACHE/localappdata" "D:/Temp/hyperframes"
USERPROFILE="$CACHE/home" HOME="$CACHE/home" LOCALAPPDATA="$CACHE/localappdata" \
PUPPETEER_CACHE_DIR="$CACHE/puppeteer" HYPERFRAMES_FONT_CACHE_DIR="$CACHE/fonts" \
HYPERFRAMES_EXTRACT_CACHE_DIR="$CACHE/extract" TEMP="D:/Temp/hyperframes" TMP="D:/Temp/hyperframes" \
HYPERFRAMES_SKIP_SKILLS=1 HYPERFRAMES_NO_TELEMETRY=1 \
HYPERFRAMES_FFMPEG_PATH="$HERE/node_modules/ffmpeg-static/ffmpeg.exe" \
HYPERFRAMES_FFPROBE_PATH="$HERE/node_modules/ffprobe-static/bin/win32/x64/ffprobe.exe" \
PATH="$HERE/node_modules/ffmpeg-static:$PATH" \
  node "$HERE/node_modules/hyperframes/dist/cli.js" "$@"
