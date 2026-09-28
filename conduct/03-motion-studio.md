# 03 — motion-studio composite skill

Status: done
Depends on: 01, 02 (toolkit + presets must exist first)

## Plan

RIGOR: strict
LANE: skills
Builder: Opus (per handoff; coordinator is running as Sonnet 5 this session, so
this is an escalation above the coordinator's own tier — approved by Forrest
2026-09-28)

Build `motion-studio`, the composite skill in `plugins/motion-skills/skills/
motion-studio/SKILL.md` (plus any supporting scripts) that governs the whole
pipeline: brief → beat-grid concept → style frame → build → review → sound →
deliver. It must:

- Gate spend: read the budget baseline from
  `~/work/agent_experiments/showreel/docs/motion-plugin.context.md`
  "Measurement baseline" section and enforce/report against thresholds (works
  with the budget guard hook from task 04 — coordinate, don't duplicate logic).
- Route to the toolkit (task 01) and presets (task 02) rather than reimplementing
  rendering.
- Enforce the "fresh-session rule" (each piece of motion work starts in a fresh
  session, per the handoff's session-economics gotcha — model can't watch/hear
  its own output across a huge single-session build).
- Read brand kits from `~/.claude/motion-overlay.md` (create this file's expected
  shape/schema as part of this task if it doesn't exist yet — do NOT put RMW's
  actual brand values in the plugin; those go in the overlay only).
- Support "template mode": scaffold a new project by copying the versioned
  template directory from task 01.
- Write the `.motion-skills` marker file when it scaffolds a project (this is
  what the budget guard hook in task 04 checks for to know it's motion work).

## Acceptance criteria

1. The clean-room run (task 09) stays inside its measured budget when using this
   skill end to end.
2. No personal paths, brand values, or budget numbers appear inside
   `plugins/motion-skills/` — they live in `~/.claude/motion-overlay.md` only.
3. `motion-studio` correctly writes the `.motion-skills` marker on scaffold.

## Evidence

Built 2026-09-28 by the Opus builder. Files (all under
`plugins/motion-skills/skills/motion-studio/`): `SKILL.md`, `motion-overlay.example.md`
(overlay schema, placeholder values only), `scripts/overlay.mjs` (dependency-free parser
and validator for the overlay's YAML-subset front matter), `scripts/spend-gate.mjs`
(transcript measurement plus verdict), `scripts/scaffold.mjs` (template mode plus marker).
`$S` below = this builder's scratchpad; all fixtures and test overlays with numbers live
there, never in the plugin.

### Criterion 1: clean-room run stays inside its measured budget

**Resolved via task 09 (2026-09-28).** The clean-room fresh agent completed a
rendering, reviewed 10s 9:16 piece using only this skill and the toolkit, in
roughly 25-30 tool calls (qualitative — no exact token count obtained; see
`conduct/09-clean-room-test.md` criterion 3) against the baseline's 103 calls
for the original from-scratch build. Well inside budget, as expected for
toolkit reuse vs. toolkit-from-scratch. Criterion confirmed. Status → done.

What is
proven is that the gate's measurement is correct, so task 09 can trust its numbers: on the
showreel transcript truncated at the end of the baseline build (call 103,
2026-09-27T13:20:47Z) it reproduces the documented baseline (103 calls, 322k output,
489k peak, 31.8M cache reads):

```
$ spend-gate.mjs --transcript $S/showreel-build-only.jsonl --overlay motion-overlay.example.md
spend gate: UNKNOWN
| metric | value | warn | stop | status |
|---|---|---|---|---|
| calls | 103 | - | - | - |
| output_tokens | 321724 | - | - | - |
| peak_context | 488829 | - | - | - |
| cache_read_tokens | 31810024 | - | - | - |
| active_minutes | 102.9 | - | - | - |
No budget thresholds in the overlay, so no verdict. These numbers are the measurement; ...
exit=0
```

(`active_minutes` counts inter-entry gaps under 15 min, so it includes short human think
time; the handoff's 88.5 is wall-clock of the build window. Whole-file wall span was 1183
min because the session was resumed after 5.5 h and 9.7 h idle gaps, which is why raw
wall-clock was replaced.) All four verdicts, on the full transcript with scratchpad
overlays:

```
$ spend-gate.mjs --transcript <full showreel> --overlay $S/ov-ok.md --phase build    -> spend gate [build]: OK    exit=0
$ spend-gate.mjs --transcript <full showreel> --overlay $S/ov-warn.md --phase build  -> spend gate [build]: WARN  exit=3
$ spend-gate.mjs --transcript <full showreel> --overlay $S/ov-over.md --phase build  -> spend gate [build]: OVER  exit=4
$ spend-gate.mjs --transcript $S/small.jsonl --overlay $S/ov-over.md                 -> spend gate: OK (calls=1)  exit=0
$ spend-gate.mjs --transcript $S/small.jsonl --overlay $S/ov-ok.md --phase brief --log $S/proj/studio.md; tail -1 studio.md
- 2026-09-28T17:07:43.389Z brief: OK (calls=1, output_tokens=17651, peak_context=62319, cache_read_tokens=25145, active_minutes=4)
```

### Criterion 2: no personal paths, brand values or budget numbers in `plugins/motion-skills/`

```
$ bin/skill-scope-check plugins/motion-skills/skills
clean for world tier: plugins/motion-skills/skills
exit=0
$ bin/skill-scope-check <copy of git-tracked + to-be-committed files of plugins/motion-skills, 31 files>
clean for world tier: $S/shipped/plugins/motion-skills
exit=0
$ grep -rniE "rmv|rmw|redux|motor works|silent thunder|hedgeye|forrest|fkchang|cultiv|showreel|agent_experiments|#11110f|#f7f4ed|#aaa79f|#7f1718|#a63328|#063b64|#30c9c7|22\.11|39\.2M|489k|322k|88\.5" plugins/motion-skills/skills
plugins/motion-skills/skills/motion-studio/SKILL.md:3:description: ... (a reel, short, sting, logo animation, explainer loop, or showreel) ...
```

The one grep hit is the generic word "showreel" in the trigger description, not a path or
brand. The deny file `~/.config/claude-skills/deny.txt` was present and applied. Note:
`bin/skill-scope-check plugins/motion-skills` (whole dir) reports hits, but only in
`templates/v1/node_modules/` (playwright's `/home/pwuser` strings), which is gitignored
(`git check-ignore` confirms) and never shipped. Budget thresholds in the example overlay
are all `null`; RMW values appear nowhere in the plugin.

### Criterion 3: `motion-studio` writes the `.motion-skills` marker on scaffold

```
$ scaffold.mjs $S/proj --brand example --overlay $S/test-overlay.md
copied template v1 -> $S/proj
brand applied to src/config.js (look=riso, paper=#f0e8d8, inks=#102030,#405060,#708090)
wrote $S/proj/.motion-skills
wrote $S/proj/studio.md
exit=0
$ cat $S/proj/.motion-skills
# motion-skills marker: this directory tree is motion work (read by the budget guard hook).
schema: 1
template: v1
plugin_version: 0.1.0
brand: example
scaffolded: 2026-09-28T17:04:15.382Z
$ ls -A $S/proj
.gitignore .motion-skills README.md artifacts/ brand.json encode.sh* index.html package-lock.json package.json render.mjs src/ studio.md test/
$ scaffold.mjs $S/proj2          (no brand)   -> marker written, brand: none, exit=0
$ scaffold.mjs --mark-only $S/existing        -> marker written, template: none, exit=0
$ scaffold.mjs $S/proj                        -> "exists and is not empty", exit=1 (no clobber)
$ scaffold.mjs $S/proj3 --brand nosuch ...    -> 'brand "nosuch" not found', exit=1, no dir created
$ scaffold.mjs $S/proj4 --brand example --overlay motion-overlay.example.md
brand applied to src/config.js (look=enamel, paper=#eeeeee, inks=#222222,#666666,#aaaaaa)
$ node -e "...latestTemplate('$S/tpl')"  (dirs v1 v2 v10 vX)  -> v10   (numeric, not lexical; real dir -> v1)
$ (cd $S/proj && npm test)
validation ok: parameterized config, timeline, easing, type geometry, looks, audio, RGBA16F, Blob upload, platform presets
safe-zone check passed: meta-reels-1080x1920 1080x1920, 3 key elements inside 864x1536 review zone
exit=0
```

Overlay validator: example passes with an "unset thresholds" warning; a malformed overlay
reports 6 errors and exits 1 (bad schema, look, paper, ink count, default_brand, negative
threshold) plus an unknown-metric warning.

## Handoff

1. **Criterion 1 (task 09 coordinator).** In the clean-room project, the fresh agent runs
   `node <plugin>/skills/motion-studio/scripts/scaffold.mjs <dir>` then works the pipeline.
   Afterwards run `spend-gate.mjs --transcript <clean-room session.jsonl> --json` (plus the
   subagent transcripts if it delegated) and compare `calls`, `output_tokens`,
   `peak_context` against the baseline (103 / 322k / 489k for a 15 s reel). Also confirm the
   agent obeyed the fresh-session rule and ran the gate at phase boundaries (`studio.md`
   Spend log has one line per phase). Pass = inside budget; record numbers here.
2. **Task 04 (budget guard) contract.** Marker detection: walk up from the hook input's
   `cwd` for a file named `.motion-skills`; none, exit silently. For numbers and verdict,
   call `scripts/spend-gate.mjs --json --transcript <transcript_path> [--overlay F]` and read
   `verdict` / `rows`, don't re-implement the measurement. Thresholds come from
   `budget.warn` / `budget.stop` in the overlay; metric names are fixed in
   `scripts/overlay.mjs` `METRICS`. Task 04 derives the numbers from the baseline; they go in
   `~/.claude/motion-overlay.md`, not the hook.
3. **Task 10 / Forrest.** `~/.claude/motion-overlay.md` does not exist yet. Copy
   `motion-overlay.example.md` there and fill the RMW brand (palette.paper + exactly three
   inks for the toolkit, every named color in `tokens`) and the budget block; validate with
   `overlay.mjs check`. Until then the spend gate returns UNKNOWN (report-only).
4. **Not done, outside this task's paths:** the repo `README.md` plugin table doesn't list
   `motion-skills` yet; the handoff doc's Learnings section wasn't appended (suggested
   learnings: whole-transcript wall-clock is meaningless across idle gaps, use active
   minutes; the showreel transcript now holds 148 calls, the first 103 are the build).
