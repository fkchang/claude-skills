# 09 — Clean-room test (gate)

Status: pending
Depends on: 01, 02, 03, 04, 05, 06, 07, 08 (needs the whole plugin)

## Plan

RIGOR: strict (gate)
LANE: gate
Builder: fresh agent, restricted to the plugin alone (no other docs, no source
repo browsing, no showreel access) — coordinator runs and reviews this itself,
per the conduct skill's clean-room-acceptance rule (an author auditing their own
doc/skill deliverable encodes the author's own blind spots).

Task for the fresh agent: using only `plugins/motion-skills/` (installed as a
plugin, or pointed at the checked-out directory), make a 10-second 9:16 piece.

## Acceptance criteria

1. It renders.
2. It passes review (contact sheet / stills / safe-zone check per motion-render
   and social-video-delivery skills).
3. Token/session use is measured (ccusage or transcript `message.usage` summed by
   unique `message.id`) and compared against the baseline in
   `~/work/agent_experiments/showreel/docs/motion-plugin.context.md`
   "Measurement baseline".

## Evidence

(coordinator appends: fresh agent transcript summary, render output path,
measured usage vs. baseline)

## Handoff

n/a — this task IS the gate
