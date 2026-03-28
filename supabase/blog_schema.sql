-- Run this in Supabase → SQL Editor

CREATE TABLE IF NOT EXISTS blog_posts (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id    UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  slug         TEXT UNIQUE NOT NULL,
  category     TEXT NOT NULL DEFAULT 'General',
  title        TEXT NOT NULL,
  excerpt      TEXT NOT NULL DEFAULT '',
  content      TEXT NOT NULL DEFAULT '',
  published    BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Anyone (including anon) can read published posts
CREATE POLICY "blog_anon_read" ON blog_posts
  FOR SELECT TO anon USING (published = true);

-- Authenticated users (access controlled via beta code in the app) can do everything
CREATE POLICY "blog_auth_all" ON blog_posts
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Auto-update updated_at
CREATE TRIGGER blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
