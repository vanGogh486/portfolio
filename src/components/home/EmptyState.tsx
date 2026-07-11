import { useFilterContext } from '@/context/FilterContext'
import { allWorks } from '@/data/works'

export default function EmptyState() {
  const { resetFilters, activeCategory, activeTag } = useFilterContext()
  const isFiltered = !!activeCategory || !!activeTag

  if (isFiltered) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 px-4 py-16 text-center">
        <svg className="h-12 w-12 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <p className="text-lg text-slate-400">
          No works match {activeCategory && `"${activeCategory}"`}
          {activeCategory && activeTag && ' + '}
          {activeTag && `"${activeTag}"`}
        </p>
        <button
          type="button"
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-light"
          onClick={resetFilters}
        >
          Clear Filters
        </button>
      </div>
    )
  }

  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <svg className="h-16 w-16 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
      </svg>
      <h3 className="text-xl font-semibold text-white">No works yet</h3>
      <p className="text-slate-400">
        Check back soon for AI video experiments.
      </p>
    </div>
  )
}
