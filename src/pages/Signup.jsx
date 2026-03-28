import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCrypto } from '../context/CryptoContext'
import PasswordInput from '../components/PasswordInput'

export default function Signup() {
  const { signUp } = useAuth()
  const { unlockVault } = useCrypto()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 8) {
      setError('Master password must be at least 8 characters.')
      return
    }
    if (!agreed) {
      setError('You must acknowledge the no-recovery policy before continuing.')
      return
    }

    setLoading(true)
    try {
      const data = await signUp({ name, email, password })
      // If Supabase email confirmation is enabled, the session won't exist yet.
      // We can only set up the crypto profile once we have a live session.
      if (data.session) {
        await unlockVault(data.user.id, password)
        navigate('/vault')
      } else {
        setSuccess(true)
      }
    } catch (err) {
      setError(err.message ?? 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="border border-[#333333] p-8 flex flex-col gap-4">
            <p className="text-xs tracking-widest uppercase text-[#666666]">Check your inbox</p>
            <h2 className="text-2xl font-light tracking-tight text-white">Confirm your email</h2>
            <p className="text-sm text-[#666666] font-light leading-relaxed">
              We sent a confirmation link to <span className="text-white">{email}</span>. Click it to verify your email — you'll be brought back here to log in and set up your vault.
            </p>
            <Link
              to="/login"
              className="mt-2 border border-white text-white text-xs tracking-widest uppercase py-3.5 px-6 text-center hover:bg-white hover:text-black transition-colors duration-150"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-32">
      <div className="w-full max-w-sm">

        <div className="mb-10">
          <p className="text-xs tracking-widest uppercase text-[#666666] mb-3">Account</p>
          <h1 className="text-4xl font-light tracking-tight text-white">Sign Up</h1>
        </div>

        {error && (
          <div className="border border-white px-4 py-3 mb-6">
            <p className="text-xs text-white font-light leading-relaxed">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-xs tracking-widest uppercase text-[#666666]">Full Name</label>
            <div className="border border-[#333333] focus-within:border-2 focus-within:border-white transition-[border-color,border-width] duration-150">
              <input
                id="name"
                type="text"
                placeholder="Your Name"
                autoComplete="name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="w-full bg-black text-white text-sm px-4 py-3 outline-none placeholder-[#444444]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-xs tracking-widest uppercase text-[#666666]">Email</label>
            <div className="border border-[#333333] focus-within:border-2 focus-within:border-white transition-[border-color,border-width] duration-150">
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full bg-black text-white text-sm px-4 py-3 outline-none placeholder-[#444444]"
              />
            </div>
          </div>

          <PasswordInput
            label="Master Password"
            name="password"
            autoComplete="new-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <PasswordInput
            label="Confirm Password"
            name="confirm-password"
            autoComplete="new-password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
          />

          <p className="text-xs text-[#444444] font-light leading-relaxed -mt-1">
            Use at least 8 characters. Your master password never leaves your device.
          </p>

          {/* No-recovery acknowledgement */}
          <label className="flex items-start gap-3 cursor-pointer group mt-1">
            <div className="relative mt-0.5 shrink-0">
              <input
                type="checkbox"
                className="peer sr-only"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
              />
              <div className="w-4 h-4 border border-[#333333] bg-black peer-checked:bg-white transition-colors duration-150" />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 peer-checked:opacity-100">
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4L3.5 6.5L9 1" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            <span className="text-xs text-[#555555] leading-relaxed group-hover:text-[#888888] transition-colors duration-150">
              I understand that if I forget my master password, my vault cannot be recovered. There is no reset.
            </span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 border border-white text-white text-xs tracking-widest uppercase py-3.5 px-6 hover:bg-white hover:text-black transition-colors duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? <LoadingDots label="Creating Account" /> : 'Create Account'}
          </button>
        </form>

        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-px bg-[#222222]" />
          <span className="text-xs text-[#444444] tracking-widest uppercase">or</span>
          <div className="flex-1 h-px bg-[#222222]" />
        </div>

        <p className="text-xs text-[#666666] text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-white hover:text-[#aaaaaa] transition-colors duration-150">
            Log In
          </Link>
        </p>

      </div>
    </main>
  )
}

function LoadingDots({ label }) {
  return (
    <span className="flex items-center justify-center gap-2.5">
      <span className="flex items-center gap-1">
        {[0, 1, 2].map(i => (
          <span key={i} className="w-1 h-1 bg-white animate-pulse" style={{ animationDelay: `${i * 150}ms` }} />
        ))}
      </span>
      {label}
    </span>
  )
}
