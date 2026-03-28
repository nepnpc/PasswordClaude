import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useCrypto } from '../context/CryptoContext'
import { deleteAllUserData } from '../lib/vault'
import PasswordInput from '../components/PasswordInput'

const STEPS = [
  { n: 1, label: 'Warning' },
  { n: 2, label: 'Verify Email' },
  { n: 3, label: 'New Password' },
]

export default function ForgotPassword() {
  const navigate = useNavigate()
  const { unlockVault } = useCrypto()

  const [step, setStep]             = useState(1)
  const [error, setError]           = useState(null)
  const [loading, setLoading]       = useState(false)

  // Step 1 state
  const [email, setEmail]           = useState('')
  const [confirmed, setConfirmed]   = useState(false)

  // Step 2 state
  const [otp, setOtp]               = useState('')
  const [userId, setUserId]         = useState(null)

  // Step 3 state
  const [newPassword, setNewPassword] = useState('')
  const [confirmNew, setConfirmNew]   = useState('')

  // ── Step 1: acknowledge warning + send OTP ────────────────────────────────
  async function handleSendOtp(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const { error: otpErr } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        shouldCreateUser: false,
      })
      if (otpErr) throw otpErr
      setStep(2)
    } catch (err) {
      setError(err.message ?? 'Failed to send code. Check that this email has an account.')
    } finally {
      setLoading(false)
    }
  }

  // ── Step 2: verify OTP ────────────────────────────────────────────────────
  async function handleVerifyOtp(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const { data, error: verifyErr } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: otp.trim(),
        type: 'email',
      })
      if (verifyErr) throw verifyErr
      setUserId(data.user.id)
      setStep(3)
    } catch (err) {
      setError(err.message ?? 'Invalid or expired code. Try resending.')
    } finally {
      setLoading(false)
    }
  }

  async function handleResend() {
    setError(null)
    const { error: resendErr } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      shouldCreateUser: false,
    })
    if (resendErr) setError(resendErr.message)
  }

  // ── Step 3: set new password + wipe old vault ─────────────────────────────
  async function handleReset(e) {
    e.preventDefault()
    setError(null)
    if (newPassword !== confirmNew) { setError('Passwords do not match.'); return }
    if (newPassword.length < 8)    { setError('Password must be at least 8 characters.'); return }
    setLoading(true)
    try {
      const { error: authErr } = await supabase.auth.updateUser({ password: newPassword })
      if (authErr) throw authErr

      if (userId) await deleteAllUserData(userId)
      if (userId) await unlockVault(userId, newPassword)

      navigate('/vault')
    } catch (err) {
      setError(err.message ?? 'Failed to reset password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-32">
      <div className="w-full max-w-sm">

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs tracking-widest uppercase text-[#888888] mb-3">Account Recovery</p>
          <h1 className="text-3xl font-light tracking-tight text-white">Forgot Password</h1>
        </div>

        {/* Step indicators */}
        <div className="flex items-center gap-0 mb-10">
          {STEPS.map(({ n, label }, i) => (
            <div key={n} className="flex items-center">
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 flex items-center justify-center border text-xs font-medium transition-colors duration-150 ${
                  step === n
                    ? 'border-white text-white'
                    : step > n
                      ? 'border-[#555555] text-[#555555]'
                      : 'border-[#333333] text-[#333333]'
                }`}>
                  {step > n ? '✓' : n}
                </div>
                <span className={`text-xs tracking-widest uppercase hidden sm:block transition-colors duration-150 ${
                  step === n ? 'text-white' : 'text-[#444444]'
                }`}>
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-6 h-px mx-3 transition-colors duration-150 ${step > n ? 'bg-[#555555]' : 'bg-[#222222]'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="border border-white px-4 py-3 mb-6">
            <p className="text-xs text-white font-light leading-relaxed">{error}</p>
          </div>
        )}

        {/* ── Step 1: warning + email ── */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="flex flex-col gap-4">

            <div className="border border-white p-5 flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <WarningIcon />
                <p className="text-xs tracking-widest uppercase text-white">Data Loss Warning</p>
              </div>
              <p className="text-sm text-[#aaaaaa] font-light leading-relaxed">
                PasswordClaude uses a <span className="text-white">zero-knowledge architecture</span>. Your vault is encrypted exclusively with your master password — we never store or transmit it.
              </p>
              <p className="text-sm text-[#aaaaaa] font-light leading-relaxed">
                Resetting your password will <span className="text-white font-medium">permanently delete your entire vault</span>. Every stored password will be lost. There is no backup.
              </p>
            </div>

            {/* Checkbox */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="relative mt-0.5 shrink-0">
                <input
                  type="checkbox"
                  required
                  checked={confirmed}
                  onChange={e => setConfirmed(e.target.checked)}
                  className="peer sr-only"
                />
                <div className="w-4 h-4 border border-[#333333] bg-black peer-checked:bg-white transition-colors duration-150" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 peer-checked:opacity-100">
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
              <span className="text-xs text-[#555555] leading-relaxed group-hover:text-[#888888] transition-colors duration-150">
                I understand that resetting my password will permanently delete all data in my vault.
              </span>
            </label>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs tracking-widest uppercase text-[#888888]">Email</label>
              <div className="border border-[#333333] focus-within:border-2 focus-within:border-white transition-[border-color,border-width] duration-150">
                <input
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

            <button
              type="submit"
              disabled={loading || !confirmed}
              className="mt-2 border border-white text-white text-xs tracking-widest uppercase py-3.5 px-6 hover:bg-white hover:text-black transition-colors duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? <Dots label="Sending" /> : 'Send Code →'}
            </button>

            <Link
              to="/login"
              className="text-xs tracking-widest uppercase text-[#555555] hover:text-white transition-colors duration-150 text-center"
            >
              ← Back to Login
            </Link>
          </form>
        )}

        {/* ── Step 2: OTP ── */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
            <p className="text-sm text-[#888888] font-light leading-relaxed mb-2">
              A 6-digit code was sent to <span className="text-white">{email}</span>. Enter it below.
            </p>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs tracking-widest uppercase text-[#888888]">Verification Code</label>
              <div className="border border-[#333333] focus-within:border-2 focus-within:border-white transition-[border-color,border-width] duration-150">
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={8}
                  placeholder="00000000"
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                  required
                  className="w-full bg-black text-white text-sm px-4 py-3 outline-none placeholder-[#444444] font-mono tracking-[0.3em]"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading || otp.length < 8}
              className="mt-2 border border-white text-white text-xs tracking-widest uppercase py-3.5 px-6 hover:bg-white hover:text-black transition-colors duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? <Dots label="Verifying" /> : 'Verify Code →'}
            </button>
            <button
              type="button"
              onClick={handleResend}
              className="text-xs text-[#555555] hover:text-white transition-colors duration-150 cursor-pointer text-center"
            >
              Resend code
            </button>
          </form>
        )}

        {/* ── Step 3: new password ── */}
        {step === 3 && (
          <form onSubmit={handleReset} className="flex flex-col gap-4">
            <div className="border border-[#333333] px-4 py-3 mb-2">
              <p className="text-xs text-[#888888] font-light leading-relaxed">
                Your previous vault data will be permanently deleted. You are starting fresh with a new encrypted vault.
              </p>
            </div>
            <PasswordInput
              label="New Master Password"
              name="new-password"
              autoComplete="new-password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
            />
            <PasswordInput
              label="Confirm New Password"
              name="confirm-new-password"
              autoComplete="new-password"
              value={confirmNew}
              onChange={e => setConfirmNew(e.target.value)}
            />
            <button
              type="submit"
              disabled={loading}
              className="mt-2 border border-white text-white text-xs tracking-widest uppercase py-3.5 px-6 hover:bg-white hover:text-black transition-colors duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? <Dots label="Resetting" /> : 'Reset Password'}
            </button>
          </form>
        )}

      </div>
    </main>
  )
}

function WarningIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5 text-white">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
}

function Dots({ label }) {
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
