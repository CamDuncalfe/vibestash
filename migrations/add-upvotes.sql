-- Add upvote feature to VibeStash
-- Run this in Supabase SQL Editor

-- Add columns to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS maker_twitter TEXT,
ADD COLUMN IF NOT EXISTS upvotes_count INTEGER DEFAULT 0 NOT NULL;

-- Create upvotes table
CREATE TABLE IF NOT EXISTS upvotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_upvotes_product_id ON upvotes(product_id);
CREATE INDEX IF NOT EXISTS idx_upvotes_user_id ON upvotes(user_id);

-- RLS Policies
ALTER TABLE upvotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view upvotes" ON upvotes
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can upvote" ON upvotes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own upvotes" ON upvotes
  FOR DELETE USING (auth.uid() = user_id);
