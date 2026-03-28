-- Add video_url column for hover video on product cards
ALTER TABLE products ADD COLUMN IF NOT EXISTS video_url TEXT;

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_products_video_url ON products(video_url) WHERE video_url IS NOT NULL;
