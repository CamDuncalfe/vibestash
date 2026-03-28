#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://smfrysqapzwdjfscltmq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZnJ5c3FhcHp3ZGpmc2NsdG1xIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDU1MzU1MiwiZXhwIjoyMDkwMTI5NTUyfQ.6OIb0Currb1nADd3riwFYGp-muQcpsCeH1qycy8P1Tg';

const supabase = createClient(supabaseUrl, supabaseKey);

async function auditProducts() {
  const { data: products, error } = await supabase
    .from('products')
    .select('id, title, slug, maker_name, maker_twitter, maker_avatar_url, url, thumbnail_url, released_at')
    .order('released_at', { ascending: false, nullsFirst: false });

  if (error) {
    console.error('Error fetching products:', error);
    return;
  }

  console.log(`\n=== VIBESTASH PRODUCT AUDIT (${products.length} total) ===\n`);

  products.forEach((p, idx) => {
    console.log(`${idx + 1}. ${p.title} (${p.slug})`);
    console.log(`   Maker: ${p.maker_name || 'MISSING'}`);
    console.log(`   X: ${p.maker_twitter || 'MISSING'}`);
    console.log(`   Avatar: ${p.maker_avatar_url ? 'YES' : 'MISSING'}`);
    console.log(`   Released: ${p.released_at || 'MISSING'}`);
    console.log(`   URL: ${p.url}`);
    console.log('');
  });
}

auditProducts();
