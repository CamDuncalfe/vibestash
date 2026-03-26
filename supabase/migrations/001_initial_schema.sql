-- VibeStash Initial Schema
-- Run this in Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CATEGORIES
-- ============================================
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed default categories
INSERT INTO categories (name, slug, icon, sort_order) VALUES
  ('SaaS', 'saas', '☁️', 1),
  ('Mobile App', 'mobile-app', '📱', 2),
  ('Chrome Extension', 'chrome-extension', '🧩', 3),
  ('CLI Tool', 'cli-tool', '⌨️', 4),
  ('Game', 'game', '🎮', 5),
  ('AI Tool', 'ai-tool', '🤖', 6),
  ('Marketplace', 'marketplace', '🏪', 7),
  ('Social', 'social', '💬', 8),
  ('Productivity', 'productivity', '⚡', 9),
  ('Developer Tool', 'developer-tool', '🛠️', 10),
  ('Design Tool', 'design-tool', '🎨', 11),
  ('Finance', 'finance', '💰', 12),
  ('Education', 'education', '📚', 13),
  ('Health', 'health', '🏥', 14),
  ('E-commerce', 'e-commerce', '🛒', 15),
  ('API', 'api', '🔌', 16),
  ('Dashboard', 'dashboard', '📊', 17),
  ('Landing Page', 'landing-page', '🚀', 18);

-- ============================================
-- TOOLS (equivalent to "fonts" on MaxiBestOf)
-- ============================================
CREATE TABLE tools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  url TEXT,
  logo_url TEXT,
  description TEXT,
  products_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed default tools
INSERT INTO tools (name, slug, url, description) VALUES
  ('Cursor', 'cursor', 'https://cursor.sh', 'AI-first code editor'),
  ('v0', 'v0', 'https://v0.dev', 'AI UI component generator by Vercel'),
  ('Bolt', 'bolt', 'https://bolt.new', 'AI full-stack app builder'),
  ('Lovable', 'lovable', 'https://lovable.dev', 'AI web app builder'),
  ('Claude', 'claude', 'https://claude.ai', 'Anthropic AI assistant'),
  ('ChatGPT', 'chatgpt', 'https://chat.openai.com', 'OpenAI AI assistant'),
  ('Replit', 'replit', 'https://replit.com', 'Online IDE with AI'),
  ('Windsurf', 'windsurf', 'https://codeium.com/windsurf', 'AI IDE by Codeium'),
  ('Copilot', 'copilot', 'https://github.com/features/copilot', 'GitHub AI pair programmer'),
  ('Midjourney', 'midjourney', 'https://midjourney.com', 'AI image generation'),
  ('Figma', 'figma', 'https://figma.com', 'Design tool'),
  ('Framer', 'framer', 'https://framer.com', 'Web design and publishing'),
  ('Supabase', 'supabase', 'https://supabase.com', 'Open source Firebase alternative'),
  ('Firebase', 'firebase', 'https://firebase.google.com', 'Google app platform'),
  ('Vercel', 'vercel', 'https://vercel.com', 'Frontend deployment platform'),
  ('Netlify', 'netlify', 'https://netlify.com', 'Web deployment platform'),
  ('Stripe', 'stripe', 'https://stripe.com', 'Payment infrastructure'),
  ('OpenAI API', 'openai-api', 'https://platform.openai.com', 'OpenAI API platform'),
  ('Anthropic API', 'anthropic-api', 'https://console.anthropic.com', 'Anthropic API platform'),
  ('Gemini', 'gemini', 'https://gemini.google.com', 'Google AI assistant'),
  ('Devin', 'devin', 'https://devin.ai', 'AI software engineer'),
  ('Trae', 'trae', 'https://trae.ai', 'AI IDE by ByteDance');

-- ============================================
-- PRODUCTS (the main entity)
-- ============================================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  url TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  screenshots TEXT[] DEFAULT '{}',
  maker_name TEXT,
  maker_url TEXT,
  maker_avatar_url TEXT,
  tools_used TEXT[] DEFAULT '{}',
  categories TEXT[] DEFAULT '{}',
  tech_stack TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT FALSE,
  featured_at TIMESTAMPTZ,
  submitted_by UUID REFERENCES auth.users(id),
  approved BOOLEAN DEFAULT FALSE,
  approved_at TIMESTAMPTZ,
  views_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for common queries
CREATE INDEX idx_products_approved ON products(approved) WHERE approved = TRUE;
CREATE INDEX idx_products_featured ON products(featured) WHERE featured = TRUE;
CREATE INDEX idx_products_created_at ON products(created_at DESC);
CREATE INDEX idx_products_views_count ON products(views_count DESC);
CREATE INDEX idx_products_likes_count ON products(likes_count DESC);
CREATE INDEX idx_products_slug ON products(slug);

-- Full-text search index
CREATE INDEX idx_products_search ON products USING GIN (
  to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '') || ' ' || coalesce(maker_name, ''))
);

-- ============================================
-- PRODUCT_CATEGORIES (many-to-many)
-- ============================================
CREATE TABLE product_categories (
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, category_id)
);

-- ============================================
-- PRODUCT_TOOLS (many-to-many)
-- ============================================
CREATE TABLE product_tools (
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, tool_id)
);

-- ============================================
-- LIKES (user favorites)
-- ============================================
CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

CREATE INDEX idx_likes_user ON likes(user_id);
CREATE INDEX idx_likes_product ON likes(product_id);

-- ============================================
-- COLLECTIONS
-- ============================================
CREATE TABLE collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_collections_user ON collections(user_id);

-- ============================================
-- COLLECTION_ITEMS
-- ============================================
CREATE TABLE collection_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(collection_id, product_id)
);

-- ============================================
-- SUBMISSIONS (user-submitted products for review)
-- ============================================
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  product_url TEXT NOT NULL,
  product_name TEXT,
  comments TEXT,
  tools_used TEXT[] DEFAULT '{}',
  maker_name TEXT,
  maker_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ
);

CREATE INDEX idx_submissions_status ON submissions(status);

-- ============================================
-- NEWSLETTER_SUBSCRIBERS
-- ============================================
CREATE TABLE newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE
);

-- ============================================
-- USER PROFILES (extended user data)
-- ============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  website TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Products: public read for approved, admin write
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view approved products"
  ON products FOR SELECT
  USING (approved = TRUE);

CREATE POLICY "Admins can do anything with products"
  ON products FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE)
  );

-- Categories: public read, admin write
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view categories"
  ON categories FOR SELECT
  USING (TRUE);

CREATE POLICY "Admins can manage categories"
  ON categories FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE)
  );

-- Tools: public read, admin write
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view tools"
  ON tools FOR SELECT
  USING (TRUE);

CREATE POLICY "Admins can manage tools"
  ON tools FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE)
  );

-- Likes: user can manage own, public read counts
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own likes"
  ON likes FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Public can view likes"
  ON likes FOR SELECT
  USING (TRUE);

-- Collections: owner can manage, public can view public collections
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own collections"
  ON collections FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Public can view public collections"
  ON collections FOR SELECT
  USING (is_public = TRUE);

-- Collection items: follows collection access
ALTER TABLE collection_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own collection items"
  ON collection_items FOR ALL
  USING (
    EXISTS (SELECT 1 FROM collections WHERE collections.id = collection_id AND collections.user_id = auth.uid())
  );

CREATE POLICY "Public can view public collection items"
  ON collection_items FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM collections WHERE collections.id = collection_id AND collections.is_public = TRUE)
  );

-- Submissions: authenticated users can insert, view own
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can submit"
  ON submissions FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can view own submissions"
  ON submissions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage submissions"
  ON submissions FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE)
  );

-- Newsletter: admin only
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage newsletter"
  ON newsletter_subscribers FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE)
  );

CREATE POLICY "Public can subscribe to newsletter"
  ON newsletter_subscribers FOR INSERT
  WITH CHECK (TRUE);

-- Profiles: users can view all, edit own
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view profiles"
  ON profiles FOR SELECT
  USING (TRUE);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Product categories/tools: public read
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view product categories"
  ON product_categories FOR SELECT
  USING (TRUE);

CREATE POLICY "Admins can manage product categories"
  ON product_categories FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE)
  );

ALTER TABLE product_tools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view product tools"
  ON product_tools FOR SELECT
  USING (TRUE);

CREATE POLICY "Admins can manage product tools"
  ON product_tools FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE)
  );

-- ============================================
-- FUNCTIONS
-- ============================================

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Increment/decrement likes count
CREATE OR REPLACE FUNCTION increment_likes()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products SET likes_count = likes_count + 1 WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION decrement_likes()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products SET likes_count = likes_count - 1 WHERE id = OLD.product_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_like_created
  AFTER INSERT ON likes
  FOR EACH ROW EXECUTE FUNCTION increment_likes();

CREATE TRIGGER on_like_deleted
  AFTER DELETE ON likes
  FOR EACH ROW EXECUTE FUNCTION decrement_likes();

-- Increment view count function (called from API)
CREATE OR REPLACE FUNCTION increment_views(product_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE products SET views_count = views_count + 1 WHERE id = product_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Search products function
CREATE OR REPLACE FUNCTION search_products(search_query TEXT)
RETURNS SETOF products AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM products
  WHERE approved = TRUE
  AND (
    to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '') || ' ' || coalesce(maker_name, ''))
    @@ plainto_tsquery('english', search_query)
    OR title ILIKE '%' || search_query || '%'
    OR description ILIKE '%' || search_query || '%'
    OR maker_name ILIKE '%' || search_query || '%'
    OR search_query = ANY(tools_used)
    OR search_query = ANY(categories)
  )
  ORDER BY
    ts_rank(
      to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '') || ' ' || coalesce(maker_name, '')),
      plainto_tsquery('english', search_query)
    ) DESC,
    likes_count DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update products_count on tools when product_tools changes
CREATE OR REPLACE FUNCTION update_tool_product_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE tools SET products_count = products_count + 1 WHERE id = NEW.tool_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE tools SET products_count = products_count - 1 WHERE id = OLD.tool_id;
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_product_tool_changed
  AFTER INSERT OR DELETE ON product_tools
  FOR EACH ROW EXECUTE FUNCTION update_tool_product_count();

-- ============================================
-- STORAGE BUCKET
-- ============================================
INSERT INTO storage.buckets (id, name, public) VALUES ('screenshots', 'screenshots', TRUE);

CREATE POLICY "Public can view screenshots"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'screenshots');

CREATE POLICY "Admins can upload screenshots"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'screenshots'
    AND EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE)
  );

CREATE POLICY "Authenticated users can upload screenshots"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'screenshots'
    AND auth.uid() IS NOT NULL
  );
