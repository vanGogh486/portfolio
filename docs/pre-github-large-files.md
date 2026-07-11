# Pre-GitHub Large File Report

## Summary

| Size | Count | Files |
|------|-------|-------|
| >100 MB | 2 | unarmored/full.mp4 (176MB), vivo-relic/full.mp4 (188MB) |
| >90 MB | 2 | (same as >100MB) |
| >50 MB | 4 | above + midnight/full.mp4 (73MB), sk2/full.mp4 (50MB) |

## All Large Files in public/

| File | Size | Git Tracked? |
|------|------|--------------|
| vivo-relic/full.mp4 | 188 MB | ✅ Yes |
| unarmored/full.mp4 | 176 MB | ✅ Yes |
| midnight-elevator/full.mp4 | 73 MB | ✅ Yes |
| sk2-concept/full.mp4 | 50 MB | ✅ Yes |
| midnight/interactive/intro.mp4 | 45 MB | ✅ Yes |
| midnight/interactive/branch-b.mp4 | 35 MB | ✅ Yes |
| midnight/interactive/branch-a.mp4 | 29 MB | ✅ Yes |
| echocalypse-lilith/full.mp4 | 19 MB | ✅ Yes |
| ysl-lipstick/full.mp4 | 16 MB | ✅ Yes |
| hero/hero-mobile.mp4 | 12 MB | ✅ Yes |
| hero/hero-background.mp4 | 11 MB | ✅ Yes |

## GitHub Limit

GitHub has a hard 100 MB per-file limit. Two files (unarmored + vivo-relic full.mp4) already exceed this and are tracked in git history.

## Recommended Actions

1. **Git LFS** — Install Git LFS and migrate large .mp4 files to LFS tracking
2. **Video compression** — Re-encode all full.mp4 files to lower bitrates
3. **History rewrite** — Use `git filter-branch` or `bfg` to remove large files from history, then re-add compressed versions
4. **External hosting** — Host videos on an external CDN and link from the site

Do NOT push to GitHub without resolving the 100MB file issue.
