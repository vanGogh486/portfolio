export default function Bio() {
  return (
    <div className="flex flex-col items-center gap-8 md:flex-row md:items-start">
      {/* Avatar placeholder */}
      <div className="h-40 w-40 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-accent to-accent-secondary p-1">
        <div className="flex h-full w-full items-center justify-center rounded-2xl bg-slate-900 text-4xl">
          🎬
        </div>
      </div>

      <div className="space-y-4 text-center md:text-left">
        <h1 className="text-3xl font-bold text-white sm:text-4xl">About Me</h1>
        <div className="space-y-3 text-slate-400">
          <p>
            Hi! I&apos;m an AI video creator passionate about exploring the
            intersection of artificial intelligence and visual storytelling.
          </p>
          <p>
            My work spans generative video, neural style transfer, and
            latent space exploration — always pushing the boundaries of
            what machines can create.
          </p>
          <p>
            When I&apos;m not experimenting with the latest AI models, you can
            find me sharing knowledge with the creative AI community.
          </p>
        </div>
      </div>
    </div>
  )
}
