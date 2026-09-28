import { E, segment, spring } from './ease.js';
import { ball, polyline, shake, stretch, view } from './kit.js';
import { steelGradient, tint } from './looks.js';
import { drawText } from './type.js';

export function drawSmoke(config, timeline) {
  return (P, time) => {
    const { width: w, height: h } = config, u = timeline.progress(time), pulse = Math.max(0, spring(time - .08, 3, .36));
    const [dx, dy] = shake(time, 1.2, 8); P.save(); view(P, { cx: w / 2, cy: h / 2, tx: dx, ty: dy, zoom: 1 + .025 * E.outQuad(u) });
    const line = polyline([[w * .12, h * .72], [w * .34, h * .48], [w * .58, h * .63], [w * .86, h * .31]]); P.stroke(line, P.inks.ink1, Math.max(2, w / 150), true);
    const x = w * (.16 + .68 * E.inOutCubic(u)), y = h * (.72 - .38 * Math.sin(Math.PI * u)); ball(P, x, y, Math.max(14, w * .045) * (1 + .1 * pulse), { ...stretch(Math.cos(Math.PI * u) * 700, -Math.sin(Math.PI * u) * 700), spec: P.inks.ink0 });
    drawText(P, 'MAKE', w / 2, h * .25, Math.max(30, w * .11), P.inks.dark, { each: glyph => ({ dy: Math.sin(time * 8 + glyph.index) * 3, sx: 1 + .05 * pulse }) });
    if (config.look === 'enamel') { const plate = new Path2D(); plate.roundRect(w * .19, h * .79, w * .62, h * .07, h * .02); P.fillStyled(plate, (_index, context) => steelGradient(context, w * .19, h * .79, w * .81, h * .86)); } else { const disk = new Path2D(); disk.arc(w * .84, h * .8, w * .065, 0, Math.PI * 2); P.fill(disk, tint(P.inks.mix12, .6), true); }
    P.restore(); return { misregistration: 1 + .25 * Math.max(0, Math.sin(time * Math.PI * 4)) };
  };
}
