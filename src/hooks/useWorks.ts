import { useMemo } from 'react'
import { allWorks, allCategories, allTags } from '@/data/works'
import { filterWorks } from '@/lib/filterWorks'
import { useFilterContext } from '@/context/FilterContext'

export function useWorks() {
  const { activeCategory, activeTag } = useFilterContext()

  const filtered = useMemo(
    () => filterWorks(allWorks, activeCategory, activeTag),
    [activeCategory, activeTag],
  )

  return {
    works: filtered,
    allWorks,
    categories: allCategories,
    tags: allTags,
    totalCount: allWorks.length,
    filteredCount: filtered.length,
  }
}
