---
name: social-video-delivery
description: Formats, safe zones, captions, loudness targets, and encode settings for delivering a finished video to social/video platforms — works on real footage as well as code-rendered output, since this is the delivery/QA layer rather than the renderer. Reuses the motion-skills toolkit's platform presets and cites official sources with checked dates for every spec. Use when preparing a final deliverable for YouTube, Instagram/Meta Reels, or a similar platform, checking safe zones or captions on real footage, or picking a loudness target.
---

# Social Video Delivery: Formats, Safe Zones, Captions, Loudness

This skill is broader than the toolkit: it applies to any finished video —
code-rendered or real footage — not just output from the `motion-render`
pipeline. Every spec below states an official source and the date it was
checked. Where a platform hasn't published a number, that gap is stated
explicitly rather than filled with a plausible-sounding default.

## Format, safe-zone, and encode specs (reuse, don't re-sweep)

Resolution, safe-zone margins, and H.264/AAC encode profiles for YouTube
(1080p, 4K) and Instagram/Meta Reels (1080x1920), plus two proposed-but-not-yet-
confirmed social formats, are already pinned with sources in the toolkit:

- `templates/v1/src/presets.js` — `PLATFORM_PRESETS`, each entry carrying its
  own `sources` object (URL + `checked` date) and an explicit `status` field
  (`confirmed` vs `proposed-not-confirmed`).
- `templates/v1/src/safe-zones.js` — geometry checks and a review overlay
  against those presets.

Do not re-derive or re-sweep those specs here; import `platformPreset(id)` and
`safeRect(preset)` from `presets.js` for anything format/safe-zone/encode
related. This skill only adds what `presets.js` doesn't cover: captions and
loudness targets.

## Captions

| Platform | Spec | Source |
|---|---|---|
| YouTube | Accepts SRT, SubViewer (.sbv/.sub), MPsub, LRC, and Videotron Lambda as "basic" formats (no styling/markup honored beyond plain text); SAMI/RealText support only `<b>/<i>/<u>`/color, no positioning; WebVTT supports positioning with the same limited styling; TTML/DFXP support full styling and positioning (includes CEA-608/iTunes Timed Text); Scenarist Closed Caption (.scc) is the preferred broadcast format for CEA-608-based captions, alongside EBU-STL and several other broadcast caption formats | [Supported subtitle and closed caption files](https://support.google.com/youtube/answer/2734698?hl=en), checked 2026-09-28 |
| Facebook / Instagram video ads | Captions are uploaded as a separate .srt file per language; the filename must follow `<name>.<language-code>_<COUNTRY-CODE>.srt` (language code lowercase, country code uppercase, e.g. `ad.en_US.srt`) or the caption file is rejected on upload; more than one language can be attached, one .srt per language | [Add captions to your video ad on Facebook and Instagram](https://www.facebook.com/business/help/1675722002698686), checked 2026-09-28 |

Neither official page above publishes a numeric on-screen caption safe area
distinct from the general Reels safe zone already pinned in `presets.js`'s
`metaReelsSources` — treat caption text as subject to that same safe rectangle,
not a separate one, unless a platform later publishes a caption-specific margin.

Practical implication for code-rendered pieces: burn captions in *inside* the
active preset's safe rectangle (`safeRect(preset)` from `presets.js`), and also
export an .srt sidecar using the filename convention above when delivering to
Meta placements, since Meta's own captioning path expects a separate file, not
burned-in text, for its accessibility captions.

## Loudness

There is no single official "upload target" LUFS number published by YouTube or
Meta for organic video uploads — claims of a specific number (e.g. "-14 LUFS")
in third-party guides could not be traced to an official platform page as of
this check, so this skill does not repeat that claim as fact. Two adjacent
numbers *are* officially published, from different standards bodies, for
different purposes:

| Source | What it states | Applies to |
|---|---|---|
| [EBU R128](https://tech.ebu.ch/docs/r/r128.pdf) (European Broadcasting Union), checked 2026-09-28 | Programme loudness target of -23.0 LUFS ± 0.5 LU (relative-gated measurement), maximum true peak level -1 dBTP | The general broadcast loudness-normalization standard; widely used as a starting reference for any delivery when a platform publishes no number of its own |
| [Google Ad Manager: audio normalization](https://support.google.com/admanager/answer/1181018?hl=en), checked 2026-09-28 | "Ad Manager normalizes audio by setting a target loudness value of -24 LKFS" during transcoding, referencing ATSC A/85 | Ad Manager-hosted ad creatives specifically — not a statement about organic YouTube uploads |

Given no platform-published organic-upload number exists, treat EBU R128's
-23 LUFS / -1 dBTP as the default delivery target unless a specific platform or
client states otherwise, and always verify the actual delivery file rather than
trusting a target was hit:

```sh
ffmpeg -i delivery.mp4 -af ebur128=peak=true -f null -
```

See the `motion-sound` skill for the AAC true-peak-overshoot gotcha (why this
must be measured on the encoded delivery file, not the pre-encode mix) and for
spectrogram/waveform checks that don't require listening.

## Working on real footage (not code-rendered)

This skill's specs apply the same way to footage from a camera or a third-party
editor:

1. Confirm actual resolution/frame rate/codec with `ffprobe`, don't assume the
   export matches the target preset.
2. Check composition against the safe rectangle for the target preset
   (`safeRect(preset)` in `templates/v1/src/safe-zones.js` takes a preset object,
   not a code-rendered scene — it works on any element's pixel bounding box).
3. Re-encode through the same profile `presets.js` defines for the target
   (`platformPreset(id).encode`) so delivery files are consistent regardless of
   source.
4. Run the loudness check above on the final export before delivery.

## Acceptance evidence

Every spec in this file that is stated as a platform fact cites an official
source URL and a checked date (2026-09-28) — the format/safe-zone/encode specs
by reference to `templates/v1/src/presets.js`'s existing citations, and the two
new areas (captions, loudness) with their own citations above. Where no
official number exists, that absence is stated rather than filled in.
