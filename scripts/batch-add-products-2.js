#!/usr/bin/env node
/**
 * Batch add products - Round 2
 * Run: node scripts/batch-add-products-2.js
 */

const SUPABASE_URL = 'https://smfrysqapzwdjfscltmq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZnJ5c3FhcHp3ZGpmc2NsdG1xIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDU1MzU1MiwiZXhwIjoyMDkwMTI5NTUyfQ.6OIb0Currb1nADd3riwFYGp-muQcpsCeH1qycy8P1Tg';

const newProducts = [
  // HIGH ENGAGEMENT from X searches
  {
    title: "Veloria",
    slug: "veloria",
    url: "https://veloria.pxxl.click",
    description: "A beautiful Valentine's Day website vibe coded with Gemini. Send it to someone special and watch them blush. Went mega-viral with 5K+ likes.",
    maker_twitter: "ennycodes",
    maker_name: "DevEnny",
    tools_used: ["Gemini"],
    x_likes: 5093,
    x_views: 638891,
    categories: ["fun"]
  },
  {
    title: "Brand OS",
    slug: "brand-os",
    url: "https://mybrandos.app",
    description: "Scan your X content and get a full brand analysis. Voice, content pillars, style, all scored. Drop your handle and find out your brand identity.",
    maker_twitter: "BawsaXBT",
    maker_name: "Bawsa",
    tools_used: ["Cursor"],
    x_likes: 41,
    x_views: 2315,
    categories: ["tools"]
  },
  {
    title: "MakeEveryIdea",
    slug: "make-every-idea",
    url: "https://makeeveryidea.com",
    description: "Type any idea and get an interactive app mockup + landing page instantly. By Pieter Levels. Generates working prototypes from just a sentence.",
    maker_twitter: "levelsio",
    maker_name: "Pieter Levels",
    tools_used: ["Claude"],
    x_likes: 2000,
    x_views: 100000,
    categories: ["tools"]
  },
  {
    title: "Stripe Letter Time Machine",
    slug: "stripe-letter-time-machine",
    url: "https://stripeletter.com",
    description: "Browse past and present Stripe annual letters with reader mode, AI summaries, and voice narration. Built with Cursor cloud agents, mostly from a phone.",
    maker_twitter: "edwinarbus",
    maker_name: "Edwin",
    tools_used: ["Cursor"],
    x_likes: 197,
    x_views: 42294,
    categories: ["tools"]
  },
  {
    title: "Juan's 2D Adventure Game",
    slug: "juans-2d-game",
    url: "https://github.com/JuanRezzio/2d-game",
    description: "A full 2D game built entirely in Cursor with AI-generated sprites from Opus 4.5. Character animations, props, backgrounds, all from text prompts. 1.1K likes.",
    maker_twitter: "JuanRezzio",
    maker_name: "Juan",
    tools_used: ["Cursor", "Claude Opus"],
    x_likes: 1148,
    x_views: 173646,
    categories: ["games"]
  },
  {
    title: "Multiplayer Whiteboard",
    slug: "lovable-whiteboard",
    url: "https://lovablewhiteboard.com",
    description: "A real-time multiplayer whiteboard built fully in Lovable in one afternoon. Cursor tracking, drawing tools, and real-time sync between users.",
    maker_twitter: "tylerbruno05",
    maker_name: "Tyler Bruno",
    tools_used: ["Lovable"],
    x_likes: 173,
    x_views: 27203,
    categories: ["tools"]
  },

  // From Substack "12 Incredible Projects"
  {
    title: "NewMom.Help",
    slug: "newmom-help-v2",
    url: "https://newmom.help",
    description: "Support platform for new mothers, built by someone with zero coding experience using Bolt and Supabase. Domain expertise + AI = shipped product.",
    maker_twitter: "zeng_wt",
    maker_name: "Zeng",
    tools_used: ["Bolt", "Supabase"],
    x_likes: 50,
    x_views: 5000,
    categories: ["tools"]
  },
  {
    title: "AltCloud",
    slug: "altcloud-dev",
    url: "https://altcloud.dev",
    description: "Cloud infrastructure management tool built with a hybrid AI approach. ChatGPT for planning, Lovable for frontend, Bolt for iteration.",
    maker_twitter: "proguptaX",
    maker_name: "Proshanto",
    tools_used: ["ChatGPT", "Lovable", "Bolt"],
    x_likes: 30,
    x_views: 3000,
    categories: ["tools"]
  },
  {
    title: "FairOffer.AI",
    slug: "fairoffer-ai",
    url: "https://fairoffer.ai",
    description: "AI-powered salary negotiation tool. Built by a former Excel power user turned vibe coder. Helps you negotiate better compensation packages.",
    maker_twitter: "Haridigresses",
    maker_name: "Hari",
    tools_used: ["Zite", "Airtable"],
    x_likes: 40,
    x_views: 4000,
    categories: ["tools"]
  },
  {
    title: "Remote-Code",
    slug: "remote-code-app",
    url: "https://remote-code.com",
    description: "Code from your phone. A multi-platform mobile development tool built meta-style: scaffolded with Claude Code, then finished using the app itself.",
    maker_twitter: "zain_hoda",
    maker_name: "Zain",
    tools_used: ["Claude Code", "Amp"],
    x_likes: 60,
    x_views: 6000,
    categories: ["tools"]
  },
  {
    title: "Prompy",
    slug: "prompy-me",
    url: "https://prompy.me",
    description: "Beautifully designed prompt management tool for AI workflows. Built by a product/UI designer who used vibe coding to handle the technical side.",
    maker_twitter: "kerroudjm",
    maker_name: "Mo",
    tools_used: ["Vercel", "Supabase"],
    x_likes: 30,
    x_views: 3000,
    categories: ["tools"]
  },
  {
    title: "ShiftTrader",
    slug: "shifttrader-app",
    url: "https://shifttrader.app",
    description: "Shift trading platform for workplaces. Trade shifts with coworkers seamlessly. Built by an engineering manager as a side project with Claude Code.",
    maker_twitter: "siuraymond",
    maker_name: "Raymond",
    tools_used: ["Claude Code"],
    x_likes: 25,
    x_views: 2500,
    categories: ["tools"]
  },
  {
    title: "Story Sphere",
    slug: "story-sphere-app",
    url: "https://story-sphere.netlify.app",
    description: "Interactive storytelling platform built entirely in Bolt by a total beginner who started vibe coding just 3 months ago.",
    maker_twitter: "tekstak",
    maker_name: "Gary",
    tools_used: ["Bolt"],
    x_likes: 20,
    x_views: 2000,
    categories: ["fun"]
  },
  {
    title: "Million Dollar Page AI",
    slug: "million-dollar-page-ai-v2",
    url: "https://milliondollarpage.ai",
    description: "The Million Dollar Homepage reimagined for the AI era. Dynamic pricing, AI-generated pixel art, approval system, and Stripe payments. Built by a UX designer using Bolt.",
    maker_twitter: "gaurabhmathure",
    maker_name: "Gaurabh",
    tools_used: ["Bolt"],
    x_likes: 100,
    x_views: 10000,
    categories: ["fun"]
  },
  {
    title: "ViroShorts",
    slug: "viroshorts",
    url: "https://viroshorts.com",
    description: "Video creation platform built by a fund accountant learning vibe coding. Create short-form viral content with AI assistance.",
    maker_twitter: "anocodeguy",
    maker_name: "Kamal",
    tools_used: ["Cursor"],
    x_likes: 40,
    x_views: 4000,
    categories: ["tools"]
  },
  {
    title: "FromNora",
    slug: "fromnora-app",
    url: "https://fromnora.com",
    description: "AI agent platform built by a marketing grad who left Universal to pursue his vision. Full Flutter app with Stripe, Supabase, and real-time features.",
    maker_twitter: "hellorymi",
    maker_name: "Ryan",
    tools_used: ["FlutterFlow", "Claude"],
    x_likes: 50,
    x_views: 5000,
    categories: ["tools"]
  },
  {
    title: "SleepingBaby",
    slug: "sleeping-baby-app",
    url: "https://sleepingbaby.info",
    description: "Parenting app built in just 450 Cursor tokens. Sleep tracking, feeding logs, and milestones for new parents. Proof that great prompting = shipped products.",
    maker_twitter: "pakosteve",
    maker_name: "Balázs",
    tools_used: ["Cursor"],
    x_likes: 30,
    x_views: 3000,
    categories: ["tools"]
  },

  // More from various X searches
  {
    title: "Cursor Browser",
    slug: "cursor-browser",
    url: "https://github.com/nichochar/cursor-browser",
    description: "A web browser vibe coded by Cursor. Actually renders web pages, mostly correctly. The ultimate meta project: an AI coding a browser.",
    maker_twitter: null,
    maker_name: "Cursor Team",
    tools_used: ["Cursor"],
    x_likes: 614,
    x_views: 94491,
    categories: ["tools"]
  },
  {
    title: "Sherlock AI",
    slug: "sherlock-ai-face",
    url: "https://sherlock.social",
    description: "AI face search that identifies social media profiles from photos. Upload a face, find their online presence. Trending globally on X.",
    maker_twitter: null,
    maker_name: "Sherlock Team",
    tools_used: ["Cursor"],
    x_likes: 500,
    x_views: 100000,
    categories: ["tools"]
  },
  {
    title: "LT3 Memory Game",
    slug: "lt3-memory",
    url: "https://lt3memory.com",
    description: "Memory card matching game with lofi art and chill vibes. Built by @JackLT3_ for the LT3 NFT community. Compete for the fastest time.",
    maker_twitter: "JackLT3_",
    maker_name: "Jack",
    tools_used: ["Cursor"],
    x_likes: 76,
    x_views: 1480,
    categories: ["games"]
  },

  // Products from reallygoodbusinessideas.com that weren't already added
  {
    title: "Townie by Val Town",
    slug: "townie-val-town",
    url: "https://www.val.town/townie",
    description: "Generate full-stack web apps from natural language prompts. By Val Town. Instant backend + frontend from a single description.",
    maker_twitter: "valaboratory",
    maker_name: "Val Town",
    tools_used: ["Custom AI"],
    x_likes: 200,
    x_views: 50000,
    categories: ["tools"]
  },
  {
    title: "Tempo",
    slug: "tempo-react",
    url: "https://tempo.new",
    description: "AI-powered React IDE. Design and build React components visually with AI assistance. Ship production-ready code without context switching.",
    maker_twitter: "AaravBhatt",
    maker_name: "Aarav Bhatt",
    tools_used: ["Custom AI"],
    x_likes: 300,
    x_views: 50000,
    categories: ["tools"]
  },
  {
    title: "Softgen",
    slug: "softgen",
    url: "https://softgen.ai",
    description: "Generate full-stack web applications from prompts. Firebase backend, React frontend, deployed instantly. The fastest way to go from idea to live app.",
    maker_twitter: null,
    maker_name: "Softgen Team",
    tools_used: ["Custom AI"],
    x_likes: 150,
    x_views: 30000,
    categories: ["tools"]
  },
  {
    title: "Wordware",
    slug: "wordware",
    url: "https://wordware.ai",
    description: "Build AI agents with natural language. No code needed. Create complex workflows, integrate APIs, and deploy AI-powered tools from plain English instructions.",
    maker_twitter: "wordaboratory",
    maker_name: "Wordware Team",
    tools_used: ["Custom AI"],
    x_likes: 500,
    x_views: 100000,
    categories: ["tools"]
  },

  // More individual products from deeper X scrolling
  {
    title: "Larp.uno",
    slug: "larp-uno",
    url: "https://larp.uno",
    description: "Generate fake PnL cards for Solana trading platforms. Pick your platform (GMGN, Axiom, Trading Terminal), enter your gains, auto-generate a flex-ready card.",
    maker_twitter: "Larpuno",
    maker_name: "Larp.uno",
    tools_used: ["Cursor"],
    x_likes: 23,
    x_views: 409,
    categories: ["fun"]
  },
  {
    title: "GadgetPadi",
    slug: "gadgetpadi",
    url: "https://mygadgetpadi.com",
    description: "Gadget comparison and review platform. Vibe coded the full web app (frontend + backend) in 24 hours. Built to help people make better tech buying decisions.",
    maker_twitter: "0x3sage",
    maker_name: "Sage",
    tools_used: ["Cursor"],
    x_likes: 19,
    x_views: 287,
    categories: ["tools"]
  },

  // More high-quality products found in research
  {
    title: "Amurex",
    slug: "amurex",
    url: "https://amurex.ai",
    description: "Open-source AI meeting copilot. Joins your meetings, takes notes, generates action items. Claims $1.2M ARR, all vibe coded with Claude and Cursor.",
    maker_twitter: "AdiPat7",
    maker_name: "Aditya Patange",
    tools_used: ["Claude", "Cursor"],
    x_likes: 300,
    x_views: 50000,
    categories: ["tools"]
  },
  {
    title: "DataButton",
    slug: "databutton",
    url: "https://databutton.com",
    description: "Build and deploy full-stack AI apps with natural language. Backend, frontend, database, all wired together from prompts. No infrastructure needed.",
    maker_twitter: "DataButtonApp",
    maker_name: "DataButton",
    tools_used: ["Custom AI"],
    x_likes: 200,
    x_views: 40000,
    categories: ["tools"]
  },
  {
    title: "Marblism",
    slug: "marblism",
    url: "https://marblism.com",
    description: "Generate a full-stack SaaS app from a description. Next.js + Prisma + auth + payments. Ship a complete product without writing boilerplate.",
    maker_twitter: "marblism_dev",
    maker_name: "Marblism",
    tools_used: ["Custom AI"],
    x_likes: 150,
    x_views: 30000,
    categories: ["tools"]
  },
  {
    title: "Micro Agent",
    slug: "micro-agent",
    url: "https://github.com/BuilderIO/micro-agent",
    description: "AI agent that writes and fixes code until tests pass. By Builder.io. Give it a task and test criteria, it iterates until everything's green.",
    maker_twitter: "AltimateAi",
    maker_name: "Builder.io",
    tools_used: ["GPT-4", "Claude"],
    x_likes: 800,
    x_views: 80000,
    categories: ["tools"]
  },
  {
    title: "Screenshot to Code",
    slug: "screenshot-to-code",
    url: "https://screenshottocode.com",
    description: "Upload a screenshot or paste a URL and get clean HTML/Tailwind/React code. The fastest way to clone any UI you see on the web.",
    maker_twitter: "AbiCohen",
    maker_name: "Abi Cohen",
    tools_used: ["GPT-4", "Claude"],
    x_likes: 5000,
    x_views: 500000,
    categories: ["tools"]
  },
  {
    title: "Dandy AI",
    slug: "dandy-ai",
    url: "https://dandy.so",
    description: "AI-powered SVG illustrations generator. Type what you want and get a beautiful vector illustration. No more searching stock illustration sites.",
    maker_twitter: "DandyGenAI",
    maker_name: "Dandy AI",
    tools_used: ["Custom AI"],
    x_likes: 200,
    x_views: 40000,
    categories: ["tools"]
  },
  {
    title: "GPT Crawler",
    slug: "gpt-crawler",
    url: "https://github.com/BuilderIO/gpt-crawler",
    description: "Crawl any website and turn it into a custom GPT knowledge file. Point it at docs, a blog, or any site and get a structured dataset for your AI.",
    maker_twitter: "AltimateAi",
    maker_name: "Builder.io",
    tools_used: ["GPT-4"],
    x_likes: 3000,
    x_views: 300000,
    categories: ["tools"]
  }
];

async function main() {
  // Get existing slugs
  const res = await fetch(`${SUPABASE_URL}/rest/v1/products?select=slug`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
  });
  const existing = await res.json();
  const existingSlugs = new Set(existing.map(p => p.slug));
  
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
    categories: p.categories,
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
  const countRes = await fetch(`${SUPABASE_URL}/rest/v1/products?select=id&approved=eq.true`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, Prefer: 'count=exact', 'Range-Unit': 'items', Range: '0-0' }
  });
  const range = countRes.headers.get('content-range');
  console.log(`\nNew total approved products: ${range}`);
}

main().catch(console.error);
