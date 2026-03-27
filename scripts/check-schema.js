const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf8');
const supabaseUrl = envFile.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1];
const supabaseKey = envFile.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)[1];

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .limit(1);
  
  console.log('Current product schema:');
  console.log(JSON.stringify(products[0], null, 2));
}

checkSchema();
