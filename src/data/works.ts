import type { WorkData } from '@/types/work'
import { projects } from '@/data/projects'

export const allWorks: WorkData[] = projects.map((p) => {
  const roleParts = p.role.split(' / ').map((r) => r.trim()).filter(Boolean)
  return {
    slug: p.slug,
    title: p.title,
    date: `${p.year}-01-01`,
    category: p.category,
    tags: roleParts,
    thumbnail: p.cover,
    video: p.preview,
    fullVideo: p.fullVideo,
    description: p.summary,
    tools: roleParts,
    featured: p.featured,
    content: markdownContent(p),
  }
})

export const allCategories: string[] = [...new Set(projects.map((p) => p.category))]

export const allTags: string[] = [
  ...new Set(projects.flatMap((p) => p.role.split(' / ').map((r) => r.trim()).filter(Boolean))),
]

function markdownContent(p: (typeof projects)[number]): string {
  return `## 项目概述

${p.summary}

## 项目信息

- **英文标题**：${p.englishTitle}
- **年份**：${p.year}
- **类别**：${p.category}
- **角色**：${p.role}

${p.disclaimer ? `\n> ${p.disclaimer}\n` : ''}

## 项目图集

${p.gallery.map((url, i) => `![${p.title} - 图 ${i + 1}](${url})`).join('\n\n')}
`
}
