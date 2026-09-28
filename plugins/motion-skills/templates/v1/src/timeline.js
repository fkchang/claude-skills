export function createTimeline(config, { beatsPerBar = 4 } = {}) {
  const beat = 60 / config.bpm;
  const bar = beat * beatsPerBar;
  return Object.freeze({
    bpm: config.bpm, beat, bar, duration: config.duration, beatsPerBar,
    at: (barIndex, beatIndex = 0, sixteenth = 0) => barIndex * bar + beatIndex * beat + sixteenth * beat / 4,
    progress: time => Math.max(0, Math.min(1, time / config.duration)),
  });
}
