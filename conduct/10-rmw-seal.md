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

## Handoff

**GATE: Forrest's approval required before step 3. Status stays in_progress.**

Show Forrest:

1. `/Users/fkchang/work/entreprenural_ideas/rmv/motion/seal/compare-badge.png`: the reference badge (cropped from `chatgpt_artifacts/16-rmw-phoenix-rebirth-brand-identity-board.png`) above the redraw
2. `/Users/fkchang/work/entreprenural_ideas/rmv/motion/seal/compare-chop.png`: the reference chop (from deck `image-12-1.jpg`) beside the redrawn chop

Questions for Forrest:

- (a) Is "seal" = the chop inside the winged badge (as redrawn)? Or did he intend a round ring-and-phoenix mark that doesn't exist in the reference yet?
- (b) Keep the corrected 鳳 in place of the reference's garbled glyph?
- (c) Row order (as the reference has it) or traditional column order?
- (d) Stroke weight: current bolder strokes, or thinner to match the reference?
