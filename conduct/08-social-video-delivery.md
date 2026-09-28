# 08 — social-video-delivery skill

Status: done
Lane session: run together with 05, 06, 07 in one warmed Sonnet session

## Plan

RIGOR: loose
LANE: standalone-skills
Builder: Sonnet, plus Perplexity for specs

Write `plugins/motion-skills/skills/social-video-delivery/SKILL.md`: formats,
safe zones, captions, loudness targets, and encode settings for delivering to
platforms — must also work on real footage, not just code-rendered output (this
skill is broader than the toolkit; it's the delivery/QA layer).

Reuse the platform presets/specs pinned in task 02 (don't re-sweep specs that
task 02 already pinned with sources+dates — cite task 02's presets file). Add
captions and loudness-target guidance not already covered by task 02's
encode-profile work.

## Acceptance criteria

1. Every spec in the skill cites an official source and the date it was checked
   (reuse task 02's citations where the spec overlaps; new citations for
   captions/loudness targets not covered there).

## Evidence

Built `plugins/motion-skills/skills/social-video-delivery/SKILL.md`. Reuses
task 02's presets rather than re-sweeping their specs: points at
`templates/v1/src/presets.js` (`PLATFORM_PRESETS`, each with its own `sources`
+ `checked` date) and `templates/v1/src/safe-zones.js` for format/safe-zone/
encode. Researched and cited only the two areas task 02 doesn't cover:

### Criterion 1 — every spec cites an official source and checked date

| Spec | Source | Checked |
|---|---|---|
| YouTube caption file formats (SRT, SubViewer, MPsub, LRC, Videotron Lambda, SAMI, RealText, WebVTT, TTML/DFXP, SCC, EBU-STL, etc.) | https://support.google.com/youtube/answer/2734698?hl=en (fetched in full; table transcribed from the live page) | 2026-09-28 |
| Meta video-ad captions: separate .srt per language, filename convention `name.xx_CC.srt` (lowercase language, uppercase country) | https://www.facebook.com/business/help/1675722002698686 | 2026-09-28 |
| EBU R128 loudness target -23 LUFS ± 0.5 LU, max true peak -1 dBTP | https://tech.ebu.ch/docs/r/r128.pdf | 2026-09-28 |
| Google Ad Manager transcode loudness target -24 LKFS (ad-creative transcoding, not organic upload — cited to show the distinction, not as a general video-delivery target) | https://support.google.com/admanager/answer/1181018?hl=en | 2026-09-28 |

Explicitly stated as *not* officially confirmed (to avoid repeating an
unsourced third-party claim as fact): a platform-published organic-upload LUFS
target for YouTube or Meta. Multiple search results claimed "YouTube normalizes
to -14 LUFS," but none traced to an official support.google.com page during
this check — the skill states this gap rather than asserting the number.

World-tier check:

```text
$ rg -n -i 'redux|motor works|/users/|/Users/fkchang|cultiv-os|agent_experiments|budget' plugins/motion-skills/skills
(no matches, exit 1)
```

Criterion confirmed directly. Status → done.

## Handoff

(none expected)
