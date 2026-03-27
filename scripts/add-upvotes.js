const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf8');
const supabaseUrl = envFile.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1];
const supabaseKey = envFile.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)[1];

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrate() {
  console.log('🔧 Adding upvote feature...\n');
  
  // Note: Column additions need to be done via Supabase SQL Editor
  // This script will verify the changes
  
  console.log('⚠️  Please run these SQL commands in Supabase SQL Editor:');
  console.log('\n-- Add columns to products table');
  console.log('ALTER TABLE products ADD COLUMN IF NOT EXISTS maker_twitter TEXT;');
  console.log('ALTER TABLE products ADD COLUMN IF NOT EXISTS upvotes_count INTEGER DEFAULT 0 NOT NULL;');
  
  console.log('\n-- Create upvotes table');
  console.log(`CREATE TABLE IF NOT EXISTS upvotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);`);
  
  console.log('\nCREATE INDEX IF NOT EXISTS idx_upvotes_product_id ON upvotes(product_id);');
  console.log('CREATE INDEX IF NOT EXISTS idx_upvotes_user_id ON upvotes(user_id);');
  
  console.log('\n-- RLS Policies');
  console.log('ALTER TABLE upvotes ENABLE ROW LEVEL SECURITY;');
  console.log(`
CREATE POLICY "Anyone can view upvotes" ON upvotes
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can upvote" ON upvotes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own upvotes" ON upvotes
  FOR DELETE USING (auth.uid() = user_id);
`);
}

migrate();
