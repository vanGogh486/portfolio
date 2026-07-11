# Design System — 潘奕冰 Portfolio

> Last updated: 2026-07-08
> Status: Draft — awaiting art-director review

## Brand Positioning

**One sentence:** 潘奕冰 is a digital content and creative project practitioner who bridges human storytelling with AIGC production — her portfolio should feel like a curated film still, not a template gallery.

**Visual keywords:** cinematic · editorial · restrained · warm-dark · typographic

---

## Typography

| Role | Family | Weights | Usage |
|------|--------|---------|-------|
| Display | System sans-serif | 900 (Black) | Hero "PAN YIBING", section titles |
| Heading | System sans-serif | 700 (Bold) | Project titles, name |
| Body | System sans-serif | 400, 500 | Descriptions, about text |
| Utility | System sans-serif | 500 | Labels, metadata, nav |

**Type Scale (Desktop → Mobile):**

| Level | Desktop | Tablet | Mobile |
|-------|---------|--------|--------|
| Hero display | clamp(3.5rem, 7vw, 8rem) | clamp(2.5rem, 6vw, 5rem) | clamp(2rem, 8vw, 4rem) |
| H1 | 2.5rem | 2rem | 1.75rem |
| H2 | 1.5rem | 1.25rem | 1.125rem |
| Body | 0.875rem | 0.875rem | 0.8125rem |
| Caption | 0.75rem | 0.75rem | 0.6875rem |
| Label | 0.6875rem | 0.6875rem | 0.625rem |

**Line heights:** Display 0.88-0.95, Heading 1.1-1.2, Body 1.5-1.7

**Tracking:** Display -0.02em, Labels +0.12em to +0.2em uppercase

---

## Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--bg-primary` | `#0C0C0C` | Page background |
| `--bg-elevated` | `#141414` | Card, modal background |
| `--bg-card` | `#1A1A1A` | Hover state, inner containers |
| `--text-primary` | `#C8C0B8` | Headings, name |
| `--text-secondary` | `rgba(200,192,184,0.5)` | Body text |
| `--text-muted` | `rgba(200,192,184,0.3)` | Metadata, captions |
| `--accent` | `#B8936E` | Hover states only |
| `--border-subtle` | `rgba(255,255,255,0.05)` | Dividers, card borders |
| `--border-default` | `rgba(255,255,255,0.08)` | Interactive borders |

**Rules:**
- Accent color `#B8936E` is used ONLY for hover states on interactive elements
- Never use accent as background fill or large-area color
- No gradients with more than 2 color stops
- No neon, no acid, no rainbow

---

## Grid & Layout

| Breakpoint | Width | Columns | Gutter | Margin |
|------------|-------|---------|--------|--------|
| Desktop (≥1024px) | max-w-7xl (1280px) | 12 | 24px | auto |
| Laptop (768-1023px) | 100% - 64px | 8 | 20px | 32px |
| Tablet (640-767px) | 100% - 48px | 4 | 16px | 24px |
| Mobile (<640px) | 100% - 32px | 2 | 12px | 16px |

**Section vertical spacing:** py-24 (96px) to py-32 (128px)

---

## Border Radius

| Context | Value |
|---------|-------|
| Cards | 16px |
| Modal | 16px |
| Buttons | 9999px (pill) |
| Images (in cards) | 12px |
| Image containers | 16px |

---

## Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Icon-to-text gap |
| sm | 8px | Tight internal padding |
| md | 16px | Card padding |
| lg | 24px | Section gap, card gap |
| xl | 48px | Between major sections |
| 2xl | 96px | Section top/bottom |

---

## Motion

| Interaction | Duration | Easing | Notes |
|-------------|----------|--------|-------|
| Page entrance (hero) | 0.6-0.8s | [0.25, 0.1, 0.25, 1] | Staggered children |
| Scroll reveal | 0.5s | [0.25, 0.1, 0.25, 1] | y: 24px → 0 |
| Hover scale | 0.4s | ease-out | Card scale: 1.005, portrait: 1.012 |
| Parallax (mouse) | spring | stiffness: 40, damping: 28 | Disabled on touch + reduced-motion |
| Modal open | 0.35s | [0.25, 0.1, 0.25, 1] | scale 0.96→1, y 20px→0 |
| Modal close | 0.25s | ease-in | Reverse of open |
| Button hover arrow | 0.3s | ease-out | translateX: 0 → 4px |

**Parallax limits:**
- Person portrait: ±10px X, ±6px Y
- Background text: ±4px X, ±3px Y
- Concentric rings: ±10px X/Y

**Reduced motion:** Disable all parallax, scale animations, and scroll reveals. Keep opacity fades.

---

## Responsive Rules

### Desktop (≥1024px)
- Split Hero: left 46% portrait, right 54% text, vertical divider
- 3-column project grid
- Motion Reel: 2-row auto-scroll
- Modal: side-by-side (left info, right video)

### Laptop (768-1023px)
- Split Hero maintained, proportions adjusted
- 3-column → 2-column project grid
- Motion Reel: 2-row (smaller tiles)

### Tablet (640-767px)
- Hero stacks: portrait top, text bottom, horizontal divider
- 2-column project grid
- Modal: stacked (info above video)

### Mobile (<640px)
- Hero: portrait top 50%, text bottom 50%, horizontal divider
- 1-column project list
- Motion Reel: horizontal swipe
- Modal: full-screen bottom sheet
- Touch targets ≥ 44px
- No parallax, no hover-dependent interactions
