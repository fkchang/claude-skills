# 01 — Toolkit extraction

Status: built-awaiting-gate

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

### Criterion 1 — smoke project and render pipeline (built; visual gate remains)

Command:

```text
$ npm test

> motion-toolkit-template@1.0.0 test
> node test/validate.mjs

validation ok: parameterized config, timeline, easing, type geometry, looks, audio, RGBA16F, Blob upload
```

The template includes a toolkit-only smoke composition (`src/smoke.js`) that
uses separated inks, vector type geometry, easing and motion helpers, plus
offline-audio primitives. Its render driver preserves forward-shutter sampling,
RGBA16F accumulation, Blob frame POSTs, a lossless RGB master, and a separate
delivery encoder. Browser rendering is blocked in this builder sandbox, so the
contact-sheet comparison is handed off below rather than asserted.

### Criterion 2 — parameterized size, timing, and palette

Command:

```text
$ npm test

> motion-toolkit-template@1.0.0 test
> node test/validate.mjs

validation ok: parameterized config, timeline, easing, type geometry, looks, audio, RGBA16F, Blob upload
```

`test/validate.mjs` constructs a non-default 320x240, 30 fps, 3 second, 100
BPM configuration with a non-default paper and three-ink palette, then checks
its parsed values and derived beat clock.

### Criterion 3 — swappable riso and enamel looks

Command:

```text
$ node --check src/looks.js
$ npm test

> motion-toolkit-template@1.0.0 test
> node test/validate.mjs

validation ok: parameterized config, timeline, easing, type geometry, looks, audio, RGBA16F, Blob upload
```

The validation checks the enamel shader is present. `createConfig({ look:
'riso' })` and `createConfig({ look: 'enamel' })` select the shaders through
the same `Stage` config surface; the smoke composition also exercises the
enamel steel-density gradient path.

### Criterion 4 — no personal or show-specific material in toolkit

Command:

```text
$ rg -n -i 'redux|motor works|rmv|/users/|budget' . || true
```

Output: *(no matches)*

### General static validation

Command:

```text
$ node --check render.mjs && for f in src/*.js test/*.mjs; do node --check "$f"; done && bash -n encode.sh && git diff --check -- .
```

Output: *(no output; exit 0)*

## Handoff

(runbook for anything needing a real render/visual check, if not CLI-provable)

From `plugins/motion-skills/templates/v1` on a machine that permits a local
loopback server and headless Chrome:

```sh
npm install
npm test
npm run smoke:sheet
node render.mjs sheet width=320 height=180 fps=24 duration=2 bpm=120 look=enamel from=0 to=2 step=0.4 cols=3 tw=120 name=smoke-enamel-sheet.png
npm run smoke:audio
node render.mjs video width=320 height=180 fps=24 duration=2 bpm=120 look=riso mb=4 from=0 to=2 out=smoke-master.mkv
master=out/smoke-master.mkv audio=out/smoke.wav OUT=out/smoke.mp4 ./encode.sh
```

Expected observations: `out/smoke-sheet.png` is a five-frame contact sheet
with three colored ink separations, stippled tint grain, and slight plate
movement; `out/smoke-enamel-sheet.png` has the same animated geometry but flat
enamel fields, a restrained fine grain, and a steel-toned lower strip. Both
sheets show vector letterforms changing independently and a moving, stretched
circle along a drawn path. The video command writes a lossless RGB master;
the encode command reports an H.264/AAC delivery file with the requested 320x180
geometry and 24 fps. Approve these visual observations to change Status to done.
