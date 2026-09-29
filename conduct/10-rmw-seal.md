# 10 — First RMW piece: seal sting

Status: in_progress
Reopened 2026-09-28: Forrest requested two more changes after approving v4 —
more chisel bass/resonance, and a new closing "sizzle burnaway" reveal into
the real photographic logo with a short musical motif. See Evidence below for
the v4-approval record; this addendum starts a new Evidence entry beneath it.
Output location (Forrest, 2026-09-28): inside the rmv project, at
`/Users/fkchang/work/entreprenural_ideas/rmv/motion/` (new directory, sibling
to `docs/`, `chatgpt_artifacts/`, `prototype/` — no existing `brand/` or
`motion/` convention there yet). NOT inside `claude-skills` (world-tier) and
NOT inside `agent_experiments/showreel`.
Depends on: 01 (toolkit), and Forrest's brand-kit values living in
`~/.claude/motion-overlay.md` (task 03 defines the overlay schema; this task
populates RMW's actual values there — NOT in the plugin).

## Plan

RIGOR: strict (gate: Forrest approves the seal before it animates)
LANE: rmw
Builder: Opus (per handoff — visual judgment; escalation above coordinator's own
Sonnet tier — approved by Forrest 2026-09-28)

Steps (from `~/work/agent_experiments/showreel/docs/motion-plugin.context.md`
scope row 10 and the "RMW brand kit status" section):

1. Redraw the seal as clean vector, in separate animatable parts (ring, phoenix,
   lettering) against `16-rmw-phoenix-rebirth-brand-identity-board.png` and the
   badge sheet inside `Redux_Motor_Works_Advertising_Deck.pptx` (see
   `~/work/agent_experiments/showreel/docs/rmv-inventory.md` for exact asset
   paths) — no auto-trace.
2. **GATE — STOP HERE**: present the vector redraw side by side with the
   reference art to Forrest for approval BEFORE any animation work.
3. Download the three OFL fonts (Barlow Condensed, IBM Plex Sans, Source Serif 4)
   from Google Fonts.
4. Build the brand kit tokens in `~/.claude/motion-overlay.md`: palette (carbon
   `#11110f`, ivory `#f7f4ed`, steel `#aaa79f`, oxblood `#7f1718`, seal red
   `#A63328`, cobalt-night `#063b64`, turquoise `#30c9c7` — per Forrest's
   2026-09-28 decision to use the shipped CSS values, not the site-grammar.md
   values), fonts, and the mid-century-enamel look reference (task 01). One
   named-token file, so a palette change is a one-line edit + re-render.
5. Build the 3-5s seal sting in 16:9, 9:16, and 1:1, with a silence-then-thunder
   sound logo ("wake the thunder" per the handoff's "Motion the docs already
   imply" note).

## Acceptance criteria

1. Forrest approves the seal redraw side by side with the reference (gate — see
   step 2 above; do not proceed past this without explicit approval).
2. The sting renders in all three formats (16:9, 9:16, 1:1).
3. It passes the loudness check (ebur128 peak) and the safe-zone check (task 02).

## Evidence

(append here — include the side-by-side comparison Forrest reviewed, and the
per-criterion render/measurement output)

### Step 1: vector redraw (Opus builder, 2026-09-28)

**What the reference actually shows (differs from the brief's "ring / phoenix / lettering"):**
There is no round ring and no pictorial phoenix anywhere in `16-rmw-phoenix-rebirth-brand-identity-board.png`
or the deck's `ppt/media/image-12-1.jpg` (1600x900, extracted with `unzip -p` to scratch; .pptx untouched).
The "phoenix-rebirth seal" is a **small square red chop**: rounded-square chrome bezel, black field, red
rounded-square border, and 鳳凰涅槃 in a 2x2 grid. It sits in the **primary badge**: winged shield with a
carbon plate, chrome "RMW" lettering, and xiangyun (auspicious cloud) scrolls on both sides. I redrew what
is there and did not invent a phoenix. Mapping to the brief: ring → `chop-border` (plus `frame` for the
badge's enclosing shield), phoenix emblem → the 鳳凰涅槃 chop itself, lettering → `lettering` (RMW) and
`chop-characters`.

**Built** (all in `/Users/fkchang/work/entreprenural_ideas/rmv/motion/seal/`). Every part uses the same
`0 0 1160 260` viewBox, so the layers line up exactly when stacked:

- `frame.svg`: wings (4 bars per side, mirrored), lower chrome sweeps, shield bezel, carbon plate. Sub-ids: `wings`, `lower-sweeps`, `shield-bezel`, `shield-plate`
- `clouds.svg`: xiangyun scrolls built as stroked spiral paths (semicircle-arc spirals), which suits a stroke-dashoffset draw-on
- `lettering.svg`: R, M, W as hand-placed polygons (`letter-R/M/W`)
- `chop-border.svg`: the chop's bezel, field, and red border
- `chop-characters.svg`: 鳳 凰 涅 槃 hand-built as uniform-weight stroked paths (`char-feng/huang/nie/pan`), also suitable for draw-on
- `seal-full.svg` + `seal-full.png` (1600x359): the full composite
- `chop-closeup.svg` + `chop-closeup.png` (800x800): the same chop art with a cropped viewBox
- `compare-badge.png` (reference above, redraw below) and `compare-chop.png` (reference left, redraw right): side-by-side review sheets
- `build.rb`: the single source. `ruby build.rb` regenerates every SVG and PNG, and the palette is one hash at the top

Colors: carbon `#11110f` (plate, chop field, outlines); ivory `#f7f4ed` and steel `#aaa79f` (chrome
gradients, with a carbon "horizon" stop for the chrome read); seal red `#A63328` (chop border and characters).
Oxblood is not used because the reference doesn't call for it. There is no auto-trace: every path is
hand-placed coordinates, and rendering uses rsvg-convert.

**Ambiguities / honest gaps:**

1. **Top-left character is garbled in the reference.** The AI art renders something like 蘭/鸞, not 鳳. I drew the correct 鳳 (几 + 一 + 鳥). The top-right (凰 = 几 + 皇), bottom-left (涅), and bottom-right (槃) are legible in the source and match.
2. **Reading order.** The reference lays the characters out in rows, left to right (鳳凰 / 涅槃). A traditional chop reads by column, right to left (TR↓, then TL↓), which in that layout would read 凰槃鳳涅. I kept the reference layout. Swapping to traditional column order is a one-line change in `CELLS`.
3. **Stroke weight and style.** The reference's characters are thinner, in a loose small-seal hand. Mine are a bit bolder (so they stay legible at badge size) and more regular. This is a style choice for Forrest.
4. **Chrome is simplified.** The reference is a photoreal render (brushed texture, bevels, drop shadows). The redraw is flat vector with a gradient suggesting chrome. The cloud scrolls are a simplified version of the reference's more ornate curls.
5. The brand wordmark bar ("REDUX MOTOR WORKS"), "Silent Thunder", and the ST emblem are **not** redrawn, because they are outside the seal scope.

rmv root is not a git repo (`git rev-parse` → fatal), so the files are on disk only and uncommitted.

### Step 1b: revision pass after Forrest's review (Opus builder, 2026-09-28)

Forrest's rulings: (a) the seal is the square red chop inside the winged RMW badge, with no separate phoenix
mark; (b) keep the corrected 鳳; (c) fix the grid; (d) use a lighter, more organic hand, with small and large
optical variants; (e) the brand is RMW, not RMV. The `rmv` folder path stays.

Changes (all in `/Users/fkchang/work/entreprenural_ideas/rmv/motion/seal/`, generated by `build.rb`):

- **Grid (c):** `CELLS` is now TL 涅, TR 鳳, BL 槃, BR 凰. Read right column first (TR↓BR, then TL↓BL), that gives 鳳凰涅槃. Checked visually in `compare-chop.png`. `chop-characters.svg` and `seal-full.svg` were rebuilt with it.
- **Stroke (d):**
  - Each subpath gets its own stroke width, and each distinct point is nudged by a seeded jitter. Shared points move together, so boxes and joins stay closed.
  - Round caps and joins soften the corners.
  - The output is deterministic: the same seed gives the same art.
  - It is lighter overall: seal-small averages 4.4 units (was a uniform 5), with a red border of 6.5 (was 7).
- **Variants (d):**
  - `seal-small.svg` / `seal-small.png`: width 4.4±0.5, jitter ±0.6, border 6.5. Tuned for badge sizes, and it is the variant the badge layers (`chop-characters.svg`, `chop-border.svg`, `seal-full.svg`) use.
  - `seal-large.svg` / `seal-large.png`: width 2.9±0.5, jitter ±1.0, border 4.5. Closer to the reference's finer hand.
  - Both are standalone 200x200 chops with `chop-border` and `chop-characters` groups (`char-*` per character), so they can be animated independently.
  - "Simpler" in small is weight only, not fewer strokes. At 90px every stroke still resolves, so I didn't drop any.
- **Removed:** `chop-closeup.svg` / `chop-closeup.png` (superseded by `seal-small`/`seal-large`, and they had the old grid).
- **Unchanged:** frame, clouds, lettering, and `compare-badge.png` (the old chop grid still shows in its lower half; this pass didn't re-review the badge).
- **Review sheet:** `compare-chop.png`
  - Top row: reference, seal-small and seal-large, each at 600px.
  - Middle row: small and large at the actual badge size (90px).
  - Bottom row: the full badge with the corrected chop.

Remaining judgment calls: seal-small's border stays heavier than the reference's, for small-size legibility.
The jitter is subtle on purpose. If Forrest wants a rougher, carved-stone feel, raise `jitter` in `VARIANTS`.

### Step 1c: carved-stone pass (Opus builder, 2026-09-28)

Forrest confirmed the grid (涅 鳳 / 槃 凰) and the variant usage: small for the badge and small renders,
large for hero and close-up shots. He asked for a noticeably rougher, carved-stone hand. Changes are in `build.rb`, which
is still deterministic (seeded):

- **Wobbling strokes:** every straight segment is split into up to 4 pieces, and the interior points are jittered (`wobble`), so lines waver along their length, not only at their ends.
- **Double ink pass:** each stroke is drawn twice, the second pass at 0.8x width with separate jitter. The overlap gives lumpy, uneven edges.
- **Hand-cut border:** the red border is now an irregular hand-cut polygon (a rounded square sampled every 6 units and jittered), also drawn with a double pass. It replaces the clean `rect`.
- **Wear mask:** small irregular 5-point chips are placed along the ink and applied as an SVG `<mask>` (`wear-chars`, `wear-border`), so they cut real transparent holes. The parts stay clean on any background, and the mask can be animated later (for example, a stamp reveal).
- **Per-variant degree:**

| Setting | small | large |
|---|---|---|
| jitter | 0.9 | 1.4 |
| wobble | 0.7 | 1.2 |
| chips on characters / border | 22 / 14 | 45 / 30 |
| where chips land | edges only | anywhere on the stroke, so some nearly break it |

Small stays more legible, and large erodes more.

- **Rebuilt:** `chop-border.svg`, `chop-characters.svg`, `seal-small.svg`/`.png`, `seal-large.svg`/`.png`, `seal-full.svg`/`.png` and `compare-chop.png`.
- **Checked visually:** the characters read at 90px in both variants. `rsvg-convert` renders the masks correctly, and `ruby -w` gives no warnings.
- **Caveat for later:** some motion or render tools handle SVG masks poorly. If one does, the chips can instead be baked in as field-colored overlays (carbon chips on top) with a small code change.

### Steps 3-5: fonts, overlay, seal sting (Opus builder, 2026-09-28)

**Step 3: fonts.** Downloaded from `github.com/google/fonts` (`ofl/`) into `/Users/fkchang/work/entreprenural_ideas/rmv/motion/fonts/`:

- `barlowcondensed/`: Regular, Medium, SemiBold, Bold, ExtraBold
- `ibmplexsans/`: `IBMPlexSans[wdth,wght].ttf` + Italic (variable)
- `sourceserif4/`: `SourceSerif4[opsz,wght].ttf` + Italic (variable)

Each folder has its `OFL.txt` (SIL OFL 1.1, confirmed from the headers). `file` reports all nine as TrueType, and `SHA256SUMS` pins them. Roles come from the inventory: Barlow Condensed display, Plex Sans body, Source Serif 4 editorial.

**Step 4: overlay.** Wrote `~/.claude/motion-overlay.md` to the task-03 schema:

- Brand `rmw` is the default, with the enamel look.
- Palette: paper carbon `#11110f`, and inks steel `#aaa79f`, ivory `#f7f4ed` and seal red `#A63328` (stack order ink0 to ink2).
- All seven named tokens are there: carbon, ivory, steel, oxblood, seal_red, cobalt_night `#063b64`, turquoise `#30c9c7`.
- Also: the fonts with their paths, `logo` pointing at `motion/seal/`, a `sound_logo` line, notes, and the outputs paths.
- Budget thresholds are null (no measured baseline yet).
- `node scripts/overlay.mjs check` gives `ok ... (brands: rmw)`, with a warning that no budget thresholds are set. `overlay.mjs brand rmw` round-trips.

**Step 5: sting.**

- **Scaffold:** `scaffold.mjs /Users/fkchang/work/entreprenural_ideas/rmv/motion/sting --brand rmw` applied the RMW palette and look to `src/config.js`. Then `npm install` and `npm test` passed.
- **How it draws:** `seal/` is a symlink to `../seal`, so the scene parses the approved SVGs at load. There is no redrawn copy of the art (`src/sting.js`: DOMParser to Path2D, with animation hooks keyed on SVG ids).
- **Brief and beat grid:** in `/Users/fkchang/work/entreprenural_ideas/rmv/motion/sting/studio.md`. 4.0 s at 120 BPM, 2 bars:
  - 0 to 2 s: silence while the chop (seal-large) inks in, reading order 鳳 凰 涅 槃.
  - 2.00 s: the thunder hit. Flash, snap pull-back to the full badge (seal-small), wings spring out, shake.
  - After that: the clouds fade in, a glint sweeps RMW, and the badge holds.
- **Sound:** `src/sting-audio.js`, deterministic seeded noise. A high-passed crack plus three crackles, an 85 to 30 Hz sine boom, and a rolling low-passed rumble that decays by about 3.9 s.
- **Toolkit additions** (logged in the studio.md Decisions as template-v2 candidates): `audio.js` exports `wav`, and `main.js` draws the sting.

**Criterion 2: renders in all three formats.**

- `node render.mjs video preset=<id> mb=4` gave 120 frames each for `youtube-1080p` (24 s), `meta-reels-1080x1920` (18 s) and `proposed-social-1x1` (15 s).
- `PRESET=<id> ./encode.sh` gave `/Users/fkchang/work/entreprenural_ideas/rmv/motion/deliver/rmw-seal-sting-16x9.mp4`, `-9x16.mp4` and `-1x1.mp4`.
- ffprobe on all three: h264 High, yuv420p, bt709 primaries/trc/matrix, 30/1, AAC-LC, duration 4.000000, and 120 decoded frames (`-count_frames`).
- Sizes: 16:9 is 1920x1080, 9:16 is 1080x1920, 1:1 is 1080x1080.
- 1:1 uses `proposed-social-1x1`, which the toolkit marks proposed-not-confirmed.

**Criterion 3a: loudness** (`ffmpeg -i <mp4> -af ebur128=peak=true -f null -` on each delivery):

| file | integrated | true peak | onset (silencedetect -60 dB) |
|---|---|---|---|
| 16x9 | -23.0 LUFS | -8.3 dBFS | 1.9995 s |
| 9x16 | -23.0 LUFS | -8.2 dBFS | 1.9989 s |
| 1x1 | -23.0 LUFS | -8.2 dBFS | 1.9989 s |

- Target, from `social-video-delivery`: -23 LUFS ±0.5, true peak at or below -1 dBTP. All three pass.
- The first draft measured -17.0 LUFS, so I dropped the master by 6 dB (0.5 to 0.25). No other mix changes.
- On the WAV, astats over 0 to 1.99 s reads peak -inf dB, so the pre-hit is true digital silence.

**Criterion 3b: safe zone** (`npm test`, which now includes `test/sting-safe-zone.mjs`):

- It reuses the toolkit's `platformPreset` and `assertSafeZone`, with no reimplementation.
- It checks every frame from 0.45 s to the hit (the close-up chop) and from 2.35 s to the end (the settled badge). Each box is taken at worst case, grown by the shake amplitude and including the wing overshoot.
- Output:
  - `youtube-1080p`: 97 frames ok; settled badge 1420x310 at (250,385).
  - `meta-reels-1080x1920`: 97 frames ok; settled badge 762x166 at (159,877).
  - `proposed-social-1x1`: 97 frames ok; settled badge 762x166 at (159,457).
- The 2.00 to 2.35 s pull-back is excluded as motion, not a resting message. A negative control at t=2.1 in 9:16 throws `Outside meta-reels-1080x1920 safe zone: badge`, so the check does detect a violation.
- Visual overlays: `/Users/fkchang/work/entreprenural_ideas/rmv/motion/sting/out/safezone-<preset>.png`, rendered with `reviewPreset=`.

**Review artifacts** (in `/Users/fkchang/work/entreprenural_ideas/rmv/motion/sting/out/`):

- `sheet-16x9.png`: 16-frame contact sheet.
- `still-closeup-16x9.png` and `still-final-16x9.png`: full-res stills.
- `mp4-frames-<16x9|9x16|1x1>.png`: frames 15/36/57/60/63/75/90/119, pulled from the encoded MP4s.

In my own check, the sheets show the seal inking in reading order, the flash at 2.00 s, a motion-blurred pull-back, and a settled badge whose corrected chop and wings match the approved `seal-full.png`. That is the author's check, not a review.

**Not gated here (per the "no shortcuts" rule; runbook in Handoff):**

- A fresh-reviewer pass (motion-studio phase 5) has not run.
- Forrest has not approved the style frame or the motion.
- Nobody has listened to the thunder. The meters prove level and timing, not character.
- Spend gate: UNKNOWN (no thresholds). A security hook blocked passing this builder's own `--transcript` path, and auto-detect read a different, likely coordinator, transcript. The numbers are logged in studio.md with that caveat.

## Handoff

**GATE CLEARED (2026-09-28).** Forrest approved the carved-stone pass as final,
via `compare-chop.png` presented on a StreamWeaver canvas
(`streamweaver canvas-push rmv-seal`). Verbatim: "I approve." Criterion 1 is
met. Proceeding to steps 3-5 (fonts, brand-kit overlay, seal sting animation).

### Handoff for steps 3-5 (builder, 2026-09-28): verification runbook

Status stays in_progress until the coordinator verifies.

1. **Re-run the numbers.**
   - `cd /Users/fkchang/work/entreprenural_ideas/rmv/motion/sting && npm test`: three sting safe-zone lines, all ok.
   - For each of the three files in `/Users/fkchang/work/entreprenural_ideas/rmv/motion/deliver/`: `ffmpeg -i <f> -af ebur128=peak=true -f null -` should give I = -23.0 and Peak at or below -1.
   - `ffprobe` should give 4.000 s, h264 High, bt709.
2. **Show Forrest (human gate, not CLI-provable).**
   - Play `/Users/fkchang/work/entreprenural_ideas/rmv/motion/deliver/rmw-seal-sting-16x9.mp4` with sound. Then the 9x16 and 1x1 files.
   - Stills: `/Users/fkchang/work/entreprenural_ideas/rmv/motion/sting/out/sheet-16x9.png`, and `safezone-meta-reels-1080x1920.png` for the vertical.
3. **Questions for Forrest.**
   - (a) Does the thunder sound right? It is synthesized, not a recording.
   - (b) Is the timing right: 2 s of silence, then the hit?
   - (c) Size in 9:16 and 1:1: the badge settles at 762 px wide (the 90%-of-safe-width cap), leaving a lot of black. A bigger vertical layout would mean a stacked composition, which is a new design decision.
   - (d) The ivory flash at the hit covers the full frame for about 0.15 s. Is that acceptable?
4. **Optional:** a fresh Sonnet reviewer with only `studio.md` and the review PNGs (motion-studio phase 5).
5. **To change something:**
   - A seal change goes through `ruby /Users/fkchang/work/entreprenural_ideas/rmv/motion/seal/build.rb`, then re-render. The sting reads the new SVGs automatically.
   - Timing is `T` in `src/sting-layout.js`. Mix is `MIX` in `src/sting-audio.js`.
   - Render and encode: `node render.mjs video preset=<id> mb=4 out=master-<id>.mkv`, then `PRESET=<id> OUT=... ./encode.sh master=out/master-<id>.mkv audio=out/thunder.wav`, after `node render.mjs audio out=thunder.wav`.

Nothing is committed: `rmv/` is not a git repo.

### Coordinator verification (2026-09-28)

Re-ran the builder's numbers independently rather than trusting the report:

- `ffprobe` on all three delivery files: 4.000000s, correct dims (1920x1080 /
  1080x1920 / 1080x1080), h264 High + AAC. Confirmed.
- `ffmpeg -af ebur128=peak=true` on all three: 16:9 gives I=-23.0 LUFS, true
  peak -8.3 dBFS; 9:16 and 1:1 both -23.0 LUFS / -8.2 dBFS. Matches the
  builder's table exactly. Well inside the -23±0.5 LUFS / -1 dBTP targets.
- `ffmpeg -af silencedetect=noise=-60dB:d=0.1`: silence from 0 to 1.999521s,
  confirming true digital silence before the 2.0s hit (not just a quiet mix).
- Viewed `sheet-16x9.png`, `mp4-frames-9x16.png`, `safezone-meta-reels-1080x1920.png`,
  `still-closeup-16x9.png`, `still-final-16x9.png` directly: chop inks in
  4/凰/涅/槃 in order, flash at 2.00s, pull-back to the settled badge with the
  corrected carved-stone chop and wings extended, matches the approved
  `seal-full.png`. Every sampled frame stays inside the safe-zone rectangle in
  both the close-up and settled phases.
- Confirmed `plugins/motion-skills/templates/` in `claude-skills` is untouched
  (`git status`/`git diff --stat` clean) — the builder's toolkit-candidate
  changes (`audio.js` wav export, sting wiring in `main.js`) live only in its
  own scaffolded copy under `rmv/motion/sting/`, not the shared world-tier
  template. Correctly left as a proposal in `studio.md`, not applied upstream.

**Not verifiable by the coordinator either** (same "model can't watch video or
hear audio" limit the toolkit itself documents): whether the synthesized
thunder actually sounds right, and whether the motion timing/feel lands. That
is Forrest's call — see Handoff.

### Sound revision v2 (builder, 2026-09-28): audio only; motion, framing and seal untouched

Forrest approved the motion, timing and framing. Two sound notes: the thunder sounded like "the rattle of beads," and the 0-2 s phase should not be dead silence.

**What changed** (`/Users/fkchang/work/entreprenural_ideas/rmv/motion/sting/src/sting-audio.js`; v1 is kept as `out/thunder-v1.wav` and `out/sting-audio-v1.js.txt`):

1. **Thunder.**
   - The three discrete high-passed crackle bursts (the beads) are gone.
   - Now: one wideband crack (bandpass 2.4 kHz, Q 0.6, 1 ms attack, about 30 ms decay).
   - The roll: 8 independent noise bursts, each through two cascaded low-pass stages with cutoffs of 40-150 Hz (biased low). Onsets are staggered over 50-450 ms, with 40-250 ms swells and exponential tails (time constant decay/3, decay 1.0-2.4 s).
   - A quieter 90-320 Hz body layer, so the roll survives phone speakers.
   - A 70 to 28 Hz sub boom.
   - The master fades over the last 0.3 s, ending at 3.92 s.
2. **Chisel ticks.**
   - One per character, on the exact `T` beats (`T.charStart + i * T.charStagger`: 0.80, 1.02, 1.24, 1.46 s).
   - Each is a bandpassed 3.8 kHz stone tick, a faint high scrape, and a short 190-265 Hz knock.
3. **Held breath.** I kept true silence from 1.80 s (the start of the anticipation push) to the hit, so the last 200 ms is dead air before the thunder. It is 430 ms below -60 dB. My reasoning: silence makes the hit land harder, and the ticks already carry the anticipation.

**Objective checks** (the `out/measure.sh` script, run on the WAV):

| Metric | v1 | v2 |
|---|---|---|
| RMS above 1.5 kHz, 2.05-2.60 s (the "beads" zone) | -41.9 dB | -59.8 dB |
| Thunder band RMS 2.00-3.95 s: sub under 80 / 80-250 / 250-1.5k / over 1.5k | -33.9 / -31.9 / -45.6 / -42.2 | -27.6 / -30.0 / -45.6 / -53.0 |

- **Low band (under 250 Hz), RMS per 150 ms from 2.00 s:**
  - v1: -18, -26, -33, -39, -43, -46 ... -67. A single clean decay.
  - v2: -15, -22, -26, -27, -29, -32, -35, -38, -40, -42, -45, -50, -63. It swells and holds from 2.3 to 3.2 s, which is the roll.
- **Spectrograms:** `/Users/fkchang/work/entreprenural_ideas/rmv/motion/sting/out/spectrogram-v1-vs-v2.png`. v1 (top) shows three broadband crackle stripes after the hit. v2 (bottom) shows one crack line and energy concentrated and sustained under 150 Hz, plus four thin tick lines before the hit.
- **Chisel level:** max momentary -43.3 LUFS, against the thunder's -18.6. That is about 25 LU under, so it is texture, not an event. Tick peak is -22.6 dBFS. I first had the ticks at -49 LUFS (30 LU under) and raised them 6 dB so they stay audible on a phone.

**Re-verified per delivery** (video re-muxed from the same approved masters; no motion change):

| file | integrated | true peak | frames | onsets (silencedetect -60 dB, 0.1 s) |
|---|---|---|---|---|
| 16x9 | -23.0 LUFS | -9.1 dBFS | 120 | 0.799, 1.021, 1.241, 1.461, 2.000 |
| 9x16 | -23.0 LUFS | -9.2 dBFS | 120 | 0.800, 1.021, 1.241, 1.461, 2.000 |
| 1x1 | -23.0 LUFS | -9.2 dBFS | 120 | 0.800, 1.021, 1.241, 1.461, 2.000 |

- ffprobe on all three: h264 High, yuv420p, bt709, 30/1, and 4.000 s.
- `npm test`: all three sting safe-zone checks ok, unchanged.

**Not gated:** whether this sounds like thunder, and whether the ticks read as chisel, is Forrest's call. The meters prove spectral balance, envelope shape, level and timing, not character.

**Handoff:**

- Play `/Users/fkchang/work/entreprenural_ideas/rmv/motion/deliver/rmw-seal-sting-16x9.mp4` with sound, ideally on both headphones and a phone speaker.
- Questions for Forrest:
  - (a) Does it sound like thunder now?
  - (b) Is the chisel level right?
  - (c) Keep the 1.80 to 2.00 s held-breath silence?
- Tuning knobs are in `MIX` in `src/sting-audio.js`:
  - `rumble.cutoff` and `rumble.decay` set the roll's weight and length.
  - `chisel.gain` sets the tick level.
  - `breathFrom` sets when the held breath starts.
- To rebuild: `node render.mjs audio out=thunder.wav`, then re-run `encode.sh` per preset with the existing masters.

Status stays in_progress.

### Coordinator verification of the audio revision (2026-09-28)

Re-ran independently rather than trusting the report:

- `ffprobe`/`ebur128` on all three deliveries: 4.000000s, -23.0 LUFS, true peak
  -9.1/-9.2 dBFS on all three. Matches the builder's table.
- `ffmpeg silencedetect=noise=-60dB:d=0.1` on 16:9: confirms four short
  tick-sized non-silent blips at ~0.80/1.02/1.24/1.46s separated by real gaps,
  then true silence from 1.569 to 2.000s (0.43s held breath) before the hit —
  satisfies the anticipation/held-breath requirement with margin.
- Viewed `spectrogram-v1-vs-v2.png` directly: v1 (top) shows three sharp
  broadband stripes right after the hit — visibly the "beads" Forrest heard.
  v2 (bottom) replaces them with sustained, low-concentrated energy (under
  ~150-200Hz) that swells and holds through 2.3-3.2s, plus four short thin
  tick lines before the hit. This is a real, visible spectral change in the
  direction requested, not just a level tweak.

Still true, same as always: whether it actually *sounds* like thunder is not
something I can verify — that's Forrest's ear, same limit the toolkit's own
"model can't watch/hear" gotcha names. Bringing this to him now.

### Sound revision v3 (builder, 2026-09-28): analysis-informed synthesis; audio only

Forrest's notes on v2: the thunder still didn't sound like thunder, and the chisel ticks sounded like typing.

**1. References** (`/Users/fkchang/work/entreprenural_ideas/rmv/motion/sting/reference-audio/`; README marks it analysis input only, never shipped):

- Six Freesound recordings, all CC0 1.0, license checked on each sound's page on 2026-09-28. They are the HQ previews (128 kbps MP3, 48 kHz); originals need a login.
- `SHA256SUMS` pins them. The README has the URL, author and use of each.
- Thunder, used: 744723 (Emulius) and 476739 (elmoustachio).
- Thunder, measured but unused: 683420, which is almost pure sub and looks pre-filtered.
- Chisel, used: 841053 (quarry chisel strikes) and 812116 (stonemason mallet).
- Chisel, measured but unused: 487084, which is scraping (13-135 ms attacks), not strikes.
- Nothing in `src/`, `render.mjs` or `index.html` reads that directory (grep-verified).

**2. What the measurements showed** (`tools/analyze_audio.py`, numpy STFT, 5 bands, 50 ms hop):

- **Thunder band balance.** Relative to the loudest band: sub -4.1, low (80-250) 0, lowmid (250-1k) -2.5, mid (1-4k) -16.3, high (4-16k) -41.2 dB. The real energy sits in 80 Hz-1 kHz; v2 had lowmid about 15 dB too low.
- **Thunder onset.** A 30-165 ms swell with a transient centroid of 140-340 Hz. There is **no bright crack** in the references, so v1/v2's 2.4 kHz crack was a synth cliché.
- **Thunder envelope.** A plateau, a drop around 0.4 s, and re-swells near 1.0 and 1.3 s, falling only about 11 dB/s. Frame-to-frame flicker is 2-3.3 dB std.
- **Chisel strike** (median of 6 quarry strikes):
  - attack 2.6 ms (range 1-3.6);
  - transient centroid 3364 Hz, ring centroid 3256 Hz;
  - broadband decay -67.6 dB/s;
  - inharmonic ring partials 2285, 4359, 4931, 6855 and 8191 Hz, about 15 dB above the local floor, decaying at 23-46 dB/s;
  - mallet body at 498 Hz (stonemason).
- **Why v2's tick read as typing.** It decayed at about 2300 dB/s and had no ring partials.

**3. Synthesis from the measured numbers** (`src/sting-audio.js`):

- **Thunder:** one noise layer per measured band, through 48 dB/oct band filters. Its gain follows the measured 150 ms band envelope from `src/sting-audio-targets.js`, plus measured-std flicker at 20 Hz, with the measured 30 ms onset ramp.
- **Chisel:** the measured transient (bandpass near the centroid, measured attack, a decay derived from -67.6 dB/s), plus a 4 ms impact spike, plus sine partials at the measured frequencies and decay rates (±4% detune per character), plus the 498 Hz mallet.
- **Calibration:** fit offsets live in `src/sting-audio-cal.js`. `tools/fit_audio.py` fits the band offsets and master loudness, with 2 iterations converged. `tools/fit_chisel.py` grid-fits the chisel levels on an isolated-strike test render (`strikeTest=1`), because overlapping strikes contaminate the attack and decay metrics.
- **Unchanged:** the held breath (true silence from 1.80 s, below -60 dB from 1.77 s), the hit at 2.00 s, and the ticks on the `T` beats.

**4. Quantitative comparison, synth vs target** (`/Users/fkchang/work/entreprenural_ideas/rmv/motion/sting/out/audio-compare.json`; plot `/Users/fkchang/work/entreprenural_ideas/rmv/motion/sting/out/audio-compare.png`):

| Thunder band | target total | synth total | curve RMSE | pre-fade slope target / synth (dB/s) | flicker std target / synth |
|---|---|---|---|---|---|
| sub | -4.1 | -4.1 | 4.5 dB | -11.0 / -9.5 | 3.32 / 3.98 |
| low | 0.0 | 0.0 | 3.4 dB | -12.2 / -11.9 | 2.55 / 2.02 |
| lowmid | -2.5 | -2.5 | 2.9 dB | -11.1 / -10.4 | 2.36 / 1.90 |
| mid | -16.3 | -15.7 | 2.7 dB | -12.6 / -10.4 | 2.14 / 2.49 |
| high | -41.2 | -40.7 | n/a | -1.9 / -11.7 | 1.21 / 1.94 |

- The high band's target is the reference recording's noise floor, 41 dB down, so it isn't meaningful.
- The plot shows the synth tracking the reference target's drop at about 0.4 s and its re-swell near 1.3 s in every band.
- Thunder onset: attack 28.3 ms against the 30.2 ms target. Onset centroid 208 Hz against 343 Hz, so the first 25 ms is darker than the reference; this is a known gap.

| Chisel strike (isolated) | target (quarry median) | synth (median of 4) |
|---|---|---|
| attack 10-90% | 2.6 ms (range 1.0-3.6) | 1.2 ms (0.67-2.23) |
| transient centroid | 3364 Hz | 3180 Hz |
| ring centroid | 3256 Hz | 3386 Hz |
| broadband decay | -67.6 dB/s | -71.2 dB/s |
| ring-peak prominence | about 15 dB | 15.5 dB |
| ring partials | 2285 / 4359 / 4931 / 6855 / 8191 Hz | detected at 4406-5271 and 6647-6932 Hz (±4% detune), plus the 483-513 Hz mallet |

- Spectrograms: `/Users/fkchang/work/entreprenural_ideas/rmv/motion/sting/out/spectrogram-v2-vs-v3.png`. v3 spreads its energy up to about 1 kHz with visible swells, and the strikes ring across 1-8 kHz over a 500 Hz body.
- **Known artifact:** the 5-band resynthesis shows hard steps at the 1 kHz and 4 kHz band edges, where the reference spectrum is smooth. If Forrest hears a "filtered" quality, the next step is more, narrower bands.

**Levels.** Chisel max momentary is -36.4 LUFS against the thunder's -17.2, about 19 LU under.

**Deliveries re-verified** (video re-muxed from the same approved masters):

| file | integrated | true peak | frames | onsets (-60 dB) | profile |
|---|---|---|---|---|---|
| 16x9 | -23.0 LUFS | -7.3 dBFS | 120 | 0.799, 2.003 | h264 High, bt709, AAC-LC, 4.000 s |
| 9x16 | -23.0 LUFS | -7.3 dBFS | 120 | 0.800, 2.003 | same |
| 1x1 | -23.0 LUFS | -7.3 dBFS | 120 | 0.800, 2.003 | same |

- The ring now bridges the gaps between strikes, so silencedetect sees one run from 0.80 s.
- `npm test`: all three sting safe-zone checks ok.

**Not gated:** whether it sounds like thunder and like a chisel on stone is Forrest's call. The curves prove the measured match, not the character.

**Handoff:**

- Play `/Users/fkchang/work/entreprenural_ideas/rmv/motion/deliver/rmw-seal-sting-16x9.mp4` on headphones and on a phone speaker.
- If it's still off: change the references or the rules in `tools/derive_targets.py`, then re-run `derive_targets.py`, `fit_chisel.py` and `fit_audio.py 2`, then re-encode.
- v1 and v2 are kept for A/B: `out/thunder-v1.wav`, `out/thunder-v2.wav`, and the `out/sting-audio-v*.js.txt` sources.

### Coordinator verification of v3 (analysis-informed synthesis) (2026-09-28)

- **Provenance:** read `reference-audio/README.md` directly — all six sources
  are CC0 1.0, with author/URL/date per file, `SHA256SUMS` pinned, and an
  explicit statement that nothing under `src/`, `render.mjs`, or `index.html`
  reads that directory (confirmed by design: it's inputs to an offline
  `derive_targets.py` step, not the render path).
- **Deliveries:** re-ran `ffprobe`/`ebur128` independently on all three —
  4.000000s, -23.0 LUFS, -7.3 dBTP on all three. Matches the builder's report.
  `silencedetect` confirms true silence 1.767-2.003s immediately before the
  hit.
- **Quantitative match:** viewed `audio-compare.png` (thunder band energy,
  reference solid vs. synth dashed, 5 bands over the first 1.9s) directly —
  the synth visibly tracks the reference's shape closely in sub/low/low-mid/mid,
  including matching dips and swells at the same times, not just matching
  average level. High band stays low in both, consistent with the finding that
  real thunder has no bright crack.
- **Spectrogram:** `spectrogram-v2-vs-v3.png` — v3 (bottom) shows visible
  ringing/resonance trails on the four ticks (extending up through ~800-1500Hz
  and persisting, not an instant click), and real mid-band texture in the
  thunder body through the decay, both absent in v2 (top). This is a visible,
  not just numerical, difference in the direction Forrest asked for.

This is a materially more rigorous pass than v1/v2 — real measured targets,
not guessed DSP constants. Still Forrest's ear for the final call. Bringing
this to him now.

### Sound revision v4 (builder, 2026-09-28): tick sync, reverb, bass, spectral smoothness; audio only

Forrest's notes on v3: the thunder now sounds like thunder and the chisel direction is right. Three new notes: the tick leads the visual, the thunder reads "8-bit NES", and both sounds need bass and reverb.

**1. Tick sync bug, with root cause.**

- v3 fired each tick at the *start* of its glyph's reveal. The glyphs are only fully inked 219-258 ms later: the reveal is an outQuad wipe, and each glyph's lowest ink sits at 63-69 of the 80-unit wipe.
- Fix: `charLanded(index, bottom, fps)` in `src/sting-layout.js` returns the first video frame at which the glyph is fully inked. The glyph bottoms are read from `seal-large.svg` at render time (`glyphBottoms()` in `src/sting.js`), and the reveal constants are now shared (`REVEAL`).
- New tick times: 1.067, 1.300, 1.467 and 1.733 s. Each is 8-25 ms after the geometric landing, erring late as requested.
- **A second bug the measurement caught.** The first v4 render put the ticks at 1.083, 1.292, 1.500 and 1.750 s: the landing times snapped to a *24 fps* grid. The audio render passes no preset, so it used the template default of fps 24, while every delivery is 30 fps. I changed the project default fps to 30 (`src/config.js`). The video always passed presets, so it is unaffected; `npm test` still passes.
- Measured tick onsets (first +12 dB crossing on a 2 ms energy envelope):
  - WAV: -1.0 / -0.1 / +0.4 / -0.3 ms against the landing frame.
  - MP4s: -5.0 / +0.8 / +1.1 / +0.6 ms. The -5 ms on the first tick is AAC pre-echo coming out of digital silence, not schedule.
- **Held breath:** now 100 ms (1.90-2.00 s), because the last glyph lands at 1.733 s. The WAV is -inf there; the MP4s are -77 to -91 dB (AAC noise floor).

**2. Reverb, measured then synthesized.**

- `tools/measure_reverb.py` does Schroeder backward integration per octave, with the pre-event noise floor subtracted and the integration truncated where the tail meets the floor (Lundeby-style).
- **Thunder:** 2 clap tails (744723 at 3.4 s; 476739 at 6.5 s). EDT: 63 Hz 3.48, 125 3.76, 250 2.60, 500 2.65, 1k 2.06 s.
  - Above 1 kHz the tails are unreliable, so I extrapolated at 0.8x per octave (air absorption): 2k 1.65, 4k 1.32, 8k 1.05.
  - The one direct 4 kHz measurement, 1.33 s, agrees with the extrapolation.
  - I used EDT because the thunder's T20 includes continuing rumble.
- **Chisel:** 12 isolated quarry strikes. The 500 Hz-8 kHz EDT is robust at 0.26-0.51 s (500 Hz: 0.36 s, n=11).
  - The low bands and late decay are dominated by non-stationary quarry ambience and the steel chisel's own ring, so I held 0.36 s below 500 Hz.
  - This is a known limitation: room and ring can't be cleanly separated in that recording.
- **Synthesis** (`reverbIR` in `src/sting-audio.js`): an IR per sound, made of decorrelated stereo noise per octave band, each decaying at its measured T60 (predelay 20 ms for thunder, 8 ms for chisel), energy-normalized, through a ConvolverNode.
  - It is code-generated, with no sampled IR.
  - I chose it over a comb/allpass network because it matches the measured per-band T60 exactly and avoids comb-filter metallic coloration, which would itself read as synthetic.
- **Wet level** is bisected to the measured EDT (`tools/reverb_fit.py`): thunder -10.35 dB (median of 250/500/1k EDT against 2.60 s), chisel -15.38 dB (500 Hz EDT: 0.359 s against 0.36 s).

**3. Bass.**

- **Thunder:** the references' sub band spans -12.1 to 0 dB relative to the loudest band. v3 used their mean (-4.1). v4 uses the top of that real range (`SUB_RULE = "max"` in `derive_targets.py`), so sub is now the loudest band.
- **Chisel:** the quarry strikes' low content is 27 dB above the pre-strike background (a real stone thump, not ambience). In the first 150 ms their balance (sub/low/lowmid/mid/high) is -17.2 / -4.3 / -3.8 / -2.7 / 0 dB, and it decays at -209.5 dB/s.
  - v3 had low at -41.6 dB: the missing body.
  - v4 adds a body layer with those measured levels and decay rate, fitted with `tools/fit_body.py`.

**4. Spectral smoothness.**

- The thunder moved from 5 hard bands to 10 roughly octave-wide sub-bands, with the measured envelopes interpolated in dB/Hz across log frequency.
- Ripple (std of the 1/12-octave spectrum around a cubic fit, 150 Hz-6 kHz): ref 1.26-4.21 dB; **v3 4.77** (max 9.7 dB near 1.5 kHz, the stepped region); **v4 1.85** (max 4.7 dB).
- A first edge-step metric I tried conflated steep smooth tilt with steps, so I replaced it with ripple.

**Comparison** (`/Users/fkchang/work/entreprenural_ideas/rmv/motion/sting/out/audio-v3-vs-v4.png` and `.json`; band envelopes against the reference in `/Users/fkchang/work/entreprenural_ideas/rmv/motion/sting/out/audio-compare.png`):

| Metric | reference | v3 | v4 |
|---|---|---|---|
| Thunder EDT 63 / 125 / 250 / 500 / 1k (s) | 3.48 / 3.76 / 2.60 / 2.65 / 2.06 | 4.46 / 1.91 / 1.78 / 2.42 / 2.40 | 3.59 / 4.29 / 3.03 / 2.61 / 2.51 |
| Thunder balance sub/low/lowmid/mid/high (dB) | 744723: -12.1/-1.8/0/-16.2/-51.8; 476739: 0/-2.2/-9.0/-20.3/-34.5 | -4.1/0/-2.5/-15.7/-40.7 | 0/-2.0/-4.5/-18.2/-43.2 |
| Thunder spectral ripple std / max (dB) | 1.26-4.21 / 2.9-7.7 | 4.77 / 9.7 | 1.85 / 4.7 |
| Chisel strike balance sub/low/lowmid/mid/high (dB) | -17.2/-4.3/-3.8/-2.7/0 | about -49/-42/-15/0/-4 | -16.8/-4.8/-4.8/0/-4.4 |
| Chisel 500 Hz EDT (s) | 0.36 | 0.23 | 0.36 |

- Remaining mismatches: thunder EDT at 125/250 Hz runs 0.4-0.5 s long, and the chisel's mid and high bands are swapped by about 3-4 dB.

**Deliveries** (video re-muxed from the same approved masters):

| file | integrated | true peak | frames | profile |
|---|---|---|---|---|
| 16x9 | -23.0 LUFS | -6.6 dBFS | 120 | h264 High, bt709, 30/1, AAC-LC, 4.000 s |
| 9x16 | -23.0 LUFS | -6.6 dBFS | 120 | same |
| 1x1 | -23.0 LUFS | -6.6 dBFS | 120 | same |

- `npm test`: all three safe-zone checks ok.
- The chisel's max momentary is 19 LU under the thunder's (-36.7 against -17.7 LUFS).
- The reverb tails end inside the 4.0 s duration: the master fades to zero by 3.92 s.

**Not gated:** whether the space and bass now read as natural rather than 8-bit is Forrest's call. If it still does:

- The next candidates are the long thunder EDT at 125/250 Hz and the 20 Hz flicker modulation. The flicker is a random-step AM, and that texture is close to the NES noise channel.
- The flicker std matches the reference, but its *spectrum*, the rate of change, was not measured.

**Handoff:**

- Play `/Users/fkchang/work/entreprenural_ideas/rmv/motion/deliver/rmw-seal-sting-16x9.mp4` on headphones and on a phone.
- A/B sources: `out/thunder-v1.wav`, `thunder-v2.wav` and `thunder-v3.wav` against `out/thunder.wav`.

Status stays in_progress.

### Coordinator verification of v4 (tick sync + reverb/bass) (2026-09-28)

- **Deliveries:** re-ran `ffprobe`/`ebur128` independently on all three — all
  4.000000s, 30fps (confirms the fps-mismatch bug fix), -23.0 LUFS, -6.6 dBTP.
  Matches the report exactly.
- **Tick timing:** `silencedetect` on 16:9 shows silence 0-1.067s (matching the
  first tick's corrected landing time exactly), then a short gap and silence
  1.885-2.003s (~0.118s, matching the reported "100ms before the hit" — the
  compression from 200ms is explained by the last character now landing later,
  at 1.733s), then a decaying tail that reaches silence again by 3.907s (before
  the 4.0s cutoff — confirms the reverb tail doesn't clip).
- **Quantitative improvement:** viewed `audio-v3-vs-v4.png` directly — v4 (red)
  visibly tracks the reference decay curves far more closely than v3
  (blue/purple) across all four measured panels (early decay per octave, band
  balance, spectral ripple, chisel strike balance). The spectral-ripple panel
  in particular shows v4's bars close to reference height where v3's were
  roughly double — a real, visible reduction in the "stepped" quality.
- Builder's own honesty about remaining gaps (125/250Hz thunder decay running
  long, the unmeasured flicker rate, mid/high chisel bands swapped ~3-4dB) is
  recorded as-is — no reason to doubt it, and it's exactly the kind of
  known-limitation disclosure this build has been consistent about throughout.

Bringing this to Forrest now for another listen.


### Final approval (2026-09-28)

Forrest, on v4: "that will work for now." All three acceptance criteria met
(render in three formats: confirmed; loudness/safe-zone: confirmed
independently; Forrest's approval of both the seal art and the sting: given).
Row 10 is the last task in the build. All ten rows are now done.
