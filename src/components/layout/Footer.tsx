import { SITE, SOCIAL_LINKS } from '@/lib/constants'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-slate-800 bg-slate-950">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-8 sm:flex-row sm:justify-between sm:px-6 lg:px-8">
        <p className="text-sm text-slate-500">
          &copy; {year} {SITE.author}
        </p>

        <div className="flex items-center gap-6">
          <a
            href={SOCIAL_LINKS.email}
            className="text-sm text-slate-500 transition-colors hover:text-slate-300"
          >
            联系我
          </a>
        </div>
      </div>
    </footer>
  )
}
