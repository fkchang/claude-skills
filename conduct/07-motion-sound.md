# 07 — motion-sound skill

Status: pending
Lane session: run together with 05, 06, 08 in one warmed Sonnet session

## Plan

RIGOR: loose
LANE: standalone-skills
Builder: Sonnet

Write `plugins/motion-skills/skills/motion-sound/SKILL.md`: score and SFX
synthesis driven from the timeline, and audio checks that don't require ears.

Source: `~/cultiv-os/knowledge-base/synthesized-sound-for-motion.md`,
`~/work/agent_experiments/showreel/src/audio.js` (`renderSoundtrack()`) and
`src/timeline.js` (`BPM`, `at()`, `HITS`, `hitEnv(t)` — audio cues import scene
constants, so retiming a scene retimes its sound, per the code-map gotcha).

Cover the two paid-for Web Audio / mastering gotchas from
`motion-plugin.context.md`: `setValueCurveAtTime` throws without a prior
anchoring automation event; AAC adds ~2dB inter-sample overshoot, so limit at the
mux (`alimiter`) and verify with `ebur128=peak=true`.

Point at `src/audio.js` and the toolkit's extracted audio primitives (task 01)
rather than re-deriving Web Audio code in the skill's prose.

## Acceptance criteria

1. Loudness and true peak are measured (documents the actual command, e.g.
   `ffmpeg -af ebur128=peak=true`) rather than asserted/eyeballed.

## Evidence

(append here)

## Handoff

(none expected)
