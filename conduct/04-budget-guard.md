# 04 — Budget guard hook

Status: done

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

## Forward finding from task 03 (motion-studio) — read before building

Task 03 already built the marker format and the measurement logic; task 04 must
reuse them, not reimplement:

- **Marker detection**: walk up from the hook input's `cwd` looking for a file
  named `.motion-skills` (schema documented in
  `plugins/motion-skills/skills/motion-studio/SKILL.md` and written by
  `plugins/motion-skills/skills/motion-studio/scripts/scaffold.mjs`). None found
  anywhere up the tree → exit silently, exit 0.
- **Measurement**: do NOT re-derive token/call counting. Call
  `node plugins/motion-skills/skills/motion-studio/scripts/spend-gate.mjs --json --transcript <transcript_path> [--overlay <path>]`
  and read its `verdict` (`OK` | `WARN` | `OVER` | `UNKNOWN`) and `rows` (metrics:
  `calls`, `output_tokens`, `peak_context`, `cache_read_tokens`, `active_minutes`).
  Exit codes: 0 OK/UNKNOWN, 3 WARN, 4 OVER (per task 03's evidence).
- **Thresholds**: come from `budget.warn` / `budget.stop` in
  `~/.claude/motion-overlay.md` (schema in `motion-overlay.example.md`, same
  directory) — NOT hardcoded in the hook. If the overlay doesn't exist or has no
  thresholds set, `spend-gate.mjs` returns `UNKNOWN` (numbers only, no verdict);
  the hook should stay silent in that case too (nothing to warn against yet),
  not treat `UNKNOWN` as an error.
- The hook itself should be thin: marker walk, then shell out to
  `spend-gate.mjs`, then format its stdout as the Stop hook's warning message if
  verdict is WARN/OVER. All the actual measurement logic already exists and is
  gated — don't duplicate it.

## Acceptance criteria

1. Fires the correct warning when run against the fixture transcript at/past the
   baseline-derived threshold.
2. Stays silent on a small session fixture (well under threshold).
3. Stays silent when no `.motion-skills` marker is present, regardless of
   transcript size.

## Evidence

Built `plugins/motion-skills/hooks/budget-guard.mjs` (the Stop hook) and
`plugins/motion-skills/hooks/hooks.json` (registration; Claude Code auto-loads
`hooks/hooks.json` for an installed plugin — confirmed against
`plugin-structure` skill docs, no `plugin.json` change needed). The hook does
the `.motion-skills` marker walk itself, then shells out to `spend-gate.mjs
--json --transcript <path>` (no re-derived measurement logic), and on
WARN/OVER prints `{ hookSpecificOutput: { hookEventName: "Stop", systemMessage
} }` and exits 0. It never sets `permissionDecision: "deny"` — confirmed via
the official Stop-hook docs
(`https://code.claude.com/docs/en/hooks#stop`) that `deny`/exit-2 forces the
agent to keep working, which fights the fresh-session rule this guard exists
to enforce; `systemMessage` shows the warning in the transcript without
blocking or risking the exit-2 block-loop the docs describe a safeguard for.

Fixtures (built with a small generator, not committed — synthetic JSONL with
just the fields `spend-gate.mjs measure()` reads: `type`, `timestamp`,
`message.id`, `message.usage.{output_tokens,input_tokens,cache_read_input_tokens,cache_creation_input_tokens}`):

- `over-threshold.jsonl`: 110 assistant calls, 3000 output_tokens each (330k
  total), one call with `cache_read_input_tokens: 460000` to push peak_context
  to 462k.
- `small-session.jsonl`: 5 assistant calls, 100 output_tokens each (500
  total), peak_context 1000.
- `fixture-overlay.md`: budget thresholds derived from the baseline in
  `~/work/agent_experiments/showreel/docs/motion-plugin.context.md` (88.5 min,
  103 calls, 322k output tokens, 489k peak context) — set a bit under that
  baseline: `warn` calls=80/output_tokens=250000/peak_context=400000, `stop`
  calls=100/output_tokens=300000/peak_context=450000.
- `with-marker/.motion-skills`: a marker file in the schema `motion-studio`
  writes (`schema`, `template`, `plugin_version`, `brand`, `scaffolded`).
- `no-marker/project`: same directory shape, no marker anywhere up the tree.

All runs below use `MOTION_OVERLAY=<fixture-overlay.md>` and pipe a Stop-hook
JSON payload (`session_id`, `transcript_path`, `cwd`, `hook_event_name:
"Stop"`, plus the other Stop-hook fields per the docs) into
`node plugins/motion-skills/hooks/budget-guard.mjs`.

### Criterion 1 — fires on the over-threshold fixture (marker present)

Input: `cwd` = `.../fixtures/with-marker/project`, `transcript_path` =
`.../fixtures/over-threshold.jsonl`.

```
$ echo '<stop-hook-json>' | node plugins/motion-skills/hooks/budget-guard.mjs
{"hookSpecificOutput":{"hookEventName":"Stop","systemMessage":"motion-skills budget guard: OVER\nPast a stop threshold. Stop building. Write a handoff in studio.md and tell the user; continue only in a fresh session or with their explicit OK.\n- calls: 110 (warn 80, stop 100) -> OVER\n- output_tokens: 330000 (warn 250000, stop 300000) -> OVER\n- peak_context: 462000 (warn 400000, stop 450000) -> OVER"}}
exit code: 0
```

Also verified the marker walk works from a nested subdirectory
(`with-marker/project/deep/sub`) — same output, confirming "walk up from cwd"
is not limited to the immediate directory.

### Criterion 2 — silent on the small fixture (marker present)

Input: `cwd` = `.../fixtures/with-marker/project`, `transcript_path` =
`.../fixtures/small-session.jsonl`. Direct `spend-gate.mjs --json` run first
confirmed verdict `OK` (calls 5, output_tokens 500, peak_context 1000, all
well under `warn`).

```
$ echo '<stop-hook-json>' | node plugins/motion-skills/hooks/budget-guard.mjs
stdout: []
exit code: 0
```

### Criterion 3 — silent with no marker, regardless of transcript size

Input: `cwd` = `.../fixtures/no-marker/project` (verified no `.motion-skills`
anywhere from that directory up to `/`), `transcript_path` =
`.../fixtures/over-threshold.jsonl` (the same OVER-verdict transcript from
criterion 1).

```
$ echo '<stop-hook-json>' | node plugins/motion-skills/hooks/budget-guard.mjs
stdout: []
exit code: 0
```

Also verified malformed stdin (`echo "not json" | node budget-guard.mjs`)
stays silent and exits 0, rather than crashing a user's unrelated session.

## Handoff

(none expected — this should be fully CLI-testable against transcript fixtures)
