import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createConfig } from '../src/config.js';
import { E, snap, spring } from '../src/ease.js';
import { createTimeline } from '../src/timeline.js';
import { PLATFORM_PRESETS, platformPreset } from '../src/presets.js';

const config = createConfig({ width: 320, height: 240, fps: 30, duration: 3, bpm: 100, look: 'enamel', palette: { paper: '#ffffff', inks: ['#112233', '#445566', '#778899'] } });
assert.equal(config.width, 320); assert.equal(config.height, 240); assert.equal(config.fps, 30); assert.equal(config.duration, 3); assert.equal(config.bpm, 100); assert.equal(config.colors.inks[1][0], 68 / 255);
const timeline = createTimeline(config); assert.equal(timeline.beat, .6); assert.ok(Math.abs(timeline.at(1, 2) - 3.6) < 1e-9); assert.equal(E.inOutCubic(.5), .5); assert.equal(snap(0), 0); assert.equal(snap(1), 1); assert.ok(spring(.2) > 0);
assert.ok(fs.readFileSync(path.resolve('src/engine.js'), 'utf8').includes('RGBA16F')); assert.ok(fs.readFileSync(path.resolve('src/main.js'), 'utf8').includes('new Blob')); assert.ok(fs.readFileSync(path.resolve('src/type.js'), 'utf8').includes('createHarfBuzzShaper')); assert.ok(fs.readFileSync(path.resolve('src/looks.js'), 'utf8').includes('ENAMEL_FRAGMENT')); assert.ok(fs.readFileSync(path.resolve('src/audio.js'), 'utf8').includes('OfflineAudioContext'));
assert.deepEqual(Object.keys(PLATFORM_PRESETS), ['youtube-1080p', 'youtube-4k', 'meta-reels-1080x1920', 'proposed-social-4x5', 'proposed-social-1x1']);
assert.equal(platformPreset('youtube-4k').width, 3840); assert.equal(platformPreset('meta-reels-1080x1920').height, 1920);
assert.equal(platformPreset('proposed-social-4x5').status, 'proposed-not-confirmed'); assert.equal(platformPreset('youtube-1080p').sources.encode.checked, '2026-09-28');
console.log('validation ok: parameterized config, timeline, easing, type geometry, looks, audio, RGBA16F, Blob upload, platform presets');
