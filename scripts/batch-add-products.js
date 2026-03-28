#!/usr/bin/env node
/**
 * Batch add new vibe-coded products to VibeStash Supabase
 * Run: node scripts/batch-add-products.js
 */

const SUPABASE_URL = 'https://smfrysqapzwdjfscltmq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZnJ5c3FhcHp3ZGpmc2NsdG1xIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDU1MzU1MiwiZXhwIjoyMDkwMTI5NTUyfQ.6OIb0Currb1nADd3riwFYGp-muQcpsCeH1qycy8P1Tg';

const newProducts = [
  // From X/Twitter searches
  // SKIP: "Is It Vibe Coded?" already in DB as is-it-vibe-coded
  {
    title: "Retro Camera App",
    slug: "retro-camera-gemini",
    url: "https://retrocamera.app",
    description: "A nostalgic retro camera app vibe coded entirely with Gemini 3.0. Applies vintage film filters and effects to your photos.",
    maker_twitter: "ann_nnng",
    maker_name: "Ann",
    tools_used: ["Gemini"],
    x_likes: 4000,
    x_views: 864000,
    category_slug: "tools"
  },
  {
    title: "Sim Office",
    slug: "sim-office",
    url: "https://simoffice.xyz",
    description: "A virtual office simulator built with Claude. Create your dream workspace, manage tasks, and collaborate with AI coworkers in a cozy sim environment.",
    maker_twitter: "johnknopf",
    maker_name: "John Knopf",
    tools_used: ["Claude"],
    x_likes: 210,
    x_views: 8000,
    category_slug: "games"
  },
  {
    title: "Excalicord",
    slug: "excalicord",
    url: "https://github.com/nicolezhanghr/excalicord",
    description: "A video recorder built on top of Excalidraw. Record your whiteboard sessions as video, perfect for tutorials and async presentations.",
    maker_twitter: "zarazhangrui",
    maker_name: "Nicole Zhang",
    tools_used: ["Claude Code"],
    x_likes: 352,
    x_views: 46000,
    category_slug: "tools"
  },
  {
    title: "Solana Fruit Ninja",
    slug: "solana-fruit-ninja",
    url: "https://solanafruitninja.com",
    description: "The classic Fruit Ninja game, rebuilt on Solana. Pay-to-play with native in-game NINJA token rewards. First vibe coded Solana game.",
    maker_twitter: "_0xaryan",
    maker_name: "Aryan",
    tools_used: ["Cursor"],
    x_likes: 32,
    x_views: 7858,
    category_slug: "games"
  },
  {
    title: "Arena Infinity",
    slug: "arena-infinity",
    url: "https://arena-infinity.vercel.app",
    description: "An infinite graph explorer for Are.na. Navigate connections between blocks and channels in a beautiful, never-ending visual web.",
    maker_twitter: "ravivasavan",
    maker_name: "Ravi",
    tools_used: ["Claude Code"],
    x_likes: 77,
    x_views: 5300,
    category_slug: "tools"
  },
  {
    title: "VibeTalent",
    slug: "vibetalent",
    url: "https://vibetalent.work",
    description: "Marketplace for vibe coders who actually ship. Build reputation through daily streaks, shipped projects, and vibe scores instead of resumes.",
    maker_twitter: "abhiontwt",
    maker_name: "Abhi",
    tools_used: ["Cursor"],
    x_likes: 50,
    x_views: 5000,
    category_slug: "tools"
  },
  {
    title: "Vibolio",
    slug: "vibolio",
    url: "https://vibolio.com",
    description: "Directory of the world's top vibe coders and AI builders. Browse curated vibe coded websites, apps, and products. Find builders who use Claude, Cursor, and ChatGPT.",
    maker_twitter: null,
    maker_name: "Vibolio Team",
    tools_used: ["Lovable"],
    x_likes: 30,
    x_views: 3000,
    category_slug: "tools"
  },
  {
    title: "Vibe Coded Sims",
    slug: "vibe-sims",
    url: "https://github.com/ctatedev/vibe-sims",
    description: "A three.js Sims-like game with on-demand AI asset creation. Build your world, create characters, and generate 3D objects from text prompts in real-time.",
    maker_twitter: "ctatedev",
    maker_name: "Chris Tate",
    tools_used: ["Cursor", "GPT-4o"],
    x_likes: 3066,
    x_views: 589047,
    category_slug: "games"
  },
  {
    title: "CreatorCook",
    slug: "creatorcook",
    url: "https://creatorcook.com",
    description: "The ultimate content and marketing resource for creators, brands, and marketers. Research, create, and monetize better content.",
    maker_twitter: "brycent",
    maker_name: "Brycent",
    tools_used: ["Lovable"],
    x_likes: 36,
    x_views: 3677,
    category_slug: "tools"
  },
  {
    title: "Fake PNL Generator",
    slug: "fake-pnl-generator",
    url: "https://fakepnl.com",
    description: "Generate fake profit & loss screenshots for any major crypto exchange. A meme tool for Crypto Twitter traders who want to flex.",
    maker_twitter: "0xTria",
    maker_name: "0xTria",
    tools_used: ["Cursor"],
    x_likes: 1040,
    x_views: 191454,
    category_slug: "fun"
  },
  {
    title: "Claude Code Dashboard",
    slug: "claude-code-dashboard",
    url: "https://github.com/nicolezhanghr/claude-code-dashboard",
    description: "Beautiful dashboard for monitoring Claude Code sessions. Track token usage, costs, and session history with rich visualizations.",
    maker_twitter: "poetengineer__",
    maker_name: "Poet Engineer",
    tools_used: ["Claude Code"],
    x_likes: 3200,
    x_views: 43000,
    category_slug: "tools"
  },
  // SKIP: Feynman already in DB as feynman
  {
    title: "gmatcha",
    slug: "gmatcha",
    url: "https://gmatcha.com",
    description: "A beautiful matcha-themed productivity tool. Track habits, set goals, and stay focused with a calming green aesthetic.",
    maker_twitter: null,
    maker_name: "gmatcha",
    tools_used: ["Cursor"],
    x_likes: 100,
    x_views: 10000,
    category_slug: "tools"
  },
  {
    title: "PillPets",
    slug: "pillpets",
    url: "https://apps.apple.com/app/pillpets/id6744093371",
    description: "Take your medications on time by raising a virtual pet. Miss a dose and your pet gets sad. A gamified medication reminder built with AI.",
    maker_twitter: "NathanGeckler",
    maker_name: "Nathan Geckler",
    tools_used: ["Cursor"],
    x_likes: 54,
    x_views: 5000,
    category_slug: "tools"
  },
  {
    title: "Spentzy",
    slug: "spentzy",
    url: "https://spentzy.com",
    description: "A fun spending tracker that visualizes where your money goes. Beautiful charts and insights to help you understand your spending habits.",
    maker_twitter: "Goldenmax",
    maker_name: "Max",
    tools_used: ["Cursor"],
    x_likes: 80,
    x_views: 8000,
    category_slug: "tools"
  },
  // From articles (21 Real Products + Redwerk) - only ones NOT already in DB
  {
    title: "Family Meal Planner",
    slug: "family-meal-planner",
    url: "https://play.google.com/store/apps/details?id=com.familymealplanner",
    description: "AI-powered weekly meal planner for families. Input dietary preferences and family size, get personalized meal plans with grocery lists.",
    maker_twitter: null,
    maker_name: "Family Meal Planner",
    tools_used: ["Cursor"],
    x_likes: 20,
    x_views: 2000,
    category_slug: "tools"
  },
  // More from X deep scrolling
  {
    title: "Chong-U's Vibe Game",
    slug: "chongu-vibe-game",
    url: "https://github.com/chongdashu/vibe-game",
    description: "A fully AI-generated 2D action game with sprites made by GPT Image and Sora 2. Idle animations, walk cycles, attacks, all generated from text prompts.",
    maker_twitter: "chongdashu",
    maker_name: "Chong-U",
    tools_used: ["Codex CLI", "GPT-4o", "Sora"],
    x_likes: 965,
    x_views: 79470,
    category_slug: "games"
  },
  {
    title: "Sub by Marc",
    slug: "sub-marc",
    url: "https://sub.marc.io",
    description: "Email subscriber management tool by BetaList founder Marc Kohlbrugge. Simple, fast, and built entirely with vibe coding.",
    maker_twitter: "marckohlbrugge",
    maker_name: "Marc Kohlbrugge",
    tools_used: ["Claude"],
    x_likes: 39,
    x_views: 11000,
    category_slug: "tools"
  },
  {
    title: "MakeBook",
    slug: "makebook",
    url: "https://makebook.io",
    description: "Generate interactive app mockups and landing pages from just an idea. By Pieter Levels. Type what you want to build and get a working prototype.",
    maker_twitter: "levelsio",
    maker_name: "Pieter Levels",
    tools_used: ["Claude"],
    x_likes: 500,
    x_views: 50000,
    category_slug: "tools"
  },
  {
    title: "CalAI",
    slug: "calai",
    url: "https://calai.app",
    description: "AI calorie tracking from photos. Snap a picture of your meal and get instant nutritional breakdown. Claims $3M+ MRR, all vibe coded.",
    maker_twitter: null,
    maker_name: "CalAI Team",
    tools_used: ["Cursor"],
    x_likes: 500,
    x_views: 100000,
    category_slug: "tools"
  }
];

async function main() {
  // First get existing slugs
  const res = await fetch(`${SUPABASE_URL}/rest/v1/products?select=slug&or=(approved.eq.true,approved.eq.false)`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
  });
  const existing = await res.json();
  const existingSlugs = new Set(existing.map(p => p.slug));
  
  // Also get category IDs
  const catRes = await fetch(`${SUPABASE_URL}/rest/v1/categories?select=id,slug`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
  });
  const categories = await catRes.json();
  const catMap = {};
  categories.forEach(c => catMap[c.slug] = c.id);
  console.log('Categories:', Object.keys(catMap).join(', '));
  
  // Filter out duplicates
  const toInsert = newProducts.filter(p => {
    if (existingSlugs.has(p.slug)) {
      console.log(`SKIP (exists): ${p.slug}`);
      return false;
    }
    return true;
  });
  
  console.log(`\nInserting ${toInsert.length} new products (${newProducts.length - toInsert.length} skipped as duplicates)`);
  
  if (toInsert.length === 0) {
    console.log('Nothing to insert!');
    return;
  }
  
  // Format for Supabase
  const rows = toInsert.map(p => ({
    title: p.title,
    slug: p.slug,
    url: p.url,
    description: p.description,
    maker_twitter: p.maker_twitter,
    maker_name: p.maker_name,
    tools_used: p.tools_used,
    x_likes: p.x_likes || 0,
    x_views: p.x_views || 0,
    categories: [p.category_slug],
    approved: true,
    featured: false,
    upvotes_count: 0,
    released_at: new Date().toISOString()
  }));
  
  // Batch insert
  const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/products`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation'
    },
    body: JSON.stringify(rows)
  });
  
  if (!insertRes.ok) {
    const err = await insertRes.text();
    console.error('Insert failed:', insertRes.status, err);
    return;
  }
  
  const inserted = await insertRes.json();
  console.log(`\n✅ Successfully inserted ${inserted.length} products!`);
  inserted.forEach(p => console.log(`  + ${p.title} (${p.slug})`));
  
  // Get new total
  const countRes = await fetch(`${SUPABASE_URL}/rest/v1/products?select=id&approved=eq.true&or=(flagged_for_removal.is.null,flagged_for_removal.eq.false)`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, Prefer: 'count=exact' }
  });
  console.log(`\nNew total approved products: ${countRes.headers.get('content-range')}`);
}

main().catch(console.error);
