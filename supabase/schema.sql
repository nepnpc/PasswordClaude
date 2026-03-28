-- Run this in your Supabase project → SQL Editor

-- ─── Profiles ────────────────────────────────────────────────────────────────
-- Stores the per-user PBKDF2 salt and an AES-GCM encrypted verification token.
-- Neither field is secret; the salt is random and the key_check is useless
-- without the master password. Nothing here reveals the master password.
CREATE TABLE IF NOT EXISTS profiles (
  id             UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  encryption_salt TEXT NOT NULL,   -- base64(random 16-byte salt)
  key_check       TEXT NOT NULL,   -- base64(iv):base64(AES-GCM("passwordclaude-verify"))
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_self" ON profiles
  FOR ALL USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- ─── Vault Items ─────────────────────────────────────────────────────────────
-- Stores AES-GCM encrypted blobs. The plaintext NEVER reaches this table.
CREATE TABLE IF NOT EXISTS vault_items (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  iv         TEXT NOT NULL,         -- base64(random 12-byte IV per item)
  ciphertext TEXT NOT NULL,         -- base64(AES-GCM encrypted JSON blob)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE vault_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "vault_items_self" ON vault_items
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Auto-update updated_at on row changes
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER vault_items_updated_at
  BEFORE UPDATE ON vault_items
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
