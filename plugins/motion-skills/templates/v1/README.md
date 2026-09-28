# Motion toolkit template v1

A browser-rendered, deterministic template for short motion pieces. It is a
versioned template rather than a published package: copy this directory into a
project, keep its module boundaries, and configure the piece in one place.

## Configuration

`src/config.js` owns the only defaults. `createConfig()` accepts `width`,
`height`, `fps`, `duration`, `bpm`, `palette`, and `look`. The look is selected
by the same config surface: `look: 'riso'` gives separated inks and stochastic
screening; `look: 'enamel'` gives flat enamel, steel-density gradients, and
restrained low-frequency grain.

## Platform presets and safe-zone review

`src/presets.js` supplies config-only presets: `youtube-1080p` (1920x1080),
`youtube-4k` (3840x2160), and `meta-reels-1080x1920` (1080x1920). The 4:5
(`proposed-social-4x5`) and square (`proposed-social-1x1`) presets are
**proposed, not confirmed**. Select one with `preset=<id>`; the shared engine,
timeline, and renderer are unchanged.

Each preset stores an official URL and `checked: '2026-09-28'` beside its
resolution, safe-zone, and encoding record. [YouTube’s resolution guidance](https://support.google.com/youtube/answer/6375112?hl=en)
pins 1920x1080 and 3840x2160 at 16:9. Its [upload guidance](https://support.google.com/youtube/answer/1722171?hl=en)
pins MP4, progressive H.264 High/4:2:0, AAC-LC at 48 kHz, BT.709 SDR, and the
8 Mbps 1080p / 35–45 Mbps 4K SDR targets at standard frame rates. [Meta’s
Reels guidance](https://www.facebook.com/business/ads/facebook-instagram-reels-ads)
pins 9:16 with audio and key messages in a safe zone, but does **not** publish
1080x1920, numeric margins, or a complete codec/bitrate target on that page.

Accordingly, the Meta 1080x1920 raster, its 10% margins, the proposed-format
rasters, and their H.264/BT.709/AAC profile values are **toolkit review-policy
defaults**, not claims about a platform requirement. YouTube’s 5% review
margins are likewise a toolkit policy because YouTube’s cited pages provide no
numeric safe-zone margin. `encode.sh` delegates to `src/encode.mjs`, which
reuses the existing master-plus-audio pipeline and selects profile data via
`PRESET=<id>`.

Run a browser-free geometry check and create its 1080x1920 SVG test render:

```sh
npm run safe-zone:check
```

For visual review, render a contact sheet with the dashed yellow safe rectangle
and tinted unsafe margins:

```sh
node render.mjs sheet preset=meta-reels-1080x1920 reviewPreset=meta-reels-1080x1920 from=0 to=2 step=.4 cols=3 tw=180 name=reels-review.png
```

The preview mode also accepts `reviewPreset=meta-reels-1080x1920`; the overlay
is only a review layer and is not included in delivery video frames.

## Modules

- `engine.js`: three separation canvases, a `Painter`, WebGL2 print pass, and
  RGBA16F motion-blur accumulation.
- `type.js`: editable vector block glyphs, laid out and drawn as `Path2D`
  geometry. Replace `glyphPath` with a HarfBuzz/OpenType adapter when a project
  supplies licensed font data; the draw/layout interface stays the same.
- `ease.js`, `kit.js`, and `timeline.js`: deterministic timing and motion
  helpers.
- `audio.js`: offline-audio primitives plus a WAV encoder.
- `render.mjs` and `encode.sh`: Blob frame ingestion, lossless RGB master, and
  delivery encode.

## Run

Install the declared browser dependency, then run:

```sh
npm test
npm run smoke:sheet
npm run smoke:audio
node render.mjs video config=smoke fps=24 mb=4 from=0 to=2 out=smoke-master.mkv
OUT=artifacts/smoke.mp4 ./encode.sh master=out/smoke-master.mkv audio=out/smoke.wav
```

The renderer takes `width=`, `height=`, `fps=`, `duration=`, `bpm=`,
`palette=`, and `look=` command-line overrides. Frames are sampled with a
forward shutter `[t, t + shutter/fps)`, so a frame does not blend across a cut.
Review PNG sheets and encoded-frame extracts visually; loudness and stream
metadata can be checked with `ffmpeg`/`ffprobe`.
