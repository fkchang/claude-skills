#!/usr/bin/env node
// Measures a Claude Code session transcript and judges it against the overlay budget.
// Usage: spend-gate.mjs [--transcript F] [--overlay F] [--phase NAME] [--log studio.md] [--json]
// Exit: 0 OK or UNKNOWN, 3 WARN, 4 OVER, 1 usage/IO error.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { METRICS, loadOverlay, defaultOverlayPath, thresholdsSet } from './overlay.mjs';

const IDLE_MS = 15 * 60000;

export function measure(file) {
  const byId = new Map();
  let last = null, activeMs = 0;
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    if (!line.trim()) continue;
    let entry; try { entry = JSON.parse(line); } catch { continue; }
    const t = entry.timestamp ? Date.parse(entry.timestamp) : NaN;
    if (!Number.isNaN(t)) { if (last !== null && t > last && t - last < IDLE_MS) activeMs += t - last; last = t; }
    const m = entry.message;
    if (entry.type === 'assistant' && m?.usage && m.id) byId.set(m.id, m.usage);
  }
  const usage = [...byId.values()], sum = k => usage.reduce((s, u) => s + (u[k] || 0), 0);
  return {
    calls: usage.length,
    output_tokens: sum('output_tokens'),
    peak_context: usage.reduce((mx, u) => Math.max(mx, (u.input_tokens || 0) + (u.cache_read_input_tokens || 0) + (u.cache_creation_input_tokens || 0)), 0),
    cache_read_tokens: sum('cache_read_input_tokens'),
    active_minutes: +(activeMs / 60000).toFixed(1),
  };
}

export function judge(metrics, budget = {}) {
  const rows = METRICS.map(k => {
    const warn = budget.warn?.[k] ?? null, stop = budget.stop?.[k] ?? null, v = metrics[k];
    const status = stop !== null && v >= stop ? 'OVER' : warn !== null && v >= warn ? 'WARN' : warn === null && stop === null ? '-' : 'ok';
    return { metric: k, value: v, warn, stop, status };
  });
  const verdict = !thresholdsSet({ budget }) ? 'UNKNOWN' : rows.some(r => r.status === 'OVER') ? 'OVER' : rows.some(r => r.status === 'WARN') ? 'WARN' : 'OK';
  return { verdict, rows };
}

export const REMEDY = {
  OK: 'Within budget. Proceed to the next phase.',
  WARN: 'Past a warn threshold. Finish the current phase, write state to studio.md, and start the next phase in a fresh session.',
  OVER: 'Past a stop threshold. Stop building. Write a handoff in studio.md and tell the user; continue only in a fresh session or with their explicit OK.',
  UNKNOWN: 'No budget thresholds in the overlay, so no verdict. These numbers are the measurement; record them and set thresholds from a measured run.',
};

// Claude Code keys transcripts by the launch directory; walk up so a cd into a subdirectory still finds it.
// KNOWN LIMITATION (found in the row-9 clean-room test): this walk can reach an ancestor
// directory whose slugified path happens to collide with an unrelated session's real
// project slug (observed inside a deeply nested scratch/tmp path whose own directory
// naming embeds a slug-like segment). The result is auto-detecting a real but unrelated
// transcript with misleading numbers, not a crash — but always pass --transcript
// explicitly in any non-interactive or scripted context (hooks already do this). The
// printed/JSON `transcript` field always names the file actually used, so a caller can
// audit which one was picked.
export function findTranscript(cwd = process.cwd()) {
  const projects = path.join(process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), '.claude'), 'projects');
  for (let dir = path.resolve(cwd); ; dir = path.dirname(dir)) {
    const slugDir = path.join(projects, dir.replace(/[^A-Za-z0-9]/g, '-'));
    const files = fs.existsSync(slugDir) ? fs.readdirSync(slugDir).filter(f => f.endsWith('.jsonl')).map(f => path.join(slugDir, f)) : [];
    if (files.length) return files.sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs)[0];
    if (dir === path.dirname(dir)) return null;
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2), opt = name => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
  const transcript = opt('--transcript') || process.env.CLAUDE_TRANSCRIPT || findTranscript();
  if (!transcript || !fs.existsSync(transcript)) { console.error(`no transcript found${transcript ? ` at ${transcript}` : ' for this directory'}; pass --transcript <session.jsonl>`); process.exit(1); }
  const overlay = loadOverlay(opt('--overlay') || defaultOverlayPath());
  const metrics = measure(transcript), { verdict, rows } = judge(metrics, overlay.data.budget);
  const phase = opt('--phase') || null;
  if (args.includes('--json')) console.log(JSON.stringify({ verdict, phase, transcript, overlay: overlay.exists ? overlay.file : null, metrics, rows, remedy: REMEDY[verdict] }, null, 2));
  else {
    console.log(`spend gate${phase ? ` [${phase}]` : ''}: ${verdict}`);
    console.log(`transcript: ${transcript}`);
    console.log(`overlay: ${overlay.exists ? overlay.file : 'none'}`);
    console.log('');
    console.log('| metric | value | warn | stop | status |');
    console.log('|---|---|---|---|---|');
    rows.forEach(r => console.log(`| ${r.metric} | ${r.value} | ${r.warn ?? '-'} | ${r.stop ?? '-'} | ${r.status} |`));
    console.log('');
    console.log(REMEDY[verdict]);
  }
  const log = opt('--log');
  if (log) fs.appendFileSync(log, `- ${new Date().toISOString()} ${phase || 'gate'}: ${verdict} (${METRICS.map(k => `${k}=${metrics[k]}`).join(', ')})\n`);
  process.exit({ OK: 0, UNKNOWN: 0, WARN: 3, OVER: 4 }[verdict]);
}
