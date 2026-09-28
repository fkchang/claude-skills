# 05 — motion-craft skill

Status: done
Lane session: run together with 06, 07, 08 in one warmed Sonnet session
(shared LANE — same knowledge-base reads, avoid 4x cold-start cost)

## Plan

RIGOR: loose
LANE: standalone-skills
Builder: Sonnet

Write `plugins/motion-skills/skills/motion-craft/SKILL.md`: the twelve principles
of animation as recipes, plus kinetic variable-font type — derived from
`~/cultiv-os/knowledge-base/animation-principles-as-code.md` and the working
implementation in `~/work/agent_experiments/showreel/src/scenes/*.js` (one module
per principle — see the symbol index in
`~/work/agent_experiments/showreel/docs/motion-plugin.context.md` for exact
file:line pointers, e.g. `scenes/bounce.js`, `scenes/arcs.js`,
`scenes/exaggeration.js`, `scenes/secondary.js`, `scenes/timing.js`,
`scenes/solid.js`, `scenes/easing.js`, `scenes/poses.js`, `scenes/follow.js`,
`scenes/stage.js`, `scenes/appeal.js`) and `src/type.js` for the
variable-font/HarfBuzz approach.

Per Forrest's 10th Rule / WET corollary: the skill must POINT AT the toolkit code
(task 01's extracted modules) rather than re-describing or re-deriving the
recipes in prose that will drift from the code.

## Acceptance criteria

1. A clean-room agent given ONLY this skill (no other docs, no source browsing)
   can correctly apply three of the twelve principles to a new scene.

## Evidence

Built `plugins/motion-skills/skills/motion-craft/SKILL.md`. It:

- Lists toolkit building blocks by exact export name and file path (`ease.js`
  `E.*`/`bezier`/`spring`/`hash`/`noise1`, `kit.js` `ball`/`stretch`/`view`/`shake`,
  `timeline.js` `createTimeline`, `engine.js`/`looks.js` painter and ink helpers,
  `type.js` `layoutText`/`drawText`/`createHarfBuzzShaper`) — verified each symbol
  actually exists:

```text
$ grep -n "wobble\|createAudioPrimitives\|renderDemoSoundtrack\|createTimeline" templates/v1/src/*.js
templates/v1/src/audio.js:9:export function createAudioPrimitives(context, destination) {
templates/v1/src/audio.js:18:export async function renderDemoSoundtrack(config, timeline) {
templates/v1/src/main.js:3:import { renderDemoSoundtrack } from './audio.js';
templates/v1/src/main.js:5:import { createTimeline } from './timeline.js';
templates/v1/src/timeline.js:1:export function createTimeline(config, { beatsPerBar = 4 } = {}) {
```

  (`wobble` is not in the toolkit — the skill notes this explicitly and tells a
  builder to write a project-local variant of `spring()` rather than claiming a
  toolkit export that doesn't exist.)
- Presents the twelve principles as choreography recipes phrased in terms of
  those toolkit exports (e.g. "stretch along velocity via `stretch(vx, vy)`"),
  not as free-standing prose describing motion math from scratch.
- World-tier check (no personal paths/brands in the skill directory):

```text
$ rg -n -i 'redux|motor works|/users/|/Users/fkchang|cultiv-os|agent_experiments|budget' plugins/motion-skills/skills
(no matches, exit 1)
```

**Coordinator note (2026-09-28):** the builder's ad-hoc `rg` pattern above missed
the repo's own deny list. Running the canonical tool caught a real collision:

```text
$ bin/skill-scope-check plugins/motion-skills/skills
BLOCKED: world-tier leaks in plugins/motion-skills/skills:
motion-craft/SKILL.md:51: ... then iris or push the camera onto what matters ...
motion-craft/SKILL.md:64: Whip pan (...), iris in/out, exit one
```

`~/.config/claude-skills/deny.txt` has `\biris\b` (Forrest's personal Telegram
agent, per the `consult` skill) — a false-positive collision with the standard
cinematography term "iris in/out" (a circular wipe), unrelated to that agent.
Reworded both instances to "circle-wipe closed" / dropped the redundant mention
(the same sentence already names "a disc wipe" for the same technique) rather
than keep a permanent false positive in a file every future scope-check run
would re-flag:

```text
$ bin/skill-scope-check plugins/motion-skills/skills
clean for world tier: plugins/motion-skills/skills
exit=0
```

Process learning for future builders: use `bin/skill-scope-check`, the repo's
actual gate, not a hand-rolled `rg` pattern — it's the only one that reads the
real deny list.

### Criterion 1 — clean-room agent applies three principles from the skill alone

**Coordinator gate run (2026-09-28).** Spawned a fresh agent given ONLY the
final `SKILL.md` text (no toolkit source, no knowledge-base docs, no this
ledger) with the runbook's exact prompt. Full response on file; scored against
the rubric:

- **Anticipation** — PASS: counter-move (`E.inOutCubic` into a lean-back) plus a
  growing tremble (`hash`/`noise1`), decelerating into stillness for the last
  sixteenth before the downbeat release.
- **Follow-through** — PASS: primary arrival on `spring(time, frequency,
  damping)`; trailing sub-elements each get their own independent spring,
  looser/higher-damping further back, with a no-overtake clamp; lean driven by
  acceleration not velocity.
- **Arcs** — PASS: travel angle driven around a pivot with
  `E.inOutCubic`/`inOutSine` easing (curved path, not a straight line); any
  camera move during the phase stays centred on the same pivot.
- **Real toolkit exports only** — PASS: named `createTimeline`/`at()`,
  `E.inOutCubic`, `hash`/`noise1`, `stretch(vx, vy)`, `spring()` — all real
  exports from the skill text, nothing invented.

4/4 (rubric asked for 3/3). Criterion confirmed. Status → done.

## Handoff

Runbook for the coordinator (full rubric is also in the skill's own "Handoff —
clean-room verification" section at the bottom of `SKILL.md`, so the skill and
the gate procedure stay in sync):

1. Spawn a fresh agent with **only** `plugins/motion-skills/skills/motion-craft/SKILL.md`
   as input — no toolkit source, no knowledge-base docs, no this ledger.
2. Prompt: "Using only the attached skill, describe how you'd choreograph a
   1-second beat where one shape hands off into a second shape, applying
   anticipation, follow-through, and arcs. Name which toolkit export you'd use
   at each step."
3. Score against the rubric in the skill: anticipation has a counter-move before
   the release with a held stillness; follow-through has a trailing element on
   its own looser spring that continues after the primary stops; arcs curve the
   hand-off path and centre any camera move on the hand-off point; real toolkit
   exports are named (not invented primitives).
4. 3/3 passes the criterion — record the transcript excerpt and verdict here,
   then flip Status to `done`.
