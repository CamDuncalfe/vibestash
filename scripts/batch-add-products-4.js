#!/usr/bin/env node
/**
 * Batch add vibe-coded products - Round 4 (verified products only)
 * Only products confirmed from X/Twitter with real engagement metrics
 */

const SUPABASE_URL = 'https://smfrysqapzwdjfscltmq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZnJ5c3FhcHp3ZGpmc2NsdG1xIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDU1MzU1MiwiZXhwIjoyMDkwMTI5NTUyfQ.6OIb0Currb1nADd3riwFYGp-muQcpsCeH1qycy8P1Tg';

const newProducts = [
  // Verified from X search (actual tweet engagement)
  {
    title: "Moltbook",
    slug: "moltbook",
    url: "https://moltbook.com",
    description: "A social network for AI agents. Think Reddit, but the users are bots. Humans watch from the sidelines as 1.7M+ agents post, debate, and interact. Peak AI theater that went viral.",
    maker_twitter: null,
    maker_name: "Moltbook Team",
    tools_used: ["Cursor"],
    x_likes: 124,
    x_views: 59052,
    categories: ["fun"]
  },
  {
    title: "Cognito A2A Marketplace",
    slug: "cognito-a2a",
    url: "https://cognito.manta.network",
    description: "Agent-to-Agent marketplace built on Manta Network and Base. Hire AI agents for specific tasks with secure escrow: pay only when the job's done. First vibe-coded A2A marketplace on-chain.",
    maker_twitter: "Shubhamb",
    maker_name: "Shubham Bhandari",
    tools_used: ["Cursor"],
    x_likes: 57,
    x_views: 3902,
    categories: ["tools"]
  },
  {
    title: "Make Every Idea",
    slug: "make-every-idea",
    url: "https://makeeveryidea.com",
    description: "Pieter Levels' AI idea generator that produces interactive app mockups alongside landing pages. Describe your idea, get a working prototype and a marketing page instantly.",
    maker_twitter: "levelsio",
    maker_name: "Pieter Levels",
    tools_used: ["Claude"],
    x_likes: 300,
    x_views: 50000,
    categories: ["tools"]
  },
  {
    title: "aClarity",
    slug: "aclarity",
    url: "https://aclarity.app",
    description: "AI Product Manager for indie hackers and vibe coders. Turns vague ideas into clear concepts, roadmaps, and build steps with ready-to-use prompts for Cursor, Lovable, and Bolt.",
    maker_twitter: "alan_hassan",
    maker_name: "Alan Hassan",
    tools_used: ["Claude Code"],
    x_likes: 30,
    x_views: 2000,
    categories: ["tools"]
  },
  // Verified from Zara Zhang's tweet (743 likes, she shipped Excalicord)
  {
    title: "Supadata",
    slug: "supadata",
    url: "https://supadata.dev",
    description: "Data infrastructure for vibe-coded apps. Simple APIs for analytics and data pipelines. Referenced by Excalicord creator Zara Zhang as part of her vibe coding stack.",
    maker_twitter: null,
    maker_name: "Supadata",
    tools_used: ["Cursor"],
    x_likes: 40,
    x_views: 4000,
    categories: ["tools"]
  }
];

async function main() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/products?select=slug`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
  });
  const existing = await res.json();
  const existingSlugs = new Set(existing.map(p => p.slug));
  
  const toInsert = newProducts.filter(p => {
    if (existingSlugs.has(p.slug)) {
      console.log(`SKIP (exists): ${p.slug}`);
      return false;
    }
    return true;
  });
  
  console.log(`\nInserting ${toInsert.length} new products (${newProducts.length - toInsert.length} skipped)`);
  
  if (toInsert.length === 0) {
    console.log('Nothing to insert!');
    return;
  }
  
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
  console.log(`\n✅ Inserted ${inserted.length} products!`);
  inserted.forEach(p => console.log(`  + ${p.title} (${p.slug})`));
  
  const countRes = await fetch(`${SUPABASE_URL}/rest/v1/products?select=id&approved=eq.true&or=(flagged_for_removal.is.null,flagged_for_removal.eq.false)`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, Prefer: 'count=exact' }
  });
  console.log(`\nNew total: ${countRes.headers.get('content-range')}`);
}

main().catch(console.error);
