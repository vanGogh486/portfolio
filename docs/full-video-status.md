# Full Video Status — 潘奕冰 Portfolio

| # | Project | Slug | Preview | Full Video | Can Play Full? |
|---|---------|------|---------|------------|----------------|
| 01 | 《卸甲》 | unarmored | `/projects/unarmored/preview.mp4` (2.09MB) | ❌ null | No — preview only |
| 02 | 《终局圣物》 | vivo-relic | `/projects/vivo-relic/preview.mp4` (1.03MB) | ❌ null | No — preview only |
| 03 | SK-II | sk2-concept | `/projects/sk2-concept/preview.mp4` (4.16MB) | ❌ null | No — preview only |
| 04 | 《午夜电梯》 | midnight-elevator | `/projects/midnight-elevator/preview.mp4` (2.67MB) | ❌ null | No — preview only |

**Summary**: None of the 4 projects currently have a full-length video configured. All `fullVideo` fields are `null`. The "播放完整作品" button is hidden across all viewers until full videos are provided.

**To add a full video** for any project, update `src/data/projects.ts`:
```ts
fullVideo: '/path/to/full-video.mp4',
```
