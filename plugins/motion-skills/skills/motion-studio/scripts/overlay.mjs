#!/usr/bin/env node
// Reads the operator's motion overlay (Markdown + YAML-subset front matter).
// Usage: overlay.mjs check | brand [slug] | budget | path   [--file F]
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const METRICS = ['calls', 'output_tokens', 'peak_context', 'cache_read_tokens', 'active_minutes'];
export const LOOKS = ['riso', 'enamel'];
const HEX = /^#[0-9a-f]{6}$/i;

export const expandHome = p => (typeof p === 'string' && p.startsWith('~/') ? path.join(os.homedir(), p.slice(2)) : p);
export const defaultOverlayPath = () => process.env.MOTION_OVERLAY || path.join(process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), '.claude'), 'motion-overlay.md');

function stripComment(line) {
  let quote = null;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (quote) { if (c === quote) quote = null; }
    else if (c === '"' || c === "'") quote = c;
    else if (c === '#' && (i === 0 || /\s/.test(line[i - 1]))) return line.slice(0, i);
  }
  return line;
}

function scalar(raw) {
  const v = raw.trim();
  if (v === '' || v === 'null' || v === '~') return null;
  if (v === 'true') return true;
  if (v === 'false') return false;
  if (/^-?\d+(\.\d+)?$/.test(v)) return Number(v);
  if (/^(".*"|'.*')$/.test(v)) return v.slice(1, -1);
  if (v.startsWith('[') && v.endsWith(']')) {
    const body = v.slice(1, -1).trim();
    return body ? body.split(',').map(scalar) : [];
  }
  return v;
}

// YAML subset: nested maps by indentation, scalars, inline [a, b] lists. No dependencies.
export function parseFrontMatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) throw new Error('overlay has no YAML front matter (--- ... ---)');
  const root = {}, stack = [{ indent: -1, node: root }];
  match[1].split(/\r?\n/).forEach((original, index) => {
    const line = stripComment(original).replace(/\s+$/, '');
    if (!line.trim()) return;
    const indent = line.length - line.trimStart().length;
    const m = line.trim().match(/^([A-Za-z0-9_-]+):(?:\s+(.*))?$/);
    if (!m) throw new Error(`front matter line ${index + 2}: expected "key: value", got "${original.trim()}"`);
    while (stack.length > 1 && stack.at(-1).indent >= indent) stack.pop();
    const parent = stack.at(-1).node;
    if (m[2] === undefined || m[2] === '') { parent[m[1]] = {}; stack.push({ indent, node: parent[m[1]] }); }
    else parent[m[1]] = scalar(m[2]);
  });
  return root;
}

export function loadOverlay(file = defaultOverlayPath()) {
  if (!fs.existsSync(file)) return { file, exists: false, data: {} };
  return { file, exists: true, data: parseFrontMatter(fs.readFileSync(file, 'utf8')) };
}

export function validate(data) {
  const errors = [], warnings = [];
  if (data.schema !== 1) errors.push('schema must be 1');
  const brands = data.brands && typeof data.brands === 'object' ? data.brands : {};
  if (!Object.keys(brands).length) warnings.push('no brands defined');
  for (const [slug, b] of Object.entries(brands)) {
    if (!LOOKS.includes(b.look)) errors.push(`brands.${slug}.look must be one of ${LOOKS.join('|')}`);
    if (!b.palette || !HEX.test(b.palette.paper)) errors.push(`brands.${slug}.palette.paper must be #rrggbb`);
    if (!Array.isArray(b.palette?.inks) || b.palette.inks.length !== 3 || !b.palette.inks.every(c => HEX.test(c))) errors.push(`brands.${slug}.palette.inks must be exactly three #rrggbb colors (the toolkit's three separations)`);
    for (const [k, c] of Object.entries(b.tokens || {})) if (!HEX.test(c)) errors.push(`brands.${slug}.tokens.${k} must be #rrggbb`);
  }
  if (data.default_brand != null && !brands[data.default_brand]) errors.push(`default_brand "${data.default_brand}" is not in brands`);
  for (const level of ['warn', 'stop']) {
    const block = data.budget?.[level] || {};
    for (const [k, v] of Object.entries(block)) {
      if (!METRICS.includes(k)) warnings.push(`budget.${level}.${k} is not a known metric (${METRICS.join(', ')})`);
      else if (v !== null && !(typeof v === 'number' && v > 0)) errors.push(`budget.${level}.${k} must be a positive number or null`);
    }
  }
  if (!thresholdsSet(data)) warnings.push('no budget thresholds set: the spend gate will report only (verdict UNKNOWN)');
  return { errors, warnings };
}

export const thresholdsSet = data => ['warn', 'stop'].some(l => Object.values(data.budget?.[l] || {}).some(v => typeof v === 'number'));

export function brand(data, slug = data.default_brand) {
  if (!slug) throw new Error('no brand slug given and no default_brand in overlay');
  const b = data.brands?.[slug];
  if (!b) throw new Error(`brand "${slug}" not found in overlay (have: ${Object.keys(data.brands || {}).join(', ') || 'none'})`);
  return { slug, look: b.look, palette: { paper: b.palette.paper, inks: b.palette.inks }, tokens: b.tokens || {}, fonts: b.fonts || {}, logo: b.logo ?? null, sound_logo: b.sound_logo ?? null, notes: b.notes ?? null };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2), fi = args.indexOf('--file');
  const file = fi >= 0 ? args.splice(fi, 2)[1] : defaultOverlayPath();
  const [command = 'check', slug] = args;
  const overlay = loadOverlay(file);
  if (command === 'path') { console.log(overlay.file); process.exit(0); }
  if (!overlay.exists) { console.error(`no overlay at ${overlay.file} (copy motion-overlay.example.md there to add brands and budget)`); process.exit(command === 'check' ? 0 : 1); }
  if (command === 'check') {
    const { errors, warnings } = validate(overlay.data);
    warnings.forEach(w => console.log(`warn: ${w}`));
    errors.forEach(e => console.log(`error: ${e}`));
    console.log(errors.length ? `INVALID ${overlay.file}` : `ok ${overlay.file} (brands: ${Object.keys(overlay.data.brands || {}).join(', ') || 'none'})`);
    process.exit(errors.length ? 1 : 0);
  }
  if (command === 'brand') { console.log(JSON.stringify(brand(overlay.data, slug), null, 2)); process.exit(0); }
  if (command === 'budget') { console.log(JSON.stringify(overlay.data.budget || {}, null, 2)); process.exit(0); }
  console.error('usage: overlay.mjs check | brand [slug] | budget | path  [--file F]'); process.exit(1);
}
