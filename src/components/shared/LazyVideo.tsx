import { useVideoLazyLoad } from '@/hooks/useVideoLazyLoad'
import SkeletonCard from './SkeletonCard'

interface LazyVideoProps {
  videoSrc: string
  posterSrc: string
  title: string
  className?: string
}

export default function LazyVideo({ videoSrc, posterSrc, title, className = '' }: LazyVideoProps) {
  const { ref, shouldLoad } = useVideoLazyLoad()

  return (
    <div ref={ref} className={`relative overflow-hidden bg-slate-800 ${className}`}>
      {shouldLoad ? (
        <video
          preload="none"
          poster={posterSrc}
          controls
          className="h-full w-full object-cover"
          playsInline
          muted
          aria-label={title}
        >
          <source src={videoSrc} type="video/mp4" />
          <source src={videoSrc.replace('.mp4', '.webm')} type="video/webm" />
          <p>
            Your browser does not support HTML5 video.{' '}
            <a href={videoSrc} className="text-accent underline">
              Download the video
            </a>{' '}
            instead.
          </p>
        </video>
      ) : (
        <SkeletonCard />
      )}
    </div>
  )
}
