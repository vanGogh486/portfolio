import { Link } from 'react-router-dom'
import type { WorkData } from '@/types/work'
import TagBadge from '@/components/shared/TagBadge'
import CategoryBadge from '@/components/shared/CategoryBadge'
import { useVideoLazyLoad } from '@/hooks/useVideoLazyLoad'

interface VideoCardProps {
  work: WorkData
}

export default function VideoCard({ work }: VideoCardProps) {
  const { ref, shouldLoad } = useVideoLazyLoad()

  return (
    <Link
      to={`/project/${work.slug}`}
      className="group block overflow-hidden rounded-xl border border-slate-800 bg-slate-900 transition-all hover:border-slate-700 hover:shadow-xl hover:shadow-black/20"
    >
      {/* Thumbnail */}
      <div
        ref={ref}
        className="relative aspect-video overflow-hidden bg-slate-800"
      >
        {shouldLoad ? (
          <img
            src={work.thumbnail}
            alt={work.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="animate-skeleton h-full w-full" />
        )}

        {/* Duration badge */}
        {work.duration && (
          <span className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
            {work.duration}
          </span>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <p className="p-4 text-sm text-slate-200">{work.description}</p>
        </div>
      </div>

      {/* Info */}
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-semibold text-white transition-colors group-hover:text-accent-light line-clamp-1">
            {work.title}
          </h3>
          <CategoryBadge category={work.category} />
        </div>

        {work.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {work.tags.slice(0, 3).map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
            {work.tags.length > 3 && (
              <span className="text-xs text-slate-500">+{work.tags.length - 3}</span>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}
