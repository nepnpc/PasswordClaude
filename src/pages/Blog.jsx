import { useState, useEffect } from 'react'
import { SkeletonCard } from '../components/Skeleton'
import { fetchPublishedPosts } from '../lib/blog'

export default function Blog() {
  const [posts, setPosts]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const [expandedId, setExpandedId] = useState(null)

  useEffect(() => {
    fetchPublishedPosts()
      .then(setPosts)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <main className="max-w-5xl mx-auto px-6 pt-32 pb-24">

      {/* Header */}
      <section className="border-b border-[#333333] pb-16 mb-16">
        <p className="text-xs tracking-widest uppercase text-[#888888] mb-6">Blog</p>
        <div className="flex items-end justify-between gap-6">
          <h1 className="text-5xl font-light tracking-tight text-white leading-tight">Articles</h1>
          <p className="text-sm text-[#666666] font-light pb-1">
            {loading
              ? <span className="inline-block w-16 h-3 bg-[#1a1a1a] animate-pulse" />
              : `${posts.length} post${posts.length !== 1 ? 's' : ''}`
            }
          </p>
        </div>
      </section>

      {/* Error */}
      {error && (
        <div className="border border-white px-5 py-4 mb-8">
          <p className="text-xs text-white font-light">Failed to load posts: {error}</p>
        </div>
      )}

      {/* Posts */}
      {loading ? (
        <div className="flex flex-col gap-px bg-[#222222]">
          {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : posts.length === 0 && !error ? (
        <div className="border border-[#1a1a1a] px-8 py-20 text-center">
          <p className="text-xs tracking-widest uppercase text-[#666666] mb-3">No posts yet</p>
          <p className="text-sm text-[#888888] font-light">Check back soon.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-px bg-[#222222]">
          {posts.map(post => {
            const isExpanded = expandedId === post.id
            return (
              <article key={post.id} className="bg-black">

                {/* Card header — always visible */}
                <div className="p-8 flex flex-col gap-4">
                  <span className="text-xs tracking-widest uppercase text-[#666666]">{post.category}</span>

                  <h2 className="text-base font-medium text-white tracking-tight leading-snug">
                    {post.title}
                  </h2>

                  <p className="text-sm text-[#888888] font-light leading-relaxed">{post.excerpt}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-[#1a1a1a]">
                    <span className="text-xs text-[#555555]">
                      {post.published_at
                        ? new Date(post.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
                        : ''}
                    </span>
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : post.id)}
                      className="text-xs tracking-widest uppercase border border-[#333333] px-3 py-1.5 text-[#888888] hover:border-white hover:text-white transition-colors duration-150 cursor-pointer"
                    >
                      {isExpanded ? '← Minimize' : 'Read →'}
                    </button>
                  </div>
                </div>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="border-t border-[#1a1a1a] px-8 pb-10 pt-8">
                    {post.content ? (
                      <div className="prose-custom">
                        {post.content.split('\n').map((line, i) => (
                          line.trim() === ''
                            ? <div key={i} className="h-4" />
                            : <p key={i} className="text-sm text-[#cccccc] font-light leading-relaxed">{line}</p>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-[#555555] font-light italic">No content yet.</p>
                    )}
                    <button
                      onClick={() => setExpandedId(null)}
                      className="mt-8 text-xs tracking-widest uppercase text-[#555555] hover:text-white transition-colors duration-150 cursor-pointer border-b border-transparent hover:border-[#555555]"
                    >
                      ← Minimize
                    </button>
                  </div>
                )}
              </article>
            )
          })}
        </div>
      )}
    </main>
  )
}
