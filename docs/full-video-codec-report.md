# Full Video Codec Report

## Diagnosis: Browser Can't Decode Video Track

All 4 `full.mp4` files contain H.265/HEVC or AV1 video codecs. Chrome/Edge **cannot** decode these in software mode.

### Symptoms
- Audio: ✅ plays normally (AAC is universally supported)
- Progress bar: ✅ advances (duration detected from audio track)
- Video: ❌ frozen — `videoWidth=0`, `videoHeight=0` (browser can't decode)
- Seek: shows a single frame from the decoded track (if any H.264 track exists)

### Per-File Codec Analysis

| Project | Codecs Found | Size | Browser Compatible? |
|---------|-------------|------|---------------------|
| unarmored | hvc1 + av01 + avc1 (3 video tracks!) | 173 MB | ❌ H.265/AV1 not supported |
| vivo-relic | avc1 + hev1 + hvc1 | 170 MB | ❌ Mixed |
| sk2-concept | **hvc1 only** (H.265) | 49 MB | ❌ No H.264 track at all |
| midnight-elevator | av01 + hvc1 | 71 MB | ❌ Neither supported |

All files: `moov` atom AFTER `mdat` (not streaming-optimized).

### Root Cause

Chrome and Edge do not support H.265/HEVC software decoding. These videos were likely exported from AIGC tools (即梦/可灵) that default to H.265 for smaller file sizes.

### Solution

Re-encode ALL 4 files to **H.264 + AAC + yuv420p**.

## Recommended Export Settings

If you have ffmpeg (run from terminal):
```bash
ffmpeg -i full-original.mp4 \
  -c:v libx264 -profile:v high -level:v 4.1 \
  -pix_fmt yuv420p -r 30 -fps_mode cfr \
  -crf 20 -preset medium -movflags +faststart \
  -c:a aac -b:a 192k -ar 48000 \
  full.mp4
```

If using **剪映/CapCut**:
- Export → H.264 → High Quality → 30fps

If using **Premiere Pro**:
- Format: H.264, Preset: Match Source - High Bitrate
- Video: VBR 1 pass, Target 15-25 Mbps
- Audio: AAC 192kbps 48000Hz

If using **HandBrake** (free, cross-platform):
- Preset: Fast 1080p30
- Video: H.264 (x264), Constant Quality RF 20
- Audio: AAC 192kbps
- Check: "Web Optimized" (for moov atom at start)

## Files to Re-encode

| Priority | Project | Current Codec | Target |
|----------|---------|---------------|--------|
| 🔴 HIGH | sk2-concept | H.265 only | H.264 |
| 🔴 HIGH | midnight-elevator | AV1 + H.265 | H.264 |
| 🟡 MED | unarmored | H.265 + AV1 + H.264 | H.264 only |
| 🟡 MED | vivo-relic | H.264 + H.265 | H.264 only |

### Process

For each project:
1. Rename current file: `full.mp4` → `full-original.mp4`
2. Export new H.264 version as `full.mp4`
3. Keep `preview.mp4` unchanged (these are already working)
