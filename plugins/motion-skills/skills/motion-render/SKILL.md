---
name: motion-render
description: The code-driven render pipeline (headless-browser frame generation to Node to a lossless master to a delivery encode), its ten paid-for gotchas, and how to review a render without watching video or hearing audio. Points at the motion-skills toolkit's render driver, encoder, and platform presets rather than re-describing the pipeline. Use when setting up, debugging, or reviewing a code-driven video render — motion-blur artifacts, frame-upload performance, color/gamma issues, or checking an encoded delivery file.
---

# Motion Render: Pipeline, Gotchas, Review Without Watching

## The one rule

Every frame is a pure function of time: `draw(P, t)` must return the same pixels
for the same `t`, called any number of times, in any order. This is what makes
motion blur (multiple samples per frame), sparse contact sheets, and resumable
renders possible. Any simulation inside a scene integrates from `t = 0` at a fixed
step, or is solved in closed form, inside the call — never carried between calls.

## The pipeline (point at the toolkit, don't restate its code)

| Stage | What it does | Toolkit path |
|---|---|---|
| Frame generation | Headless Chrome (`channel: 'chrome'` for the real GPU) renders `draw(P, t)` into separated-ink or enamel canvases, prints them through a WebGL2 shader, and POSTs raw RGBA frames back to a local Node server | `templates/v1/render.mjs`, `templates/v1/src/engine.js` |
| Lossless master | Frames stream into ffmpeg as `libx264rgb -qp 0` (no delivery compression choices baked in yet) | `templates/v1/render.mjs` |
| Delivery encode | Scales to a platform's canonical size, applies its H.264/AAC profile, muxes with an audio limiter | `templates/v1/src/encode.mjs`, invoked via `templates/v1/encode.sh` |
| Platform encode profiles + safe zones | Resolution, bitrate, color, and safe-zone review margins per target, each with a source URL and checked date | `templates/v1/src/presets.js`, `templates/v1/src/safe-zones.js` |

Run modes exposed by `render.mjs`: `stills`, `sheet` (a contact-sheet grid PNG),
`video`, and `audio` — see `templates/v1/README.md` for the exact flags
(`config=`, `preset=`, `from=`, `to=`, `step=`, `look=`, etc.). Don't re-derive
these flags in scene code; pass them through.

## The ten gotchas already paid for

| # | Symptom | Cause | Fix |
|---|---|---|---|
| 1 | Frame upload takes ~1.4s | An `ArrayBuffer` request body is slow in Chrome | Wrap pixels in a `Blob` before `fetch` (~30ms) |
| 2 | x264 crawls at 0.7-3s/frame, huge files | Per-pixel white-noise texture defeats compression | Keep grain low-frequency or confined to tints; encode lossless first, deliver later |
| 3 | Accumulation buffer stays black | Blending into an `RGBA32F` target needs `EXT_float_blend` | Accumulate in `RGBA16F` (`HALF_FLOAT`) instead |
| 4 | A frame at a cut shows both shots blended | A centred motion-blur shutter samples across the cut | Use a forward shutter: sub-frames in `[t, t + shutter/fps)` |
| 5 | Stepped/ghosted fast moves | Too few motion-blur sub-frames for the speed (8 is enough for most moves, a whip pan needed 32) | Boost sub-frame count in known fast windows |
| 6 | Motion-blur edges look muddy/dark | Averaging happened in sRGB instead of linear light | Convert to linear before accumulating, back to sRGB after |
| 7 | Video plays upside down | `gl.readPixels` reads bottom-up | Flip on the master encode (`-vf vflip`) |
| 8 | Font metrics off by 2x, contact points wrong | Assumed 1000 units-per-em; some fonts use 2000 | Always read the font's actual `upem`; use the true glyph cap/x-height for contact points, not a guess |
| 9 | A width-axis variable font won't animate in Canvas | Canvas has no `font-variation-settings` | Shape glyph outlines at any axis value via HarfBuzz, draw as `Path2D` (`createHarfBuzzShaper` in `templates/v1/src/type.js`) |
| 10 | The model can't watch or hear the result | LLMs have no video/audio playback | See "Reviewing without watching" below |

## Reviewing without watching (gotcha #10, in detail)

An agent working on a render can never just "watch it back." Review with:

- **Contact sheets.** `render.mjs sheet from=... to=... step=... cols=... tw=...`
  renders a grid of stills into one PNG — cheaper to view than many separate
  images, and one sheet stays useful across the whole session instead of being
  re-read on every call.
- **Stills at cuts.** Render the frame immediately before, on, and after a cut
  time to catch blended frames (gotcha #4) or a position jump across a hand-off.
- **Frames pulled from the encoded delivery file, not the render.** The render
  and the delivery encode can diverge (recompression artifacts, color shifts).
  Sample the actual MP4:
  ```sh
  ffmpeg -i out/delivery.mp4 -vf "select='not(mod(n\,15))',scale=192:108,tile=10x6" -frames:v 1 sheet.png
  ```
- **Spectrograms and waveforms for the audio track** (see the `motion-sound`
  skill for the exact commands) — timing and level are visible even though the
  audio itself can't be heard.
- **Loudness/true-peak numbers**, not an assertion that the mix "sounds right"
  (again, see `motion-sound`).

## Acceptance evidence for this skill

No code in this file duplicates the toolkit: every pipeline stage above is a
pointer to a `templates/v1/...` path, and the gotcha table is recipes/diagnosis
only — no render/encode implementation is restated as runnable code.
