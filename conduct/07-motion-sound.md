# 07 — motion-sound skill

Status: done
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

Built `plugins/motion-skills/skills/motion-sound/SKILL.md`. Points at
`createAudioPrimitives`/`renderDemoSoundtrack` in `templates/v1/src/audio.js`
and `createTimeline` in `templates/v1/src/timeline.js` (verified to exist, see
task 05's evidence grep) rather than re-deriving Web Audio node graphs.

### Criterion 1 — loudness/true peak measured via a documented command, not asserted

Confirmed the filters the skill's command depends on are present on this
machine's ffmpeg:

```text
$ ffmpeg -hide_banner -filters | grep -i ebur128
 .. ebur128           A->N       EBU R128 scanner.
$ ffmpeg -hide_banner -filters | grep -i alimiter
 T. alimiter          A->A       Audio lookahead limiter.
```

Ran the exact documented command end-to-end against a real audio file (a
synthetic tone, since no rendered soundtrack exists yet in this worktree) to
prove it produces real numbers, not a hypothetical:

```text
$ ffmpeg -y -hide_banner -loglevel error -f lavfi -i "sine=frequency=440:duration=2" /tmp/motion-sound-test-tone.wav
$ ffmpeg -hide_banner -loglevel info -i /tmp/motion-sound-test-tone.wav -af ebur128=peak=true -f null - 2>&1 | tail -12
[Parsed_ebur128_0] Summary:
  Integrated loudness:
    I:         -21.8 LUFS
    Threshold: -31.8 LUFS
  Loudness range:
    LRA:         0.0 LU
  True peak:
    Peak:      -18.1 dBFS
```

The skill instructs running this same `ebur128=peak=true` command against the
actual delivery file (post-AAC-encode, post-`alimiter`), and separately covers
the AAC true-peak-overshoot gotcha (why the delivery file, not the pre-encode
WAV, is what must be measured) with a pointer to `templates/v1/src/encode.mjs`
where `alimiter` is already applied.

World-tier check:

```text
$ rg -n -i 'redux|motor works|/users/|/Users/fkchang|cultiv-os|agent_experiments|budget' plugins/motion-skills/skills
(no matches, exit 1)
```

Criterion confirmed directly. Status → done.

## Handoff

(none expected)
