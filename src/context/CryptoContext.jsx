import { createContext, useContext, useState } from 'react'
import {
  deriveKey, encryptJSON, encryptString, decryptJSON, decryptString,
  bufToBase64, base64ToBuf,
} from '../lib/crypto'
import { fetchProfile, createProfile } from '../lib/vault'

const CryptoContext = createContext(null)

// VERIFY_TOKEN is the plaintext we encrypt on first setup and decrypt on every
// subsequent login to confirm the master password is correct before touching vault data.
const VERIFY_TOKEN = 'passwordclaude-verify-v1'

export function CryptoProvider({ children }) {
  const [cryptoKey, setCryptoKey] = useState(null)

  // Called from Login/Signup pages immediately after successful Supabase auth.
  // - If the user has no profile yet: generates a salt, derives key, writes profile.
  // - If profile exists: fetches salt, derives key, verifies against stored token.
  // Throws with a human-readable message if the master password is wrong.
  async function unlockVault(userId, masterPassword) {
    const profile = await fetchProfile(userId)

    if (!profile) {
      // ── First-time setup ────────────────────────────────────────────────────
      const salt = crypto.getRandomValues(new Uint8Array(16))
      const key = await deriveKey(masterPassword, salt)

      // Store an encrypted verification token alongside the salt.
      const { iv, ciphertext } = await encryptString(key, VERIFY_TOKEN)
      await createProfile(userId, bufToBase64(salt), `${iv}:${ciphertext}`)

      setCryptoKey(key)
    } else {
      // ── Re-derive from stored salt ──────────────────────────────────────────
      const salt = base64ToBuf(profile.encryption_salt)
      const key = await deriveKey(masterPassword, salt)

      // Verify before accepting the key.
      const [ivB64, ctB64] = profile.key_check.split(':')
      try {
        const token = await decryptString(key, ivB64, ctB64)
        if (token !== VERIFY_TOKEN) throw new Error('token mismatch')
      } catch {
        throw new Error('Incorrect master password.')
      }

      setCryptoKey(key)
    }
  }

  function lockVault() {
    setCryptoKey(null)
  }

  // Convenience wrappers so callers never import from lib/crypto directly.
  async function encryptItem(plainObj) {
    if (!cryptoKey) throw new Error('Vault is locked.')
    return encryptJSON(cryptoKey, plainObj)
  }

  async function decryptItem(ivB64, ciphertextB64) {
    if (!cryptoKey) throw new Error('Vault is locked.')
    return decryptJSON(cryptoKey, ivB64, ciphertextB64)
  }

  // Called by ChangeMasterPassword after all vault items have been re-encrypted.
  // Swaps the in-memory key so the rest of the session uses the new one.
  function rotateMasterKey(newKey) {
    setCryptoKey(newKey)
  }

  return (
    <CryptoContext.Provider value={{ cryptoKey, unlockVault, lockVault, encryptItem, decryptItem, rotateMasterKey }}>
      {children}
    </CryptoContext.Provider>
  )
}

export function useCrypto() {
  const ctx = useContext(CryptoContext)
  if (!ctx) throw new Error('useCrypto must be used inside CryptoProvider')
  return ctx
}
