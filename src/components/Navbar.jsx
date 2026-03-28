import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCrypto } from '../context/CryptoContext'

const publicLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/blog', label: 'Blog' },
]

export default function Navbar() {
  const { user, signOut } = useAuth()
  const { lockVault } = useCrypto()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL
  const isAdmin = user?.email === adminEmail

  async function handleSignOut() {
    setMenuOpen(false)
    lockVault()
    await signOut()
    navigate('/')
  }

  // Boxy animation: border-b flashes white on hover, stays white when active
  const linkClass = ({ isActive }) =>
    `text-xs tracking-widest uppercase transition-all duration-150 pb-0.5 border-b-2 ${
      isActive
        ? 'text-white border-white'
        : 'text-[#888888] border-transparent hover:text-white hover:border-[#555555] active:border-white'
    }`

  const allLinks = [
    ...publicLinks,
    ...(user
      ? [
          { to: '/vault', label: 'Vault' },
          ...(isAdmin ? [{ to: '/admin', label: 'Admin' }] : []),
        ]
      : [{ to: '/login', label: 'Login' }, { to: '/signup', label: 'Sign Up' }]
    ),
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#333333] bg-black">
      <nav className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">

        <NavLink
          to="/"
          onClick={() => setMenuOpen(false)}
          className="text-sm font-semibold tracking-widest uppercase text-white shrink-0 hover:text-[#cccccc] transition-colors duration-150"
        >
          PasswordClaude
        </NavLink>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8 list-none m-0 p-0">
          {allLinks.map(({ to, label }) => (
            <li key={to}>
              <NavLink to={to} end={to === '/'} className={linkClass}>
                {label}
              </NavLink>
            </li>
          ))}
          {user && (
            <li>
              <button
                onClick={handleSignOut}
                className="text-xs tracking-widest uppercase text-[#888888] hover:text-white transition-colors duration-150 pb-0.5 border-b-2 border-transparent hover:border-[#555555] cursor-pointer"
              >
                Sign Out
              </button>
            </li>
          )}
        </ul>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-[#888888] hover:text-white transition-colors duration-150 cursor-pointer p-1"
          onClick={() => setMenuOpen(v => !v)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </nav>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-[#222222] bg-black">
          <ul className="flex flex-col list-none m-0 p-0">
            {allLinks.map(({ to, label }) => (
              <li key={to} className="border-b border-[#111111]">
                <NavLink
                  to={to}
                  end={to === '/'}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `block px-6 py-4 text-xs tracking-widest uppercase transition-colors duration-150 ${
                      isActive ? 'text-white' : 'text-[#888888]'
                    }`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
            {user && (
              <li>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-6 py-4 text-xs tracking-widest uppercase text-[#888888] hover:text-white transition-colors duration-150 cursor-pointer"
                >
                  Sign Out
                </button>
              </li>
            )}
          </ul>
        </div>
      )}
    </header>
  )
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}
