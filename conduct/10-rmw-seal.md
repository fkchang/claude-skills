# 10 — First RMW piece: seal sting

Status: in_progress
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

## Handoff

**GATE CLEARED (2026-09-28).** Forrest approved the carved-stone pass as final,
via `compare-chop.png` presented on a StreamWeaver canvas
(`streamweaver canvas-push rmv-seal`). Verbatim: "I approve." Criterion 1 is
met. Proceeding to steps 3-5 (fonts, brand-kit overlay, seal sting animation).
