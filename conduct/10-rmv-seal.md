# 10 — First RMV piece: seal sting

Status: in_progress
Output location (Forrest, 2026-09-28): inside the rmv project, at
`/Users/fkchang/work/entreprenural_ideas/rmv/motion/` (new directory, sibling
to `docs/`, `chatgpt_artifacts/`, `prototype/` — no existing `brand/` or
`motion/` convention there yet). NOT inside `claude-skills` (world-tier) and
NOT inside `agent_experiments/showreel`.
Depends on: 01 (toolkit), and Forrest's brand-kit values living in
`~/.claude/motion-overlay.md` (task 03 defines the overlay schema; this task
populates RMV's actual values there — NOT in the plugin).

## Plan

RIGOR: strict (gate: Forrest approves the seal before it animates)
LANE: rmv
Builder: Opus (per handoff — visual judgment; escalation above coordinator's own
Sonnet tier — approved by Forrest 2026-09-28)

Steps (from `~/work/agent_experiments/showreel/docs/motion-plugin.context.md`
scope row 10 and the "RMV brand kit status" section):

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

## Handoff

(runbook for Forrest's visual approval step — this is a human-in-the-loop gate,
not CLI-provable)
