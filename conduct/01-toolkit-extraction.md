# 01 — Toolkit extraction

Status: pending

## Plan

RIGOR: loose
LANE: toolkit
Builder: Codex via /mycodex

Extract the showreel's engine into a reusable, parametrized toolkit inside
`plugins/motion-skills/templates/<version>/` in `~/work/claude-skills` (versioned
template directory per the toolkit-shape decision — do NOT make it an npm package
yet). Source: `~/work/agent_experiments/showreel` (read `docs/for_llms.md` first —
it is the authoritative code map, modules table, drawing model, type system,
hardcoded values to parametrize, and gotchas).

Modules to extract (see for_llms.md "Modules" table and the symbol index in
`docs/motion-plugin.context.md`): `engine.js` (Painter/Stage/ink specs), `type.js`
(HarfBuzz shaping), `ease.js`, `kit.js` (motion helpers), `timeline.js` (clock —
parametrize BPM/duration/size instead of hardcoding), `audio.js` (soundtrack
primitives), `render.mjs` pipeline, `encode.sh`.

Parametrize (currently hardcoded, see for_llms.md "Hardcoded today"): frame size
(currently 1920x1080), fps (60), duration (15s), BPM (128), the three-ink palette
+ paper color. Keep the render pipeline's proven choices as-is: forward shutter,
RGBA16F accumulation, lossless master → ffmpeg encode, the frame-upload-via-Blob
fetch trick (gotcha #1 in the handoff).

Also build a second "look" for RMV's mid-century enamel style per
`docs/motion-plugin.context.md` scope row 1: flat enamel fills, steel gradients,
fine film grain — as an alternative ink/paint module alongside the riso look, not
a replacement.

Read the "Gotchas already paid for" section of
`~/work/agent_experiments/showreel/docs/motion-plugin.context.md` before starting;
these are already-paid-for lessons (frame upload perf, noise/grain perf, float
blend extension, shutter direction, sub-frame counts for fast motion, glyph upem,
spring-chain stability, Web Audio automation ordering, AAC overshoot, and that the
model can't watch/hear rendered output — review via contact sheets/stills/spectra
only).

## Acceptance criteria

1. The showreel (in its own repo) can be re-pointed at the extracted toolkit and
   re-render, producing a contact sheet that visually matches
   `~/work/agent_experiments/showreel/out/mp4_sheet.png` (same scene content,
   same look) — OR, if re-pointing the original showreel is impractical, a
   toolkit-only smoke-test project renders an equivalent contact sheet from the
   extracted modules exercising: ink separations, type-as-geometry, easing/motion
   helpers, and the audio primitives.
2. Frame size, fps, duration, BPM, and palette are constructor/config parameters,
   not hardcoded module constants.
3. The mid-century enamel "look" module exists and can be swapped in via the same
   config surface as the riso look.
4. No showreel-specific brand/personal content leaks into the toolkit (world-tier
   repo constraint) — RMV brand kit values do NOT belong here (see row 10's
   overlay file instead).

## Evidence

(append here, one entry per criterion, verbatim command output)

## Handoff

(runbook for anything needing a real render/visual check, if not CLI-provable)
