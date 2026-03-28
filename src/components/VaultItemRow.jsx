import { useState } from 'react'

const CLIPBOARD_CLEAR_MS = 30_000

async function copyWithAutoClear(text) {
  await navigator.clipboard.writeText(text)
  setTimeout(() => navigator.clipboard.writeText('').catch(() => {}), CLIPBOARD_CLEAR_MS)
}

export default function VaultItemRow({ item, onDelete, onEdit }) {
  const { id, decrypted } = item
  const { label, url, username, password } = decrypted

  const [showPassword, setShowPassword]   = useState(false)
  const [copyState, setCopyState]         = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting]           = useState(false)

  async function handleCopy(text, type) {
    try {
      await copyWithAutoClear(text)
      setCopyState(type)
      setTimeout(() => setCopyState(null), 2000)
    } catch {
      // Clipboard blocked — fail silently
    }
  }

  async function handleDelete() {
    setDeleting(true)
    await onDelete(id)
  }

  const initial = label.charAt(0).toUpperCase()

  const hostname = (() => {
    try { return new URL(url.startsWith('http') ? url : `https://${url}`).hostname }
    catch { return url }
  })()

  return (
    <div className="bg-black border-b border-[#1a1a1a] last:border-b-0 px-5 py-4 flex items-center gap-4 group hover:bg-[#0a0a0a] transition-colors duration-150">

      {/* Initial badge */}
      <div className="w-8 h-8 border border-[#444444] flex items-center justify-center shrink-0 text-xs text-[#aaaaaa] font-medium group-hover:border-[#666666] transition-colors duration-150">
        {initial}
      </div>

      {/* Label + URL */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-white font-medium truncate leading-tight">{label}</p>
        {hostname && (
          <p className="text-xs text-[#777777] truncate mt-0.5">{hostname}</p>
        )}
      </div>

      {/* Username */}
      <div className="hidden md:block w-44 shrink-0">
        <p className="text-xs text-[#aaaaaa] font-light truncate">{username}</p>
      </div>

      {/* Password (masked) */}
      <div className="hidden md:flex items-center gap-2 w-36 shrink-0">
        <p className="text-xs text-[#aaaaaa] font-light truncate">
          {showPassword ? password : '•'.repeat(Math.min(password.length, 12))}
        </p>
        <button
          onClick={() => setShowPassword(v => !v)}
          className="shrink-0 text-[#666666] hover:text-white transition-colors duration-150 cursor-pointer"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        <ActionButton
          onClick={() => handleCopy(username, 'username')}
          active={copyState === 'username'}
          label="Copy username"
          activeLabel="Copied"
        >
          <UserIcon />
        </ActionButton>

        <ActionButton
          onClick={() => handleCopy(password, 'password')}
          active={copyState === 'password'}
          label="Copy password"
          activeLabel="Copied · clears in 30 s"
        >
          <CopyIcon />
        </ActionButton>

        <ActionButton onClick={() => onEdit(item)} label="Edit">
          <PencilIcon />
        </ActionButton>

        {confirmDelete ? (
          <div className="flex items-center gap-1 ml-1">
            <button
              onClick={() => setConfirmDelete(false)}
              className="text-xs text-[#888888] hover:text-white transition-colors duration-150 cursor-pointer px-1"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="text-xs tracking-widest uppercase text-white border border-white px-2 py-1 hover:bg-white hover:text-black transition-colors duration-150 cursor-pointer disabled:opacity-40"
            >
              {deleting ? '…' : 'Delete'}
            </button>
          </div>
        ) : (
          <ActionButton onClick={() => setConfirmDelete(true)} label="Delete" danger>
            <TrashIcon />
          </ActionButton>
        )}
      </div>
    </div>
  )
}

function ActionButton({ onClick, active, label, activeLabel, danger, children }) {
  return (
    <button
      onClick={onClick}
      title={active ? (activeLabel ?? label) : label}
      className={`p-2 transition-colors duration-150 cursor-pointer ${
        active ? 'text-white' : 'text-[#666666] hover:text-white'
      }`}
    >
      {active && !danger ? <CheckIcon /> : children}
    </button>
  )
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function EyeIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z" /><circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  )
}

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  )
}

function UserIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function PencilIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" />
    </svg>
  )
}
