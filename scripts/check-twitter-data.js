const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf8');
const supabaseUrl = envFile.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1];
const supabaseKey = envFile.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)[1];

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data } = await supabase
    .from('products')
    .select('title, maker_name, maker_twitter')
    .not('maker_twitter', 'is', null)
    .limit(10);
  
  console.log('Products with Twitter handles:');
  data.forEach(p => {
    console.log(`${p.title.padEnd(30, ' ')} ${p.maker_twitter.padEnd(20, ' ')} (maker: ${p.maker_name || 'N/A'})`);
  });
}

check();
