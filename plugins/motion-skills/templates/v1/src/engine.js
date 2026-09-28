import { createInkSet, fragmentForLook } from './looks.js';

const VERTEX = `#version 300 es
void main(){ vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2); gl_Position=vec4(p*2.-1.,0.,1.); }`;
const OUTPUT = `#version 300 es
precision highp float; uniform sampler2D uAcc; uniform vec2 uRes; out vec4 frag;
void main(){vec4 a=texture(uAcc,gl_FragCoord.xy/uRes);frag=vec4(pow(a.rgb/max(a.a,1e-5),vec3(1./2.2)),1.);}`;
const plate = [[1.1, -.6], [-.9, .7], [.5, 1.2]];
const hash = value => { const x = Math.sin(value * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

export class Painter {
  constructor(contexts) { this.cs = contexts; this.inks = createInkSet(); }
  save() { this.cs.forEach(context => context.save()); }
  restore() { this.cs.forEach(context => context.restore()); }
  translate(x, y) { this.cs.forEach(context => context.translate(x, y)); }
  rotate(angle) { this.cs.forEach(context => context.rotate(angle)); }
  scale(x, y = x) { this.cs.forEach(context => context.scale(x, y)); }
  #paint(spec, overprint, callback) { this.cs.forEach((context, index) => { if (!overprint) { context.globalCompositeOperation = 'destination-out'; context.globalAlpha = 1; callback(context); context.globalCompositeOperation = 'source-over'; } if (spec[index] > .001) { context.globalAlpha = Math.min(1, spec[index]); callback(context); } context.globalAlpha = 1; }); }
  fill(path, spec, overprint = false, rule = 'nonzero') { this.#paint(spec, overprint, context => context.fill(path, rule)); }
  stroke(path, spec, width, overprint = false) { this.#paint(spec, overprint, context => { context.lineWidth = width; context.lineCap = 'round'; context.lineJoin = 'round'; context.stroke(path); }); }
  fillStyled(path, styleFor) { this.cs.forEach((context, index) => { const style = styleFor(index, context); if (style) { context.save(); context.fillStyle = style; context.fill(path); context.restore(); } }); }
}

export class Stage {
  constructor(config, draw) {
    this.config = config; this.draw = draw; this.w = config.width; this.h = config.height;
    this.separations = [0, 1, 2].map(() => new OffscreenCanvas(this.w, this.h));
    this.contexts = this.separations.map(canvas => canvas.getContext('2d'));
    this.P = new Painter(this.contexts); this.canvas = document.createElement('canvas'); this.canvas.width = this.w; this.canvas.height = this.h; document.body.append(this.canvas);
    const gl = this.gl = this.canvas.getContext('webgl2', { preserveDrawingBuffer: true, antialias: false, alpha: false });
    if (!gl || !gl.getExtension('EXT_color_buffer_float')) throw new Error('WebGL2 RGBA16F render targets are required');
    this.inkTextures = this.separations.map(() => this.#texture(gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE));
    this.accumulation = this.#texture(gl.RGBA16F, gl.RGBA, gl.HALF_FLOAT); this.framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer); gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.accumulation, 0); gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    this.print = this.#program(fragmentForLook(config.look)); this.output = this.#program(OUTPUT); this.vao = gl.createVertexArray(); this.pixels = new Uint8Array(this.w * this.h * 4);
  }
  #texture(internal, format, type) { const gl = this.gl, texture = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, texture); gl.texImage2D(gl.TEXTURE_2D, 0, internal, this.w, this.h, 0, format, type, null); [[gl.TEXTURE_MIN_FILTER, gl.LINEAR], [gl.TEXTURE_MAG_FILTER, gl.LINEAR], [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]].forEach(([key, value]) => gl.texParameteri(gl.TEXTURE_2D, key, value)); return texture; }
  #program(fragment) { const gl = this.gl, program = gl.createProgram(); [[gl.VERTEX_SHADER, VERTEX], [gl.FRAGMENT_SHADER, fragment]].forEach(([type, source]) => { const shader = gl.createShader(type); gl.shaderSource(shader, source); gl.compileShader(shader); if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader)); gl.attachShader(program, shader); }); gl.linkProgram(program); if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program)); const uniforms = {}; for (let i = 0; i < gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS); i++) { const name = gl.getActiveUniform(program, i).name; uniforms[name] = gl.getUniformLocation(program, name); } return { program, uniforms }; }
  render(time, { fps = this.config.fps, mb = 1, shutter = this.config.shutter } = {}) {
    const gl = this.gl, { uniforms } = this.print; gl.viewport(0, 0, this.w, this.h); gl.bindVertexArray(this.vao); gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT); gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE); gl.useProgram(this.print.program);
    for (let sample = 0; sample < mb; sample++) { const sampleTime = mb === 1 ? time : time + (sample + .5) / mb * shutter / fps; this.contexts.forEach(context => { context.setTransform(1, 0, 0, 1, 0, 0); context.clearRect(0, 0, this.w, this.h); }); const effects = this.draw(this.P, sampleTime, this) || {}; const seed = Math.floor(sampleTime * 15 + 1e-6); this.inkTextures.forEach((texture, index) => { gl.activeTexture(gl.TEXTURE0 + index); gl.bindTexture(gl.TEXTURE_2D, texture); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE, this.separations[index]); gl.uniform1i(uniforms[`uInk${index}`], index); gl.uniform3fv(uniforms[`uCol${index}`], this.config.colors.inks[index]); const boost = Math.max(0, (effects.misregistration || 1) - 1) * 4; gl.uniform2f(uniforms[`uOff${index}`], plate[index][0] + (hash(seed * 3 + index) - .5) * boost, plate[index][1] + (hash(seed * 7 + index) - .5) * boost); }); gl.uniform3fv(uniforms.uPaper, this.config.colors.paper); gl.uniform2f(uniforms.uRes, this.w, this.h); gl.uniform1f(uniforms.uSeed, seed % 97); gl.uniform1f(uniforms.uWeight, 1 / mb); gl.uniform1f(uniforms.uScale, 1); gl.drawArrays(gl.TRIANGLES, 0, 3); }
    gl.disable(gl.BLEND); gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.useProgram(this.output.program); gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, this.accumulation); gl.uniform1i(this.output.uniforms.uAcc, 0); gl.uniform2f(this.output.uniforms.uRes, this.w, this.h); gl.drawArrays(gl.TRIANGLES, 0, 3); if (gl.getError()) throw new Error('WebGL render error');
  }
  readPixels() { this.gl.readPixels(0, 0, this.w, this.h, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.pixels); return this.pixels; }
  png() { return new Promise(resolve => this.canvas.toBlob(resolve, 'image/png')); }
}
