import matter from 'gray-matter'
import type { WorkData, WorkFrontmatter } from '@/types/work'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9一-鿿-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export function parseWorkMarkdown(filename: string, raw: string): WorkData | null {
  try {
    const { data, content } = matter(raw)
    const fm = data as Partial<WorkFrontmatter>

    const title = fm.title ?? 'Untitled'
    const slug = fm.slug ?? slugify(title)

    return {
      slug,
      title,
      date: fm.date ?? new Date().toISOString().split('T')[0],
      category: fm.category ?? 'uncategorized',
      tags: fm.tags ?? [],
      thumbnail: fm.thumbnail ?? '/thumbnails/default-thumbnail.jpg',
      video: fm.video ?? '',
      description: fm.description ?? '',
      duration: fm.duration,
      tools: fm.tools,
      featured: fm.featured ?? false,
      videoFormat: fm.videoFormat,
      videoWidth: fm.videoWidth,
      videoHeight: fm.videoHeight,
      content,
    }
  } catch (err) {
    console.warn(`Failed to parse markdown file: ${filename}`, err)
    return null
  }
}
