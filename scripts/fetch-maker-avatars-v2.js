#!/usr/bin/env node
/**
 * Fetch maker avatars - v2 with longer delays and multiple fallbacks.
 * Tries: unavatar.io/twitter → unavatar.io/github → github.com/<handle>.png
 */

const SUPABASE_URL = 'https://smfrysqapzwdjfscltmq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZnJ5c3FhcHp3ZGpmc2NsdG1xIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDU1MzU1MiwiZXhwIjoyMDkwMTI5NTUyfQ.6OIb0Currb1nADd3riwFYGp-muQcpsCeH1qycy8P1Tg';

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchProducts() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/products?select=id,slug,maker_twitter&approved=eq.true&maker_twitter=not.is.null&maker_avatar_url=is.null&order=slug`,
    {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    }
  );
  return res.json();
}

async function tryUrl(url) {
  try {
    const res = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      signal: AbortSignal.timeout(5000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function getAvatarUrl(twitterHandle) {
  const handle = twitterHandle.replace(/^@/, '');
  
  // Strategy 1: unavatar.io with 2s delay (respect rate limits)
  const unavatarUrl = `https://unavatar.io/twitter/${handle}`;
  if (await tryUrl(unavatarUrl)) return unavatarUrl;
  
  await sleep(500);
  
  // Strategy 2: GitHub avatar (many makers have matching GitHub usernames)
  const githubUrl = `https://github.com/${handle}.png?size=200`;
  const ghRes = await fetch(githubUrl, {
    method: 'HEAD',
    redirect: 'manual',
    signal: AbortSignal.timeout(5000),
  }).catch(() => null);
  
  if (ghRes && (ghRes.status === 200 || ghRes.status === 302)) {
    // Use unavatar.io/github which gives direct image URL
    return `https://unavatar.io/github/${handle}`;
  }
  
  return null;
}

async function updateProduct(id, avatarUrl) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/products?id=eq.${id}`,
    {
      method: 'PATCH',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({ maker_avatar_url: avatarUrl }),
    }
  );
  return res.ok;
}

async function main() {
  console.log(`Fetching products with maker_twitter but no avatar...`);
  const products = await fetchProducts();
  console.log(`Found ${products.length} products to process\n`);
  
  let updated = 0;
  let failed = 0;
  
  for (const p of products) {
    const handle = p.maker_twitter.replace(/^@/, '');
    process.stdout.write(`[${updated + failed + 1}/${products.length}] ${p.slug} (@${handle})... `);
    
    const avatarUrl = await getAvatarUrl(handle);
    
    if (!avatarUrl) {
      console.log('❌ no avatar found');
      failed++;
    } else {
      const ok = await updateProduct(p.id, avatarUrl);
      if (ok) {
        console.log(`✅ ${avatarUrl}`);
        updated++;
      } else {
        console.log('❌ DB update failed');
        failed++;
      }
    }
    
    // 1.5s between requests to avoid rate limits
    await sleep(1500);
  }
  
  console.log(`\nDone! Updated: ${updated}, Failed: ${failed}`);
}

main().catch(console.error);
