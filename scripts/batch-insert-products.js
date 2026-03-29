#!/usr/bin/env node
// Batch insert new products into VibeStash Supabase DB
// Run: node scripts/batch-insert-products.js

const SUPABASE_URL = 'https://smfrysqapzwdjfscltmq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZnJ5c3FhcHp3ZGpmc2NsdG1xIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDU1MzU1MiwiZXhwIjoyMDkwMTI5NTUyfQ.6OIb0Currb1nADd3riwFYGp-muQcpsCeH1qycy8P1Tg';

const products = [
  // From various curated articles and Lenny's newsletter
  {
    title: 'Giggles',
    slug: 'giggles',
    url: 'https://usegiggles.com',
    description: 'Social entertainment platform. Pure fun, zero productivity.',
    maker_name: null,
    maker_twitter: null,
    tools_used: ['AI'],
    categories: ['Social'],
    approved: true,
  },
  {
    title: 'MillionDollarPage.AI',
    slug: 'milliondollarpage-ai',
    url: 'https://milliondollarpage.ai',
    description: 'The million dollar homepage, but AI-generated. Every pixel has a story.',
    maker_name: null,
    maker_twitter: null,
    tools_used: ['AI'],
    categories: ['Fun'],
    approved: true,
  },
  {
    title: 'Dreambase',
    slug: 'dreambase',
    url: 'https://dreambase.ai',
    description: 'Visual admin panel for Supabase. Makes your database feel like a design tool.',
    maker_name: null,
    maker_twitter: null,
    tools_used: ['AI'],
    categories: ['Developer Tool'],
    approved: true,
  },
  {
    title: 'ttyl',
    slug: 'ttyl',
    url: 'https://talktyl.com',
    description: 'Send voice memos to your future self. Time capsule energy.',
    maker_name: null,
    maker_twitter: null,
    tools_used: ['AI'],
    categories: ['Productivity'],
    approved: true,
  },
  {
    title: 'MIXCARD',
    slug: 'mixcard',
    url: 'https://mixcard.me',
    description: 'Turn your Spotify playlists into physical postcards. Digital vibes, analog delivery.',
    maker_name: null,
    maker_twitter: null,
    tools_used: ['AI'],
    categories: ['Social'],
    approved: true,
  },
  {
    title: 'PulseWP',
    slug: 'pulsewp',
    url: 'https://pulsewp.cc',
    description: 'WordPress news tracker. Cuts through the noise so you dont have to.',
    maker_name: null,
    maker_twitter: null,
    tools_used: ['AI'],
    categories: ['Developer Tool'],
    approved: true,
  },
  {
    title: 'WP API Explorer',
    slug: 'wp-api-explorer',
    url: 'https://wpapiexplorer.com',
    description: 'Discover and test WordPress REST API endpoints without reading a single doc.',
    maker_name: null,
    maker_twitter: null,
    tools_used: ['AI'],
    categories: ['Developer Tool'],
    approved: true,
  },
  {
    title: 'ChatIQ',
    slug: 'chatiq',
    url: 'https://chatiq.ai',
    description: 'AI customer support bot that actually works. $2K MRR and climbing.',
    maker_name: null,
    maker_twitter: null,
    tools_used: ['AI'],
    categories: ['SaaS', 'AI Tool'],
    approved: true,
  },
  {
    title: 'TrendFeed',
    slug: 'trendfeed',
    url: 'https://trendfeed.app',
    description: 'AI-powered trend discovery for content creators. Find what to make before everyone else does.',
    maker_name: null,
    maker_twitter: null,
    tools_used: ['AI'],
    categories: ['SaaS', 'AI Tool'],
    approved: true,
  },
  {
    title: 'SEO Forecast',
    slug: 'seo-forecast',
    url: 'https://seo-forecast.animalz.co',
    description: 'SEO traffic calculator by Animalz. Punch in numbers, see if the content is worth writing.',
    maker_name: 'Animalz',
    maker_twitter: '@AnimalzCo',
    tools_used: ['AI'],
    categories: ['SaaS'],
    approved: true,
  },
  {
    title: 'SleepingBaby',
    slug: 'sleepingbaby',
    url: 'https://sleepingbaby.info',
    description: 'Baby sleep guidance for exhausted parents. Vibe coded at 3am, obviously.',
    maker_name: null,
    maker_twitter: null,
    tools_used: ['AI'],
    categories: ['Health'],
    approved: true,
  },
  {
    title: 'Plinq',
    slug: 'plinq',
    url: 'https://plinq.com.br',
    description: 'Smart link-in-bio tool. One link to rule them all.',
    maker_name: null,
    maker_twitter: null,
    tools_used: ['AI'],
    categories: ['SaaS'],
    approved: true,
  },
  {
    title: 'Illustration.app',
    slug: 'illustration-app',
    url: 'https://illustration.app',
    description: 'AI illustration generator. Type a scene, get art. No Figma required.',
    maker_name: null,
    maker_twitter: null,
    tools_used: ['AI'],
    categories: ['Design Tool', 'AI Tool'],
    approved: true,
  },
  // From Lenny's Newsletter
  {
    title: 'How Many Layers',
    slug: 'how-many-layers',
    url: 'https://howmanylayersidag.se',
    description: 'Weather app that just tells you what to wear. 85K users. Built with Lovable.',
    maker_name: null,
    maker_twitter: null,
    tools_used: ['Lovable'],
    categories: ['Mobile App'],
    approved: true,
  },
  {
    title: 'MealMuse',
    slug: 'mealmuse',
    url: 'https://mealmuse.ai',
    description: 'Photo your fridge, get recipes. Built with Lovable + Supabase + Cursor.',
    maker_name: null,
    maker_twitter: null,
    tools_used: ['Lovable', 'Cursor', 'Supabase'],
    categories: ['AI Tool'],
    approved: true,
  },
  {
    title: 'Flowbound',
    slug: 'flowbound',
    url: 'https://www.flowbound.app',
    description: 'Procrastination? Here, play this game instead. Actually helps you get back on track.',
    maker_name: null,
    maker_twitter: null,
    tools_used: ['AI'],
    categories: ['Productivity'],
    approved: true,
  },
  {
    title: 'Paddles.ai',
    slug: 'paddles-ai',
    url: 'https://www.paddles.ai',
    description: 'Pickleball match tracker and analyzer. Vibe coded on Replit, used across the US.',
    maker_name: null,
    maker_twitter: null,
    tools_used: ['Replit'],
    categories: ['Mobile App'],
    approved: true,
  },
  {
    title: 'Timeless Memories',
    slug: 'timeless-memories',
    url: 'https://timelessmemories.me',
    description: 'Memory preservation app. Built with Lovable, which is insane when you see how complex it is.',
    maker_name: null,
    maker_twitter: null,
    tools_used: ['Lovable'],
    categories: ['Social'],
    approved: true,
  },
  {
    title: 'My Baby Logger',
    slug: 'my-baby-logger',
    url: 'https://mybabylogger.com',
    description: 'Track feedings, sleep, diapers. Built by a new dad over two weekends with Lovable.',
    maker_name: null,
    maker_twitter: null,
    tools_used: ['Lovable'],
    categories: ['Health'],
    approved: true,
  },
  {
    title: 'Chores AI',
    slug: 'chores-ai',
    url: 'https://www.chores-ai.com',
    description: 'Chore tracker for kids. First iOS app, started with v0, finished with Claude.',
    maker_name: null,
    maker_twitter: null,
    tools_used: ['v0', 'Claude'],
    categories: ['Mobile App'],
    approved: true,
  },
  {
    title: 'Stories of Life',
    slug: 'stories-of-life',
    url: 'https://stories-of-life.vercel.app',
    description: 'Bedtime stories from your daily emotions. A side project that became a nightly ritual.',
    maker_name: null,
    maker_twitter: null,
    tools_used: ['Bolt', 'Supabase'],
    categories: ['AI Tool'],
    approved: true,
  },
  {
    title: 'Standup Buddy',
    slug: 'standup-buddy',
    url: 'https://standup-buddy.lovable.app',
    description: 'Daily standup helper. Used every day at work. Lovable did the heavy lifting.',
    maker_name: null,
    maker_twitter: null,
    tools_used: ['Lovable'],
    categories: ['Productivity'],
    approved: true,
  },
  {
    title: 'Wisdemic Time',
    slug: 'wisdemic-time',
    url: 'https://time.wisdemic.com',
    description: 'Time tracking app built in a single day with Warp.dev. Simple and it works.',
    maker_name: null,
    maker_twitter: null,
    tools_used: ['Warp'],
    categories: ['Productivity'],
    approved: true,
  },
  {
    title: 'Lash Map Tracker',
    slug: 'lash-map-tracker',
    url: 'https://lash-map-tracker.replit.app',
    description: 'Track your eyelash styles and methods with photos. Hyper-specific and perfect.',
    maker_name: null,
    maker_twitter: null,
    tools_used: ['Replit'],
    categories: ['Mobile App'],
    approved: true,
  },
];

async function insertProducts() {
  console.log(`Inserting ${products.length} products...`);
  
  // First check for existing slugs to avoid duplicates
  const slugs = products.map(p => p.slug);
  const checkResp = await fetch(
    `${SUPABASE_URL}/rest/v1/products?select=slug&slug=in.(${slugs.join(',')})`,
    {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
      }
    }
  );
  const existing = await checkResp.json();
  const existingSlugs = new Set(existing.map(p => p.slug));
  
  if (existingSlugs.size > 0) {
    console.log(`Skipping ${existingSlugs.size} existing: ${[...existingSlugs].join(', ')}`);
  }
  
  const newProducts = products.filter(p => !existingSlugs.has(p.slug));
  console.log(`Inserting ${newProducts.length} new products...`);
  
  if (newProducts.length === 0) {
    console.log('Nothing to insert.');
    return;
  }
  
  const resp = await fetch(`${SUPABASE_URL}/rest/v1/products`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
    },
    body: JSON.stringify(newProducts.map(p => ({
      ...p,
      approved: true,
      flagged_for_removal: false,
    }))),
  });
  
  if (!resp.ok) {
    const err = await resp.text();
    console.error(`Insert failed: ${resp.status} ${err}`);
    return;
  }
  
  const inserted = await resp.json();
  console.log(`Successfully inserted ${inserted.length} products!`);
  inserted.forEach(p => console.log(`  ✅ ${p.slug}`));
}

insertProducts().catch(console.error);
