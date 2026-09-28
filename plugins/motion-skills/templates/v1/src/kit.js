import { hash } from './ease.js';

export function ball(P, x, y, radius, { sx = 1, sy = 1, rot = 0, spec = P.inks.ink0, overprint = false } = {}) {
  P.save(); P.translate(x, y); P.rotate(rot); P.scale(sx, sy);
  const path = new Path2D(); path.arc(0, 0, radius, 0, Math.PI * 2); P.fill(path, spec, overprint); P.restore();
}
export function stretch(vx, vy, amount = .002, max = .55) {
  const speed = Math.hypot(vx, vy), s = 1 + Math.min(max, speed * amount);
  return { sx: 1 / s, sy: s, rot: speed > 1 ? Math.atan2(vy, vx) - Math.PI / 2 : 0 };
}
export function view(P, { tx = 0, ty = 0, zoom = 1, rot = 0, cx, cy }) {
  P.translate(cx + tx, cy + ty); P.rotate(rot); P.scale(zoom); P.translate(-cx, -cy);
}
export function shake(time, amplitude, seed = 0) {
  const frame = Math.floor(time * 30);
  return [(hash(frame * 1.7 + seed) - .5) * 2 * amplitude, (hash(frame * 2.3 + seed + 9) - .5) * 2 * amplitude];
}
export function polyline(points) { const path = new Path2D(); points.forEach(([x, y], i) => i ? path.lineTo(x, y) : path.moveTo(x, y)); return path; }
