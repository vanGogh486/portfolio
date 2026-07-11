import { Link } from 'react-router-dom'

export default function NotFound({ message = 'Page not found' }: { message?: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <h1 className="text-7xl font-bold text-accent">404</h1>
      <p className="text-lg text-slate-400">{message}</p>
      <Link
        to="/"
        className="rounded-lg bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-light"
      >
        Back to Gallery
      </Link>
    </div>
  )
}
