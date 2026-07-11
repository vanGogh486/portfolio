import type { WorkData } from '@/types/work'

export function filterWorks(
  works: WorkData[],
  category: string | null,
  tag: string | null,
): WorkData[] {
  return works.filter((work) => {
    if (category && work.category !== category) return false
    if (tag && !work.tags.includes(tag)) return false
    return true
  })
}
