#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://smfrysqapzwdjfscltmq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZnJ5c3FhcHp3ZGpmc2NsdG1xIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDU1MzU1MiwiZXhwIjoyMDkwMTI5NTUyfQ.6OIb0Currb1nADd3riwFYGp-muQcpsCeH1qycy8P1Tg';

const supabase = createClient(supabaseUrl, supabaseKey);

const PRODUCTS_TO_FLAG = [
  // Established browser games (not vibe-coded, too old/established)
  'Agar.io', 'Slither.io', '2048', 'Cookie Clicker', 'Flappy Bird', 'Wordle',
  'GeoGuessr', 'Cool Math Games', 'Incremental Games', 'A Dark Room', 'Candy Box',
  'Universal Paperclips', 'Krunker.io', 'Diep.io', 'Little Alchemy', 'Sporcle',
  'Akinator', 'The Wiki Game', 'Quick Draw with Google', 'AI Dungeon',
  // Dev platforms (not vibe-coded products)
  'itch.io', 'Replit', 'Glitch', 'Observable', 'RunKit', 'CodePen', 'JSFiddle',
  'CodeSandbox', 'Val Town', 'Deno Deploy', 'Railway', 'Render', 'Fly.io',
  'Supabase', 'PlanetScale', 'Neon', 'Vercel', 'Netlify', 'Cloudflare Pages',
  'GitHub Pages',
  // Productivity/no-code platforms
  'Notion', 'Coda', 'Airtable', 'Retool', 'Streamlit', 'Gradio',
  'Hugging Face Spaces', 'Google Colab', 'Kaggle', 'Jupyter',
  // Creative coding libraries/tools
  'p5.js', 'Three.js', 'D3.js', 'Processing', 'OpenFrameworks', 'TouchDesigner',
  'Sonic Pi', 'TidalCycles', 'Hydra', 'Cables.gl', 'ShaderToy', 'Desmos',
  'GeoGebra', 'Mathigon', 'Brilliant', '3Blue1Brown', 'Khan Academy',
  // Visual/no-code builders
  'Scratch', 'Snap!', 'App Inventor', 'Thunkable', 'Bubble', 'Webflow', 'Framer',
  'Squarespace', 'Wix', 'Carrd', 'Super.so', 'Typedream', 'Softr', 'Glide',
  'Adalo', 'FlutterFlow', 'Draftbit', 'AppGyver', 'Power Apps',
  // Automation platforms
  'Zapier', 'Make', 'n8n', 'Pipedream', 'IFTTT',
  // Form/event tools
  'Tally', 'Typeform', 'Jotform', 'Luma', 'Partiful',
  // Other established
  'xkcd',
];

function normalize(str) {
  return str.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
}

function getCategory(title) {
  const t = title.toLowerCase();
  const games = ['agar.io', 'slither.io', '2048', 'cookie clicker', 'flappy bird', 'wordle',
    'geoguessr', 'cool math games', 'incremental games', 'a dark room', 'candy box',
    'universal paperclips', 'krunker.io', 'diep.io', 'little alchemy', 'sporcle',
    'akinator', 'the wiki game', 'quick draw with google', 'ai dungeon'];
  const devPlatforms = ['itch.io', 'replit', 'glitch', 'observable', 'runkit', 'codepen',
    'jsfiddle', 'codesandbox', 'val town', 'deno deploy', 'railway', 'render', 'fly.io',
    'supabase', 'planetscale', 'neon', 'vercel', 'netlify', 'cloudflare pages', 'github pages'];
  const productivity = ['notion', 'coda', 'airtable', 'retool', 'streamlit', 'gradio',
    'hugging face spaces', 'google colab', 'kaggle', 'jupyter'];
  const creative = ['p5.js', 'three.js', 'd3.js', 'processing', 'openframeworks',
    'touchdesigner', 'sonic pi', 'tidalcycles', 'hydra', 'cables.gl', 'shadertoy',
    'desmos', 'geogebra', 'mathigon', 'brilliant', '3blue1brown', 'khan academy'];
  const noCode = ['scratch', 'snap!', 'app inventor', 'thunkable', 'bubble', 'webflow',
    'framer', 'squarespace', 'wix', 'carrd', 'super.so', 'typedream', 'softr', 'glide',
    'adalo', 'flutterflow', 'draftbit', 'appgyver', 'power apps'];
  const automation = ['zapier', 'make', 'n8n', 'pipedream', 'ifttt'];
  const formEvent = ['tally', 'typeform', 'jotform', 'luma', 'partiful'];

  if (games.some(g => normalize(g) === normalize(t))) return 'Established game/interactive — not vibe-coded';
  if (devPlatforms.some(g => normalize(g) === normalize(t))) return 'Established dev platform — not a vibe-coded product';
  if (productivity.some(g => normalize(g) === normalize(t))) return 'Established productivity/ML platform — not vibe-coded';
  if (creative.some(g => normalize(g) === normalize(t))) return 'Established creative coding tool/library — not vibe-coded';
  if (noCode.some(g => normalize(g) === normalize(t))) return 'Established no-code/visual builder — not vibe-coded';
  if (automation.some(g => normalize(g) === normalize(t))) return 'Established automation platform — not vibe-coded';
  if (formEvent.some(g => normalize(g) === normalize(t))) return 'Established form/event platform — not vibe-coded';
  return 'Established platform — not vibe-coded';
}

async function main() {
  console.log('Adding flagged_for_removal columns if they don\'t exist...');

  // Add columns via SQL
  const { error: sqlError1 } = await supabase.rpc('exec_sql', {
    query: 'ALTER TABLE products ADD COLUMN IF NOT EXISTS flagged_for_removal BOOLEAN DEFAULT FALSE'
  }).maybeSingle();

  // If RPC doesn't exist, try direct SQL via REST
  if (sqlError1) {
    console.log('RPC not available, using direct SQL via postgrest...');
    // Use the Supabase SQL editor endpoint
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify({ query: 'ALTER TABLE products ADD COLUMN IF NOT EXISTS flagged_for_removal BOOLEAN DEFAULT FALSE; ALTER TABLE products ADD COLUMN IF NOT EXISTS flag_reason TEXT;' }),
    });

    if (!response.ok) {
      // Try the management API
      console.log('Trying direct query via management API...');
      const sqlResponse = await fetch(`${supabaseUrl}/pg`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({
          query: 'ALTER TABLE products ADD COLUMN IF NOT EXISTS flagged_for_removal BOOLEAN DEFAULT FALSE; ALTER TABLE products ADD COLUMN IF NOT EXISTS flag_reason TEXT;'
        }),
      });

      if (!sqlResponse.ok) {
        console.log('Could not run ALTER TABLE via API. Running via supabase query...');
        // Try using the from().select() workaround - just check if columns exist
        const { data: testData, error: testError } = await supabase
          .from('products')
          .select('flagged_for_removal, flag_reason')
          .limit(1);

        if (testError && testError.message.includes('column')) {
          console.error('ERROR: Columns do not exist and could not be created automatically.');
          console.error('Please run this SQL in the Supabase dashboard SQL editor:');
          console.error('');
          console.error('  ALTER TABLE products ADD COLUMN IF NOT EXISTS flagged_for_removal BOOLEAN DEFAULT FALSE;');
          console.error('  ALTER TABLE products ADD COLUMN IF NOT EXISTS flag_reason TEXT;');
          console.error('');
          console.error('Then re-run this script.');
          process.exit(1);
        } else {
          console.log('Columns already exist!');
        }
      } else {
        console.log('Columns added successfully via management API.');
      }
    } else {
      console.log('Columns added successfully.');
    }
  } else {
    // Run second ALTER
    await supabase.rpc('exec_sql', {
      query: 'ALTER TABLE products ADD COLUMN IF NOT EXISTS flag_reason TEXT'
    }).maybeSingle();
    console.log('Columns added successfully via RPC.');
  }

  // Fetch all products
  console.log('\nFetching all products...');
  const { data: products, error } = await supabase
    .from('products')
    .select('id, title');

  if (error) {
    console.error('Error fetching products:', error);
    process.exit(1);
  }

  console.log(`Found ${products.length} products in database.\n`);

  // Build normalized lookup map
  const productsByNorm = new Map();
  for (const p of products) {
    const key = normalize(p.title);
    if (!productsByNorm.has(key)) {
      productsByNorm.set(key, []);
    }
    productsByNorm.get(key).push(p);
  }

  const flagged = [];
  const notFound = [];

  for (const title of PRODUCTS_TO_FLAG) {
    const key = normalize(title);
    const matches = productsByNorm.get(key);

    if (matches && matches.length > 0) {
      for (const match of matches) {
        flagged.push({ id: match.id, title: match.title, reason: getCategory(title) });
      }
    } else {
      notFound.push(title);
    }
  }

  // Flag products in batches
  if (flagged.length > 0) {
    console.log(`Flagging ${flagged.length} products...\n`);

    for (const item of flagged) {
      const { error: updateError } = await supabase
        .from('products')
        .update({
          flagged_for_removal: true,
          flag_reason: item.reason,
        })
        .eq('id', item.id);

      if (updateError) {
        console.error(`  ERROR flagging "${item.title}":`, updateError.message);
      } else {
        console.log(`  FLAGGED: ${item.title} — ${item.reason}`);
      }
    }
  }

  console.log(`\n=== SUMMARY ===`);
  console.log(`Flagged: ${flagged.length} products`);
  console.log(`Not found in database: ${notFound.length} titles`);

  if (notFound.length > 0) {
    console.log(`\nTitles NOT found:`);
    for (const t of notFound) {
      console.log(`  - ${t}`);
    }
  }
}

main().catch(console.error);
