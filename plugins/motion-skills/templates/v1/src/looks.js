export const tint = (spec, amount) => spec.map(value => value * amount);

export function createInkSet() {
  const paper = [0, 0, 0];
  return Object.freeze({ paper, ink0: [1, 0, 0], ink1: [0, 1, 0], ink2: [0, 0, 1], dark: [1, 1, 1], mix01: [1, 1, 0], mix02: [1, 0, 1], mix12: [0, 1, 1] });
}

export function steelGradient(context, x0, y0, x1, y1, strength = 1) {
  const gradient = context.createLinearGradient(x0, y0, x1, y1);
  gradient.addColorStop(0, `rgba(255,255,255,${strength * .18})`);
  gradient.addColorStop(.45, `rgba(255,255,255,${strength})`);
  gradient.addColorStop(.7, `rgba(255,255,255,${strength * .35})`);
  gradient.addColorStop(1, `rgba(255,255,255,${strength * .75})`);
  return gradient;
}

const header = `#version 300 es
precision highp float;
uniform sampler2D uInk0, uInk1, uInk2;
uniform vec3 uCol0, uCol1, uCol2, uPaper;
uniform vec2 uOff0, uOff1, uOff2, uRes;
uniform float uSeed, uWeight, uScale;
out vec4 frag;
float hash(vec2 p) { vec3 q = fract(vec3(p.xyx) * .1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
float noise(vec2 p) { vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f); return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1)),f.x),f.y); }
float density(sampler2D texture_, vec2 px, vec2 off) { return texture(texture_, (px-off)/uRes).a; }
`;

export const RISO_FRAGMENT = `${header}
float cover(sampler2D texture_, vec2 px, vec2 off, float salt) {
  float d=density(texture_,px,off); if(d<=0.) return 0.; vec2 gp=px/uScale;
  float grain=.5*hash(floor(gp)+salt*91.7+uSeed*13.1)+.5*noise(gp*.55+salt*17.3);
  return clamp((d-grain)/.35+.5,0.,1.)*(.91+.09*noise(gp/26.+salt));
}
void main(){ vec2 px=vec2(gl_FragCoord.x,uRes.y-gl_FragCoord.y); vec2 gp=px/uScale; float fiber=noise(gp/80.)*.6+noise(gp/12.)*.4; vec3 col=uPaper*(.987+.014*fiber); col*=mix(vec3(1),uCol0,cover(uInk0,px,uOff0,1.)); col*=mix(vec3(1),uCol1,cover(uInk1,px,uOff1,2.)); col*=mix(vec3(1),uCol2,cover(uInk2,px,uOff2,3.)); frag=vec4(pow(col,vec3(2.2))*uWeight,uWeight); }`;

export const ENAMEL_FRAGMENT = `${header}
float cover(sampler2D texture_, vec2 px, vec2 off) { return smoothstep(.015,.985,density(texture_,px,off)); }
void main(){ vec2 px=vec2(gl_FragCoord.x,uRes.y-gl_FragCoord.y); vec2 gp=px/uScale; float grain=(noise(gp/42.)-.5)*.018; vec3 col=clamp(uPaper+grain,0.,1.); col=mix(col,uCol0,cover(uInk0,px,uOff0)); col=mix(col,uCol1,cover(uInk1,px,uOff1)); col=mix(col,uCol2,cover(uInk2,px,uOff2)); frag=vec4(pow(col,vec3(2.2))*uWeight,uWeight); }`;

export const fragmentForLook = look => look === 'enamel' ? ENAMEL_FRAGMENT : RISO_FRAGMENT;
