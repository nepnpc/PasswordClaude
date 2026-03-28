import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCrypto } from '../context/CryptoContext'
import { fetchVaultItems, deleteVaultItem } from '../lib/vault'
import { SkeletonCard } from '../components/Skeleton'
import VaultUnlock from '../components/VaultUnlock'
import VaultItemRow from '../components/VaultItemRow'
import AddItemModal from '../components/AddItemModal'

export default function Vault() {
  const { user } = useAuth()
  const { cryptoKey, decryptItem } = useCrypto()

  const [items, setItems]           = useState([])      // [{ id, iv, ciphertext, created_at, decrypted }]
  const [loadingItems, setLoading]  = useState(true)
  const [fetchError, setFetchError] = useState(null)
  const [showModal, setShowModal]   = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [search, setSearch]         = useState('')
  const [unlockKey, setUnlockKey]   = useState(0)       // forces re-fetch after unlock

  const displayName = user?.user_metadata?.full_name?.split(' ')[0] ?? 'there'

  // ── Fetch + decrypt all vault items ────────────────────────────────────────
  useEffect(() => {
    if (!cryptoKey) return
    let cancelled = false

    async function load() {
      setLoading(true)
      setFetchError(null)
      try {
        const rows = await fetchVaultItems()
        const decrypted = await Promise.all(
          rows.map(async row => {
            try {
              const plain = await decryptItem(row.iv, row.ciphertext)
              return { ...row, decrypted: plain }
            } catch {
              return { ...row, decrypted: null }  // show error state per-item, don't crash
            }
          })
        )
        if (!cancelled) setItems(decrypted)
      } catch (err) {
        if (!cancelled) setFetchError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [cryptoKey, unlockKey])

  // ── Client-side search (runs after decryption) ──────────────────────────────
  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return items
    return items.filter(({ decrypted }) =>
      decrypted &&
      (decrypted.label.toLowerCase().includes(q) ||
       decrypted.username.toLowerCase().includes(q) ||
       decrypted.url.toLowerCase().includes(q))
    )
  }, [items, search])

  // ── Group filtered items by label (case-insensitive) ───────────────────────
  const groupedItems = useMemo(() => {
    const groups = new Map()
    for (const item of filteredItems) {
      const key = (item.decrypted?.label ?? '').toLowerCase()
      if (!groups.has(key)) groups.set(key, [])
      groups.get(key).push(item)
    }
    return [...groups.entries()].sort(([a], [b]) => a.localeCompare(b))
  }, [filteredItems])

  // ── Handlers ────────────────────────────────────────────────────────────────
  function handleAdd(newItem) {
    setItems(prev => [newItem, ...prev])
  }

  function handleEdit(item) {
    setEditingItem(item)
  }

  function handleUpdate(updatedItem) {
    setItems(prev => prev.map(i => i.id === updatedItem.id ? updatedItem : i))
  }

  async function handleDelete(id) {
    await deleteVaultItem(id)
    setItems(prev => prev.filter(i => i.id !== id))
  }

  // ── Locked state: key wiped from memory (e.g. page refresh) ────────────────
  if (!cryptoKey) {
    return <VaultUnlock onUnlocked={() => setUnlockKey(k => k + 1)} />
  }

  const validItems   = items.filter(i => i.decrypted !== null)
  const brokenItems  = items.filter(i => i.decrypted === null)

  return (
    <>
      <main className="max-w-5xl mx-auto px-6 pt-28 pb-24">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <section className="border-b border-[#333333] pb-8 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-xs tracking-widest uppercase text-[#666666] mb-1">Vault</p>
            <h1 className="text-3xl font-light tracking-tight text-white">
              Hello, {displayName}.
            </h1>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="shrink-0 border border-white text-white text-xs tracking-widest uppercase py-3 px-6 hover:bg-white hover:text-black transition-colors duration-150 cursor-pointer flex items-center gap-2"
          >
            <PlusIcon /> Add Password
          </button>
        </section>

        {/* ── Stats ───────────────────────────────────────────────────────── */}
        <section className="border-b border-[#333333] pb-8 mb-8">
          <div className="grid grid-cols-3 gap-px bg-[#222222]">
            {[
              { value: loadingItems ? '—' : validItems.length,  label: 'Passwords' },
              { value: loadingItems ? '—' : brokenItems.length, label: 'Corrupted' },
              { value: loadingItems ? '—' : filteredItems.length, label: 'Shown' },
            ].map(({ value, label }) => (
              <div key={label} className="bg-black px-5 py-4">
                <span className="block text-xl font-light text-white">{value}</span>
                <span className="text-xs tracking-widest uppercase text-[#777777]">{label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Search ──────────────────────────────────────────────────────── */}
        <div className="mb-6">
          <div className="border border-[#333333] focus-within:border-[#666666] transition-colors duration-150 flex items-center gap-3 px-4">
            <SearchIcon />
            <input
              type="text"
              placeholder="Search by label, username, or URL…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-black text-white text-sm py-3 outline-none placeholder-[#555555]"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="text-[#444444] hover:text-white transition-colors duration-150 cursor-pointer"
              >
                <CloseIcon />
              </button>
            )}
          </div>
        </div>

        {/* ── Content ─────────────────────────────────────────────────────── */}
        {fetchError ? (
          <div className="border border-white px-5 py-4">
            <p className="text-xs text-white font-light">Failed to load vault: {fetchError}</p>
          </div>

        ) : loadingItems ? (
          <div className="border border-[#1a1a1a] divide-y divide-[#1a1a1a]">
            {[...Array(4)].map((_, i) => <SkeletonRow key={i} />)}
          </div>

        ) : filteredItems.length === 0 ? (
          <EmptyState search={search} onAdd={() => setShowModal(true)} />

        ) : (
          <div className="flex flex-col gap-2">
            {groupedItems.map(([labelKey, groupItems]) => (
              <div key={labelKey || '_unknown'} className="border border-[#222222] divide-y divide-[#1a1a1a]">
                {groupItems.length > 1 && (
                  <div className="px-5 py-2 bg-[#080808] flex items-center justify-between">
                    <span className="text-xs tracking-widest uppercase text-[#444444]">
                      {groupItems[0].decrypted?.label ?? 'Unknown'}
                    </span>
                    <span className="text-[10px] tracking-widest uppercase text-[#333333]">{groupItems.length} accounts</span>
                  </div>
                )}
                {groupItems.map(item =>
                  item.decrypted ? (
                    <VaultItemRow key={item.id} item={item} onDelete={handleDelete} onEdit={handleEdit} />
                  ) : (
                    <BrokenItemRow key={item.id} id={item.id} onDelete={handleDelete} />
                  )
                )}
              </div>
            ))}
          </div>
        )}

        {/* Column legend — only when items are visible */}
        {!loadingItems && filteredItems.length > 0 && (
          <div className="mt-2 hidden md:flex items-center gap-4 px-5 text-[10px] tracking-widest uppercase text-[#555555]">
            <div className="w-8 shrink-0" />
            <div className="flex-1">Label</div>
            <div className="w-44">Username</div>
            <div className="w-36">Password</div>
            <div className="w-24 text-right">Actions</div>
          </div>
        )}

        {/* ── Security footer ─────────────────────────────────────────────── */}
        <div className="mt-16 pt-6 border-t border-[#1a1a1a] flex items-center justify-between">
          <span className="text-xs text-[#444444] tracking-widest uppercase">Security</span>
          <Link
            to="/change-master-password"
            className="text-xs tracking-widest uppercase text-[#555555] hover:text-white transition-colors duration-150 border-b border-transparent hover:border-[#555555]"
          >
            Change Master Password →
          </Link>
        </div>

      </main>

      {(showModal || editingItem) && (
        <AddItemModal
          item={editingItem}
          onAdd={handleAdd}
          onSave={handleUpdate}
          onClose={() => { setShowModal(false); setEditingItem(null) }}
        />
      )}
    </>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function EmptyState({ search, onAdd }) {
  return (
    <div className="border border-[#1a1a1a] px-8 py-16 flex flex-col items-center gap-4 text-center">
      {search ? (
        <>
          <p className="text-xs tracking-widest uppercase text-[#666666]">No results</p>
          <p className="text-sm text-[#888888] font-light">No entries match "{search}".</p>
        </>
      ) : (
        <>
          <LockEmptyIcon />
          <p className="text-xs tracking-widest uppercase text-[#666666]">Your vault is empty</p>
          <p className="text-sm text-[#888888] font-light max-w-xs leading-relaxed">
            Add your first password. It will be encrypted in your browser before reaching our servers.
          </p>
          <button
            onClick={onAdd}
            className="mt-2 border border-white text-white text-xs tracking-widest uppercase py-3 px-6 hover:bg-white hover:text-black transition-colors duration-150 cursor-pointer"
          >
            Add Password
          </button>
        </>
      )}
    </div>
  )
}

function BrokenItemRow({ id, onDelete }) {
  return (
    <div className="px-5 py-4 flex items-center justify-between gap-4 bg-black">
      <p className="text-xs text-[#888888] font-light">
        Decryption failed — this item may have been encrypted with a different key.
      </p>
      <button
        onClick={() => onDelete(id)}
        className="text-xs tracking-widest uppercase text-[#777777] hover:text-white transition-colors duration-150 cursor-pointer shrink-0"
      >
        Remove
      </button>
    </div>
  )
}

function SkeletonRow() {
  return (
    <div className="px-5 py-4 flex items-center gap-4 bg-black">
      <div className="w-8 h-8 bg-[#111111] animate-pulse shrink-0" />
      <div className="flex-1 flex flex-col gap-1.5">
        <div className="h-3 bg-[#111111] animate-pulse w-32" />
        <div className="h-2.5 bg-[#0d0d0d] animate-pulse w-20" />
      </div>
      <div className="hidden md:block w-44 h-2.5 bg-[#111111] animate-pulse" />
      <div className="hidden md:block w-24 h-2.5 bg-[#0d0d0d] animate-pulse" />
      <div className="flex gap-2">
        <div className="w-7 h-7 bg-[#0d0d0d] animate-pulse" />
        <div className="w-7 h-7 bg-[#0d0d0d] animate-pulse" />
        <div className="w-7 h-7 bg-[#0d0d0d] animate-pulse" />
      </div>
    </div>
  )
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function PlusIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#666666] shrink-0">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function LockEmptyIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round" strokeLinejoin="round" className="text-[#2a2a2a]">
      <rect x="3" y="11" width="18" height="11" /><path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  )
}
