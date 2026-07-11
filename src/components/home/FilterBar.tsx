import { useWorks } from '@/hooks/useWorks'
import { useFilterContext } from '@/context/FilterContext'
import CategoryBadge from '@/components/shared/CategoryBadge'
import TagBadge from '@/components/shared/TagBadge'

export default function FilterBar() {
  const { categories, tags } = useWorks()
  const { activeCategory, activeTag, setCategory, setTag, resetFilters } = useFilterContext()

  const hasActive = activeCategory || activeTag

  return (
    <div className="border-b border-slate-800 bg-slate-950 px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-4">
        {/* Categories */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-2 text-xs font-medium uppercase tracking-wider text-slate-500">
            Category
          </span>
          {categories.map((cat) => (
            <CategoryBadge
              key={cat}
              category={cat}
              active={activeCategory === cat}
              onClick={() => setCategory(activeCategory === cat ? null : cat)}
            />
          ))}
          {hasActive && (
            <button
              type="button"
              className="ml-2 text-xs text-slate-500 transition-colors hover:text-slate-300"
              onClick={resetFilters}
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-2 text-xs font-medium uppercase tracking-wider text-slate-500">
              Tags
            </span>
            {tags.map((tag) => (
              <TagBadge
                key={tag}
                tag={tag}
                active={activeTag === tag}
                onClick={() => setTag(activeTag === tag ? null : tag)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
