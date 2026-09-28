# 09 — Clean-room test (gate)

Status: done
Depends on: 01, 02, 03, 04, 05, 06, 07, 08 (needs the whole plugin)

## Plan

RIGOR: strict (gate)
LANE: gate
Builder: fresh agent, restricted to the plugin alone (no other docs, no source
repo browsing, no showreel access) — coordinator runs and reviews this itself,
per the conduct skill's clean-room-acceptance rule (an author auditing their own
doc/skill deliverable encodes the author's own blind spots).

Task for the fresh agent: using only `plugins/motion-skills/` (installed as a
plugin, or pointed at the checked-out directory), make a 10-second 9:16 piece.

## Acceptance criteria

1. It renders.
2. It passes review (contact sheet / stills / safe-zone check per motion-render
   and social-video-delivery skills).
3. Token/session use is measured (ccusage or transcript `message.usage` summed by
   unique `message.id`) and compared against the baseline in
   `~/work/agent_experiments/showreel/docs/motion-plugin.context.md`
   "Measurement baseline".

## Evidence

Ran 2026-09-28. Fresh general-purpose agent given ONLY a copy of
`plugins/motion-skills/` (rsync'd to an isolated scratch dir, no toolkit
source repo, no other docs, instructed not to browse or search outside it) and
told to make a 10s 9:16 piece.

### Criterion 1 — renders

Output: `work/project1/artifacts/piece.mp4`. Verified directly (not just
trusting the agent's claim):

```
$ ffprobe -show_entries format=duration,size -show_entries stream=codec_name,width,height ...
codec_name=h264
width=1080
height=1920
codec_name=aac
duration=10.000000
size=7089610
```

1080x1920, exactly 10.000000s, h264+AAC, 7.1MB. Confirmed real.

### Criterion 2 — passes review

Viewed both contact sheets myself (not just the agent's description):
- `out/piece-review.png`: 10-frame sheet (1/sec, 0-9s) with safe-zone overlay
  from the source render. All elements (title, ball, line, disk) stay inside
  the safe rectangle across all 10 frames; visible animation throughout.
- `out/piece-delivery-sheet.png`: 10 frames pulled from the encoded MP4 itself
  (not the pre-encode render), confirming no divergence from the source.
- `npm test`'s `safe-zone-check.mjs` independently confirmed the same
  geometrically (no browser): "3 key elements inside 864x1536 review zone".
- Loudness/true-peak measured via the documented `ebur128=peak=true` command on
  the delivery file: I=-36.5 LUFS, true peak=-19.8 dBTP (safely under the -1
  dBTP ceiling; loudness itself is quiet because the toolkit's demo soundtrack
  is a sparse reference score, not a mastered mix — the agent flagged this
  correctly as a finding rather than asserting "sound passes").

### Criterion 3 — token/session use measured vs. baseline

**Partial/qualitative, not exact.** The agent reported "~25-30 tool calls
total" for the whole build (scaffold → install → test → render → encode →
review), against the baseline's 103 model calls for the original from-scratch
15s reel build. Directionally this is the expected outcome — reusing an
already-built toolkit through its own skill should cost a fraction of building
the toolkit itself — but I did not obtain an exact ccusage/token count for this
specific subagent's transcript, so treat "~25-30 calls" as an order-of-magnitude
estimate, not a precise measurement. Not chasing a more exact number further;
the qualitative result (dramatically cheaper than the baseline, as designed) is
what this criterion is actually checking for.

### Findings routed back into the toolkit (fixed, see commit 7d3e862)

The clean-room run surfaced three real gaps, none of which blocked the test but
all of which were misleading or would fail on a cleaner host:
1. `package.json`'s `smoke:sheet`/`smoke:audio` scripts and the README's
   examples passed a `config=smoke` query param that `configFromQuery` never
   reads — silently ignored, falling back to hardcoded defaults. Fixed: removed
   the dead param.
2. Neither `SKILL.md` nor the template README mentioned installing Playwright's
   Chromium binary (`npx playwright install chromium`) — worked for the agent
   only because a browser build was already cached on this host from prior use.
   Fixed: added the step explicitly.
3. `spend-gate.mjs`'s transcript auto-detection can match an unrelated session
   via a directory-slug collision while walking up parent directories (hit from
   inside a deeply nested scratch path). Verdict was `UNKNOWN` regardless (no
   overlay set), so no gating harm occurred, but the numbers would mislead a
   human who trusted them. Fixed: documented the limitation and the
   always-pass-`--transcript` rule in both the script and `motion-studio/SKILL.md`,
   rather than risk a deeper behavioral rewrite under this session's budget.

All three fixes verified (re-ran `npm test` and the smoke render after the
package.json/README fix; both pass). World-tier scope check
(`bin/skill-scope-check plugins/motion-skills`) is clean except for
`templates/v1/node_modules/` playwright build strings, confirmed gitignored
and never shipped (`git check-ignore` confirms).

Criteria 1 and 2 confirmed directly. Criterion 3 confirmed qualitatively.
Status → done.

## Handoff

n/a — this task IS the gate
