import { Link } from 'react-router-dom'

const socialLinks = [
  {
    label: 'GitHub',
    href: 'https://github.com/nepnpc',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/nepnpc/',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/nepnpc/',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/nepnpc/',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: 'Email',
    href: 'mailto:subwrn@gmail.com',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m2 7 10 7 10-7" />
      </svg>
    ),
  },
]

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/blog', label: 'Blog' },
]

export default function Footer() {
  return (
    <footer className="border-t border-[#222222] bg-black mt-auto">
      <div className="max-w-5xl mx-auto px-6 py-12">

        {/* Top row */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-10 mb-10 border-b border-[#1a1a1a] pb-10">

          {/* Brand + tagline */}
          <div className="flex flex-col gap-3 max-w-xs">
            <span className="text-xs tracking-widest uppercase text-white font-semibold">PasswordClaude</span>
            <p className="text-xs text-[#555555] font-light leading-relaxed">
              A zero-knowledge password manager. Your vault is encrypted on your device before it ever reaches our servers.
            </p>
          </div>

          {/* Nav links */}
          <div className="flex flex-col gap-2">
            <p className="text-xs tracking-widest uppercase text-[#444444] mb-2">Navigation</p>
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="text-xs text-[#666666] hover:text-white transition-colors duration-150"
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Social links */}
          <div className="flex flex-col gap-2">
            <p className="text-xs tracking-widest uppercase text-[#444444] mb-2">Connect</p>
            {socialLinks.map(({ label, href, icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('mailto') ? undefined : '_blank'}
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-xs text-[#666666] hover:text-white transition-colors duration-150"
              >
                {icon}
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom row — credits */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <p className="text-xs text-[#444444] font-light">
            © {new Date().getFullYear()} PasswordClaude. Open source under the MIT License.
          </p>
          <p className="text-xs text-[#444444] font-light">
            Designed &amp; built by{' '}
            <a
              href="https://github.com/nepnpc"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#666666] hover:text-white transition-colors duration-150 border-b border-[#333333] hover:border-white pb-px"
            >
              Subarna Katwal
            </a>
          </p>
        </div>

      </div>
    </footer>
  )
}
