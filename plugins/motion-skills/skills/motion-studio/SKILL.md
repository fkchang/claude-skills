---
name: motion-studio
description: Run a code-driven motion piece end to end (a reel, short, sting, logo animation, explainer loop, or showreel) through brief, beat grid, style frame, build, review, sound and delivery, with a spend gate at every phase boundary, brand kits from the operator's motion overlay, and a fresh session per phase. Also scaffolds new motion projects from the plugin's versioned toolkit template ("template mode"). Use when asked to make, plan, scaffold or resume an animated video or motion graphic, or when a motion build starts eating session budget.
---

# motion-studio: the pipeline that governs a motion piece

This skill decides **what happens in what order, in which session, at what spend**. It
writes no rendering code. Rendering, encoding, presets and safe zones live in the toolkit
template (`templates/vN/` in this plugin); craft, render, sound and delivery detail live in
the sibling skills `motion-craft`, `motion-render`, `motion-sound` and
`social-video-delivery`. Point at them; don't restate them.

Paths below are relative to this skill's directory. Scripts are Node ES modules with no
dependencies beyond Node itself.

## On invoke

1. **Overlay.** `node scripts/overlay.mjs check`. It reads `~/.claude/motion-overlay.md`
   (or `$MOTION_OVERLAY`). No overlay is fine: no brand, and the spend gate reports without
   a verdict. Schema: `motion-overlay.example.md`.
2. **Project.** Find the project root: the nearest directory containing `.motion-skills`.
   None and the user is starting a piece: go to **Template mode**. Existing motion code
   without a marker: `node scripts/scaffold.mjs --mark-only <dir>`.
3. **Resume.** Read the project's `studio.md`. The first unchecked phase is where you are.
4. **Gate.** Run the spend gate (below) and say the verdict in one line before any work.
5. If the lean-coordinator skills are installed, run the session under `opus-lean` or
   `fable-lean` to match the model; the delegation rules below assume them.

## The fresh-session rule

**Each real piece of motion work, and each build-heavy phase of it, starts in a fresh
session that reads `studio.md` and the brief, not the previous session's history.**

Why (session economics, measured on a single-thread reel build):
- Every call re-reads the whole context. A tiny reply late in a ~500k-token session still
  re-reads ~500k; a call over a 50k context costs about a tenth of one over 500k. Long motion
  builds balloon context with frames, shader code and render logs.
- An idle hour expires the prompt cache; resuming a big session then pays a full rewrite.
- The model can't watch video or hear audio. It reviews through contact sheets, stills and
  meters, and a session that built the piece reads those through its own intent. A fresh
  reviewer that sees only the brief and the artifacts catches what the author can't.

So: capture decisions in `studio.md` while context exists, end the session, start the next
phase fresh with "read studio.md, continue at <phase>". Never resume a large motion session
for a small question.

## Pipeline

| # | Phase | Produces (in the project) | Who / effort | Gate to pass |
|---|---|---|---|---|
| 1 | Brief | `studio.md` Brief: preset ids, duration, BPM, one-line message, must-haves, brand | Main thread, medium | User confirms the brief |
| 2 | Beat grid | `studio.md` Beat grid: bars x beats, each hit at a bar.beat time, scene ranges | Main thread, medium (taste) | Durations add up: `bars * 4 * 60 / BPM` = duration |
| 3 | Style frame | One still per key scene, one contact sheet (`out/`) | Main thread builds one scene; `motion-craft` for principles | **User approves the look.** Cheapest place to change direction |
| 4 | Build | Scene modules in `src/`, wired in `src/main.js` | Fresh session. Well-specified "does it run" pieces go to a cheaper builder (Sonnet, or a coding agent via the lean overlay); timing and taste stay with you | `npm test` passes; `motion-render` rules followed |
| 5 | Review | Contact sheet, stills at every cut, frames pulled from the encoded MP4, safe-zone sheet | **Fresh reviewer** (subagent at Sonnet tier) given only the brief, beat grid and images | Reviewer's list is empty or accepted by the user |
| 6 | Sound | Score and SFX from the timeline hits; loudness and true-peak numbers | `motion-sound`; checks are ffmpeg meters, not ears | Loudness and true peak **measured**, within the delivery target |
| 7 | Deliver | Encodes per preset, copied to the overlay's `outputs.deliveries` | `social-video-delivery`; deterministic scripts | `ffprobe` matches the preset's encode record |

Check off the phase in `studio.md` and write its decisions there before moving on.

### Routing into the toolkit (don't reimplement)

The scaffolded project **is** the toolkit. Everything below is already there; read its
`README.md` for flags.

| Need | Use |
|---|---|
| Size, fps, duration, BPM, palette, look | `src/config.js` `createConfig()`; CLI `width= height= fps= duration= bpm= look=` |
| Platform raster, safe zone, encode profile | `src/presets.js` ids, `preset=<id>` |
| Safe-zone check / overlay | `npm run safe-zone:check`; `node render.mjs sheet ... reviewPreset=<id>` |
| Timing grid | `src/timeline.js` |
| Easing, springs, noise | `src/ease.js`, `src/kit.js` |
| Type | `src/type.js` |
| Contact sheet / preview still / video master | `node render.mjs sheet|preview|video ...` |
| Audio | `src/audio.js`, `node render.mjs audio ...` |
| Delivery encode | `PRESET=<id> OUT=... ./encode.sh master=... audio=...` |

If the toolkit lacks something the piece needs, add it to the project copy, note it in
`studio.md` Decisions, and flag it as a candidate for the next template version. Never
paste toolkit code into a skill.

## Spend gate

Run at the start of every session and at every phase boundary:

```sh
node scripts/spend-gate.mjs --phase <phase> --log <project>/studio.md
```

It sums the current session transcript's `message.usage`, de-duplicated by `message.id`
(newest `.jsonl` for the working directory; override with `--transcript`), and compares
`calls`, `output_tokens`, `peak_context`, `cache_read_tokens` and `active_minutes` against the
overlay's `budget.warn` and `budget.stop`. `peak_context` is the largest single call's
input plus cache reads plus cache writes; `active_minutes` sums time between transcript
entries, skipping gaps of 15 minutes or more as idle. Add `--json` for machines. If other
sessions run in the same directory, "newest transcript" may be theirs: pass `--transcript`.
Auto-detection can also, rarely, match an unrelated session via a directory-slug collision
while walking up parent directories (seen from a deeply nested scratch path) — always pass
`--transcript` explicitly from a subagent, hook, or any other non-interactive context.

| Verdict | Exit | Do this |
|---|---|---|
| OK | 0 | Proceed |
| WARN | 3 | Finish the current phase, write state to `studio.md`, start the next phase fresh |
| OVER | 4 | Stop building. Write a handoff in `studio.md`, tell the user; continue only fresh or with their OK |
| UNKNOWN | 0 | No thresholds in the overlay. Report the numbers as the measurement; don't invent a verdict |

Thresholds live only in the overlay and come from a measured run. After a piece ships,
record its final gate reading in the overlay's `budget.baseline` so the next thresholds are
set from data.

## Brand kits

`node scripts/overlay.mjs brand [slug]` prints a brand as JSON: `look`, `palette` (the
toolkit's paper plus exactly three inks), named `tokens`, `fonts`, `logo`, `sound_logo`,
`notes`. Scaffolding with `--brand` writes `brand.json` into the project and sets the
template's default palette and look, verified by importing the patched config. A palette
change is a one-line overlay edit, the same edit in the project's `DEFAULT_PALETTE`
(`src/config.js`), and a re-render. Brand values never go into this plugin.

## Template mode

```sh
node scripts/scaffold.mjs <new-project-dir> [--brand <slug>] [--template vN]
```

- Copies the **highest** `templates/vN/` (or the one named) into a new or empty directory,
  skipping `node_modules/` and `out/`.
- Writes `.motion-skills` (the marker) and a `studio.md` phase log.
- With `--brand`, writes `brand.json` and applies the brand's palette and look.
- Then `cd <dir> && npm install && npm test`.

Default parent directory: the overlay's `outputs.projects`, if set.

### The `.motion-skills` marker (contract for the budget guard hook)

A file named `.motion-skills` in a project root means **this directory tree is motion
work**. Flat `key: value` lines (valid YAML), `#` comments allowed:

```
schema: 1
template: v1          # template version copied, or none (--mark-only)
plugin_version: 0.1.0
brand: example        # brand slug, or none
scaffolded: 2026-01-01T00:00:00.000Z
```

Detection rule for hooks: take the hook input's `cwd`, walk up to the filesystem root, and
treat the session as motion work if any directory on the way holds `.motion-skills`.
Presence is the signal; the fields are informational. No marker: the hook exits silently.
A hook that needs usage numbers or thresholds should call
`scripts/spend-gate.mjs --json --transcript <transcript_path>` rather than re-derive them,
so there is one measurement.

## Lean delegation inside the pipeline

- Taste calls (brief, beat grid, style frame approval, review verdicts) stay with you or the
  user. Mechanical, verifiable work goes down the ladder: scene boilerplate and encode runs
  to a cheaper builder, spec lookups to a research sweep, meters to scripts.
- Review is always a fresh agent, never the session that built the frames.
- Rendering, encoding and metering are deterministic scripts: run them, don't reason about
  what they would output.
- Recurring pieces with only data changes (new copy, new date) should become a data-driven
  template rendered by a script or scheduler with zero model calls.

## Don't

- Don't write rendering, encoding or audio code in a skill or in this pipeline; extend the
  project's toolkit copy.
- Don't put brand values, budgets or personal paths in this plugin; they belong in the overlay.
- Don't claim a piece "looks right" or "sounds right" without the sheet, stills or meter output.
- Don't keep building past a WARN in the same session.
