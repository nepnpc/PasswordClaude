import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchAllPosts, deletePost, togglePublish } from '../../lib/blog'

export default function AdminIndex() {
  const [posts, setPosts]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(null)

  useEffect(() => {
    fetchAllPosts()
      .then(setPosts)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  async function handleToggle(post) {
    try {
      const updated = await togglePublish(post.id, post.published)
      setPosts(prev => prev.map(p => p.id === post.id ? { ...p, ...updated } : p))
    } catch (e) {
      setError(e.message)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this post permanently?')) return
    try {
      await deletePost(id)
      setPosts(prev => prev.filter(p => p.id !== id))
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <main className="max-w-5xl mx-auto px-6 pt-28 pb-24">

      <section className="border-b border-[#333333] pb-8 mb-8 flex items-center justify-between">
        <div>
          <p className="text-xs tracking-widest uppercase text-[#888888] mb-1">Admin</p>
          <h1 className="text-3xl font-light tracking-tight text-white">Blog Posts</h1>
        </div>
        <Link
          to="/admin/post/new"
          className="border border-white text-white text-xs tracking-widest uppercase py-3 px-6 hover:bg-white hover:text-black transition-colors duration-150 flex items-center gap-2"
        >
          <PlusIcon /> New Post
        </Link>
      </section>

      {error && (
        <div className="border border-white px-4 py-3 mb-6">
          <p className="text-xs text-white font-light">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col gap-px bg-[#222222]">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-black px-5 py-4 flex items-center gap-4">
              <div className="h-3 bg-[#111111] animate-pulse flex-1" />
              <div className="h-3 bg-[#111111] animate-pulse w-20" />
              <div className="h-3 bg-[#0d0d0d] animate-pulse w-16" />
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="border border-[#1a1a1a] px-8 py-16 text-center">
          <p className="text-xs tracking-widest uppercase text-[#666666] mb-3">No posts yet</p>
          <p className="text-sm text-[#888888] font-light">Create your first blog post to get started.</p>
        </div>
      ) : (
        <div className="border border-[#222222] divide-y divide-[#1a1a1a]">
          {/* Header row */}
          <div className="hidden md:flex items-center gap-4 px-5 py-2 text-[10px] tracking-widest uppercase text-[#555555]">
            <div className="flex-1">Title</div>
            <div className="w-24">Category</div>
            <div className="w-20">Status</div>
            <div className="w-32 text-right">Actions</div>
          </div>

          {posts.map(post => (
            <div key={post.id} className="flex items-center gap-4 px-5 py-4 bg-black hover:bg-[#0a0a0a] transition-colors duration-150">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-medium truncate">{post.title}</p>
                <p className="text-xs text-[#666666] mt-0.5 truncate">{post.excerpt}</p>
              </div>
              <div className="hidden md:block w-24">
                <span className="text-xs text-[#777777]">{post.category}</span>
              </div>
              <div className="w-20">
                <span className={`text-xs tracking-widest uppercase ${post.published ? 'text-white' : 'text-[#555555]'}`}>
                  {post.published ? 'Live' : 'Draft'}
                </span>
              </div>
              <div className="flex items-center gap-3 w-32 justify-end shrink-0">
                <button
                  onClick={() => handleToggle(post)}
                  className="text-xs tracking-widest uppercase text-[#666666] hover:text-white transition-colors duration-150 cursor-pointer"
                >
                  {post.published ? 'Unpublish' : 'Publish'}
                </button>
                <Link
                  to={`/admin/post/${post.id}`}
                  className="text-xs tracking-widest uppercase text-[#666666] hover:text-white transition-colors duration-150"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="text-[#444444] hover:text-white transition-colors duration-150 cursor-pointer"
                >
                  <TrashIcon />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}

function PlusIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
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
