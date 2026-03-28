import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCrypto } from '../context/CryptoContext'
import { supabase } from '../lib/supabase'
import {
  deriveKey, encryptString, decryptJSON, encryptJSON,
  bufToBase64, base64ToBuf,
} from '../lib/crypto'
import {
  fetchProfile, fetchVaultItems,
  updateVaultItemCrypto, updateProfile,
} from '../lib/vault'
import PasswordInput from '../components/PasswordInput'

const VERIFY_TOKEN = 'passwordclaude-verify-v1'

// ── Step indicators ──────────────────────────────────────────────────────────
const STEPS = [
  { n: 1, label: 'Verify Identity' },
  { n: 2, label: 'Email OTP' },
  { n: 3, label: 'New Password' },
]

export default function ChangeMasterPassword() {
  const { user } = useAuth()
  const { rotateMasterKey } = useCrypto()
  const navigate = useNavigate()

  const [step, setStep]       = useState(1)
  const [error, setError]     = useState(null)
  const [loading, setLoading] = useState(false)

  // Step 1 state
  const [currentPassword, setCurrentPassword] = useState('')
  const [derivedOldKey, setDerivedOldKey]     = useState(null)

  // Step 2 state
  const [otp, setOtp]         = useState('')

  // Step 3 state
  const [newPassword, setNewPassword]   = useState('')
  const [confirmNew, setConfirmNew]     = useState('')

  // ── Step 1: verify current master password ────────────────────────────────
  async function handleVerify(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const profile = await fetchProfile(user.id)
      if (!profile) throw new Error('No vault profile found. Please log out and log in again.')

      const salt = base64ToBuf(profile.encryption_salt)
      const key  = await deriveKey(currentPassword, salt)

      const [ivB64, ctB64] = profile.key_check.split(':')
      let token
      try {
        // Use decryptJSON which throws on bad key (AES-GCM auth tag mismatch)
        token = await supabase.auth.getSession() // just a keep-alive ping
        const dec = await crypto.subtle.decrypt(
          { name: 'AES-GCM', iv: base64ToBuf(ivB64) },
          key,
          base64ToBuf(ctB64)
        )
        token = new TextDecoder().decode(dec)
      } catch {
        throw new Error('Incorrect master password.')
      }
      if (token !== VERIFY_TOKEN) throw new Error('Incorrect master password.')

      setDerivedOldKey(key)

      // Send OTP to the user's email
      const { error: otpErr } = await supabase.auth.signInWithOtp({
        email: user.email,
        shouldCreateUser: false,
      })
      if (otpErr) throw otpErr

      setStep(2)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // ── Step 2: verify email OTP ──────────────────────────────────────────────
  async function handleOtp(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const { error: verifyErr } = await supabase.auth.verifyOtp({
        email: user.email,
        token: otp.trim(),
        type: 'email',
      })
      if (verifyErr) throw verifyErr
      setStep(3)
    } catch (err) {
      setError(err.message ?? 'Invalid or expired code. Try resending.')
    } finally {
      setLoading(false)
    }
  }

  async function handleResendOtp() {
    setError(null)
    const { error } = await supabase.auth.signInWithOtp({
      email: user.email,
      shouldCreateUser: false,
    })
    if (error) setError(error.message)
  }

  // ── Step 3: re-encrypt entire vault with new master password ──────────────
  async function handleReencrypt(e) {
    e.preventDefault()
    setError(null)

    if (newPassword !== confirmNew) { setError('Passwords do not match.'); return }
    if (newPassword.length < 8)    { setError('Password must be at least 8 characters.'); return }
    if (newPassword === currentPassword) { setError('New password must differ from the current one.'); return }

    setLoading(true)
    try {
      // 1. Fetch all encrypted vault items
      const rows = await fetchVaultItems()

      // 2. Decrypt each item using the old key derived in step 1
      const decryptedItems = await Promise.all(
        rows.map(async row => ({
          id:    row.id,
          plain: await decryptJSON(derivedOldKey, row.iv, row.ciphertext),
        }))
      )

      // 3. Derive new key from new password + fresh salt
      const newSalt = crypto.getRandomValues(new Uint8Array(16))
      const newKey  = await deriveKey(newPassword, newSalt)

      // 4. Re-encrypt every item with the new key
      await Promise.all(
        decryptedItems.map(async ({ id, plain }) => {
          const { iv, ciphertext } = await encryptJSON(newKey, plain)
          await updateVaultItemCrypto(id, iv, ciphertext)
        })
      )

      // 5. Store new salt + fresh key_check in profiles
      const { iv: checkIv, ciphertext: checkCt } = await encryptString(newKey, VERIFY_TOKEN)
      await updateProfile(user.id, bufToBase64(newSalt), `${checkIv}:${checkCt}`)

      // 6. Update the Supabase auth password so login still works
      const { error: authErr } = await supabase.auth.updateUser({ password: newPassword })
      if (authErr) throw authErr

      // 7. Swap the in-memory key — no re-login needed
      rotateMasterKey(newKey)

      navigate('/vault')
    } catch (err) {
      setError(err.message ?? 'Re-encryption failed. Your vault data is unchanged.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-32">
      <div className="w-full max-w-sm">

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs tracking-widest uppercase text-[#888888] mb-3">Security</p>
          <h1 className="text-3xl font-light tracking-tight text-white">Change Master Password</h1>
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

        {/* ── Step 1 ── */}
        {step === 1 && (
          <form onSubmit={handleVerify} className="flex flex-col gap-4">
            <p className="text-sm text-[#888888] font-light leading-relaxed mb-2">
              Enter your <span className="text-white">current</span> master password to confirm your identity.
            </p>
            <PasswordInput
              label="Current Master Password"
              name="current-password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
            />
            <button
              type="submit"
              disabled={loading}
              className="mt-2 border border-white text-white text-xs tracking-widest uppercase py-3.5 px-6 hover:bg-white hover:text-black transition-colors duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? <Dots label="Verifying" /> : 'Continue →'}
            </button>
          </form>
        )}

        {/* ── Step 2 ── */}
        {step === 2 && (
          <form onSubmit={handleOtp} className="flex flex-col gap-4">
            <p className="text-sm text-[#888888] font-light leading-relaxed mb-2">
              A 6-digit code was sent to <span className="text-white">{user?.email}</span>. Enter it below.
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
              onClick={handleResendOtp}
              className="text-xs text-[#555555] hover:text-white transition-colors duration-150 cursor-pointer text-center"
            >
              Resend code
            </button>
          </form>
        )}

        {/* ── Step 3 ── */}
        {step === 3 && (
          <form onSubmit={handleReencrypt} className="flex flex-col gap-4">
            <div className="border border-[#333333] px-4 py-3 mb-2">
              <p className="text-xs text-[#888888] font-light leading-relaxed">
                All vault items will be re-encrypted with your new master password. This may take a moment.
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
              {loading ? <Dots label="Re-encrypting vault" /> : 'Change Master Password'}
            </button>
          </form>
        )}

      </div>
    </main>
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
