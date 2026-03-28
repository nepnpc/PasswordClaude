import { supabase } from './supabase'

export async function fetchPublishedPosts() {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('id, slug, category, title, excerpt, published_at')
    .eq('published', true)
    .order('published_at', { ascending: false })
  if (error) throw error
  return data
}

export async function fetchAllPosts() {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('id, slug, category, title, excerpt, published, published_at, created_at')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function fetchPostById(id) {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function createPost(fields) {
  const { data: { session } } = await supabase.auth.getSession()
  const { data, error } = await supabase
    .from('blog_posts')
    .insert({ ...fields, author_id: session.user.id })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updatePost(id, fields) {
  const { data, error } = await supabase
    .from('blog_posts')
    .update(fields)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deletePost(id) {
  const { error } = await supabase.from('blog_posts').delete().eq('id', id)
  if (error) throw error
}

export async function togglePublish(id, currentlyPublished) {
  const fields = {
    published: !currentlyPublished,
    published_at: !currentlyPublished ? new Date().toISOString() : null,
  }
  return updatePost(id, fields)
}
