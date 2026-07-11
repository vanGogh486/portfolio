export default function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-skeleton rounded-lg bg-slate-800 ${className}`}
      style={{ aspectRatio: '16 / 9' }}
      aria-hidden="true"
    />
  )
}
