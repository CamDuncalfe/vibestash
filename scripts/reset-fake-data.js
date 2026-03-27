const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf8');
const supabaseUrl = envFile.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1];
const supabaseKey = envFile.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)[1];

const supabase = createClient(supabaseUrl, supabaseKey);

async function reset() {
  console.log('Resetting all fake data to genuine state...\n');
  
  // Reset likes_count to 0
  const { error: likesError } = await supabase
    .from('products')
    .update({ likes_count: 0 })
    .neq('likes_count', 0);
  
  if (likesError) {
    console.error('Error resetting likes:', likesError);
    return;
  }
  console.log('✅ Reset all likes_count to 0');
  
  // Reset views_count to 0
  const { error: viewsError } = await supabase
    .from('products')
    .update({ views_count: 0 })
    .neq('views_count', 0);
  
  if (viewsError) {
    console.error('Error resetting views:', viewsError);
    return;
  }
  console.log('✅ Reset all views_count to 0');
  
  // Verify
  const { data: check } = await supabase
    .from('products')
    .select('likes_count, views_count')
    .or('likes_count.neq.0,views_count.neq.0');
  
  console.log(`\n${check?.length || 0} products still have non-zero counts (should be 0)`);
  
  console.log('\n✅ All fake data removed. Everything is now genuine.');
}

reset();
