const wav = buffer => {
  const channels = buffer.numberOfChannels, frames = buffer.length, bytes = 44 + frames * channels * 2, data = new ArrayBuffer(bytes), view = new DataView(data);
  const text = (offset, value) => [...value].forEach((char, index) => view.setUint8(offset + index, char.charCodeAt(0)));
  text(0, 'RIFF'); view.setUint32(4, bytes - 8, true); text(8, 'WAVEfmt '); view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, channels, true); view.setUint32(24, buffer.sampleRate, true); view.setUint32(28, buffer.sampleRate * channels * 2, true); view.setUint16(32, channels * 2, true); view.setUint16(34, 16, true); text(36, 'data'); view.setUint32(40, frames * channels * 2, true);
  let offset = 44; for (let frame = 0; frame < frames; frame++) for (let channel = 0; channel < channels; channel++) { const value = Math.max(-1, Math.min(1, buffer.getChannelData(channel)[frame])); view.setInt16(offset, value < 0 ? value * 32768 : value * 32767, true); offset += 2; }
  return new Blob([data], { type: 'audio/wav' });
};

export function createAudioPrimitives(context, destination) {
  const envelope = (time, peak, attack, decay) => { const gain = context.createGain(); gain.gain.setValueAtTime(.0001, Math.max(0, time - .001)); gain.gain.linearRampToValueAtTime(peak, time + attack); gain.gain.exponentialRampToValueAtTime(.0001, time + attack + decay); gain.connect(destination); return gain; };
  return {
    tone(time, frequency, { duration = .18, gain = .12, type = 'sine' } = {}) { const oscillator = context.createOscillator(); oscillator.type = type; oscillator.frequency.setValueAtTime(frequency, time); oscillator.connect(envelope(time, gain, .004, duration)); oscillator.start(time); oscillator.stop(time + duration + .05); },
    click(time, gain = .07) { this.tone(time, 1700, { duration: .04, gain, type: 'triangle' }); },
    sweep(time, end, startHz, endHz, gain = .08) { const oscillator = context.createOscillator(); oscillator.type = 'sine'; oscillator.frequency.setValueAtTime(startHz, time); oscillator.frequency.exponentialRampToValueAtTime(endHz, end); oscillator.connect(envelope(time, gain, .01, end - time)); oscillator.start(time); oscillator.stop(end + .05); },
  };
}

export async function renderDemoSoundtrack(config, timeline) {
  const sampleRate = 48000, context = new OfflineAudioContext(2, Math.ceil(sampleRate * config.duration), sampleRate), master = context.createGain(); master.gain.value = .65; master.connect(context.destination);
  const sound = createAudioPrimitives(context, master);
  for (let time = 0, index = 0; time < config.duration; time += timeline.beat, index++) { sound.tone(time, index % 4 === 0 ? 110 : 220, { duration: timeline.beat * .55, gain: .12, type: index % 2 ? 'triangle' : 'sine' }); sound.click(time + timeline.beat / 2, .045); }
  sound.sweep(Math.max(0, config.duration - timeline.beat), config.duration - .03, 240, 1600, .09);
  return wav(await context.startRendering());
}
