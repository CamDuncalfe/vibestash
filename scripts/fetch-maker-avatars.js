#!/usr/bin/env node
/**
 * Fetch maker avatars for products that have maker_twitter but no maker_avatar_url.
 * Uses unavatar.io (free, no API key needed) to resolve X/Twitter profile pictures.
 * 
 * Usage: node scripts/fetch-maker-avatars.js [--dry-run]
 */

const SUPABASE_URL = 'https://smfrysqapzwdjfscltmq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZnJ5c3FhcHp3ZGpmc2NsdG1xIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDU1MzU1MiwiZXhwIjoyMDkwMTI5NTUyfQ.6OIb0Currb1nADd3riwFYGp-muQcpsCeH1qycy8P1Tg';

const DRY_RUN = process.argv.includes('--dry-run');

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

async function getAvatarUrl(twitterHandle) {
  const handle = twitterHandle.replace(/^@/, '');
  
  // Try unavatar.io first (aggregates multiple sources)
  const unavatarUrl = `https://unavatar.io/twitter/${handle}`;
  try {
    const res = await fetch(unavatarUrl, { method: 'HEAD', redirect: 'follow' });
    if (res.ok && res.headers.get('content-type')?.startsWith('image/')) {
      return unavatarUrl;
    }
  } catch (e) {
    // Fall through
  }
  
  // Fallback: try direct X profile image via unavatar.io/x
  const xUrl = `https://unavatar.io/x/${handle}`;
  try {
    const res = await fetch(xUrl, { method: 'HEAD', redirect: 'follow' });
    if (res.ok && res.headers.get('content-type')?.startsWith('image/')) {
      return xUrl;
    }
  } catch (e) {
    // Fall through
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
  
  if (DRY_RUN) {
    console.log('DRY RUN — will not update database\n');
  }
  
  let updated = 0;
  let skipped = 0;
  let failed = 0;
  
  for (const p of products) {
    const handle = p.maker_twitter.replace(/^@/, '');
    process.stdout.write(`[${updated + skipped + failed + 1}/${products.length}] ${p.slug} (@${handle})... `);
    
    const avatarUrl = await getAvatarUrl(handle);
    
    if (!avatarUrl) {
      console.log('❌ no avatar found');
      failed++;
    } else if (DRY_RUN) {
      console.log(`✅ would set: ${avatarUrl}`);
      updated++;
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
    
    // Rate limit: 200ms between requests to be nice to unavatar.io
    await sleep(200);
  }
  
  console.log(`\nDone! Updated: ${updated}, Skipped: ${skipped}, Failed: ${failed}`);
}

main().catch(console.error);
