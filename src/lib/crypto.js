// ─── Encoding helpers ─────────────────────────────────────────────────────────

export function bufToBase64(buffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
}

export function base64ToBuf(base64) {
  return Uint8Array.from(atob(base64), c => c.charCodeAt(0))
}

// ─── Key derivation ───────────────────────────────────────────────────────────
// PBKDF2-SHA256, 600 000 iterations, produces a non-extractable AES-GCM-256 key.
// The master password and derived key NEVER leave the browser.

export async function deriveKey(masterPassword, salt) {
  const enc = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(masterPassword),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  )
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 600_000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,            // non-extractable — the raw key bytes can never be read back
    ['encrypt', 'decrypt']
  )
}

// ─── Encryption ───────────────────────────────────────────────────────────────
// Each call generates a fresh 12-byte random IV.  Returns base64 strings
// so they are safe to store as plain TEXT columns in Postgres.

export async function encryptJSON(cryptoKey, plainObj) {
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const encoded = new TextEncoder().encode(JSON.stringify(plainObj))
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, cryptoKey, encoded)
  return { iv: bufToBase64(iv), ciphertext: bufToBase64(ciphertext) }
}

export async function encryptString(cryptoKey, plaintext) {
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const encoded = new TextEncoder().encode(plaintext)
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, cryptoKey, encoded)
  return { iv: bufToBase64(iv), ciphertext: bufToBase64(ciphertext) }
}

// ─── Decryption ───────────────────────────────────────────────────────────────
// AES-GCM authentication tag is verified automatically — any tampering throws.

export async function decryptJSON(cryptoKey, ivB64, ciphertextB64) {
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: base64ToBuf(ivB64) },
    cryptoKey,
    base64ToBuf(ciphertextB64)
  )
  return JSON.parse(new TextDecoder().decode(decrypted))
}

export async function decryptString(cryptoKey, ivB64, ciphertextB64) {
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: base64ToBuf(ivB64) },
    cryptoKey,
    base64ToBuf(ciphertextB64)
  )
  return new TextDecoder().decode(decrypted)
}

// ─── Password generator ───────────────────────────────────────────────────────
// Uses crypto.getRandomValues — no Math.random().

const CHARSET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+'

export function generatePassword(length = 20) {
  const values = crypto.getRandomValues(new Uint32Array(length))
  return Array.from(values, v => CHARSET[v % CHARSET.length]).join('')
}
