# 04 — Budget guard hook

Status: pending

## Plan

RIGOR: strict
LANE: guard
Builder: Sonnet (defaulting to coordinator's own tier — handoff said "Opus or
Sonnet"; using Sonnet avoids an escalation ask. Revisit if Sonnet's output proves
inadequate on the fixture test below.)

Build a Stop hook (ships with `plugins/motion-skills/hooks/`) that reads
`transcript_path` and warns past thresholds (context size, session token count).
Must:

- Exit silently (no output, no warning) unless the session is motion work —
  detect via the `.motion-skills` marker file that `motion-studio` (task 03)
  writes when it scaffolds a project.
- Exit silently on a small/short session even when it IS motion work (no false
  positives on trivial sessions).
- Fire a warning at the right thresholds when tested against this session's own
  transcript as a fixture — thresholds derived from the baseline in
  `~/work/agent_experiments/showreel/docs/motion-plugin.context.md`
  "Measurement baseline" (88.5 min wall-clock, 103 calls, 322k output tokens,
  489k peak context, $22.11 API-equivalent for one 15s reel).
- Never fire for Forrest's other (non-motion) Claude Code sessions.

## Acceptance criteria

1. Fires the correct warning when run against the fixture transcript at/past the
   baseline-derived threshold.
2. Stays silent on a small session fixture (well under threshold).
3. Stays silent when no `.motion-skills` marker is present, regardless of
   transcript size.

## Evidence

(append here, one entry per criterion, verbatim command output — include the
fixture transcript path/description used)

## Handoff

(none expected — this should be fully CLI-testable against transcript fixtures)
