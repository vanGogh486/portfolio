# Launch Checklist — 潘奕冰 Portfolio

> Generated: 2026-07-10

## Site URLs

| Page | URL |
|------|-----|
| Homepage | http://localhost:5173/ |
| Visual Lab (backup) | http://localhost:5173/visual-lab |
| 《卸甲》 detail | http://localhost:5173/project/unarmored |
| 《终局圣物》 detail | http://localhost:5173/project/vivo-relic |
| SK-II detail | http://localhost:5173/project/sk2-concept |
| 《午夜电梯》 detail | http://localhost:5173/project/midnight-elevator |

## Homepage Sections

| # | Section | ID | Status |
|---|---------|-----|--------|
| 01 | Hero | — | ✅ Portrait, PAN YIBING, name, CTA, film drawer |
| 02 | About | `#about-section` | ✅ Portrait, intro, stats, capabilities, lens, education |
| 03 | Works | `#works-section` | ✅ 4 project cards, hover preview (卸甲), Cinematic Viewer |
| 04 | Experience | `#experience-section` | ✅ Education, practice, awards |
| 05 | Contact | `#contact-section` | ✅ Email copy, mailto, location |

## 4 Projects

| # | Title | Poster | Slug | Detail Page |
|---|-------|--------|------|-------------|
| 01 | 《卸甲》 | F.png ✅ | `unarmored` | HTTP 200 ✅ |
| 02 | 《终局圣物》 | G.png ✅ | `vivo-relic` | HTTP 200 ✅ |
| 03 | SK-II 概念广告 | H.png ✅ | `sk2-concept` | HTTP 200 ✅ |
| 04 | 《午夜电梯》 | I.png ✅ | `midnight-elevator` | HTTP 200 ✅ |

## Interactive Features

| Feature | Status |
|---------|--------|
| Hero portrait parallax | ✅ Desktop only, prefers-reduced-motion respected |
| Hero film drawer | ✅ Hover expand with 4 thumbnails |
| Works index → image switching | ✅ 400ms crossfade |
| 卸甲 hover video preview | ✅ 300ms delay, poster↔video crossfade, pointer-events-none |
| Cinematic Project Viewer | ✅ Esc/backdrop/close, PREV/NEXT arrows+keyboard, scroll lock+restore |
| About lens | ✅ Magnet + capability hover |
| Navigation anchors | ✅ Smooth scroll to sections |
| Mobile responsive | ✅ Stacked layout, no horizontal scroll |

## SEO

| Element | Value |
|---------|-------|
| Title | `潘奕冰｜数字内容、影视制作与AIGC作品集` |
| Description | `潘奕冰个人作品集，展示数字内容策划、影视制作、AIGC创作、品牌视频与互动叙事项目。` |
| OG image | `/portrait/hero-portrait.png` |
| Language | `zh-CN` |
| Favicon | `/favicon.svg` ✅ |

## Contact Info

| Field | Status |
|-------|--------|
| Email | 819859568@qq.com ✅ |
| Copy button | ✅ |
| Mailto link | ✅ |
| Location | 杭州 ✅ |
| Phone | ❌ Not displayed (privacy) |
| Address | ❌ Not displayed (privacy) |

## Resume

| Status | Details |
|--------|---------|
| ❌ PDF not found | No PDF in `public/resume/` or Desktop |
| Action needed | **User to provide PDF** → place in `public/resume/pan-yibing-resume.pdf` |
| Placeholder | Add download button to Hero + Contact once PDF is available |

## Build

| Check | Result |
|-------|--------|
| `npm run build` | ✅ Passed |
| TypeScript | ✅ (pre-existing baseUrl deprecation warning only) |
| Chunk size | 500KB+ (non-critical for launch) |

## Remaining Content Gaps

| Item | Status |
|------|--------|
| 卸甲 hover video | ✅ using `/projects/unarmored/preview.mp4` |
| vivo/SK-II/midnight hover videos | ❌ Not yet available — using static posters |
| 卸甲 full film | ❌ Preview only — "完整成片待接入" noted in Viewer |
| Resume PDF | ❌ Not yet provided |
| Process images for 卸甲 + 午夜电梯 | ❌ Missing |
| WebP optimized covers | ❌ No ffmpeg available |

## Mobile Test (390×844)

| Check | Status |
|-------|--------|
| Hero portrait complete | ✅ |
| Name + CTA visible | ✅ |
| About readable | ✅ |
| Works project switching | ✅ |
| No horizontal scroll | ✅ |
| Touch targets ≥ 44px | ✅ |
| Viewer opens (tap poster) | ✅ |
| Contact copy button | ✅ |

## Video Files (need future compression)

| File | Size |
|------|------|
| hero-desktop.mp4 | 7.7 MB |
| hero-mobile.mp4 | 11.3 MB |
| hero-background.mp4 | 10.9 MB |
| book/open.mp4 | 3.1 MB |
| book/flip.mp4 | 6.2 MB |
| book/close.mp4 | 4.1 MB |

## Deployment

| Item | Status |
|------|--------|
| SPA fallback | `dist/index.html` — needs server config for client-side routing |
| GitHub Pages | Not yet configured |
| Custom domain | Not yet configured |
| Netlify/Vercel | Recommended — auto SPA routing support |

## Recommended Next Steps

1. Provide resume PDF → add download button
2. Provide 卸甲 full film → replace "完整成片待接入" note
3. Install ffmpeg → compress video files
4. Deploy to Netlify or Vercel (auto-build from Git on push)

## Build Output

```
dist/
├── index.html
├── favicon.svg
└── assets/
    ├── index-*.css
    └── index-*.js
```

✅ Ready for deployment with SPA fallback configuration.
