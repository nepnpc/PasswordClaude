import { supabase } from './supabase'

// ─── Profile (salt + key verification) ───────────────────────────────────────

export async function fetchProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('encryption_salt, key_check')
    .eq('id', userId)
    .maybeSingle()
  if (error) throw error
  return data // null if not yet created
}

export async function createProfile(userId, encryptionSalt, keyCheck) {
  const { error } = await supabase
    .from('profiles')
    .insert({ id: userId, encryption_salt: encryptionSalt, key_check: keyCheck })
  if (error) throw error
}

// ─── Vault items ──────────────────────────────────────────────────────────────

export async function fetchVaultItems() {
  const { data, error } = await supabase
    .from('vault_items')
    .select('id, iv, ciphertext, created_at')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function insertVaultItem(iv, ciphertext) {
  const { data: { session } } = await supabase.auth.getSession()
  const { data, error } = await supabase
    .from('vault_items')
    .insert({ iv, ciphertext, user_id: session.user.id })
    .select('id, iv, ciphertext, created_at')
    .single()
  if (error) throw error
  return data
}

export async function deleteVaultItem(id) {
  const { error } = await supabase.from('vault_items').delete().eq('id', id)
  if (error) throw error
}

export async function updateVaultItemCrypto(id, iv, ciphertext) {
  const { error } = await supabase
    .from('vault_items')
    .update({ iv, ciphertext })
    .eq('id', id)
  if (error) throw error
}

export async function updateProfile(userId, encryptionSalt, keyCheck) {
  const { error } = await supabase
    .from('profiles')
    .update({ encryption_salt: encryptionSalt, key_check: keyCheck })
    .eq('id', userId)
  if (error) throw error
}

export async function deleteAllUserData(userId) {
  const { error: e1 } = await supabase.from('vault_items').delete().eq('user_id', userId)
  if (e1) throw e1
  const { error: e2 } = await supabase.from('profiles').delete().eq('id', userId)
  if (e2) throw e2
}
