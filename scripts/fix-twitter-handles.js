const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf8');
const supabaseUrl = envFile.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1];
const supabaseKey = envFile.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)[1];

const supabase = createClient(supabaseUrl, supabaseKey);

// Correct mappings with actual slugs
const twitterMappings = {
  'puter-os': '@KernelKetchup',
  'fly-pieter': '@levelsio',
  'slapmac': '@joshlofi',
  'codepen-1': '@CodePen',
  'bruno-simon': '@bruno_simon',
  'ai-dungeon': '@aidungeon',
  'bitchat-1': '@bitchatapp'
};

async function fix() {
  console.log('Fixing Twitter handles with correct slugs...\n');
  
  let updated = 0;
  
  for (const [slug, twitter] of Object.entries(twitterMappings)) {
    const { error } = await supabase
      .from('products')
      .update({ maker_twitter: twitter })
      .eq('slug', slug);
    
    if (error) {
      console.log(`❌ ${slug}: ${error.message}`);
    } else {
      console.log(`✅ ${slug} → ${twitter}`);
      updated++;
    }
  }
  
  console.log(`\n🎉 Updated ${updated}/${Object.keys(twitterMappings).length} products`);
}

fix();
