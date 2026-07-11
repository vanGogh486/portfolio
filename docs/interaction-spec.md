# Interaction Specification — 潘奕冰 Portfolio

> Last updated: 2026-07-08
> Status: Complete — validated against ProjectStack.tsx and ProjectPreviewModal.tsx

---

## Architecture Overview

Three interdependent state machines govern all interaction:

```
┌──────────────────────────────────────────────────────────────┐
│                    GALLERY CONTROLLER                        │
│  scrollPosition: number | null                               │
│  activeCardId: string | null    (which card is hovered)     │
│  activeModalId: string | null   (which modal is open)       │
│  bodyScrollLocked: boolean                                   │
│  videoPlaybackRegistry: Set<string>  (IDs of playing videos)│
└──────────┬──────────────────────────────┬────────────────────┘
           │                              │
           ▼                              ▼
┌─────────────────────┐        ┌─────────────────────┐
│   CARD STATE MACHINE│        │  MODAL STATE MACHINE│
│   (one per card)    │        │  (singleton)        │
└─────────────────────┘        └─────────────────────┘
```

---

## 1. Card State Machine

### 1.1 State Definitions

```
                           ┌──────────┐
                    ┌─────→│   IDLE   │←──────────────────────────────┐
                    │      └────┬─────┘                               │
                    │           │ mouseenter                          │
                    │           ▼                                      │
                    │      ┌──────────────┐                           │
                    │      │ HOVER_PENDING│ 250ms timer               │
                    │      └──────┬───────┘                           │
                    │             │ timer fires (250ms)               │
                    │             ▼                                    │
                    │      ┌──────────────┐  mouseleave              │
                    │      │HOVER_PREVIEW │────────────┐              │
                    │      │   PLAYING    │            │              │
                    │      └──────┬───────┘            │              │
                    │             │ click               │              │
                    │             ▼                     │              │
                    │      ┌──────────────┐            │              │
                    │      │   CLICKED    │            │              │
                    │      │ (card presses│            │              │
                    │      │  scale 0.98) │            │              │
                    │      └──────┬───────┘            │              │
                    │             │ modal opens        │              │
                    │             ▼                     │              │
                    │      ┌──────────────┐            │              │
                    │      │   DISMISSED  │            │              │
                    │      │ (modal just  │            │              │
                    │      │  closed)     │            │              │
                    │      └──────┬───────┘            │              │
                    │             │ restore focus      │              │
                    └─────────────┘                    │              │
                                                       │              │
                    ┌──────────────────────────────────┘              │
                    │ mouseleave                                     │
                    ▼                                                │
              ┌──────────────┐                                      │
              │ HOVER_LEAVE  │─── 300ms reset to poster ────────────┘
              └──────────────┘
```

### 1.2 State Details

| # | State | Trigger | Card Visual | Video Element | Duration | Easing |
|---|-------|---------|-------------|---------------|----------|--------|
| 0 | **IDLE** | Page load / after hover-leave reset / after modal close | Static cover image at full opacity. Card bg `#141414`, border `white/0.04` | `<video>` hidden (`opacity: 0`, `display: none` on mobile). `currentTime = 0`. | -- | -- |
| 1 | **HOVER_PENDING** | `mouseenter` on card | Card bg transitions to `#181818`, border to `white/0.1`. Cover image still visible. | Video begins `preload` if not already. Does NOT play yet. | 250ms delay before advancing | `ease-out`, 200ms for bg/border |
| 2 | **HOVER_PREVIEW** | 250ms timer expires (only if mouse still on card) | Cover image fades to 40% opacity. Card scale `1.005`. | Video fades in (`opacity: 0 → 1`), plays muted, loop. Playback limited to 3–6s segment (seek to `0` if loop restarts). | Cover dim: 300ms. Video fade-in: 300ms. Playback: continuous loop. | Cover: `ease-out`. Video: `ease-in-out`. |
| 3 | **CLICKED** | `mousedown` on card (or `touchstart`) | Card scale `0.98`. bg darkens slightly. | Video continues playing (do NOT pause). | 150ms press, then modal begins opening | `ease-in`, 150ms |
| 4 | **DISMISSED** | Modal close animation completes | Card returns to IDLE: cover full opacity, scale `1.0`, bg/border back to idle. Focus ring visible on the card. | Video hidden, `currentTime = 0`, paused. | 300ms | `ease-out`, 300ms |
| 5 | **HOVER_LEAVE** | `mouseleave` from card (any hover state) | Card bg/border return to idle. Cover fades back to full opacity. Scale returns to `1.0`. | Video fades out (`opacity: 1 → 0`), pauses, `currentTime` resets to `0`. | 300ms total | `ease-out`, 300ms |
| 6 | **ERROR** | Video `error` event fires during HOVER_PREVIEW | Cover stays at full opacity. Video hidden. No broken-icon shown. | `<video>` removed from DOM or replaced with a transparent placeholder. Error logged to console (non-blocking). | Immediate | -- |

### 1.3 Transition Guard

The 250ms HOVER_PENDING timer MUST be cancelled if:
- `mouseleave` fires before the timer expires -- transition directly to HOVER_LEAVE
- The card enters CLICKED state (click before preview started) -- cancel timer, proceed to CLICKED

### 1.4 Video Segment Looping (3-6s)

```
playback model:
  On HOVER_PREVIEW enter:
    1. video.currentTime = 0
    2. video.play()
    3. Start a 6s timeout
  On 6s timeout fire:
    4. video.pause()
    5. video.currentTime = 0
    6. Wait 500ms (shows poster frame briefly)
    7. video.play()  → loop restarts
  On HOVER_LEAVE:
    8. Clear timeout
    9. video.pause()
   10. video.currentTime = 0
```

This prevents the preview from playing the entire video and gives a "teaser" feel.

---

## 2. Modal State Machine

### 2.1 State Definitions

```
                         ┌──────────┐
                         │  CLOSED  │←──────────────────────────────┐
                         └────┬─────┘                               │
                              │ card click                          │
                              ▼                                      │
                         ┌──────────────┐                           │
                         │   OPENING    │ 350ms (modal + backdrop)  │
                         └──────┬───────┘                           │
                                │ animation complete                │
                                ▼                                    │
                         ┌──────────────┐                           │
                    ┌───→│     OPEN     │                           │
                    │    │ (poster view)│                           │
                    │    └──┬───┬───┬───┘                           │
                    │       │   │   │                               │
                    │       │   │   └── "View Full Case" click      │
                    │       │   │                                    │
                    │       │   └── close btn / Esc / backdrop       │
                    │  user │                                        │
                    │ clicks│                                        │
                    │  play │                                        │
                    │       │                                        │
                    │       ▼                                        │
                    │    ┌──────────────┐                           │
                    │    │VIDEO_PLAYING │                           │
                    │    └──┬───┬───┬───┘                           │
                    │       │   │   │                               │
                    │  pause│   │   └── video ends                  │
                    │       │   │                                    │
                    │       ▼   │                                    │
                    │    ┌──────────────┐   ┌──────────────┐        │
                    └────│VIDEO_PAUSED  │   │ VIDEO_ENDED  │        │
                         └──────────────┘   └──────┬───────┘        │
                                                   │                 │
                              ┌────────────────────┼─────────────────┘
                              │                    │
                              ▼                    ▼
                         ┌──────────────┐   ┌──────────────┐
                         │   CLOSING    │   │ NAVIGATING   │
                         │   250ms      │   │ (to detail)  │
                         └──────┬───────┘   └──────────────┘
                                │ animation complete
                                ▼
                         ┌──────────────┐
                         │  CLOSED      │
                         │ (scroll      │
                         │  restored)   │
                         └──────────────┘
```

### 2.2 State Details

| # | State | Trigger | Visual | Audio | Focus | Duration |
|---|-------|---------|--------|-------|-------|----------|
| 0 | **CLOSED** | Initial / after close | Modal not in DOM. `body overflow: ''`. | N/A | On triggering card (or last focused element) | -- |
| 1 | **OPENING** | Card `mousedown` → `click` | **Backdrop**: fades from `opacity: 0` to `opacity: 1` (black/80 + blur). **Modal panel**: scales from `0.96` to `1.0`, translates from `+20px` Y to `0`. | N/A | Focus moves to modal container (`role="dialog"`). `body overflow: hidden` set immediately. | Backdrop: 250ms. Panel: 350ms. Easing: `cubic-bezier(0.25, 0.1, 0.25, 1)` |
| 2 | **OPEN** | Opening animation complete | Modal fully visible. **Video shows poster frame** (cover image as `poster` attribute). Play button overlay visible. Video does NOT auto-play. Left panel: project info visible. | Silent. Video `muted` but not playing. | Focus trapped inside modal. First focusable element (close button) receives focus. | -- |
| 3 | **VIDEO_PLAYING** | User clicks play button on video | Video plays with native controls visible. Progress bar advances. Play button swaps to pause icon. | Muted by default; user can click unmute in controls. | Focus can move to video controls. | -- |
| 4 | **VIDEO_PAUSED** | User clicks pause button | Video freezes on current frame. Pause icon swaps to play icon. Poster does NOT re-appear (shows paused frame). | Silent. | Focus remains on video controls. | -- |
| 5 | **VIDEO_ENDED** | Video `ended` event fires | Video shows last frame or poster. Play button becomes replay icon. | Silent. | Focus remains on video. | -- |
| 6 | **VIDEO_FULLSCREEN** | User clicks fullscreen button in native controls | Native fullscreen API activated. Modal backdrop still present behind fullscreen video. | Per native controls. | Per native fullscreen behavior. | -- |
| 7 | **VIDEO_ERROR** | Video `error` event fires | Video element hidden. Cover image shown in its place as static fallback. An `<img>` tag renders with `project.cover`. No broken-media icon. | N/A | Fallback image is not interactive. | Immediate |
| 8 | **CLOSING** | Close button click / Escape key / backdrop click | Reverse of OPENING: panel scales to `0.96`, translates to `+20px` Y, opacity to `0`. Backdrop fades to `opacity: 0`. | Video pauses immediately. | Focus returns to the card that triggered the modal. | 250ms. Easing: `cubic-bezier(0.55, 0.05, 0.35, 1)` (slightly faster exit) |
| 9 | **NAVIGATING** | "View Full Case" link clicked | Modal begins CLOSING animation. On animation complete, navigate to `/project/:slug`. | Video pauses. | After navigation, focus on new page per browser default. | 250ms closing, then route change |
| 10 | **ERROR_FALLBACK** | Modal fails to mount or project data is null/invalid | Modal does not render. Instead, immediately navigate to `/project/:slug` (the detail page). `body overflow` restored. | N/A | On detail page. | Immediate route push |

### 2.3 Modal Open Sequence (Detailed Timeline)

```
t=0ms     Card mousedown → card scale 0.98 (150ms press effect)
t=0ms     Save window.scrollY to gallery controller
t=0ms     Set body.style.overflow = 'hidden'
t=0ms     Set body.style.paddingRight = scrollbarWidth + 'px' (prevents layout shift)
t=0ms     Mount modal component (display: fixed, inset: 0, z-index: 100)
t=0ms     Backdrop starts fading in (opacity 0→1, 250ms)
t=0ms     Modal panel starts scaling in (0.96→1.0, +20px→0 Y, 350ms)
t=150ms   Card press effect completes (card enters CLICKED state)
t=250ms   Backdrop fully visible
t=350ms   Modal panel fully visible, focus moves to close button
t=350ms   Modal in OPEN state
```

### 2.4 Modal Close Sequence (Detailed Timeline)

```
t=0ms     Trigger: Escape / close btn / backdrop click
t=0ms     Pause video (if playing)
t=0ms     Start closing animation (backdrop + panel, 250ms)
t=250ms   Animation complete
t=250ms   Unmount modal from DOM
t=250ms   body.style.overflow = ''
t=250ms   body.style.paddingRight = ''
t=250ms   window.scrollTo(0, savedScrollPosition)
t=250ms   Return focus to triggering card (card enters DISMISSED state)
t=550ms   Card DISMISSED animation completes, card returns to IDLE
```

---

## 3. Gallery Controller (Global)

### 3.1 Responsibilities

The Gallery Controller is a single module/context that manages:

| Responsibility | Implementation |
|----------------|---------------|
| **Scroll position** | Save `window.scrollY` before modal opens, restore on close. Use `window.scrollTo({ top, behavior: 'instant' })` to avoid animated scroll. |
| **Single video playback** | Maintain a registry (`Set<string>`) of currently-playing video element IDs. Before any video plays, pause all others in the registry. |
| **Off-screen pause** | Use `IntersectionObserver` (threshold: `0.5`) on every card. When a card drops below 50% visibility, pause its preview video and reset to poster. When it rises above 50%, do NOT auto-play (only play on hover). |
| **Body scroll lock** | Toggle `document.body.style.overflow` and compensate for scrollbar width (`window.innerWidth - document.documentElement.clientWidth`). |
| **prefers-reduced-motion** | Listen to `matchMedia('(prefers-reduced-motion: reduce)')`. When active, disable all scale transforms, parallax, and Y-axis translations. Keep opacity fades. |
| **prefers-color-scheme** | Currently dark-only. No toggle. |

### 3.2 Single Video Playback Protocol

```
function requestVideoPlayback(videoElement: HTMLVideoElement): boolean {
  1. Pause all videos currently in the playbackRegistry
  2. Clear the registry
  3. Add this videoElement to the registry
  4. Call videoElement.play()
  5. Return true if play() succeeded, false if rejected
}

function releaseVideoPlayback(videoElement: HTMLVideoElement): void {
  1. videoElement.pause()
  2. videoElement.currentTime = 0
  3. Remove from registry
}
```

Call `requestVideoPlayback` when:
- A card enters HOVER_PREVIEW
- A user clicks play in the modal

Call `releaseVideoPlayback` when:
- A card enters HOVER_LEAVE
- Modal video is paused or modal closes

### 3.3 IntersectionObserver for Off-Screen Pause

```
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.intersectionRatio < 0.5) {
        // Card is mostly off-screen
        releaseVideoPlayback(entry.target.querySelector('video'))
      }
      // Do NOT auto-play when scrolling back into view
    })
  },
  { threshold: [0.5] }
)

// Observe each card's container div
cards.forEach(card => observer.observe(card))
```

---

## 4. Input Modes

### 4.1 Mouse (Desktop)

| Action | Element | Behavior | Timing |
|--------|---------|----------|--------|
| Move cursor over card | Card container | Enter HOVER_PENDING state. Card bg/border begin transition. | 200ms bg/border |
| Cursor stays on card 250ms | Card container | Enter HOVER_PREVIEW state. Preview video plays muted, cover dims. | 300ms cover dim + video fade-in |
| Move cursor off card | Card container | Enter HOVER_LEAVE. Video pauses, resets, cover restores. | 300ms |
| Mousedown on card | Card container | Enter CLICKED. Card presses to scale 0.98. | 150ms |
| Mouseup on card (after mousedown) | Card container | Modal begins opening sequence. | 350ms |
| Click play button on modal video | Modal video | Enter VIDEO_PLAYING. | Immediate |
| Click pause button | Modal video | Enter VIDEO_PAUSED. | Immediate |
| Click close button | Modal close btn | Enter CLOSING. | 250ms |
| Click backdrop | Modal backdrop | Enter CLOSING. | 250ms |
| Click "View Full Case" | Modal link | Enter NAVIGATING → CLOSING → route change. | 250ms + route |

### 4.2 Keyboard

#### 4.2.1 Global Tab Order (Modal Closed)

```
1. Skip-to-content link (hidden until focused)
2. Header: Logo (link to /)
3. Header: Navigation links (left to right)
4. Main content:
   a. Hero CTAs (if any)
   b. Project cards (in DOM order, top to bottom)
   c. About section interactive elements
   d. Capabilities (if interactive)
   e. Experience timeline
   f. Contact form fields
5. Footer: Links
```

#### 4.2.2 Card-Level Keyboard

| Key | Context | Action |
|-----|---------|--------|
| Tab | Card in IDLE | Focus moves to next card (card itself is focusable as `<button>`) |
| Shift+Tab | Card in IDLE | Focus moves to previous card |
| Enter | Card focused | Open modal (same as click) |
| Space | Card focused | Open modal (same as click). Prevent default scrolling. |

**Note on Card focus visual**: When a card receives focus via keyboard (`:focus-visible`), show a `2px` outline in `#8b5cf6` (violet-500) with `2px` offset, in addition to the hover bg/border treatment. Do NOT show this outline on mouse click (`:focus:not(:focus-visible)`).

#### 4.2.3 Modal Focus Trap (Tab Order)

```
Forward Tab (Tab key):
  Close button → Video play/pause → Video mute/unmute → Video progress scrub → "View Full Case" link → Close button

Reverse Tab (Shift+Tab):
  Close button → "View Full Case" link → Video progress scrub → Video mute/unmute → Video play/pause → Close button
```

Implementation logic:

```
const FOCUSABLE_SELECTOR = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"]), video[controls]'

function trapFocus(modalElement: HTMLElement, e: KeyboardEvent) {
  const focusable = modalElement.querySelectorAll(FOCUSABLE_SELECTOR)
  const first = focusable[0]   // Close button
  const last = focusable[focusable.length - 1]  // "View Full Case" link

  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault()
    last.focus()
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault()
    first.focus()
  }
}
```

#### 4.2.4 Modal Keyboard Shortcuts

| Key | Context | Action |
|-----|---------|--------|
| Escape | Modal open (any state) | Enter CLOSING → CLOSED |
| Tab | Modal open | Cycle through focus trap (see above) |
| Shift+Tab | Modal open | Reverse cycle |
| Space | Video focused | Toggle play/pause |
| Enter | Video focused | Toggle play/pause |
| ArrowLeft | Video focused | Seek backward 5 seconds |
| ArrowRight | Video focused | Seek forward 5 seconds |
| ArrowUp | Video focused | Increase volume (if unmuted) |
| ArrowDown | Video focused | Decrease volume (if unmuted) |
| M | Video focused | Toggle mute |
| F | Video focused | Toggle fullscreen |

### 4.3 Touch (Mobile / Tablet)

| Action | Element | Behavior | Notes |
|--------|---------|----------|-------|
| Tap card | Card container | Open modal directly. NO hover preview. | Card gives haptic-style press feedback (scale 0.98, 150ms) before modal opens. |
| Tap play button | Modal video | Enter VIDEO_PLAYING. Mobile browsers may require a user gesture to play; this tap satisfies that. | Video plays inline (`playsInline`). |
| Tap pause / tap video | Modal video | Enter VIDEO_PAUSED. | Standard mobile video behavior. |
| Tap close button | Modal close btn | Enter CLOSING. | Minimum touch target: 44x44px. |
| Tap backdrop (outside modal panel) | Modal backdrop | Enter CLOSING. | Ensure backdrop covers full viewport. |
| Swipe down on modal panel | Modal panel | Enter CLOSING (optional, gesture-dependent). If not implementing swipe, tap close button only. | This is a nice-to-have; not required. |
| Scroll vertically | Page (modal closed) | Normal scroll. Cards scroll into/out of view. | IntersectionObserver pauses off-screen videos. |
| Scroll vertically | Modal open | Scroll is locked. If modal content overflows, scroll inside modal panel only (its `overflow-y: auto`). | Modal panel has `max-h-[90vh] overflow-y-auto`. |

**Mobile Modal Layout**: On screens narrower than 768px (`md:` breakpoint), the modal layout stacks vertically: info on top, video on bottom. Video has `min-h-[240px]`. The close button remains top-right at `44x44px`.

---

## 5. Animation Specifications

### 5.1 Easing Curves

| Name | Cubic-Bezier | Use |
|------|-------------|-----|
| **modal-enter** | `cubic-bezier(0.25, 0.1, 0.25, 1.0)` | Modal panel scale + translate on open |
| **modal-exit** | `cubic-bezier(0.55, 0.05, 0.35, 1.0)` | Modal panel scale + translate on close (slightly faster, snappier exit) |
| **fade** | `ease-out` (CSS default) | Backdrop opacity, cover dim, video fade-in/out, bg/border transitions |
| **press** | `ease-in` (CSS default) | Card scale on mousedown (0.98) |

### 5.2 prefers-reduced-motion Adaptations

When `window.matchMedia('(prefers-reduced-motion: reduce)').matches` is `true`:

| Animation | Normal | Reduced Motion |
|-----------|--------|---------------|
| Card scale on hover | `scale: 1.005` | **Disabled** (`scale: 1.0`) |
| Card scale on press | `scale: 0.98` | **Disabled** |
| Modal panel scale-in | `0.96 → 1.0` | **Disabled** (appears at `1.0`) |
| Modal panel slide-up | `+20px → 0 Y` | **Disabled** (appears at `0`) |
| Hero parallax | portrait ±10px, text ±4px | **Disabled** |
| Scroll-triggered reveals | `opacity: 0, y: 20 → opacity: 1, y: 0` | **Opacity only** (`opacity: 0 → 1`, no Y movement) |
| Cover dim | `opacity: 1 → 0.4` | **Kept** (opacity only, no motion) |
| Video fade-in | `opacity: 0 → 1` | **Kept** |
| Backdrop fade | `opacity: 0 → 1` | **Kept** |
| Arrow translate on hover | `translateX: 0 → 4px` | **Disabled** |
| Cover image scale on hover | `scale: 1.0 → 1.05` | **Disabled** |

Detection pattern:

```typescript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Also listen for runtime changes:
const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
mediaQuery.addEventListener('change', (e) => {
  // Update animation config
})
```

### 5.3 Transition Durations Summary

| Transition | Duration | Easing |
|------------|----------|--------|
| Card bg/border (idle → hover) | 200ms | ease-out |
| Hover delay timer | 250ms | -- |
| Cover image dim | 300ms | ease-out |
| Video preview fade-in | 300ms | ease-in-out |
| Card press (mousedown) | 150ms | ease-in |
| Modal backdrop fade-in | 250ms | ease-out |
| Modal panel enter | 350ms | modal-enter |
| Modal backdrop fade-out | 250ms | ease-out |
| Modal panel exit | 250ms | modal-exit |
| Hover leave reset (cover + video) | 300ms | ease-out |
| Dismissed card restore | 300ms | ease-out |
| Arrow translate | 300ms | ease-out |

---

## 6. Error Handling Matrix

### 6.1 Video Errors

| Scenario | Detection | Recovery | User Impact |
|----------|-----------|----------|-------------|
| Preview video network error (404, CORS, timeout) | `<video>.onerror` event | Hide `<video>`, show cover `<img>` at full opacity. Log to console with project slug. | User sees static cover. Hover has no preview, but click still works. |
| Preview video decode error | `<video>.onerror` with `MEDIA_ERR_DECODE` | Same as above. | Same as above. |
| Modal video network error | `<video>.onerror` event | Hide `<video>`, show cover `<img>` as fallback. Keep modal open (text info still visible). "View Full Case" link still works. | User sees static cover instead of video. Can still read project info and navigate to detail. |
| All videos fail + cover image fails | `<img>.onerror` on cover | Show CSS gradient placeholder using project-specific accent color (e.g., `linear-gradient(135deg, #1a1a2e, #16213e)`). | User sees colored gradient placeholder. Card is still clickable. |
| Modal mount failure (React error boundary) | Error boundary catches render error | Immediately navigate to `/project/:slug`. Restore body scroll. Show a brief toast: "Opening project..." (optional). | User lands on detail page instead of modal. No data loss. |

### 6.2 Network & Environment Errors

| Scenario | Detection | Recovery |
|----------|-----------|----------|
| Network offline | `navigator.onLine === false` | Skip all video loads. Show static covers only. Card click navigates directly to detail page (skip modal). |
| JavaScript disabled | `<noscript>` fallback | Each card is wrapped in `<noscript><a href="/project/:slug">...</a></noscript>`. Click goes directly to detail page. |
| Slow connection (preview video takes >3s to load) | `video.readyState < 2` after 3s | Keep cover at full opacity. Show subtle loading indicator (pulsing ring on thumbnail). Do not interrupt user. |

### 6.3 Focus Restoration Failure

If the triggering card is no longer in the DOM when the modal closes (e.g., due to a route change or dynamic content update), fall back to focusing `document.body` or the `#selected-works` section heading.

---

## 7. Accessibility Requirements

### 7.1 ARIA Attributes

| Element | Attribute | Value |
|---------|-----------|-------|
| Card button | `aria-label` | `"View {project.title} — {project.category}"` |
| Card video (preview) | `aria-hidden` | `"true"` (decorative only) |
| Card cover image | `alt` | `"{project.title} cover image"` |
| Modal container | `role` | `"dialog"` |
| Modal container | `aria-modal` | `"true"` |
| Modal container | `aria-label` | `"{project.title} — project preview"` |
| Modal container | `aria-describedby` | ID of the summary paragraph element |
| Close button | `aria-label` | `"关闭预览"` (Close preview) |
| Modal video | `aria-label` | `"{project.title} preview video"` |
| "View Full Case" link | `aria-label` | `"查看 {project.title} 的完整案例"` |
| Backdrop div | `aria-hidden` | `"true"` |

### 7.2 Focus Management

```
On modal open:
  1. Save document.activeElement (the card that was clicked)
  2. Set focus to the first focusable element in the modal (close button)
  3. Announce modal to screen reader via aria-live region or role="dialog"

On modal close:
  1. Return focus to the saved element (the card)
  2. If card is gone, focus #selected-works heading
  3. Screen reader reads the card's accessible name on focus
```

### 7.3 Keyboard-Only Testing Checklist

- [ ] Tab through all cards in gallery without opening any
- [ ] Open a card with Enter
- [ ] Open a card with Space (verify page does not scroll)
- [ ] Tab through all modal controls in forward order
- [ ] Tab through all modal controls in reverse order (Shift+Tab)
- [ ] Close modal with Escape
- [ ] Verify focus returns to the card that was opened
- [ ] Open modal, tab to video, use Space to play/pause
- [ ] Open modal, use ArrowLeft/ArrowRight to seek video
- [ ] Tab to "View Full Case", press Enter, verify navigation
- [ ] After closing, tab to next card and open it
- [ ] Verify no focusable elements are reachable behind the modal

### 7.4 Screen Reader Testing Checklist

- [ ] Card is announced as button with project name
- [ ] Modal opening is announced (role="dialog" triggers announcement)
- [ ] Close button announced as "关闭预览"
- [ ] Video announced with project title
- [ ] "View Full Case" announced as link
- [ ] Modal closing returns focus and announces the card
- [ ] Images have descriptive alt text
- [ ] Decorative video has aria-hidden

### 7.5 Color and Contrast

- All text meets WCAG AA contrast ratio (4.5:1 for normal text, 3:1 for large text) against `#141414` background
- Focus ring (`#8b5cf6` on dark bg): sufficient contrast
- Text colors used: `white/0.85` (#D9D9D9), `white/0.55` (#8C8C8C), `white/0.35` (#595959), `white/0.25` (#404040), `white/0.18` (#2E2E2E)
- Verify `white/0.35` body text meets 4.5:1 against `#141414`: `#595959` on `#141414` = ~3.2:1 -- **fails**. Consider bumping to `white/0.55` (#8C8C8C, ~5.3:1) for body text.

---

## 8. Implementation Checklist

### Phase 1: Card Hover (Priority: High)

- [ ] Implement 250ms hover delay timer per card
- [ ] Implement video segment looping (play 0-6s, pause, reset, loop)
- [ ] Implement cover dim / video fade-in transitions
- [ ] Implement HOVER_LEAVE reset (pause, currentTime=0, cover restore)
- [ ] Add `video.onerror` handler per card with cover fallback
- [ ] Hide preview video on mobile (`display: none` below `sm:`)

### Phase 2: Modal Core (Priority: High)

- [ ] Save scroll position before modal open
- [ ] Lock body scroll (`overflow: hidden` + scrollbar width compensation)
- [ ] Implement focus trap (Tab/Shift+Tab cycle)
- [ ] Implement Escape key handler
- [ ] Implement backdrop click handler
- [ ] Return focus to triggering card on close
- [ ] Restore scroll position on close
- [ ] DO NOT auto-play modal video (show poster + play button)
- [ ] Add modal video error fallback (cover image)
- [ ] Implement ARIA attributes per Section 7.1

### Phase 3: Global Controller (Priority: Medium)

- [ ] Implement single-video-playback registry
- [ ] Implement IntersectionObserver for off-screen pause
- [ ] Implement prefers-reduced-motion detection and adaptation
- [ ] Add `<noscript>` fallback for cards
- [ ] Implement network offline detection

### Phase 4: Polish (Priority: Medium)

- [ ] Add card mousedown press effect (scale 0.98)
- [ ] Add modal "View Full Case" close-then-navigate sequence
- [ ] Mobile: verify 44x44px touch targets
- [ ] Test full keyboard navigation flow
- [ ] Test with screen reader
- [ ] Verify WCAG contrast compliance

---

## 9. State Machine Reference Card

### Card States (quick lookup)

```
IDLE                → HOVER_PENDING   (mouseenter)
HOVER_PENDING       → HOVER_PREVIEW   (250ms timer, mouse still over)
HOVER_PENDING       → HOVER_LEAVE     (mouseleave before timer)
HOVER_PREVIEW       → CLICKED         (mousedown)
HOVER_PREVIEW       → HOVER_LEAVE     (mouseleave)
CLICKED             → OPENING         (mouseup, modal opens)
DISMISSED           → IDLE            (300ms restore animation)
HOVER_LEAVE         → IDLE            (300ms reset)
*                   → ERROR           (video.onerror)
```

### Modal States (quick lookup)

```
CLOSED              → OPENING         (card click)
OPENING             → OPEN            (350ms animation complete)
OPEN                → VIDEO_PLAYING   (user clicks play)
OPEN                → CLOSING         (close/Esc/backdrop)
OPEN                → NAVIGATING      ("View Full Case" click)
VIDEO_PLAYING       → VIDEO_PAUSED    (user clicks pause)
VIDEO_PLAYING       → VIDEO_ENDED     (video ends)
VIDEO_PLAYING       → VIDEO_ERROR     (video.onerror)
VIDEO_PLAYING       → CLOSING         (close/Esc/backdrop)
VIDEO_PAUSED        → VIDEO_PLAYING   (user clicks play)
VIDEO_PAUSED        → CLOSING         (close/Esc/backdrop)
VIDEO_ENDED         → VIDEO_PLAYING   (user clicks replay)
VIDEO_ENDED         → CLOSING         (close/Esc/backdrop)
VIDEO_ERROR         → CLOSING         (close/Esc/backdrop)
CLOSING             → CLOSED          (250ms animation complete)
NAVIGATING          → (route change)  (250ms closing + navigation)
*                   → ERROR_FALLBACK  (modal render failure)
```
