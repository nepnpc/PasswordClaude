import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useCrypto } from '../context/CryptoContext'
import { deleteAllUserData } from '../lib/vault'
import PasswordInput from '../components/PasswordInput'

// Supabase redirects here with an access token in the URL hash after a password reset email click.
export default function ResetPassword() {
  const navigate = useNavigate()
  const { unlockVault } = useCrypto()

  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)
  const [ready, setReady]       = useState(false)
  const [userId, setUserId]     = useState(null)

  useEffect(() => {
    // Supabase fires PASSWORD_RECOVERY (and then SIGNED_IN) when the user clicks
    // the reset link. Both events may fire before or after this component mounts,
    // so we check getSession() on mount AND listen for incoming events.
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setReady(true)
        setUserId(session.user.id)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') {
        setReady(true)
        setUserId(session?.user?.id ?? null)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    if (password !== confirm) { setError('Passwords do not match.'); return }
    if (password.length < 8)  { setError('Password must be at least 8 characters.'); return }
    setLoading(true)
    try {
      // 1. Update the Supabase auth password
      const { error: authErr } = await supabase.auth.updateUser({ password })
      if (authErr) throw authErr

      // 2. Wipe the old profile (old salt + key_check) and all encrypted vault data.
      //    Without this step the old PBKDF2 salt would cause key verification to fail
      //    permanently — the user would be locked out of a vault they can never decrypt.
      if (userId) await deleteAllUserData(userId)

      // 3. Derive a fresh key from the new password and create a new profile row.
      if (userId) await unlockVault(userId, password)

      navigate('/vault')
    } catch (err) {
      setError(err.message ?? 'Failed to update password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!ready) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="flex flex-col gap-3 w-64">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-3 bg-[#1a1a1a] animate-pulse" style={{ width: `${[100, 70, 85][i]}%` }} />
          ))}
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">

        <div className="mb-10">
          <p className="text-xs tracking-widest uppercase text-[#666666] mb-3">Account Recovery</p>
          <h1 className="text-4xl font-light tracking-tight text-white">Set New Password</h1>
        </div>

        <div className="border border-[#333333] px-4 py-3 mb-6">
          <p className="text-xs text-[#888888] font-light leading-relaxed">
            Your previous vault data has been permanently deleted. You are starting fresh with a new encrypted vault.
          </p>
        </div>

        {error && (
          <div className="border border-white px-4 py-3 mb-6">
            <p className="text-xs text-white font-light">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <PasswordInput
            label="New Master Password"
            name="password"
            autoComplete="new-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <PasswordInput
            label="Confirm New Password"
            name="confirm-password"
            autoComplete="new-password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="mt-2 border border-white text-white text-xs tracking-widest uppercase py-3.5 px-6 hover:bg-white hover:text-black transition-colors duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? <LoadingDots label="Saving" /> : 'Save New Password'}
          </button>
        </form>
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
