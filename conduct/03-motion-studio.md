# 03 — motion-studio composite skill

Status: pending
Depends on: 01, 02 (toolkit + presets must exist first)

## Plan

RIGOR: strict
LANE: skills
Builder: Opus (per handoff; coordinator is running as Sonnet 5 this session, so
this is an escalation above the coordinator's own tier — approved by Forrest
2026-09-28)

Build `motion-studio`, the composite skill in `plugins/motion-skills/skills/
motion-studio/SKILL.md` (plus any supporting scripts) that governs the whole
pipeline: brief → beat-grid concept → style frame → build → review → sound →
deliver. It must:

- Gate spend: read the budget baseline from
  `~/work/agent_experiments/showreel/docs/motion-plugin.context.md`
  "Measurement baseline" section and enforce/report against thresholds (works
  with the budget guard hook from task 04 — coordinate, don't duplicate logic).
- Route to the toolkit (task 01) and presets (task 02) rather than reimplementing
  rendering.
- Enforce the "fresh-session rule" (each piece of motion work starts in a fresh
  session, per the handoff's session-economics gotcha — model can't watch/hear
  its own output across a huge single-session build).
- Read brand kits from `~/.claude/motion-overlay.md` (create this file's expected
  shape/schema as part of this task if it doesn't exist yet — do NOT put RMV's
  actual brand values in the plugin; those go in the overlay only).
- Support "template mode": scaffold a new project by copying the versioned
  template directory from task 01.
- Write the `.motion-skills` marker file when it scaffolds a project (this is
  what the budget guard hook in task 04 checks for to know it's motion work).

## Acceptance criteria

1. The clean-room run (task 09) stays inside its measured budget when using this
   skill end to end.
2. No personal paths, brand values, or budget numbers appear inside
   `plugins/motion-skills/` — they live in `~/.claude/motion-overlay.md` only.
3. `motion-studio` correctly writes the `.motion-skills` marker on scaffold.

## Evidence

(append here, one entry per criterion, verbatim command output)

## Handoff

(runbook for anything needing a real render/visual review pass)
