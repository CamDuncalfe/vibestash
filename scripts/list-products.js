const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read .env.local manually
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) env[match[1]] = match[2];
});

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
);

async function listProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('id, title, url, description, approved')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log(`\nTotal products: ${data.length}\n`);
  data.forEach((p, i) => {
    console.log(`${i + 1}. ${p.title}`);
    console.log(`   URL: ${p.url}`);
    console.log(`   Approved: ${p.approved}`);
    console.log(`   ID: ${p.id}`);
    console.log(`   Desc: ${p.description?.substring(0, 100)}...`);
    console.log('');
  });
}

listProducts();
