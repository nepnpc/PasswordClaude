import { useState } from 'react'
import { useCrypto } from '../context/CryptoContext'
import { insertVaultItem, updateVaultItemCrypto } from '../lib/vault'
import { generatePassword } from '../lib/crypto'
import PasswordInput from './PasswordInput'

// Pass `item` to enter edit mode (pre-fills fields, calls onSave on submit).
// Leave `item` undefined for add mode (calls onAdd on submit).
export default function AddItemModal({ onAdd, onSave, onClose, item: editItem = null }) {
  const isEditing = !!editItem
  const { encryptItem } = useCrypto()

  const [label, setLabel]       = useState(editItem?.decrypted?.label    ?? '')
  const [url, setUrl]           = useState(editItem?.decrypted?.url       ?? '')
  const [username, setUsername] = useState(editItem?.decrypted?.username  ?? '')
  const [password, setPassword] = useState(editItem?.decrypted?.password  ?? '')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)

  function handleGenerate() {
    setPassword(generatePassword(20))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const plain = { label: label.trim(), url: url.trim(), username: username.trim(), password }
      const { iv, ciphertext } = await encryptItem(plain)
      if (isEditing) {
        await updateVaultItemCrypto(editItem.id, iv, ciphertext)
        onSave({ ...editItem, iv, ciphertext, decrypted: plain })
      } else {
        const row = await insertVaultItem(iv, ciphertext)
        onAdd({ ...row, decrypted: plain })
      }
      onClose()
    } catch (err) {
      setError(err.message ?? 'Failed to save item.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-full max-w-md bg-black border border-[#333333]">
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#222222]">
          <p className="text-xs tracking-widest uppercase text-white">{isEditing ? 'Edit Password' : 'Add Password'}</p>
          <button
            onClick={onClose}
            className="text-[#555555] hover:text-white transition-colors duration-150 cursor-pointer"
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Modal body */}
        <form onSubmit={handleSubmit} className="px-6 py-6 flex flex-col gap-4">
          {error && (
            <div className="border border-white px-4 py-3">
              <p className="text-xs text-white font-light">{error}</p>
            </div>
          )}

          {/* Label */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs tracking-widest uppercase text-[#666666]">Label *</label>
            <div className="border border-[#333333] focus-within:border-2 focus-within:border-white transition-[border-color,border-width] duration-150">
              <input
                type="text"
                placeholder="e.g. Netflix"
                value={label}
                onChange={e => setLabel(e.target.value)}
                required
                className="w-full bg-black text-white text-sm px-4 py-3 outline-none placeholder-[#444444]"
              />
            </div>
          </div>

          {/* URL */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs tracking-widest uppercase text-[#666666]">URL <span className="text-[#444444]">(optional)</span></label>
            <div className="border border-[#333333] focus-within:border-2 focus-within:border-white transition-[border-color,border-width] duration-150">
              <input
                type="text"
                placeholder="https://netflix.com"
                value={url}
                onChange={e => setUrl(e.target.value)}
                className="w-full bg-black text-white text-sm px-4 py-3 outline-none placeholder-[#444444]"
              />
            </div>
          </div>

          {/* Username */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs tracking-widest uppercase text-[#666666]">Username / Email *</label>
            <div className="border border-[#333333] focus-within:border-2 focus-within:border-white transition-[border-color,border-width] duration-150">
              <input
                type="text"
                placeholder="you@example.com"
                autoComplete="off"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                className="w-full bg-black text-white text-sm px-4 py-3 outline-none placeholder-[#444444]"
              />
            </div>
          </div>

          {/* Password + generate */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs tracking-widest uppercase text-[#666666]">Password *</label>
              <button
                type="button"
                onClick={handleGenerate}
                className="text-xs tracking-widest uppercase text-[#555555] hover:text-white transition-colors duration-150 cursor-pointer"
              >
                Generate
              </button>
            </div>
            <PasswordInput
              label=""
              name="item-password"
              autoComplete="new-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-[#333333] text-[#666666] text-xs tracking-widest uppercase py-3 hover:border-white hover:text-white transition-colors duration-150 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 border border-white text-white text-xs tracking-widest uppercase py-3 hover:bg-white hover:text-black transition-colors duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving…' : isEditing ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}
