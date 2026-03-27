const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf8');
const supabaseUrl = envFile.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1];
const supabaseKey = envFile.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)[1];

const supabase = createClient(supabaseUrl, supabaseKey);

async function audit() {
  console.log('🔍 AUDITING FOR PLACEHOLDER/FAKE DATA\n');
  
  // Check for products with null/missing data
  const { data: products } = await supabase
    .from('products')
    .select('*');
  
  let issues = [];
  
  products.forEach(p => {
    if (!p.description || p.description.includes('Lorem') || p.description.includes('placeholder')) {
      issues.push(`${p.title}: Placeholder description`);
    }
    if (!p.thumbnail_url) {
      issues.push(`${p.title}: Missing thumbnail`);
    }
    if (!p.maker_name) {
      issues.push(`${p.title}: Missing maker name`);
    }
    if (!p.url || p.url.includes('example.com')) {
      issues.push(`${p.title}: Placeholder URL`);
    }
  });
  
  if (issues.length > 0) {
    console.log('❌ FOUND ISSUES:\n');
    issues.forEach(i => console.log(`  - ${i}`));
  } else {
    console.log('✅ No placeholder content found');
  }
  
  console.log('\n📊 STATS:');
  console.log(`  Products: ${products.length}`);
  console.log(`  With thumbnails: ${products.filter(p => p.thumbnail_url).length}`);
  console.log(`  With makers: ${products.filter(p => p.maker_name).length}`);
  console.log(`  With descriptions: ${products.filter(p => p.description).length}`);
}

audit();
