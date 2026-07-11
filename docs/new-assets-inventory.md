# New Asset Inventory — 网站.zip

## Summary

| Category | Count | Total Size |
|----------|-------|------------|
| Design reference boards | 8 (A-E + 3 ChatGPT) | 14.0 MB |
| Decorative PNG images | 8 (F-M) | 14.3 MB |
| Checkerboard elements (NO alpha) | 4 (N-Q) | 4.9 MB |
| Hero videos | 3 (01-03) | 29.9 MB |
| Project/book videos | 4 (04, 09-11) | 23.3 MB |
| Decoration videos | 3 (12-14) | 12.2 MB |
| **Total** | **30 files** | **98.6 MB** |

---

## Design Reference Boards (DO NOT USE in production)

| File | Dims | Size | Content |
|------|------|------|---------|
| A.png | 1672×941 | 1.8 MB | UI design board — Hero layout reference |
| C.png | 1672×941 | 1.6 MB | UI design board — Selected Works layout |
| ChatGPT 22_28_48 (1) | 1672×941 | 1.4 MB | UI design board — Book modal layout |
| ChatGPT 22_28_48 (2) | 941×1672 | 1.7 MB | UI design board — Mobile layout |
| ChatGPT 22_55_21/25/28 | 1536×1024 | 5.5 MB | UI design boards — About/Experience layout |
| D.png | 1122×1402 | 1.7 MB | About section layout reference |
| E.png | 941×1672 | 1.6 MB | Mobile layout reference |

## About Portrait

| File | Dims | Size | Copied To |
|------|------|------|-----------|
| B.png | 1122×1402 | 1.3 MB | `public/media/portfolio-v2/about/portrait.png` |

## Decorative Images (used as backgrounds)

| File | Dims | Size | Usage |
|------|------|------|-------|
| F.png | 1586×992 | 2.0 MB | Landscape background |
| G.png | 1586×992 | 1.8 MB | Landscape background |
| H.png | 1586×992 | 1.4 MB | Landscape background |
| I.png | 1586×992 | 1.7 MB | Landscape background |
| J.png | 1672×941 | 1.4 MB | Wide landscape |
| K.png | 1672×941 | 1.8 MB | Wide landscape |
| L.png | 1672×941 | 2.0 MB | Wide landscape |
| M.png | 1672×941 | 1.9 MB | Wide landscape |

## Checkerboard Elements

| File | Dims | Size | Alpha | Action |
|------|------|------|-------|--------|
| N.png | 1254×1254 | 1.2 MB | ❌ NO | Cannot use directly. Baked checkerboard. Needs CSS/SVG recreation. |
| O.png | 1254×1254 | 1.3 MB | ❌ NO | Same as above |
| P.png | 1254×1254 | 1.3 MB | ❌ NO | Same as above |
| Q.png | 1254×1254 | 1.0 MB | ❌ NO | Same as above |

## Videos — Hero

| Original | Copied To | Size | Usage |
|----------|-----------|------|-------|
| 01｜首页Hero人物循环·桌面版.mp4 | `hero/hero-desktop.mp4` | 7.7 MB | Desktop hero person video |
| 02｜首页Hero人物循环·手机版.mp4 | `hero/hero-mobile.mp4` | 11.3 MB | Mobile hero person video |
| 03｜Hero无人物背景循环.mp4 | `hero/hero-background.mp4` | 10.9 MB | Background loop behind person |

⚠️ No ffmpeg available — cannot recompress. Files used as-is. Sizes larger than target (5-7MB).

## Videos — Book/Project

| Original | Copied To | Size | Actual Action |
|----------|-----------|------|---------------|
| 09｜作品册封面打开.mp4 | `book/open.mp4` | 3.1 MB | Book opening animation |
| 10｜内页翻页.mp4 | `book/flip.mp4` | 6.2 MB | Page flip animation |
| 11｜作品册关闭.mp4 | `book/close.mp4` | 4.1 MB | Book closing animation |
| 04｜《卸甲》项目Hover预览.mp4 | NOT copied (9.6MB) | — | Too large for hover. Use original 2.09MB preview. |

## Videos — Decorations

| Original | Copied To | Size | Usage |
|----------|-----------|------|-------|
| 12｜透明玻璃环循环.mp4 | `decorations/glass-loop.mp4` | 7.8 MB | About section glass ring |
| 13｜镜头光圈Loading动画.mp4 | `decorations/lens-loading.mp4` | 2.2 MB | Loading state |
| 14｜胶片漂浮装饰循环.mp4 | `decorations/film-loop.mp4` | 1.8 MB | About/Experience decoration |

---

## Video Classification of 09, 10, 11

After reviewing content:
- **09 → `open.mp4`**: Book cover opening (correctly named)
- **10 → `flip.mp4`**: Internal page flip (correctly named)
- **11 → `close.mp4`**: Book closing (correctly named)

## N, O, P, Q — Alpha Channel Result

All 4 files have `alpha=false` — the checkerboard pattern is baked into the RGB pixels. No transparent background. Cannot be used as overlay elements directly. CSS/SVG alternatives needed.
