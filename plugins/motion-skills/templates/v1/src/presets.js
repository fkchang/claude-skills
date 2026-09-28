// Platform presets are data, not separate render paths. Sources were checked
// 2026-09-28. A missing number is never represented as a platform requirement.
export const CHECKED_DATE = '2026-09-28';
export const SOURCES = Object.freeze({
  youtubeResolution: 'https://support.google.com/youtube/answer/6375112?hl=en',
  youtubeEncoding: 'https://support.google.com/youtube/answer/1722171?hl=en',
  metaReels: 'https://www.facebook.com/business/ads/facebook-instagram-reels-ads',
});
const source = (url, statement) => Object.freeze({ url, checked: CHECKED_DATE, statement });
const reviewZone = fraction => Object.freeze({ top: fraction, right: fraction, bottom: fraction, left: fraction, policy: 'review-policy default; not a platform-published numeric safe-zone margin' });

// YouTube names 1920x1080 and 3840x2160 for 16:9, H.264 High/4:2:0,
// progressive MP4, AAC-LC at 48 kHz, BT.709 SDR, and the listed SDR bitrates.
// It does not publish numeric title-safe margins; 5% is a toolkit review policy.
const youtubeSources = Object.freeze({
  resolution: source(SOURCES.youtubeResolution, 'Official 16:9 resolutions: 1920x1080 (1080p), 3840x2160 (2160p/4K).'),
  safeZone: source(SOURCES.youtubeResolution, 'Official player adapts to aspect ratio; no numeric safe-zone margin is specified.'),
  encode: source(SOURCES.youtubeEncoding, 'Official SDR guidance: MP4, progressive H.264 High 4:2:0, AAC-LC 48 kHz, BT.709; 1080p 8 Mbps and 2160p 35–45 Mbps at 24/25/30 fps.'),
});

// Meta’s public Reels page says 9:16 creative with key messages in the safe
// zone and audio performs better. It does not specify 1080x1920, numeric
// margins, codec, bitrate, colour, or audio encode settings. Values below are
// toolkit review-policies, not attributed platform requirements.
const metaReelsSources = Object.freeze({
  resolution: source(SOURCES.metaReels, 'Official page specifies 9:16 vertical Reels creative, not a pixel resolution.'),
  safeZone: source(SOURCES.metaReels, 'Official page requires key messages in the safe zone, but publishes no numeric margins.'),
  encode: source(SOURCES.metaReels, 'Official page calls for 9:16 video with audio, but publishes no codec, bitrate, colour, or audio-encode target.'),
});
const socialPolicySources = Object.freeze({
  resolution: source(SOURCES.metaReels, 'No official 4:5 or 1:1 requirement is pinned here; these are proposed toolkit outputs, not confirmed platform presets.'),
  safeZone: source(SOURCES.metaReels, 'No official numeric safe-zone margin is pinned for these proposed outputs.'),
  encode: source(SOURCES.metaReels, 'No official complete upload-encode target is pinned for these proposed outputs.'),
});
const h264 = (videoBitrate, audioBitrate = '256k') => Object.freeze({ container: 'mp4', videoCodec: 'libx264', profile: 'high', pixelFormat: 'yuv420p', color: 'bt709', audioCodec: 'aac', audioBitrate, audioRate: 48000, crf: 17, videoBitrate });

export const PLATFORM_PRESETS = Object.freeze({
  'youtube-1080p': Object.freeze({ id: 'youtube-1080p', platform: 'YouTube', status: 'confirmed', width: 1920, height: 1080, fps: 30, safeZone: reviewZone(.05), encode: h264('8M', '384k'), sources: youtubeSources }),
  'youtube-4k': Object.freeze({ id: 'youtube-4k', platform: 'YouTube', status: 'confirmed', width: 3840, height: 2160, fps: 30, safeZone: reviewZone(.05), encode: h264('40M', '384k'), sources: youtubeSources }),
  'meta-reels-1080x1920': Object.freeze({ id: 'meta-reels-1080x1920', platform: 'Instagram / Meta Reels', status: 'confirmed', width: 1080, height: 1920, fps: 30, safeZone: reviewZone(.10), encode: h264('10M'), sources: metaReelsSources }),
  'proposed-social-4x5': Object.freeze({ id: 'proposed-social-4x5', platform: 'Social feed', status: 'proposed-not-confirmed', width: 1080, height: 1350, fps: 30, safeZone: reviewZone(.10), encode: h264('10M'), sources: socialPolicySources }),
  'proposed-social-1x1': Object.freeze({ id: 'proposed-social-1x1', platform: 'Social feed', status: 'proposed-not-confirmed', width: 1080, height: 1080, fps: 30, safeZone: reviewZone(.10), encode: h264('10M'), sources: socialPolicySources }),
});
export function platformPreset(id) { const preset = PLATFORM_PRESETS[id]; if (!preset) throw new Error(`Unknown platform preset: ${id}. Available: ${Object.keys(PLATFORM_PRESETS).join(', ')}`); return preset; }
export function safeRect({ width, height, safeZone }) { const { top, right, bottom, left } = safeZone; return Object.freeze({ x: width * left, y: height * top, width: width * (1 - left - right), height: height * (1 - top - bottom) }); }
