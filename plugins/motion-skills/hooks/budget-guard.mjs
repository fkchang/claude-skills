#!/usr/bin/env node
// Stop hook: warns when a motion-skills session has passed the operator's spend
// thresholds. Reads the Claude Code Stop-hook JSON on stdin (fields used here:
// `cwd`, `transcript_path`), does the `.motion-skills` marker walk itself, and
// shells out to spend-gate.mjs for the actual measurement and verdict — it does
// not re-derive token/call counting or thresholds (those live in the overlay).
//
// Wiring: this plugin ships `hooks/hooks.json`, which Claude Code auto-loads
// for any session with the motion-skills plugin installed — no extra setup.
// To wire it manually instead (e.g. running this script outside the plugin
// installer), add to settings.json:
//   { "hooks": { "Stop": [ { "matcher": "", "hooks": [
//     { "type": "command", "command": "node /path/to/budget-guard.mjs" }
//   ] } ] } }
//
// Output contract: on a WARN/OVER verdict this prints
// `{ hookSpecificOutput: { hookEventName: "Stop", systemMessage } }` and exits 0.
// It never sets `permissionDecision: "deny"` — the point of the guard is to tell
// the operator to wrap up and start fresh, not to force the agent to keep
// working (that would fight the fresh-session rule, and risks the exit-2 block
// loop Claude Code's Stop hook guards against but doesn't need to be invited).
// On OK/UNKNOWN, no marker, or any internal error, it exits 0 with no output —
// silent by default is the whole point outside motion work.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const MARKER = '.motion-skills';
const SPEND_GATE = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'skills', 'motion-studio', 'scripts', 'spend-gate.mjs');

function findMarkerRoot(startDir) {
  let dir = path.resolve(startDir);
  for (;;) {
    if (fs.existsSync(path.join(dir, MARKER))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}

function main() {
  let input;
  try {
    input = JSON.parse(fs.readFileSync(0, 'utf8'));
  } catch {
    return; // malformed stdin: stay silent rather than break the user's session
  }

  const cwd = input.cwd || process.cwd();
  if (!findMarkerRoot(cwd)) return; // not motion work

  const transcript = input.transcript_path;
  if (!transcript || !fs.existsSync(transcript)) return;

  const result = spawnSync(process.execPath, [SPEND_GATE, '--json', '--transcript', transcript], { encoding: 'utf8' });
  if (result.error || !result.stdout) return; // spend-gate itself reports usage/IO errors; a hook shouldn't surface those as noise

  let report;
  try {
    report = JSON.parse(result.stdout);
  } catch {
    return;
  }

  if (report.verdict !== 'WARN' && report.verdict !== 'OVER') return; // OK and UNKNOWN are both silent

  const overRows = report.rows.filter(r => r.status === 'WARN' || r.status === 'OVER');
  const detail = overRows.map(r => `- ${r.metric}: ${r.value} (warn ${r.warn ?? '-'}, stop ${r.stop ?? '-'}) -> ${r.status}`).join('\n');
  const systemMessage = `motion-skills budget guard: ${report.verdict}\n${report.remedy}\n${detail}`;

  process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: 'Stop', systemMessage } }));
}

main();
