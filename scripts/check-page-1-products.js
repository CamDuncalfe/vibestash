const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf8');
const supabaseUrl = envFile.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1];
const supabaseKey = envFile.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)[1];

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data } = await supabase
    .from('products')
    .select('title, slug, maker_name, maker_twitter, upvotes_count, likes_count')
    .eq('approved', true)
    .order('featured', { ascending: false })
    .order('upvotes_count', { ascending: false })
    .order('likes_count', { ascending: false })
    .order('created_at', { ascending: false })
    .range(0, 11);
  
  console.log('First page products (should be visible on homepage):\n');
  data.forEach((p, i) => {
    console.log(`${(i+1).toString().padStart(2, ' ')}. ${p.title.padEnd(25, ' ')} Twitter: ${p.maker_twitter || 'N/A'.padEnd(20, ' ')}`);
  });
}

check();
