import { platformPreset } from './presets.js';

const hex = value => {
  const clean = value.replace('#', '');
  if (!/^[0-9a-f]{6}$/i.test(clean)) throw new Error(`Invalid color: ${value}`);
  return [0, 2, 4].map(i => parseInt(clean.slice(i, i + 2), 16) / 255);
};

export const DEFAULT_PALETTE = Object.freeze({
  paper: '#f5f0e8',
  inks: ['#e85b8f', '#187bb4', '#efc83c'],
});

export function createConfig(overrides = {}) {
  const preset = overrides.preset ? platformPreset(overrides.preset) : undefined;
  const palette = { ...DEFAULT_PALETTE, ...(overrides.palette || {}) };
  if (!Array.isArray(palette.inks) || palette.inks.length !== 3) throw new Error('palette.inks must contain three colors');
  const config = {
    width: preset?.width || 640,
    height: preset?.height || 360,
    fps: preset?.fps || 24,
    duration: 2,
    bpm: 120,
    look: 'riso',
    shutter: 0.5,
    palette,
    ...overrides,
    palette,
  };
  for (const name of ['width', 'height', 'fps', 'duration', 'bpm']) {
    if (!(Number(config[name]) > 0)) throw new Error(`${name} must be positive`);
  }
  if (!['riso', 'enamel'].includes(config.look)) throw new Error('look must be riso or enamel');
  return Object.freeze({ ...config, colors: { paper: hex(palette.paper), inks: palette.inks.map(hex) } });
}

export function configFromQuery(query) {
  const getNumber = name => query.has(name) ? Number(query.get(name)) : undefined;
  const palette = query.has('palette')
    ? { inks: query.get('palette').split(',').slice(0, 3) }
    : undefined;
  const values = Object.fromEntries(Object.entries({
    preset: query.get('preset') || undefined,
    width: getNumber('width'), height: getNumber('height'), fps: getNumber('fps'),
    duration: getNumber('duration'), bpm: getNumber('bpm'), look: query.get('look') || undefined,
  }).filter(([, value]) => value !== undefined));
  return createConfig({ ...values, ...(palette ? { palette } : {}) });
}
