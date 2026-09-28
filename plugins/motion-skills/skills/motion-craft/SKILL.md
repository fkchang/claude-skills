---
name: motion-craft
description: Recipes for choreographing the twelve principles of animation (plus kinetic variable-font type) in code, built on the motion-skills toolkit's easing, motion-helper, and type primitives. Use when designing or reviewing a beat, scene, or transition in a code-driven motion piece — squash and stretch, anticipation, staging, follow-through, arcs, timing, exaggeration, solid drawing, appeal, or a text reveal — and you want a recipe that reads well on screen instead of inventing motion from scratch.
---

# Motion Craft: The Twelve Principles as Code Recipes

This skill is choreography, not an engine. Every recipe below is built from primitives
that already exist in the toolkit at `plugins/motion-skills/templates/v1/`. Point at
that code; do not re-implement easing curves, spring functions, or type layout in a
scene script — import them.

## Building blocks (toolkit, not to be re-derived)

| Need | Toolkit export | Where |
|---|---|---|
| Named easing curves (hard-out settle, strong in-out) | `E.outQuad`, `E.inOutCubic`, `E.outBack`, `bezier(x1,y1,x2,y2)`, `snap`, `glide` | `templates/v1/src/ease.js` |
| Arrival with overshoot (a settle that rings past its target and decays) | `spring(time, frequency, damping)` | `templates/v1/src/ease.js` |
| Deterministic per-frame jitter/noise | `hash`, `noise1` | `templates/v1/src/ease.js` |
| Squash/stretch, camera moves, hand-shake, paths | `ball`, `stretch(vx, vy)`, `view`, `shake`, `polyline` | `templates/v1/src/kit.js` |
| The one clock (bars/beats/sixteenths on the music grid) | `createTimeline(config)` → `at(bar, beat, sixteenth)`, `progress(time)` | `templates/v1/src/timeline.js` |
| Ink separations, overprint mixing, per-ink gradients | `Painter.fill/stroke/fillStyled`, `tint`, `steelGradient` | `templates/v1/src/engine.js`, `templates/v1/src/looks.js` |
| Type as editable geometry | `layoutText`, `drawText(..., {each})`, `glyphPath`; optional `createHarfBuzzShaper` for a licensed variable font | `templates/v1/src/type.js` |

Two curves worth naming explicitly: `spring()` gives a decaying settle (good for
*arrivals*); a recipe that instead needs a jiggle that returns to rest after a hit
(a *wobble*, distinct from an arrival) is a small variant of the same damped
oscillator with a zero final target rather than the step response `spring()`
computes — write that variant in the project's own scene module next to the
recipe that needs it, the same way the project already owns its scenes; it is
choreography-specific, not a toolkit gap to fill here.

## Working method

1. Pick a beat range on the timeline: `at(bar, beat)` for the start, another `at(...)`
   call for the end. Cuts land on downbeats; hits land on the grid.
2. Pick 2-4 principles per beat, not one — the recipes below combine on purpose
   (anticipation almost always precedes an exaggerated pop; follow-through almost
   always trails a primary action).
3. Write `draw(P, t)` as a pure function of `t` only. No state carried between calls:
   simulations are closed-form or integrated from `t=0` inside the call, every time.
4. Reach for a toolkit export by name before writing new math. If the toolkit truly
   lacks a primitive, that's a toolkit change (open on the toolkit, not inline here).

## The twelve principles

| # | Principle | Recipe |
|---|---|---|
| 1 | Squash and stretch | Preserve area (`sx = 1/sy`) and stretch along velocity (`stretch(vx, vy)` gives `rot = atan2(vy, vx) - pi/2`), capped near +60%. On a landing, squash amplitude falls off with distance from the contact point and the change (e.g. a word swap, a color change) happens at the deepest squash, where it's hidden by the extremity of the pose |
| 2 | Anticipation | A slow counter-move opposite the coming action (`E.inOutCubic` into a crouch/lean-back), a growing tremble, then stillness for the last sixteenth before the release lands on a downbeat. The pause reads as held breath only if the motion before it decelerates into it |
| 3 | Staging | One clear read at a time: darken everything but the subject, bring up a "light" cue on a hit, then iris or push the camera onto what matters. Compete for attention with only one moving thing per beat |
| 4 | Straight ahead and pose to pose | Pop hard keys on the grid (e.g. sixteenths 1, 9, and a breakdown key at 5), let `E.inOutCubic`/`spring` fill the inbetweens with parabolic spacing, then step the result at a fixed low frame rate (e.g. 24) over part of the beat so it reads like a pencil test cut against the smooth motion around it |
| 5 | Follow through and overlapping action | Trailing elements (letters, a cape, a tail) each run their own damped spring toward a rest offset from the primary mover, looser (lower frequency, higher damping) the further back they are. Clamp so a trailing element can't overtake the one ahead of it. Lean/skew comes from acceleration, not velocity, so the trail whips on a stop, not just on a move. A single coupled spring chain is unstable at speed — independent per-element springs plus a clamp is stable and reads the same |
| 6 | Slow in and slow out | Parameterize the path by arc length, then ease *time* along that length (not position directly), so spacing bunches near both ends of the move and opens in the middle. Dropping evenly-spaced "onion skin" copies of the mover makes the bunching visible for review |
| 7 | Arcs | Living things move on curves, not lines. Drive a swing angle with `E.inOutCubic`/`inOutSine`-shaped easing around a pivot, and keep any camera move during the arc centred on the same pivot so nothing appears to jump |
| 8 | Secondary action | Add a second, smaller motion driven by the same primary event, on the same beat but not the same axis — a sound cue fired by a landing, an ear that flops half a beat after a head turn. It reinforces the primary action; it never competes with or delays it |
| 9 | Timing | Fewer or more frames between the same two poses changes weight and mood, not just speed. Concentric or repeating elements driven by one shared eased phase (each at a different multiple of that phase) read as one coordinated system rather than independent movers, and should realign on a downbeat |
| 10 | Exaggeration | Push a value (scale, angle, color saturation) past what's physically plausible using an overshooting curve (`E.outBack`, or `spring` with light damping) so each repetition goes further, with a small tremble as a tell just before the biggest one |
| 11 | Solid drawing | Even in a flat/graphic style, imply volume: an overprinted shadow gradient under the form, a highlight opposite the implied light, a cast shadow that moves with the form's projected position, not its center. Construction/perspective aids (front element solid, hidden/back element dashed) sell three-dimensionality without full 3D geometry |
| 12 | Appeal | Give the subject a moment of "looking" — a beat where it appears to notice the camera or the viewer, ideally right at the end. A small imperfection (an asymmetric wink, a slightly-off landing) reads as characterful, not sloppy, when it's the only imperfection in an otherwise precise piece |

## Transitions that carry a subject across a cut

Whip pan (heavy motion blur while content moves under it), iris in/out, exit one
side and enter the other on a downbeat, match position (subject holds screen
position while the world changes around it), a disc wipe, a collapse to a point,
a hard pop, and a morph (one form shrinks/reshapes into the next). Any camera move
spanning a hand-off is centred on the hand-off point so the subject never jumps at
the cut.

## Type in motion

- A variable font's width/weight axis (where available via `createHarfBuzzShaper`)
  lets a letter genuinely squash and stretch without distorting its strokes — drive
  the axis per letter, not globally, so the effect can ripple across a word.
- Physical contact (a bounce landing on a letter, a squash against a baseline) must
  use the actual glyph top under the object: lowercase x-height sits meaningfully
  lower than a cap height, and using the wrong one reads as a mis-timed hit.
- Reveals: letters entering from under a baseline clip with a small overshoot
  (`E.outBack`) staggered roughly 20-35 ms apart read as lively without looking
  jittery; much less stagger reads as one block, much more reads as unrelated.

## Handoff — clean-room verification (coordinator runs this)

Acceptance criterion 1 (a clean-room agent given ONLY this skill can correctly
apply three of the twelve principles to a new scene) needs a fresh agent with no
access to this conversation, the toolkit source, or any other doc. This builder
cannot run that in isolation from its own context, so it is left ungated here.

Runbook:
1. Spawn a fresh agent. Give it only the contents of this file (not the toolkit
   source, not the knowledge-base docs, not this conduct ledger).
2. Prompt: "Using only the attached skill, describe (in prose or pseudocode, no
   need to run code) how you would choreograph a 1-second beat where a single
   shape hands off into a second shape, applying anticipation, follow-through,
   and arcs. Name which toolkit export you'd reach for at each step."
3. Check the response against this rubric:
   - Anticipation: does it include a counter-move opposite the coming direction,
     before the main action, ending in a brief stillness?
   - Follow-through: does it describe a trailing element continuing to move
     after the primary shape stops, on its own damped spring, looser than the
     primary?
   - Arcs: does the handoff path curve rather than move in a straight line, with
     any camera move centred on the hand-off point?
   - Does it name real toolkit exports (`spring`, `stretch`, `E.outBack`, `at`,
     etc.) rather than inventing new primitives or describing raw trig from
     scratch?
4. Three-for-three on the rubric passes the criterion. Record the transcript
   excerpt and verdict in this task's ledger entry.
