// Deliberately simple vector alphabet: text stays editable geometry without a font dependency.
const GLYPHS = Object.freeze({
  A: 'M0,7L2,0L4,7M1,4L3,4', E: 'M4,0L0,0L0,7L4,7M0,3.5L3,3.5',
  G: 'M4,1Q3,0,2,0Q0,0,0,3.5Q0,7,2,7Q4,7,4,5L2,5',
  K: 'M0,0L0,7M4,0L0,3.5L4,7', M: 'M0,7L0,0L2,3L4,0L4,7',
  N: 'M0,7L0,0L4,7L4,0', O: 'M2,0Q0,0,0,3.5Q0,7,2,7Q4,7,4,3.5Q4,0,2,0',
  T: 'M0,0L4,0M2,0L2,7', I: 'M0,0L4,0M2,0L2,7M0,7L4,7',
  R: 'M0,7L0,0L2.5,0Q4,0,4,1.8Q4,3.5,2.5,3.5L0,3.5M2.3,3.5L4,7',
  S: 'M4,1Q3,0,1.5,0Q0,0,0,1.7Q0,3.5,2,3.5Q4,3.5,4,5.3Q4,7,2,7Q.7,7,0,6',
  U: 'M0,0L0,5Q0,7,2,7Q4,7,4,5L4,0', V: 'M0,0L2,7L4,0', Y: 'M0,0L2,3.5L4,0M2,3.5L2,7',
  ' ': '', '?': 'M0,1Q1,0,2.5,0Q4,0,4,1.7Q4,2.8,2,3.8L2,5M2,7L2,6.5',
});

export function glyphPath(character, unit) {
  const path = new Path2D(), tokens = (GLYPHS[character.toUpperCase()] || GLYPHS['?']).match(/[MLQ]|-?[\d.]+/g) || [];
  let i = 0, command = '';
  while (i < tokens.length) { if (/[MLQ]/.test(tokens[i])) command = tokens[i++]; const x = Number(tokens[i++]) * unit, y = Number(tokens[i++]) * unit; if (command === 'M') path.moveTo(x, y); else if (command === 'L') path.lineTo(x, y); else { const x2 = Number(tokens[i++]) * unit, y2 = Number(tokens[i++]) * unit; path.quadraticCurveTo(x, y, x2, y2); } }
  return path;
}
export function layoutText(text, size, tracking = .16) {
  const unit = size / 7, advance = 4 * unit + tracking * size;
  return { unit, advance, width: Math.max(0, text.length * advance - tracking * size), glyphs: [...text].map((character, index) => ({ character, index, x: index * advance })) };
}
export function drawText(P, text, x, baseline, size, spec, { align = .5, tracking = .16, each } = {}) {
  const layout = layoutText(text, size, tracking), start = x - layout.width * align;
  for (const glyph of layout.glyphs) { const options = each?.(glyph, layout) || {}; P.save(); P.translate(start + glyph.x + (options.dx || 0), baseline + (options.dy || 0)); P.scale(options.sx || 1, options.sy || 1); P.stroke(glyphPath(glyph.character, layout.unit), options.spec || spec, options.width || Math.max(1, layout.unit * .42), options.overprint); P.restore(); }
  return layout;
}

// Optional font-backed path shaping. Keep font bytes in the consuming project;
// this template deliberately ships no font files. The returned outlines use the
// same Path2D geometry contract as the portable block alphabet above.
export function createHarfBuzzShaper(hb, fontData) {
  const fonts = new Map(Object.entries(fontData).map(([key, bytes]) => {
    const face = new hb.Face(new hb.Blob(bytes)); return [key, { font: new hb.Font(face), upem: face.upem }];
  }));
  return {
    shape(fontKey, text, variations = {}) {
      const entry = fonts.get(fontKey); if (!entry) throw new Error(`Unknown font: ${fontKey}`);
      entry.font.setVariations(Object.entries(variations).map(([tag, value]) => new hb.Variation(tag, value)));
      const buffer = new hb.Buffer(); buffer.addText(text); buffer.guessSegmentProperties(); hb.shape(entry.font, buffer);
      const infos = buffer.getGlyphInfos(), positions = buffer.getGlyphPositions();
      return { upem: entry.upem, glyphs: infos.map((info, index) => ({ path: new Path2D(entry.font.glyphToPath(info.codepoint)), advance: positions[index].xAdvance, offsetX: positions[index].xOffset, offsetY: positions[index].yOffset })) };
    },
  };
}
