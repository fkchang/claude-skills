# 06 — motion-render skill

Status: done
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

Built `plugins/motion-skills/skills/motion-render/SKILL.md`.

### Criterion 1 — points at toolkit render/encode modules, not restated pipeline code

The pipeline table cites real paths for every stage, verified to exist:

```text
$ for f in templates/v1/render.mjs templates/v1/src/engine.js templates/v1/src/encode.mjs templates/v1/encode.sh templates/v1/src/presets.js templates/v1/src/safe-zones.js templates/v1/README.md; do [ -f "$f" ] && echo "OK  $f" || echo "MISSING $f"; done
OK  templates/v1/render.mjs
OK  templates/v1/src/engine.js
OK  templates/v1/src/encode.mjs
OK  templates/v1/encode.sh
OK  templates/v1/src/presets.js
OK  templates/v1/src/safe-zones.js
OK  templates/v1/README.md
```

Run modes (`stills`, `sheet`, `video`, `audio`) and flags are described by
reference to `templates/v1/README.md` rather than re-listed as authoritative.

### Criterion 2 — no duplicated code, recipes/gotchas only

```text
$ rg -n -i 'redux|motor works|/users/|/Users/fkchang|cultiv-os|agent_experiments|budget' plugins/motion-skills/skills
(no matches, exit 1)
$ grep -n '```' plugins/motion-skills/skills/motion-render/SKILL.md
58:  ```sh
60:  ```
```

The skill has exactly one fenced code block: an `ffmpeg` review command that
extracts a contact sheet from a delivery file (a usage example, not toolkit
logic). It does not reproduce any render/encode implementation from
`render.mjs` or `encode.mjs`. The ten-gotcha table and pipeline table are
diagnosis/fix/pointer prose, not code.

Both acceptance criteria confirmed directly. Status → done.

## Handoff

(none expected)
