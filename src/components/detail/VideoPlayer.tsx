interface VideoPlayerProps {
  videoSrc: string
  posterSrc: string
  title: string
}

export default function VideoPlayer({ videoSrc, posterSrc, title }: VideoPlayerProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-black shadow-2xl">
      <video
        preload="metadata"
        poster={posterSrc}
        controls
        className="w-full"
        playsInline
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
    </div>
  )
}
