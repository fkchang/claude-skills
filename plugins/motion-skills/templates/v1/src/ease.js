export const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
export const lerp = (a, b, t) => a + (b - a) * t;
export const segment = (time, from, to) => clamp((time - from) / (to - from));
export const E = Object.freeze({
  linear: t => t,
  outQuad: t => 1 - (1 - t) ** 2,
  inOutCubic: t => t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2,
  outBack: (t, s = 1.70158) => 1 + (s + 1) * (t - 1) ** 3 + s * (t - 1) ** 2,
});
export function bezier(x1, y1, x2, y2) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const sampleX = u => ((ax * u + bx) * u + cx) * u;
  const sampleY = u => ((ay * u + by) * u + cy) * u;
  return t => { if (t <= 0) return 0; if (t >= 1) return 1; let lo = 0, hi = 1; for (let i = 0; i < 24; i++) { const u = (lo + hi) / 2; if (sampleX(u) < t) lo = u; else hi = u; } return sampleY((lo + hi) / 2); };
}
export const snap = bezier(.16, 1, .3, 1);
export const glide = bezier(.65, 0, .35, 1);
export const hash = value => { const x = Math.sin(value * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
export const noise1 = (x, seed = 0) => lerp(hash(Math.floor(x) + seed), hash(Math.floor(x) + 1 + seed), x - Math.floor(x)) * 2 - 1;
export function spring(time, frequency = 3, damping = .3) {
  if (time <= 0) return 0;
  const w = Math.PI * 2 * frequency, z = Math.min(damping, .999), wd = w * Math.sqrt(1 - z * z);
  return 1 - Math.exp(-z * w * time) * (Math.cos(wd * time) + z * w / wd * Math.sin(wd * time));
}
