const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf8');
const supabaseUrl = envFile.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1];
const supabaseKey = envFile.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)[1];

const supabase = createClient(supabaseUrl, supabaseKey);

// Known Twitter handles for popular vibe-coded products
const twitterMappings = {
  'doom-captcha': '@miquel_camps',
  'pong-wars': '@vnglst',
  'vibechess': '@floomby',
  'puter': '@KernelKetchup',
  'gameboy-live': '@gtanaka_dev',
  'sweep-up': '@_alexanderberk',
  'doomscroll': '@demianvalenzuela',
  'tetdle': '@galenrobins',
  'fly': '@levelsio',
  'slap-mac': '@joshlofi',
  'hacker-typer': '@duiker101',
  'is-it-big': '@benjojo',
  'the-password-game': '@nkannen',
  'neal-fun': '@nealagarwal',
  'windows93': '@windows93net',
  'the-useless-web': '@uselessweb',
  'pointer-pointer': '@StudioMoniker',
  'this-person-does-not-exist': '@philip_wang',
  'blob-opera': '@davidli',
  'quick-draw': '@googlecreativelab',
  'infinite-craft': '@nealagarwal'
};

async function addTwitterHandles() {
  console.log('Adding Twitter handles to products...\n');
  
  let updated = 0;
  
  for (const [slug, twitter] of Object.entries(twitterMappings)) {
    const { data, error } = await supabase
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

addTwitterHandles();
