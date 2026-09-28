# 06 — motion-render skill

Status: pending
Lane session: run together with 05, 07, 08 in one warmed Sonnet session

## Plan

RIGOR: loose
LANE: standalone-skills
Builder: Sonnet

Write `plugins/motion-skills/skills/motion-render/SKILL.md`: the rendering
pipeline, its gotchas, and how to review a render without watching it (the model
can't watch video or hear audio — gotcha #10 in
`~/work/agent_experiments/showreel/docs/motion-plugin.context.md`: contact
sheets, stills at cuts, frames pulled from the encoded MP4, spectrograms, and
loudness stats).

Source: `~/work/agent_experiments/showreel/docs/for_llms.md` "Pipeline" section
(render.mjs → main.js → ffmpeg lossless master → encode.sh) and all ten items
under "Gotchas already paid for" in motion-plugin.context.md (frame upload perf,
noise/grain perf, float blending, shutter direction, sub-frame counts, glyph
upem, spring-chain stability, Web Audio automation, AAC overshoot, review method).

Point at the toolkit's render driver (task 01) and encode profiles (task 02)
rather than duplicating the pipeline description as free-standing prose that will
drift.

## Acceptance criteria

1. The skill correctly points at the toolkit's render/encode modules (task 01/02
   file paths) for the actual pipeline — no duplicated/rewritten pipeline code.
2. It duplicates no code from the toolkit — recipes and gotchas only, references
   by path.

## Evidence

(append here, one entry per criterion)

## Handoff

(none expected)
