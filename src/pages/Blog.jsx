import { useState, useEffect } from 'react'
import { SkeletonCard } from '../components/Skeleton'
import { fetchPublishedPosts } from '../lib/blog'

export default function Blog() {
  const [posts, setPosts]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(null)

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

      {/* Posts grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#333333]">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : posts.length === 0 && !error ? (
        <div className="border border-[#1a1a1a] px-8 py-20 text-center">
          <p className="text-xs tracking-widest uppercase text-[#666666] mb-3">No posts yet</p>
          <p className="text-sm text-[#888888] font-light">Check back soon.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#333333]">
          {posts.map(({ id, category, title, excerpt, published_at }) => (
            <article
              key={id}
              className="bg-black p-8 flex flex-col gap-4 group border border-transparent hover:border-[#333333] active:border-white transition-colors duration-150 cursor-pointer"
            >
              <span className="text-xs tracking-widest uppercase text-[#666666]">{category}</span>

              <h2 className="text-base font-medium text-white tracking-tight leading-snug group-hover:text-[#cccccc] transition-colors duration-150">
                {title}
              </h2>

              <p className="text-sm text-[#888888] font-light leading-relaxed flex-1">{excerpt}</p>

              <div className="flex items-center justify-between pt-2 border-t border-[#1a1a1a]">
                <span className="text-xs text-[#555555]">
                  {published_at
                    ? new Date(published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
                    : ''}
                </span>
                <span className="text-xs tracking-widest uppercase text-[#666666] group-hover:text-white transition-colors duration-150">
                  Read →
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}
