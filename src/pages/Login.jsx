import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCrypto } from '../context/CryptoContext'
import PasswordInput from '../components/PasswordInput'

export default function Login() {
  const { signIn } = useAuth()
  const { unlockVault } = useCrypto()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const data = await signIn({ email, password })
      await unlockVault(data.user.id, password)
      navigate('/vault')
    } catch (err) {
      setError(err.message ?? 'Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">

        <div className="mb-10">
          <p className="text-xs tracking-widest uppercase text-[#666666] mb-3">Account</p>
          <h1 className="text-4xl font-light tracking-tight text-white">Log In</h1>
        </div>

        {error && (
          <div className="border border-white px-4 py-3 mb-6">
            <p className="text-xs text-white font-light leading-relaxed">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-xs tracking-widest uppercase text-[#666666]">
              Email
            </label>
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
            autoComplete="current-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <div className="flex justify-end -mt-1">
            <Link
              to="/forgot-password"
              className="text-xs text-[#555555] hover:text-white transition-colors duration-150 tracking-wide"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 border border-white text-white text-xs tracking-widest uppercase py-3.5 px-6 hover:bg-white hover:text-black transition-colors duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? <LoadingDots label="Verifying" /> : 'Log In'}
          </button>
        </form>

        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-px bg-[#222222]" />
          <span className="text-xs text-[#444444] tracking-widest uppercase">or</span>
          <div className="flex-1 h-px bg-[#222222]" />
        </div>

        <p className="text-xs text-[#666666] text-center">
          Don't have an account?{' '}
          <Link to="/signup" className="text-white hover:text-[#aaaaaa] transition-colors duration-150">
            Sign Up
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
