# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # start dev server at http://localhost:5173
npm run build    # production build
npm run preview  # preview production build
```

## Stack

- **Vite** + **React** (JSX)
- **Tailwind CSS v4** via `@tailwindcss/vite` — no `tailwind.config.js`
- **React Router v6** — `BrowserRouter` in `App.jsx`
- **Supabase** (`@supabase/supabase-js`) — auth + encrypted storage only
- **Web Crypto API** (native browser) — PBKDF2 key derivation + AES-GCM encryption

## Environment

`.env.local` (gitignored via `*.local`):
```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

## Structure

```
src/
  lib/
    supabase.js       # Supabase client singleton
    crypto.js         # Pure Web Crypto utilities (deriveKey, encryptJSON, decryptJSON, generatePassword)
    vault.js          # Supabase CRUD for profiles + vault_items tables
  context/
    AuthContext.jsx   # Supabase session state (signIn, signUp, signOut)
    CryptoContext.jsx # In-memory CryptoKey state (unlockVault, lockVault, encryptItem, decryptItem)
  components/
    Navbar.jsx        # Sticky nav, auth-aware, mobile hamburger menu
    PasswordInput.jsx # Password field with eye toggle; skip label render when label=""
    ProtectedRoute.jsx# Redirects to /login when no session; skeleton while hydrating
    VaultUnlock.jsx   # Re-enter master password after page refresh (key wiped from memory)
    AddItemModal.jsx  # Modal: label/url/username/password + Generate button
    VaultItemRow.jsx  # Item row: eye toggle, copy username/password, inline delete confirm
    Skeleton.jsx      # SkeletonLine + SkeletonCard for Blog loading state
  pages/
    Home.jsx / About.jsx / Blog.jsx   # Public pages
    Login.jsx / Signup.jsx            # Auth pages — call unlockVault after signIn/signUp
    ForgotPassword.jsx                # Two-step: zero-knowledge warning → send reset email
    ResetPassword.jsx                 # Handles PASSWORD_RECOVERY event, wipes old profile, re-derives key
    Vault.jsx                         # Protected dashboard
  App.jsx   # Router + AuthProvider + CryptoProvider
  main.jsx
  index.css # Tailwind import + global base styles
supabase/
  schema.sql  # Run once in Supabase SQL Editor to create tables + RLS policies
```

## Supabase tables

| Table | Columns | Notes |
|---|---|---|
| `profiles` | `id`, `encryption_salt`, `key_check` | One row per user. Salt is public; key_check is encrypted with the derived key. |
| `vault_items` | `id`, `user_id`, `iv`, `ciphertext` | All plaintext fields are encrypted before insert. |

Both tables have RLS policies scoped to `auth.uid()`.

## Crypto architecture (zero-knowledge)

1. **Key derivation** — `PBKDF2(masterPassword, randomSalt, 600_000 iter, SHA-256)` → non-extractable `AES-GCM-256` key. The key lives only in React state (lost on page refresh — intentional).
2. **Vault unlock on refresh** — `CryptoContext.cryptoKey === null` triggers `<VaultUnlock>` inside `/vault`. User re-enters master password to re-derive the key.
3. **Encryption** — each item gets a fresh 12-byte random IV. Stored in Supabase as `{iv: base64, ciphertext: base64}`. The plaintext JSON `{label, url, username, password}` is never sent to the server.
4. **Verification token** — on first setup, `"passwordclaude-verify-v1"` is encrypted with the derived key and stored in `profiles.key_check`. On every subsequent login, decrypting this token verifies the master password before touching vault data.
5. **Password reset** — `ResetPassword.jsx` calls `deleteAllUserData(userId)` to wipe the old profile + vault items before deriving a new key. Without this, the old salt makes the new password permanently fail verification.

## Routes

| Path | Protection | Notes |
|---|---|---|
| `/` | public | Home landing |
| `/about` | public | Has `#contact` section |
| `/blog` | public | Skeleton loaders simulate fetch |
| `/login` | public | Calls `signIn` then `unlockVault` |
| `/signup` | public | Calls `signUp` then `unlockVault` (if session immediate) |
| `/forgot-password` | public | Two-step: warning → email send |
| `/reset-password` | public | Handles Supabase `PASSWORD_RECOVERY` event |
| `/vault` | `<ProtectedRoute>` | Shows `<VaultUnlock>` if key is null |

## Design rules (never break)

- Background `#000000` · Text `#ffffff` · Borders `#ffffff` or `#333333`
- **No colours, no shadows, no bouncy animations**
- Transitions: `duration-150` colour/border swaps only
- Inputs: `border border-[#333333]` wrapper div with `focus-within:border-2 focus-within:border-white`
- Buttons: `border border-white` + `hover:bg-white hover:text-black` inversion
- Typography: Inter, `tracking-widest uppercase` for labels/nav, `font-light tracking-tight` for headings
- Layout: `max-w-5xl mx-auto px-6`, `pt-32` page top padding (clears `h-14` sticky nav)
- Clipboard auto-clear: 30 s after copy via `navigator.clipboard.writeText('')`
