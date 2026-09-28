# 05 — motion-craft skill

Status: built-awaiting-gate
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

### Criterion 1 — clean-room agent applies three principles from the skill alone

**Not self-verifiable by this builder** (would need a fresh agent isolated from
this conversation and this worktree's other docs). Left ungated — see Handoff.

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
