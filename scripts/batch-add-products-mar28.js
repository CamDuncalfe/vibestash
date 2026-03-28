#!/usr/bin/env node
// Batch add new vibe-coded products - March 28 evening session
// Sources: X/Twitter, "21 Real Products" article, "12 Incredible Projects" article, Redwerk

const SUPABASE_URL = "https://smfrysqapzwdjfscltmq.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZnJ5c3FhcHp3ZGpmc2NsdG1xIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDU1MzU1MiwiZXhwIjoyMDkwMTI5NTUyfQ.6OIb0Currb1nADd3riwFYGp-muQcpsCeH1qycy8P1Tg";

const products = [
  // === FROM X/TWITTER ===
  {
    title: "Cureight",
    slug: "cureight",
    url: "https://cureight.replit.app",
    description: "AI-powered curated lists tool. Create and share curated collections on any topic with AI assistance.",
    maker_twitter: "AkanshaDugad",
    maker_name: "Akanksha Dugad",
    tools_used: ["Replit", "Claude"],
    x_likes: 112,
    x_views: 10000,
    approved: true
  },
  {
    title: "InTheBulletin",
    slug: "inthebulletin",
    url: "https://inthebulletin.com",
    description: "Newsletter platform built entirely with Lovable. Already has 100+ paying users. Proof that vibe-coded products can generate real revenue.",
    maker_twitter: "JustinJDean",
    maker_name: "Justin Dean",
    tools_used: ["Lovable"],
    approved: true
  },
  {
    title: "Feynman",
    slug: "feynman",
    url: "https://feynman.tech",
    description: "Claude Code for research. An AI-powered research tool that helps you explore topics deeply and efficiently, like having a brilliant research partner.",
    maker_twitter: "advaitpaliwal",
    maker_name: "Advait Paliwal",
    tools_used: ["Claude"],
    x_likes: 4900,
    approved: true
  },

  // === FROM "21 REAL PRODUCTS" ARTICLE ===
  {
    title: "Spryngtime",
    slug: "spryngtime",
    url: "https://spryngtime.com",
    description: "Free e-signature tool, like DocuSign but totally free. Fully compliant with the ESIGN Act and UETA, so signatures are legally binding. Entirely vibe coded.",
    maker_name: "Spryngtime Team",
    tools_used: ["Cursor"],
    approved: true
  },
  {
    title: "PropAnalyzer",
    slug: "propanalyzer",
    url: "https://propanalyzer.io",
    description: "Real estate property analysis tool. Instead of spending hours on manual spreadsheet analysis, investors can assess deals in minutes. Vibe coded with AI.",
    maker_name: "PropAnalyzer Team",
    tools_used: ["Cursor"],
    approved: true
  },
  {
    title: "VerseMind",
    slug: "versemind",
    url: "https://www.versemind.org",
    description: "Bible memorization app using first-letter mnemonics, spaced repetition, and progress tracking. Built to improve on existing Bible memory apps, entirely vibe coded.",
    maker_name: "VerseMind Team",
    tools_used: ["Cursor"],
    approved: true
  },
  {
    title: "LCalculator",
    slug: "lcalculator",
    url: "https://lcalculator.com",
    description: "Clean, beautiful calculators for dozens of use cases: standard deviation, snow day predictions, swim pace, and more. All vibe coded with a gorgeous interface.",
    maker_name: "LCalculator Team",
    tools_used: ["Cursor"],
    approved: true
  },
  {
    title: "Gud Prompt",
    slug: "gud-prompt",
    url: "https://gudprompt.com",
    description: "Aggregates thousands of AI prompts you can save and sort into collections. Includes a prompt generator and Chrome extension for quick access. Vibe coded.",
    maker_name: "Gud Prompt Team",
    tools_used: ["Cursor"],
    approved: true
  },
  {
    title: "PeptideCalc",
    slug: "peptidecalc",
    url: "https://peptidecalc.io",
    description: "Peptide dosage calculator for peptide therapy users. Makes complicated dosage calculations simple. Vibe coded niche tool solving a real problem.",
    maker_name: "PeptideCalc Team",
    tools_used: ["Cursor"],
    approved: true
  },
  {
    title: "NeuroParent",
    slug: "neuroparent",
    url: "https://www.neuroparent.app",
    description: "Mobile app providing in-the-moment tools for parents of children with autism and ADHD. Clear, easy-to-follow techniques for emotional outbursts and sensory overload.",
    maker_name: "NeuroParent Team",
    tools_used: ["Cursor"],
    approved: true
  },
  {
    title: "GrowthFuel Hypothesis Engine",
    slug: "growthfuel-hypothesis",
    url: "https://hypothesis.growthfuel.ca",
    description: "Turns vague growth experiment ideas into clear, testable hypotheses. Like having a growth strategist in your browser. Vibe coded growth tool.",
    maker_name: "GrowthFuel Team",
    tools_used: ["Cursor"],
    approved: true
  },
  {
    title: "Kard Kareem",
    slug: "kard-kareem",
    url: "https://1dmes6.jdoodle.io",
    description: "Design and download custom Eid greeting cards. Templates with suggested text that can be personalized. Vibe coded for a specific cultural moment.",
    maker_name: "Kard Kareem Team",
    tools_used: ["Cursor"],
    approved: true
  },
  {
    title: "PhotoGuru AI",
    slug: "photoguru",
    url: "https://photoguruai.com",
    description: "AI photo generation tool for headshots and more. Upload selfies, get professional AI-generated photos. Landing page vibe coded and optimized for conversion.",
    maker_name: "PhotoGuru Team",
    tools_used: ["Cursor", "Claude"],
    approved: true
  },
  {
    title: "Build That Idea",
    slug: "build-that-idea",
    url: "https://buildthatidea.com",
    description: "Platform for building and monetizing AI agents. Features a landing page that's the Platonic ideal of high-converting design, entirely vibe coded.",
    maker_name: "Build That Idea Team",
    tools_used: ["Cursor"],
    approved: true
  },

  // === FROM "12 INCREDIBLE PROJECTS" ARTICLE ===
  {
    title: "NewMom.Help",
    slug: "newmom-help",
    url: "https://newmom.help",
    description: "Support platform for new mothers, built by someone with zero coding background. Proves that domain expertise matters more than coding skills in the vibe coding era.",
    maker_twitter: "zeng_wt",
    maker_name: "Zeng",
    tools_used: ["Bolt", "Supabase"],
    approved: true
  },
  {
    title: "AltCloud",
    slug: "altcloud",
    url: "https://altcloud.dev",
    description: "Cloud infrastructure alternative platform. Built with a hybrid approach of AI prototyping and manual coding by a CTO with 9 years of experience.",
    maker_twitter: "proguptaX",
    maker_name: "Proshanto",
    tools_used: ["ChatGPT", "Lovable", "Bolt", "Supabase"],
    approved: true
  },
  {
    title: "FairOffer AI",
    slug: "fairoffer-ai",
    url: "https://fairoffer.ai",
    description: "AI-powered salary negotiation tool. Built by a self-described 'former Excel monkey' who went from spreadsheets to shipping AI products. Solves a universal problem.",
    maker_twitter: "Haridigresses",
    maker_name: "Hari",
    tools_used: ["Cursor", "Airtable"],
    approved: true
  },
  {
    title: "Remote-Code",
    slug: "remote-code",
    url: "https://remote-code.com",
    description: "Mobile-first development tool built with a meta approach: used Claude Code and Amp for scaffolding, then built the rest using the app itself. Inception-level vibe coding.",
    maker_twitter: "zain_hoda",
    maker_name: "Zain Hoda",
    tools_used: ["Claude", "Cursor"],
    approved: true
  },
  {
    title: "Prompy",
    slug: "prompy",
    url: "https://www.prompy.me",
    description: "Beautifully crafted AI prompt tool built by a product/UI designer. Leveraged design background for aesthetics while vibe coding handled the technical implementation.",
    maker_twitter: "kerroudjm",
    maker_name: "Mo",
    tools_used: ["Vercel", "Supabase"],
    approved: true
  },
  {
    title: "ShiftTrader",
    slug: "shifttrader",
    url: "https://shifttrader.app",
    description: "Shift trading platform for workplaces. Built by a developer turned Engineering Manager using Claude Code + Laravel. Quick shipping with AI-assisted development.",
    maker_twitter: "raymondsiu",
    maker_name: "Raymond Siu",
    tools_used: ["Claude"],
    approved: true
  },
  {
    title: "Story Sphere",
    slug: "story-sphere",
    url: "https://story-sphere.netlify.app",
    description: "Interactive storytelling platform built entirely in Bolt by a total beginner who started vibe coding just 3 months ago. The ultimate beginner success story.",
    maker_twitter: "tekstak",
    maker_name: "Gary",
    tools_used: ["Bolt"],
    approved: true
  },
  {
    title: "FromNora",
    slug: "fromnora",
    url: "https://fromnora.com",
    description: "AI agent platform built by a marketing grad who left Universal to pursue his vision. Complete career transformation enabled by vibe coding. Uses Flutter + Supabase + Stripe.",
    maker_twitter: "hellorymi",
    maker_name: "Ryan Mish",
    tools_used: ["Claude", "Supabase"],
    approved: true
  },
  {
    title: "SleepingBaby",
    slug: "sleeping-baby",
    url: "https://www.sleepingbaby.info",
    description: "Parenting app built with just 450 Cursor tokens. Full Next.js app with MongoDB and auth. Proves that efficient prompting can ship complete products incredibly fast.",
    maker_twitter: "pakosteve",
    maker_name: "Balazs",
    tools_used: ["Cursor"],
    approved: true
  },
  {
    title: "Million Dollar Page AI",
    slug: "million-dollar-page-ai",
    url: "https://milliondollarpage.ai",
    description: "The legendary Million Dollar Homepage recreated for the AI era. Dynamic pricing, approval systems, and Stripe payments, all built by a UX designer with no coding skills using Bolt.",
    maker_twitter: "gaurabhmathure",
    maker_name: "Gaurabh",
    tools_used: ["Bolt", "Supabase"],
    approved: true
  },
  {
    title: "ViroShorts",
    slug: "viroshorts",
    url: "https://viroshorts.com",
    description: "Video platform built by a fund accountant learning vibe coding. Career transition from finance to tech enabled by AI tools. Uses Cursor + Supabase + Paddle.",
    maker_twitter: "anocodeguy",
    maker_name: "Kamal",
    tools_used: ["Cursor", "Supabase"],
    approved: true
  },

  // === FROM X + ADDITIONAL FINDS ===
  {
    title: "Make Ideas Great Again",
    slug: "make-ideas-great-again",
    url: "https://makeideasgreatagain.com",
    description: "Trending product by Pieter Levels (levelsio). A viral take on idea validation meets internet culture. From the maker of Nomad List and RemoteOK.",
    maker_twitter: "levelsio",
    maker_name: "Pieter Levels",
    tools_used: ["Cursor"],
    x_likes: 5000,
    approved: true
  },
  {
    title: "Chorus",
    slug: "chorus",
    url: "https://chorus.sh",
    description: "AI-powered coding collaboration tool. Built with vibe coding principles for developers who want to ship faster together.",
    maker_name: "Chorus Team",
    tools_used: ["Cursor", "Claude"],
    approved: true
  },
  {
    title: "Lunchbox Buddy",
    slug: "lunchbox-buddy",
    url: "https://lunchboxbuddy.com",
    description: "AI meal planning tool for kids' lunchboxes. Generates creative, balanced meal ideas for parents. Practical vibe-coded tool solving an everyday problem.",
    maker_name: "Lunchbox Buddy Team",
    tools_used: ["Cursor"],
    approved: true
  }
];

async function main() {
  // First, get all existing slugs to prevent duplicates
  const existingRes = await fetch(
    `${SUPABASE_URL}/rest/v1/products?select=slug`,
    {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    }
  );
  const existing = await existingRes.json();
  const existingSlugs = new Set(existing.map((p) => p.slug));

  // Filter out products already in DB
  const newProducts = products.filter((p) => {
    if (existingSlugs.has(p.slug)) {
      console.log(`SKIP (already exists): ${p.slug}`);
      return false;
    }
    return true;
  });

  console.log(`\nAdding ${newProducts.length} new products (${products.length - newProducts.length} skipped as duplicates)\n`);

  if (newProducts.length === 0) {
    console.log("Nothing to add.");
    return;
  }

  // Format for Supabase insert
  const formatted = newProducts.map((p) => ({
    title: p.title,
    slug: p.slug,
    url: p.url,
    description: p.description,
    maker_twitter: p.maker_twitter || null,
    maker_name: p.maker_name || null,
    tools_used: p.tools_used || [],
    x_likes: p.x_likes || 0,
    x_views: p.x_views || 0,
    upvotes_count: 0,
    approved: true,
    flagged_for_removal: false,
  }));

  // Batch insert
  const res = await fetch(`${SUPABASE_URL}/rest/v1/products`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(formatted),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error(`INSERT FAILED: ${res.status} ${err}`);
    return;
  }

  const inserted = await res.json();
  console.log(`SUCCESS: Inserted ${inserted.length} products`);
  inserted.forEach((p) => console.log(`  + ${p.title} (${p.slug})`));

  // Verify total count
  const countRes = await fetch(
    `${SUPABASE_URL}/rest/v1/products?select=id&approved=eq.true`,
    {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Prefer: "count=exact",
      },
    }
  );
  const countHeader = countRes.headers.get("content-range");
  console.log(`\nTotal approved products now: ${countHeader}`);
}

main().catch(console.error);
