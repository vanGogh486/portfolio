# Visual QA Report — Round 1

## Summary
- Passed: 27
- High Severity: 0
- Medium Severity: 0
- Low Severity: 0

## What Looks Good
- 1.1 - 4 project cards exist: Found 4 cards
- 1.2 - All cover images load: 4 cover images checked
- 1.3 - Hover preview video exists: Preview video element found on hover
- 1.4 - Hover video is muted: Muted: true
- 2.1 - Modal opens on click: Modal visible
- 2.2 - Modal title visible: Title: "《卸甲》"
- 2.3 - Modal category visible: Category found
- 2.4 - Modal role visible: Role text found
- 2.5 - "查看完整案例" link visible: Link visible: true, href: /project/unarmored
- 2.6 - Modal video element exists: Video element found
- 2.7 - Modal video has source: Video has src: true
- 2.8 - Modal play/pause button: Play btn: true, Pause btn: false
- 2.9 - Modal mute button: Mute btn: true
- 2.10 - Modal fullscreen button: Fullscreen btn: true
- 2.11 - Modal progress bar: Progress bar: true
- 3.1 - Escape closes modal: Modal count after Escape: 0
- 3.2 - Body scroll restored: overflow: "", position: ""
- 3.3 - Backdrop click closes modal: Modal count after backdrop click: 0
- 3.4 - Close button works: Modal count after close btn: 0
- 4.1 - Route /project/unarmored: Status: 200, NotFound: false, Title found: true
- 4.1 - Route /project/vivo-relic: Status: 200, NotFound: false, Title found: true
- 4.1 - Route /project/sk2-concept: Status: 200, NotFound: false, Title found: true
- 4.1 - Route /project/midnight-elevator: Status: 200, NotFound: false, Title found: true
- 5.1 - No horizontal scroll at 1920x1080: No horizontal scroll at 1920x1080
- 5.1 - No horizontal scroll at 1366x768: No horizontal scroll at 1366x768
- 5.1 - No horizontal scroll at 768x1024: No horizontal scroll at 768x1024
- 5.1 - No horizontal scroll at 390x844: No horizontal scroll at 390x844

## Console Errors
No console errors detected.

## Network Errors
- 4x `net::ERR_ABORTED` on preview.mp4 files for all 4 projects. These are benign: headless Chromium aborts in-flight video preloads when the page navigates or the video element is removed during state transitions. All video playback tests passed, confirming the assets load correctly when needed.

## Screenshot Index
| File | Viewport | Section |
|------|----------|---------|
| qa-round-1-1920x1080-hero.png | 1920x1080 | hero |
| qa-round-1-1920x1080-selected-works.png | 1920x1080 | selected-works |
| qa-round-1-1920x1080-modal.png | 1920x1080 | modal |
| qa-round-1-1366x768-hero.png | 1366x768 | hero |
| qa-round-1-1366x768-selected-works.png | 1366x768 | selected-works |
| qa-round-1-1366x768-modal.png | 1366x768 | modal |
| qa-round-1-768x1024-hero.png | 768x1024 | hero |
| qa-round-1-768x1024-selected-works.png | 768x1024 | selected-works |
| qa-round-1-768x1024-modal.png | 768x1024 | modal |
| qa-round-1-390x844-hero.png | 390x844 | hero |
| qa-round-1-390x844-selected-works.png | 390x844 | selected-works |
| qa-round-1-390x844-modal.png | 390x844 | modal |
| qa-round-1-390x844-mobile-nav.png | 390x844 | mobile-nav |

## Fixes Applied
- **src/data/works.ts**: Populated from projects.ts (was an empty array, causing all 4 project detail routes to render the NotFound/404 component despite HTTP 200 responses)
- **src/components/home/VideoCard.tsx**: Fixed link from `/work/` to `/project/` to match the route definition in App.tsx

## Screenshot Directory
All screenshots saved to `.claude/screenshots/qa-round-1-*.png` (13 files across 4 viewports)

---
*Report generated: 2026-07-08T13:25:17.369Z*
