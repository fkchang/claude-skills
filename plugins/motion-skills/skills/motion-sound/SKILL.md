---
name: motion-sound
description: Score and SFX synthesis driven from the same timeline as the picture (Web Audio OfflineAudioContext), cue recipes (kick, clap, hats, bass, stabs, plucks, boing, whoosh, slide whistle, pop, bell), and how to check loudness/true-peak/timing without ears. Points at the motion-skills toolkit's audio primitives and timeline clock. Use when scoring a code-driven motion piece, adding SFX tied to on-screen hits, or verifying a mix that can't be listened to.
---

# Motion Sound: Score and SFX From the Timeline, Checked Without Ears

## Approach

Render sound in the same headless page that renders the picture, from the same
clock, offline (faster than real time): a Web Audio `OfflineAudioContext` at
48kHz stereo, encoded to a 16-bit WAV in JS. Cues are driven by importing the
**same timeline constants** the picture uses (beat/bar times, a hit-envelope
function, a phase function) — retiming a scene retimes its sound automatically,
because both read from one source of truth.

Toolkit primitives (don't re-derive Web Audio node graphs in a scene script):

| Need | Toolkit export | Where |
|---|---|---|
| The shared clock (beat, bar, `at(bar, beat, sixteenth)`) | `createTimeline(config)` | `templates/v1/src/timeline.js` |
| A short enveloped tone, a click, a pitch sweep | `createAudioPrimitives(context, destination)` → `.tone()`, `.click()`, `.sweep()` | `templates/v1/src/audio.js` |
| A reference score built from those primitives, plus WAV encoding | `renderDemoSoundtrack(config, timeline)` | `templates/v1/src/audio.js` |

Compose new cues from `.tone()`/`.click()`/`.sweep()` and additional Web Audio
nodes (noise buffers, filters, panners) the same way `renderDemoSoundtrack` does
— as a project-level composition, not a toolkit rewrite.

## Cue recipes

| Sound | Recipe |
|---|---|
| Kick | Sine sweeping high to low (e.g. 160 to 46 Hz) over ~0.1s with a ~0.4s decay, plus a short high-passed noise click for attack |
| Clap | Several band-passed noise bursts a few milliseconds apart, the last with a longer tail sent to reverb |
| Hats | High-passed noise: short (~35ms) for closed, longer (~0.2s) for open |
| Bass | Saw through a resonant low-pass filter sweeping downward, layered with a sine an octave below |
| Stabs / pads | Detuned saw pairs through a low-pass filter, spread across the stereo field |
| Plucks | Triangle plus a quieter octave-down sine, medium decay, sent to reverb |
| Boing | Sine falling in pitch over tens of milliseconds with a fast vibrato |
| Whoosh / riser / zip | Band-passed noise with the filter frequency (and pan) ramped across the move it accompanies |
| Slide whistle | A sine whose pitch follows the *same* easing curve as the on-screen move — its shape is verifiable in a spectrogram against the picture's timeline |
| Pop | A very short high-passed noise burst plus a sub-frequency drop |
| Bell / chime | A few inharmonic sine partials (non-integer multiples of a fundamental) with independently falling decays |

Musical timing: hold silence for the sixteenth before a big hit so the hit reads
as landing on the grid, not just occurring; resolve any chord progression on the
final hit of the piece.

## Web Audio gotchas (paid for)

- `setValueCurveAtTime` throws if another automation event sits at its exact
  start time. Set a parameter's starting value with `.value` or an explicit
  `setValueAtTime` first, then layer ramps after it — never let two automation
  calls land on the same instant.
- Linear and exponential ramps continue from whatever automation event precedes
  them, so anchor every ramp's starting point explicitly with `setValueAtTime`
  at the note's start time.
- `exponentialRampToValueAtTime` can never reach exactly 0 — ramp to a very
  small value instead (e.g. `0.0001`).
- AAC encoding adds measurable inter-sample overshoot (on the order of 2 dB) on
  top of whatever peak the WAV already had. Limit at the final mux, not before:
  the toolkit's encoder already applies `alimiter` in `templates/v1/src/encode.mjs`.
  Re-measure the delivery file after encoding, not the pre-encode WAV.

## Checking the mix without ears

This is the acceptance bar for this skill: loudness and true peak are
**measured**, never asserted or "sounds about right." Run this against the
delivery file (not the intermediate WAV):

```sh
ffmpeg -i delivery.mp4 -af ebur128=peak=true -f null -
```

This reports integrated loudness (LUFS), loudness range, and true peak (dBTP).
Confirmed present on this toolkit's target platform:

```text
$ ffmpeg -hide_banner -filters | grep -i ebur128
 .. ebur128           A->N       EBU R128 scanner.
$ ffmpeg -hide_banner -filters | grep -i alimiter
 T. alimiter          A->A       Audio lookahead limiter.
```

Numeric targets to aim for, and how to check timing/shape without listening:

- Keep true peak at or below -1 dBTP after the AAC encode (see the AAC-overshoot
  gotcha above) — verify with the `ebur128=peak=true` output on the delivery
  file, not the pre-limiter mix.
- See the `social-video-delivery` skill for platform-level integrated-loudness
  targets and their citations; this skill's job is to produce a measurement, not
  to pin a platform's number.
- `ffmpeg -i audio.wav -lavfi showspectrumpic=s=1024x512 spectrum.png` to check
  cue timing and shape (a slide whistle's pitch curve, a riser's ramp, the gap
  before a drop) against the picture's timeline visually.
- `ffmpeg -i audio.wav -lavfi showwavespic=s=1024x512 wave.png` to check level
  balance across sections at a glance.

## Handoff

None expected — the `ebur128`/`alimiter` commands above are runnable as shown;
run them against a real delivery file to produce the numeric evidence for this
task's ledger entry.
