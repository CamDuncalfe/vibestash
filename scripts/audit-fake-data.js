const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf8');
const supabaseUrl = envFile.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1];
const supabaseKey = envFile.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/)[1];

const supabase = createClient(supabaseUrl, supabaseKey);

async function audit() {
  // Check products for fake data
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .limit(5);

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('Sample product structure:');
  console.log(JSON.stringify(products[0], null, 2));
  
  // Check for likes/favorites
  const { data: likes } = await supabase
    .from('product_likes')
    .select('*')
    .limit(5);
    
  console.log('\n\nProduct likes table:', likes ? likes.length : 'Does not exist');
  
  // Check for views
  const { data: views } = await supabase
    .from('product_views')
    .select('*')
    .limit(5);
    
  console.log('Product views table:', views ? views.length : 'Does not exist');
}

audit();
