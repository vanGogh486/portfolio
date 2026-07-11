import { useWorks } from '@/hooks/useWorks'
import VideoCard from './VideoCard'
import EmptyState from './EmptyState'

export default function VideoGrid() {
  const { works } = useWorks()

  if (works.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {works.map((work) => (
          <VideoCard key={work.slug} work={work} />
        ))}
      </div>
    </div>
  )
}
