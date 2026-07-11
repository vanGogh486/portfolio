export default function SkeletonPlayer() {
  return (
    <div className="animate-skeleton w-full rounded-xl bg-slate-800" style={{ aspectRatio: '16/9' }} aria-hidden="true">
      <div className="flex h-full items-center justify-center">
        <svg
          className="h-16 w-16 text-slate-700"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
    </div>
  )
}
