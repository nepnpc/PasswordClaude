import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createPost, fetchPostById, updatePost } from '../../lib/blog'

const CATEGORIES = ['Security', 'Guide', 'Education', 'Engineering', 'General']

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export default function PostEditor() {
  const { id } = useParams()   // undefined when creating new
  const navigate = useNavigate()
  const isNew = !id

  const [loading, setLoading]   = useState(!isNew)
  const [saving, setSaving]     = useState(false)
  const [error, setError]       = useState(null)

  const [title, setTitle]       = useState('')
  const [slug, setSlug]         = useState('')
  const [category, setCategory] = useState('General')
  const [excerpt, setExcerpt]   = useState('')
  const [content, setContent]   = useState('')
  const [published, setPublished] = useState(false)
  const [slugTouched, setSlugTouched] = useState(false)

  useEffect(() => {
    if (isNew) return
    fetchPostById(id)
      .then(post => {
        setTitle(post.title)
        setSlug(post.slug)
        setCategory(post.category)
        setExcerpt(post.excerpt)
        setContent(post.content)
        setPublished(post.published)
        setSlugTouched(true)
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [id, isNew])

  // Auto-generate slug from title when creating new post
  function handleTitleChange(val) {
    setTitle(val)
    if (!slugTouched) setSlug(slugify(val))
  }

  async function handleSubmit(e, publishNow = false) {
    e.preventDefault()
    setError(null)
    setSaving(true)
    const fields = {
      title: title.trim(),
      slug: slug.trim(),
      category,
      excerpt: excerpt.trim(),
      content: content.trim(),
      published: publishNow ? true : published,
      published_at: publishNow ? new Date().toISOString() : (published ? undefined : null),
    }
    try {
      if (isNew) {
        await createPost(fields)
      } else {
        await updatePost(id, fields)
      }
      navigate('/admin')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <main className="max-w-5xl mx-auto px-6 pt-28 pb-24">
        <div className="flex flex-col gap-4 max-w-2xl">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 bg-[#111111] animate-pulse" style={{ width: `${[60,100,40,100,80][i]}%` }} />
          ))}
        </div>
      </main>
    )
  }

  return (
    <main className="max-w-5xl mx-auto px-6 pt-28 pb-24">

      <section className="border-b border-[#333333] pb-8 mb-8 flex items-center justify-between">
        <div>
          <p className="text-xs tracking-widest uppercase text-[#888888] mb-1">Admin</p>
          <h1 className="text-3xl font-light tracking-tight text-white">
            {isNew ? 'New Post' : 'Edit Post'}
          </h1>
        </div>
        <button
          onClick={() => navigate('/admin')}
          className="text-xs tracking-widest uppercase text-[#666666] hover:text-white transition-colors duration-150 cursor-pointer"
        >
          ← Back
        </button>
      </section>

      {error && (
        <div className="border border-white px-4 py-3 mb-6">
          <p className="text-xs text-white font-light">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-2xl flex flex-col gap-5">

        {/* Title */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs tracking-widest uppercase text-[#888888]">Title *</label>
          <div className="border border-[#333333] focus-within:border-2 focus-within:border-white transition-[border-color,border-width] duration-150">
            <input
              type="text"
              value={title}
              onChange={e => handleTitleChange(e.target.value)}
              placeholder="Post title"
              required
              className="w-full bg-black text-white text-sm px-4 py-3 outline-none placeholder-[#444444]"
            />
          </div>
        </div>

        {/* Slug */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs tracking-widest uppercase text-[#888888]">Slug *</label>
          <div className="border border-[#333333] focus-within:border-2 focus-within:border-white transition-[border-color,border-width] duration-150">
            <input
              type="text"
              value={slug}
              onChange={e => { setSlug(e.target.value); setSlugTouched(true) }}
              placeholder="url-friendly-slug"
              required
              className="w-full bg-black text-white text-sm px-4 py-3 outline-none placeholder-[#444444] font-mono"
            />
          </div>
        </div>

        {/* Category */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs tracking-widest uppercase text-[#888888]">Category</label>
          <div className="border border-[#333333] focus-within:border-2 focus-within:border-white transition-[border-color,border-width] duration-150">
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full bg-black text-white text-sm px-4 py-3 outline-none appearance-none cursor-pointer"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Excerpt */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs tracking-widest uppercase text-[#888888]">Excerpt *</label>
          <div className="border border-[#333333] focus-within:border-2 focus-within:border-white transition-[border-color,border-width] duration-150">
            <textarea
              value={excerpt}
              onChange={e => setExcerpt(e.target.value)}
              placeholder="One or two sentences shown in the blog listing…"
              rows={3}
              required
              className="w-full bg-black text-white text-sm px-4 py-3 outline-none placeholder-[#444444] resize-none"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs tracking-widest uppercase text-[#888888]">Content</label>
          <div className="border border-[#333333] focus-within:border-2 focus-within:border-white transition-[border-color,border-width] duration-150">
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Full post content (Markdown supported)…"
              rows={16}
              className="w-full bg-black text-white text-sm px-4 py-3 outline-none placeholder-[#444444] resize-y font-mono leading-relaxed"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="border border-[#333333] text-[#888888] text-xs tracking-widest uppercase py-3 px-6 hover:border-white hover:text-white transition-colors duration-150 cursor-pointer disabled:opacity-40"
          >
            {saving ? 'Saving…' : 'Save Draft'}
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={e => handleSubmit(e, true)}
            className="border border-white text-white text-xs tracking-widest uppercase py-3 px-6 hover:bg-white hover:text-black transition-colors duration-150 cursor-pointer disabled:opacity-40"
          >
            {saving ? 'Publishing…' : published ? 'Update & Publish' : 'Publish'}
          </button>
        </div>
      </form>
    </main>
  )
}
