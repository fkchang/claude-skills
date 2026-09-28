#!/usr/bin/env node
// Template mode: copy the newest toolkit template into a new project and mark it as motion work.
// Usage: scaffold.mjs <target-dir> [--brand slug] [--template vN] [--overlay F]
//        scaffold.mjs --mark-only <dir>        (mark an existing directory as motion work)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { loadOverlay, defaultOverlayPath, brand as brandFrom } from './overlay.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const pluginRoot = path.resolve(here, '../../..');
const templatesDir = path.join(pluginRoot, 'templates');
export const MARKER = '.motion-skills';
const COPY_SKIP = new Set(['node_modules', 'out']);

export function latestTemplate(dir = templatesDir) {
  const versions = fs.readdirSync(dir).filter(n => /^v\d+$/.test(n)).sort((a, b) => Number(a.slice(1)) - Number(b.slice(1)));
  if (!versions.length) throw new Error(`no vN template directories in ${dir}`);
  return versions.at(-1);
}

const pluginVersion = () => { try { return JSON.parse(fs.readFileSync(path.join(pluginRoot, '.claude-plugin/plugin.json'), 'utf8')).version; } catch { return 'unknown'; } };

export function writeMarker(dir, { template = 'none', brand = 'none' } = {}) {
  const body = [
    '# motion-skills marker: this directory tree is motion work (read by the budget guard hook).',
    'schema: 1',
    `template: ${template}`,
    `plugin_version: ${pluginVersion()}`,
    `brand: ${brand}`,
    `scaffolded: ${new Date().toISOString()}`,
    '',
  ].join('\n');
  fs.writeFileSync(path.join(dir, MARKER), body);
  return path.join(dir, MARKER);
}

const STUDIO = ({ template, brand }) => `# Studio log

Motion project scaffolded from template ${template}${brand !== 'none' ? `, brand \`${brand}\`` : ''}. This file is the project's
memory across sessions: each phase starts in a fresh session that reads this file first.

## Brief

- Deliverables (preset ids):
- Duration / BPM:
- Message (one line):
- Must-haves:
- Brand:

## Beat grid

| bar.beat | time (s) | event |
|---|---|---|

## Phases

- [ ] brief (user confirmed)
- [ ] beat grid
- [ ] style frame (user approved)
- [ ] build
- [ ] review
- [ ] sound
- [ ] deliver

## Decisions

## Spend log

`;

// Rewrites the copied template's palette/look defaults, then imports the result to prove it took.
async function applyBrand(target, b) {
  const file = path.join(target, 'src/config.js');
  const src = fs.readFileSync(file, 'utf8');
  const palette = `export const DEFAULT_PALETTE = Object.freeze({\n  paper: '${b.palette.paper}',\n  inks: [${b.palette.inks.map(c => `'${c}'`).join(', ')}],\n});`;
  const next = src.replace(/export const DEFAULT_PALETTE = Object\.freeze\(\{[\s\S]*?\}\);/, palette).replace(/look: '[a-z]+',/, `look: '${b.look}',`);
  if (next === src) return `brand not applied: src/config.js did not match the expected DEFAULT_PALETTE / look shape; wire brand.json in by hand`;
  fs.writeFileSync(file, next);
  const { createConfig } = await import(`${pathToFileURL(file).href}?t=${Date.now()}`);
  const c = createConfig();
  if (c.look !== b.look || c.palette.paper !== b.palette.paper || c.palette.inks.join() !== b.palette.inks.join()) {
    fs.writeFileSync(file, src);
    return 'brand not applied: patched config did not round-trip, restored original; wire brand.json in by hand';
  }
  return `brand applied to src/config.js (look=${c.look}, paper=${c.palette.paper}, inks=${c.palette.inks.join(',')})`;
}

async function main(argv) {
  const opt = name => { const i = argv.indexOf(name); return i >= 0 ? argv.splice(i, 2)[1] : undefined; };
  if (argv[0] === '--mark-only') {
    const dir = argv[1];
    if (!dir || !fs.statSync(dir, { throwIfNoEntry: false })?.isDirectory()) throw new Error('--mark-only needs an existing directory');
    console.log(`wrote ${writeMarker(path.resolve(dir))}`);
    return;
  }
  const slug = opt('--brand'), template = opt('--template') || latestTemplate(), overlayFile = opt('--overlay') || defaultOverlayPath();
  const target = argv[0] && path.resolve(argv[0]);
  if (!target) throw new Error('usage: scaffold.mjs <target-dir> [--brand slug] [--template vN] [--overlay F] | --mark-only <dir>');
  const source = path.join(templatesDir, template);
  if (!fs.existsSync(source)) throw new Error(`template ${template} not found in ${templatesDir}`);
  if (fs.existsSync(target) && fs.readdirSync(target).length) throw new Error(`${target} exists and is not empty; pick a new directory or use --mark-only`);
  let b = null;
  if (slug) b = brandFrom(loadOverlay(overlayFile).data, slug);

  fs.cpSync(source, target, { recursive: true, filter: src => !COPY_SKIP.has(path.basename(src)) });
  console.log(`copied template ${template} -> ${target}`);
  if (b) {
    fs.writeFileSync(path.join(target, 'brand.json'), JSON.stringify(b, null, 2) + '\n');
    console.log(await applyBrand(target, b));
  }
  console.log(`wrote ${writeMarker(target, { template, brand: b ? b.slug : 'none' })}`);
  fs.writeFileSync(path.join(target, 'studio.md'), STUDIO({ template, brand: b ? b.slug : 'none' }));
  console.log(`wrote ${path.join(target, 'studio.md')}`);
  console.log(`next: cd ${target} && npm install && npm test`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main(process.argv.slice(2)).catch(e => { console.error(`scaffold: ${e.message}`); process.exit(1); });
