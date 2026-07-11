import { useMemo } from 'react'
import { allWorks } from '@/data/works'
import type { WorkData } from '@/types/work'

export function useWorkBySlug(slug: string): WorkData | null {
  return useMemo(() => allWorks.find((w) => w.slug === slug) ?? null, [slug])
}
