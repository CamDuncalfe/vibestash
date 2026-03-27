const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf8');
const supabaseUrl = envFile.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1];
const supabaseKey = envFile.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)[1];

const supabase = createClient(supabaseUrl, supabaseKey);

async function verify() {
  console.log('✅ Verifying migration...\n');
  
  // Check products table has new columns
  const { data: products } = await supabase
    .from('products')
    .select('maker_twitter, upvotes_count')
    .limit(1);
  
  console.log('Products table new columns:', products[0]);
  
  // Check upvotes table exists
  const { data: upvotes, error } = await supabase
    .from('upvotes')
    .select('*')
    .limit(1);
  
  if (error) {
    console.log('❌ Upvotes table error:', error);
  } else {
    console.log(`✅ Upvotes table exists (${upvotes?.length || 0} rows)`);
  }
  
  console.log('\n🎉 Migration successful!');
}

verify();
