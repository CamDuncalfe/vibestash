const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf8');
const supabaseUrl = envFile.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1];
const supabaseKey = envFile.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)[1];

const supabase = createClient(supabaseUrl, supabaseKey);

async function debug() {
  // Check the exact slugs
  const slugs = ['puter', 'fly', 'slap-mac'];
  
  for (const slug of slugs) {
    const { data } = await supabase
      .from('products')
      .select('title, slug, maker_twitter')
      .eq('slug', slug);
    
    console.log(slug, '→', data);
  }
  
  // Try searching for them differently
  const { data: puterResults } = await supabase
    .from('products')
    .select('title, slug, maker_twitter')
    .ilike('slug', '%puter%');
  
  console.log('\nProducts with "puter" in slug:');
  puterResults.forEach(p => console.log(p));
}

debug();
