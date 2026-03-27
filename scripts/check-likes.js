const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf8');
const supabaseUrl = envFile.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1];
const supabaseKey = envFile.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/)[1];

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data: products, error } = await supabase
    .from('products')
    .select('title, slug, likes_count')
    .order('likes_count', { ascending: false })
    .limit(15);

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('Products with likes_count:');
  products.forEach(p => {
    console.log(`${p.likes_count.toString().padStart(4, ' ')} - ${p.title}`);
  });
}

check();
