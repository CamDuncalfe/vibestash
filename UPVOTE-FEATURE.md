# Upvote Feature + X Account Links

## Database Changes Needed

### 1. Add columns to `products` table
```sql
ALTER TABLE products 
ADD COLUMN maker_twitter TEXT,
ADD COLUMN upvotes_count INTEGER DEFAULT 0 NOT NULL;
```

### 2. Create `upvotes` table
```sql
CREATE TABLE upvotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

CREATE INDEX idx_upvotes_product_id ON upvotes(product_id);
CREATE INDEX idx_upvotes_user_id ON upvotes(user_id);
```

### 3. RLS Policies for upvotes
```sql
ALTER TABLE upvotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view upvotes"
  ON upvotes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can upvote"
  ON upvotes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own upvotes"
  ON upvotes FOR DELETE
  USING (auth.uid() = user_id);
```

## UI Changes

### Product Card
- Show maker Twitter handle below maker name (if exists)
- Format: "by @handle" with link to twitter.com/handle
- Add upvote button (separate from like button)
- Upvote = "this is high quality" (more selective)
- Like = "I enjoyed this" (more casual)

### Product Detail Page
- Prominent X handle link
- Upvote/downvote buttons
- Show upvote count

## Design Pattern
- **Like button:** Heart icon (current, keep as-is)
- **Upvote button:** Arrow up icon (new, think Hacker News/Reddit style)
- Upvotes should be more prominent in sorting (quality signal)

## Next Steps
1. Run migration in Supabase
2. Update TypeScript types
3. Create UpvoteButton component
4. Update ProductCard to show Twitter handle
5. Update sorting to prioritize upvotes over likes
