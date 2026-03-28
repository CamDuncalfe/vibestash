#!/usr/bin/env node
/**
 * Batch add new curated vibe-coded products to VibeStash
 * Run: node scripts/add-products-batch.js
 */

const { createClient } = require('@supabase/supabase-js');

const sb = createClient(
  'https://smfrysqapzwdjfscltmq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZnJ5c3FhcHp3ZGpmc2NsdG1xIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDU1MzU1MiwiZXhwIjoyMDkwMTI5NTUyfQ.6OIb0Currb1nADd3riwFYGp-muQcpsCeH1qycy8P1Tg'
);

const newProducts = [
  {
    title: 'Git City',
    slug: 'git-city',
    url: 'https://thegitcity.com',
    description: 'Your GitHub profile visualized as a 3D city. Each repo becomes a building, with height based on stars and activity. A beautiful way to showcase your open source work.',
    maker_twitter: '0xalank',
    maker_name: 'Alan K',
    tools_used: ['Claude', 'Three.js'],
    x_likes: 6900,
    x_views: 463000,
    category: 'Productivity',
    released_at: '2026-03-15'
  },
  {
    title: 'Proof',
    slug: 'proof-editor',
    url: 'https://proofeditor.ai',
    description: 'A collaborative document editor where humans and AI agents work together in real-time. Open source, free, and built for the future of writing.',
    maker_twitter: 'danshipper',
    maker_name: 'Dan Shipper',
    tools_used: ['Claude', 'React'],
    x_likes: 166,
    x_views: 32000,
    category: 'Productivity',
    released_at: '2026-03-22'
  },
  {
    title: 'Is It Vibe Coded?',
    slug: 'is-it-vibe-coded',
    url: 'https://is-vibecoded.vercel.app',
    description: 'Paste any URL and this AI detective analyzes whether the website was vibe coded or hand-crafted by a human developer. The ultimate vibe check for the internet.',
    maker_twitter: 'Param_eth',
    maker_name: 'Param',
    tools_used: ['Cursor', 'Next.js', 'Vercel'],
    x_likes: 652,
    x_views: 81000,
    category: 'Productivity',
    released_at: '2026-02-17'
  },
  {
    title: 'Waddle Box',
    slug: 'waddle-box',
    url: 'https://tomclive.github.io/waddle-box/',
    description: '3D Pac-Man reimagined on a tiny planet. Navigate a spherical world collecting items while avoiding enemies. Built with Three.js and Gemini in a single vibe coding session.',
    maker_twitter: 'TomLikesRobots',
    maker_name: 'Tom',
    tools_used: ['Gemini', 'Three.js'],
    x_likes: 678,
    x_views: 131000,
    category: 'Games',
    released_at: '2025-11-18'
  },
  {
    title: 'Prompt Minecraft',
    slug: 'prompt-minecraft',
    url: 'https://promptcraft.fun',
    description: 'A multiplayer Minecraft-style game where you build the world using natural language prompts instead of placing blocks manually. Type what you want, watch it appear.',
    maker_twitter: 'NicolasZu',
    maker_name: 'Nicolas Zullo',
    tools_used: ['Claude', 'Three.js'],
    x_likes: 920,
    x_views: 222000,
    category: 'Games',
    released_at: '2026-03-10'
  },
  {
    title: 'Milk Avatar',
    slug: 'milk-avatar',
    url: 'https://milkavatar.app',
    description: 'A macOS-native local LLM chat app with animated 3D avatars. Runs entirely on your Mac, no cloud needed. Your AI companion with personality and expression.',
    maker_twitter: 'tensorfish',
    maker_name: 'Tensorfish',
    tools_used: ['GPT-5', 'Pi', 'Swift'],
    x_likes: 568,
    x_views: 139000,
    category: 'Productivity',
    released_at: '2026-03-20'
  },
  {
    title: 'Post Bridge',
    slug: 'post-bridge',
    url: 'https://post-bridge.com',
    description: 'Cross-post to 20+ social platforms from one place. Built by a solo maker who grew it to 30K downloads in one month with zero ad spend, just organic video marketing.',
    maker_twitter: 'jackfriks',
    maker_name: 'Jack Friks',
    tools_used: ['React Native', 'Claude'],
    x_likes: 6825,
    x_views: 1935000,
    category: 'Productivity',
    released_at: '2024-11-11'
  },
  {
    title: 'DexScreener CLI',
    slug: 'dexscreener-cli',
    url: 'https://github.com/nicktomlin/dexscreener-cli',
    description: 'Track crypto token prices and charts right from your terminal. Real-time DexScreener data without leaving the command line.',
    maker_twitter: 'Meta_Alchemist',
    maker_name: 'Meta Alchemist',
    tools_used: ['Claude', 'Node.js'],
    x_likes: 200,
    x_views: 50000,
    category: 'Finance',
    released_at: '2026-03-01'
  },
  {
    title: 'Fractal',
    slug: 'fractal-app-builder',
    url: 'https://fractal.build',
    description: 'The fastest way to ship ChatGPT apps. Plan, build, emulate, and deploy custom GPT-powered apps with one-click hosting. No backend code needed.',
    maker_twitter: 'fractal_build',
    maker_name: 'Fractal Team',
    tools_used: ['GPT-5', 'Next.js'],
    x_likes: 300,
    x_views: 45000,
    category: 'Productivity',
    released_at: '2026-03-21'
  },
  {
    title: 'Vibecode App',
    slug: 'vibecode-app',
    url: 'https://vibecodeapp.com',
    description: 'The mobile app that builds mobile apps. Describe what you want in plain English on your phone and get a working app back. Vibe coding from your pocket.',
    maker_twitter: 'vibecodeapp',
    maker_name: 'Vibecode Team',
    tools_used: ['Claude', 'React Native'],
    x_likes: 150,
    x_views: 25000,
    category: 'Productivity',
    released_at: '2026-03-15'
  },
  {
    title: '100 Vibe Coding',
    slug: '100-vibe-coding',
    url: 'https://100vibecoding.com',
    description: 'From zero to your first AI-built project in 100 challenges. A structured learning path for aspiring vibe coders who want to ship real products with AI.',
    maker_twitter: '100vibecoding',
    maker_name: '100 Vibe Coding',
    tools_used: ['Various AI tools'],
    x_likes: 100,
    x_views: 20000,
    category: 'Education',
    released_at: '2026-03-10'
  },
  {
    title: 'Atoms',
    slug: 'atoms-builder',
    url: 'https://atoms.build',
    description: 'Turn your ideas into products that sell. An AI-powered builder focused on revenue-generating products, not just prototypes.',
    maker_twitter: 'atoms_build',
    maker_name: 'Atoms Team',
    tools_used: ['Claude', 'Next.js'],
    x_likes: 200,
    x_views: 30000,
    category: 'Productivity',
    released_at: '2026-03-18'
  }
];

(async () => {
  // Check for existing slugs
  const { data: existing, error: fetchErr } = await sb
    .from('products')
    .select('slug')
    .in('slug', newProducts.map(p => p.slug));
  
  if (fetchErr) {
    console.error('Error fetching existing:', fetchErr);
    return;
  }

  const existingSlugs = new Set((existing || []).map(p => p.slug));
  const toInsert = newProducts.filter(p => !existingSlugs.has(p.slug));
  
  console.log(`Found ${existingSlugs.size} already existing, ${toInsert.length} new to insert`);
  
  if (toInsert.length === 0) {
    console.log('Nothing new to add!');
    return;
  }

  // Insert in batches
  const { data, error } = await sb
    .from('products')
    .insert(toInsert.map(p => ({
      title: p.title,
      slug: p.slug,
      url: p.url,
      description: p.description,
      maker_twitter: p.maker_twitter,
      maker_name: p.maker_name,
      tools_used: p.tools_used,
      x_likes: p.x_likes || 0,
      x_views: p.x_views || 0,
      categories: p.category ? [p.category] : ['Productivity'],
      released_at: p.released_at,
      upvotes_count: 0,
      approved: true
    })))
    .select('id, title, slug');

  if (error) {
    console.error('Insert error:', error);
    return;
  }

  console.log(`Successfully inserted ${data.length} products:`);
  data.forEach(p => console.log(`  ✅ ${p.title} (${p.slug})`));
})();
