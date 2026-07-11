import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import MobileNav from './MobileNav'

const navLinks = [
  { to: '/#works-section', label: 'Works' },
  { to: '/#about-section', label: 'About' },
  { to: '/#experience-section', label: 'Experience' },
  { to: '/#contact-section', label: 'Contact' },
]

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        isHome
          ? 'bg-[#0C0C0C]/80 backdrop-blur-lg'
          : 'bg-[#0C0C0C]/95 backdrop-blur-lg border-b border-white/[0.06]'
      }`}
    >
      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Logo */}
        <Link
          to="/"
          className="text-base font-bold tracking-[0.3em] transition-colors"
          style={{ color: 'rgba(200,192,184,0.85)' }}
        >
          PYB
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              onClick={(e) => {
                if (link.to.startsWith('/#')) {
                  e.preventDefault()
                  const id = link.to.replace('/#', '')
                  const el = document.getElementById(id)
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' })
                  }
                }
              }}
              className={({ isActive }) =>
                `text-[13px] font-medium tracking-wider uppercase transition-colors ${
                  isActive
                    ? 'text-white'
                    : ''
                }`
              }
              style={({ isActive }) =>
                isActive
                  ? { color: 'rgba(200,192,184,0.9)' }
                  : { color: 'rgba(200,192,184,0.4)' }
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Mobile menu button */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-white/50 hover:text-white md:hidden"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>
        </button>
      </div>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} links={navLinks} />
    </header>
  )
}
