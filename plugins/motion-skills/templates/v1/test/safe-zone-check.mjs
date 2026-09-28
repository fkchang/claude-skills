import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { platformPreset } from '../src/presets.js';
import { assertSafeZone } from '../src/safe-zones.js';

// A deterministic, browser-free 9:16 test render. The same bounds that are
// drawn in the SVG are checked, so this works where browser rendering is blocked.
const preset = platformPreset('meta-reels-1080x1920');
const elements = [
  { id: 'headline', x: 180, y: 360, width: 720, height: 160 },
  { id: 'hero', x: 216, y: 700, width: 648, height: 648 },
  { id: 'cta', x: 300, y: 1510, width: 480, height: 100 },
];
assert.equal(preset.width, 1080); assert.equal(preset.height, 1920);
const safe = assertSafeZone(elements, preset);
assert.deepEqual(safe, { x: 108, y: 192, width: 864, height: 1536 });
const rectangles = elements.map(({ id, x, y, width, height }) => `<rect id="${id}" x="${x}" y="${y}" width="${width}" height="${height}" rx="24"/>`).join('');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920"><rect width="1080" height="1920" fill="#171717"/><rect x="${safe.x}" y="${safe.y}" width="${safe.width}" height="${safe.height}" fill="none" stroke="#ffe040" stroke-width="8" stroke-dasharray="32 24"/><g fill="#e85b8f">${rectangles}</g></svg>`;
const artifact = path.resolve('artifacts/safe-zone-9x16-test-render.svg');
fs.mkdirSync(path.dirname(artifact), { recursive: true }); fs.writeFileSync(artifact, svg);
assert.ok(fs.existsSync(artifact)); assert.match(fs.readFileSync(artifact, 'utf8'), /width="1080" height="1920"/);
console.log(`safe-zone check passed: ${preset.id} 1080x1920, ${elements.length} key elements inside ${safe.width}x${safe.height} review zone`);
console.log('wrote artifacts/safe-zone-9x16-test-render.svg');
