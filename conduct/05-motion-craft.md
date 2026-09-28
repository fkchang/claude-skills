# 05 — motion-craft skill

Status: pending
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

(append here — include the clean-room agent's output/transcript summary)

## Handoff

(none expected — clean-room test is itself the gate; coordinator runs it)
