#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
# Uses src/encode.mjs so every platform profile shares the toolkit pipeline.
# PRESET=youtube-4k OUT=out/4k.mp4 ./encode.sh master=out/master.mkv audio=out/soundtrack.wav
exec node src/encode.mjs "$@"
