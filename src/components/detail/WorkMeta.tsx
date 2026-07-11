import type { WorkData } from '@/types/work'
import CategoryBadge from '@/components/shared/CategoryBadge'
import TagBadge from '@/components/shared/TagBadge'

interface WorkMetaProps {
  work: WorkData
}

export default function WorkMeta({ work }: WorkMetaProps) {
  return (
    <div className="space-y-6">
      <div>
        <CategoryBadge category={work.category} />
        <h1 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
          {work.title}
        </h1>
        {work.description && (
          <p className="mt-3 text-lg text-slate-400">{work.description}</p>
        )}
      </div>

      <div className="flex flex-wrap gap-6 text-sm text-slate-400">
        <div className="flex items-center gap-2">
          <svg className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
          <span>{work.date}</span>
        </div>

        {work.duration && (
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{work.duration}</span>
          </div>
        )}
      </div>

      {work.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {work.tags.map((tag) => (
            <TagBadge key={tag} tag={tag} size="md" />
          ))}
        </div>
      )}

      {work.tools && work.tools.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-medium uppercase tracking-wider text-slate-500">
            Tools Used
          </h3>
          <div className="flex flex-wrap gap-2">
            {work.tools.map((tool) => (
              <span
                key={tool}
                className="rounded-md border border-slate-700 bg-slate-800/50 px-3 py-1 text-sm text-slate-300"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
