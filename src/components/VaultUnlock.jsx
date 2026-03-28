import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useCrypto } from '../context/CryptoContext'
import PasswordInput from './PasswordInput'

// Shown when a Supabase session is restored from localStorage (e.g. page refresh)
// but the derived CryptoKey has been lost from memory. The user must re-enter
// their master password to re-derive the key — it is never persisted anywhere.
export default function VaultUnlock({ onUnlocked }) {
  const { user } = useAuth()
  const { unlockVault } = useCrypto()

  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await unlockVault(user.id, password)
      onUnlocked()
    } catch (err) {
      setError(err.message ?? 'Incorrect master password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3 mb-8">
          <LockIcon />
          <div>
            <p className="text-xs tracking-widest uppercase text-[#666666]">Vault Locked</p>
            <h2 className="text-2xl font-light tracking-tight text-white">Enter master password</h2>
          </div>
        </div>

        <p className="text-sm text-[#555555] font-light leading-relaxed mb-6">
          Your vault is encrypted. Re-enter your master password to unlock it for this session.
        </p>

        {error && (
          <div className="border border-white px-4 py-3 mb-5">
            <p className="text-xs text-white font-light">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <PasswordInput
            label="Master Password"
            name="master-password"
            autoComplete="current-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="mt-1 border border-white text-white text-xs tracking-widest uppercase py-3.5 px-6 hover:bg-white hover:text-black transition-colors duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? <LoadingDots /> : 'Unlock Vault'}
          </button>
        </form>
      </div>
    </div>
  )
}

function LockIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#555555] shrink-0">
      <rect x="3" y="11" width="18" height="11" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  )
}

function LoadingDots() {
  return (
    <span className="flex items-center justify-center gap-2.5">
      <span className="flex items-center gap-1">
        {[0, 1, 2].map(i => (
          <span key={i} className="w-1 h-1 bg-white animate-pulse" style={{ animationDelay: `${i * 150}ms` }} />
        ))}
      </span>
      Unlocking
    </span>
  )
}
