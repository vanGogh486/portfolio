# Project Asset Matrix — 潘奕冰 Portfolio

> Last updated: 2026-07-09
> Status: Verified — all 13 consistency tests passed

## Four Project Identity Matrix

| slug | Title | EN Title | Type | Year | Detail Route |
|------|-------|----------|------|------|-------------|
| `unarmored` | 《卸甲》 | UNARMORED | AIGC叙事动画短片 | 2026 | `/project/unarmored` |
| `vivo-relic` | 《终局圣物》 | THE FINAL RELIC | AIGC产品概念片 | 2026 | `/project/vivo-relic` |
| `sk2-concept` | SK-II 神仙水 AIGC概念广告 | SK-II CONCEPT FILM | AIGC商业视觉练习 | 2026 | `/project/sk2-concept` |
| `midnight-elevator` | 《午夜电梯》 | MIDNIGHT ELEVATOR | AIGC互动恐怖短片 Demo | 2026 | `/project/midnight-elevator` |

## Asset Mapping

| slug | Poster (new) | Source | Hover Video | Preview Video | Gallery Dir | Process |
|------|-------------|--------|-------------|---------------|-------------|---------|
| `unarmored` | `/media/portfolio-v2/projects/unarmored/poster.png` | F.png (雪原战士) | ⏸ disabled | `/projects/unarmored/preview.mp4` | `/projects/unarmored/gallery/` (6 frames) | 3 storyboards |
| `vivo-relic` | `/media/portfolio-v2/projects/vivo/poster.png` | G.png (冰雪手机) | ⏸ disabled | `/projects/vivo-relic/preview.mp4` | `/projects/vivo-relic/gallery/` (6 frames) | 1 storyboard |
| `sk2-concept` | `/media/portfolio-v2/projects/sk2/poster.png` | H.png (产品定格) | ⏸ disabled | `/projects/sk2-concept/preview.mp4` | `/projects/sk2-concept/gallery/` (6 frames) | 3 process |
| `midnight-elevator` | `/media/portfolio-v2/projects/midnight-elevator/poster.png` | I.png (电梯惊悚) | ⏸ disabled | `/projects/midnight-elevator/preview.mp4` | `/projects/midnight-elevator/gallery/` (6 frames) | None |

## Directory → Slug Mapping

```
public/projects/unarmored/     ← unarmored
public/projects/vivo-relic/    ← vivo-relic
public/projects/sk2-concept/   ← sk2-concept
public/projects/midnight-elevator/ ← midnight-elevator

public/media/portfolio-v2/projects/unarmored/ ← unarmored (new poster)
public/media/portfolio-v2/projects/vivo/      ← vivo-relic (new poster)
public/media/portfolio-v2/projects/sk2/       ← sk2-concept (new poster)
public/media/portfolio-v2/projects/midnight-elevator/ ← midnight-elevator (new poster)
```

## Component Data Source Audit

| Component | Data Source | Field Used |
|-----------|------------|------------|
| ProjectCard | `src/data/projects.ts` | slug, title, cover, preview, hoverVideo, category, role |
| ProjectStack | `src/data/projects.ts` | all fields |
| ProjectPreviewModal | Receives Project object | slug, title, cover, preview, role, summary, englishTitle, year, category, disclaimer |
| BookModal | Hardcoded to unarmored | unarmored paths |
| MotionReel | `src/data/projects.ts` | slug, cover, preview |
| VideoCard (RelatedWorks) | `src/data/works.ts` → derived from `projects.ts` | slug, title, thumbnail, video |
| WorkDetailPage | `useWorkBySlug()` → `src/data/works.ts` | slug, title, content, thumbnail, video |

## Consistency Test Results (13/13 PASS)

```
✓ unarmored poster matches (unarmored/poster.png)
✓ vivo-relic poster matches (vivo/poster.png)
✓ sk2-concept poster matches (sk2/poster.png)
✓ midnight-elevator poster matches (midnight-elevator/poster.png)
✓ unarmored: modal slug matches card slug
✓ unarmored: BookModal size 1200×760 (no collapse)
✓ vivo-relic: modal slug matches card slug
✓ sk2-concept: modal slug matches card slug
✓ midnight-elevator: modal slug matches card slug
✓ unarmored: detail page loads (HTTP 200)
✓ vivo-relic: detail page loads (HTTP 200)
✓ sk2-concept: detail page loads (HTTP 200)
✓ midnight-elevator: detail page loads (HTTP 200)
```

## Hover Video Status

| Project | Has Hover Video | Status |
|---------|----------------|--------|
| unarmored | Yes (existing) | ⏸ Temporarily disabled during data fix |
| vivo-relic | No | Static poster + CSS hover effect |
| sk2-concept | No | Static poster + CSS hover effect |
| midnight-elevator | No | Static poster + CSS hover effect |
