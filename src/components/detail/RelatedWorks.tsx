import { allWorks } from '@/data/works'
import type { WorkData } from '@/types/work'
import VideoCard from '@/components/home/VideoCard'

interface RelatedWorksProps {
  current: WorkData
}

export default function RelatedWorks({ current }: RelatedWorksProps) {
  const related = allWorks
    .filter(
      (w) =>
        w.slug !== current.slug &&
        (w.category === current.category ||
          w.tags.some((t) => current.tags.includes(t))),
    )
    .slice(0, 3)

  if (related.length === 0) return null

  return (
    <section className="border-t border-slate-800 pt-12">
      <h2 className="mb-6 text-2xl font-bold text-white">Related Works</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {related.map((work) => (
          <VideoCard key={work.slug} work={work} />
        ))}
      </div>
    </section>
  )
}
