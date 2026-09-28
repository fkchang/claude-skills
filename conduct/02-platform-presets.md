# 02 — Platform presets and reframing

Status: built-awaiting-gate
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

### 1. 9:16 1080x1920 test render and safe-zone check

Command: `cd plugins/motion-skills/templates/v1 && npm test && node --check src/main.js && node --check src/encode.mjs && bash -n encode.sh`

```text
/Users/fkchang/.rvm/scripts/rvm: line 29: /bin/ps: Operation not permitted

> motion-toolkit-template@1.0.0 test
> node test/validate.mjs && node test/safe-zone-check.mjs

validation ok: parameterized config, timeline, easing, type geometry, looks, audio, RGBA16F, Blob upload, platform presets
safe-zone check passed: meta-reels-1080x1920 1080x1920, 3 key elements inside 864x1536 review zone
wrote artifacts/safe-zone-9x16-test-render.svg
```

Command: `cd plugins/motion-skills/templates/v1 && PRESET=meta-reels-1080x1920 OUT=/private/tmp/motion-preset-reels.mp4 ./encode.sh master=/private/tmp/motion-preset-master.mkv audio=/private/tmp/motion-preset-audio.wav`

```text
/Users/fkchang/.rvm/scripts/rvm: line 29: /bin/ps: Operation not permitted
stream|codec_name=h264|profile=High|width=1080|height=1920|pix_fmt=yuv420p|color_space=bt709|color_transfer=bt709|color_primaries=bt709|r_frame_rate=30/1
stream|codec_name=aac|profile=LC|r_frame_rate=0/0
format|duration=0.200000|size=225571|bit_rate=9022840
```

### 2. Pinned specs cite official URL and checked date

Command: `cd plugins/motion-skills/templates/v1 && node --input-type=module -e "import { PLATFORM_PRESETS } from './src/presets.js'; for (const preset of Object.values(PLATFORM_PRESETS)) console.log(preset.id + ' | ' + preset.width + 'x' + preset.height + ' | ' + preset.status + ' | ' + preset.sources.resolution.checked + ' | ' + preset.sources.resolution.url + ' | ' + preset.sources.safeZone.url + ' | ' + preset.sources.encode.url)"`

```text
/Users/fkchang/.rvm/scripts/rvm: line 29: /bin/ps: Operation not permitted
youtube-1080p | 1920x1080 | confirmed | 2026-09-28 | https://support.google.com/youtube/answer/6375112?hl=en | https://support.google.com/youtube/answer/6375112?hl=en | https://support.google.com/youtube/answer/1722171?hl=en
youtube-4k | 3840x2160 | confirmed | 2026-09-28 | https://support.google.com/youtube/answer/6375112?hl=en | https://support.google.com/youtube/answer/6375112?hl=en | https://support.google.com/youtube/answer/1722171?hl=en
meta-reels-1080x1920 | 1080x1920 | confirmed | 2026-09-28 | https://www.facebook.com/business/ads/facebook-instagram-reels-ads | https://www.facebook.com/business/ads/facebook-instagram-reels-ads | https://www.facebook.com/business/ads/facebook-instagram-reels-ads
proposed-social-4x5 | 1080x1350 | proposed-not-confirmed | 2026-09-28 | https://www.facebook.com/business/ads/facebook-instagram-reels-ads | https://www.facebook.com/business/ads/facebook-instagram-reels-ads | https://www.facebook.com/business/ads/facebook-instagram-reels-ads
proposed-social-1x1 | 1080x1080 | proposed-not-confirmed | 2026-09-28 | https://www.facebook.com/business/ads/facebook-instagram-reels-ads | https://www.facebook.com/business/ads/facebook-instagram-reels-ads | https://www.facebook.com/business/ads/facebook-instagram-reels-ads
```

### 3. Presets reuse the parameterized toolkit renderer

Command: `cd plugins/motion-skills/templates/v1 && node --input-type=module -e "import { createConfig } from './src/config.js'; for (const id of ['youtube-1080p','youtube-4k','meta-reels-1080x1920','proposed-social-4x5','proposed-social-1x1']) { const config = createConfig({ preset: id }); console.log(id + ' -> ' + config.width + 'x' + config.height + ' via createConfig'); }"; grep -c "new Stage(config" src/main.js`

```text
/Users/fkchang/.rvm/scripts/rvm: line 29: /bin/ps: Operation not permitted
youtube-1080p -> 1920x1080 via createConfig
youtube-4k -> 3840x2160 via createConfig
meta-reels-1080x1920 -> 1080x1920 via createConfig
proposed-social-4x5 -> 1080x1350 via createConfig
proposed-social-1x1 -> 1080x1080 via createConfig
1
```

## Handoff

(runbook for the visual safe-zone check if it needs a human eyeball, not just a
programmatic margin check)

Human visual gate remains open because this environment blocks loopback bind
and headless Chrome. In an environment with the declared browser dependency,
run:

```sh
cd plugins/motion-skills/templates/v1
node render.mjs sheet preset=meta-reels-1080x1920 reviewPreset=meta-reels-1080x1920 from=0 to=2 step=.4 cols=3 tw=180 name=reels-review.png
open out/reels-review.png
```

Expected observation: every contact-sheet tile is 9:16; the dashed yellow
rectangle lies 10% inside each edge; headline, hero, and CTA that matter for
the piece stay inside it. The red-tinted perimeter is a review-policy crop-risk
area, not a Meta-published numeric margin. `proposed-social-4x5` and
`proposed-social-1x1` remain proposed, not confirmed.
