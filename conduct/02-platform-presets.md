# 02 — Platform presets and reframing

Status: pending
Depends on: 01-toolkit-extraction (same lane, same builder session — do this
after 01 lands in the toolkit directory)

## Plan

RIGOR: loose
LANE: toolkit
Builder: Codex via /mycodex, with specs from a Perplexity sweep

Add platform presets and reframing on top of the toolkit from
`conduct/01-toolkit-extraction.md`:

- Formats: 16:9 1080p and 4K, 9:16 1080x1920 first (per the handoff's decided
  order); 4:5 feed and 1:1 next (proposed, not yet confirmed by Forrest — build
  them too since the scope table lists them, but flag in your report that they
  were "proposed, not confirmed").
- Pin exact specs (resolution, safe-zone margins, encode profile per platform)
  from a **Perplexity sweep of current official docs** (YouTube, Instagram/Meta),
  not from memory — this repo is world-tier and specs drift. Cite source + date
  for each pinned spec in the toolkit's preset config/comments.
- A safe-zone overlay mode for review (draws the platform's safe margins over a
  render so a human can eyeball crop risk).
- Encode profiles per platform (matching `encode.sh`'s existing approach: H.264
  High profile, appropriate CRF/bitrate, BT.709, AAC + limiter — adjust only what
  each platform's spec requires).

## Acceptance criteria

1. A 9:16 1080x1920 test render exists and a safe-zone check (visual overlay or
   programmatic margin check) passes on it.
2. Each pinned spec (resolution, safe zone, encode target) cites an official
   source URL and the date it was checked.
3. Presets are config, not copy-pasted duplicate render code — reuse the row 1
   toolkit's parametrized engine.

## Evidence

(append here, one entry per criterion, verbatim command output)

## Handoff

(runbook for the visual safe-zone check if it needs a human eyeball, not just a
programmatic margin check)
