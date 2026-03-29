#!/usr/bin/env node
/**
 * Refresh placeholder thumbnails by fetching real OG images from product URLs.
 * Only updates products currently using vibestash.fun/api/og placeholders.
 */

const SUPABASE_URL = 'https://smfrysqapzwdjfscltmq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZnJ5c3FhcHp3ZGpmc2NsdG1xIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDU1MzU1MiwiZXhwIjoyMDkwMTI5NTUyfQ.6OIb0Currb1nADd3riwFYGp-muQcpsCeH1qycy8P1Tg';

async function fetchOGImage(url) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' },
      redirect: 'follow'
    });
    clearTimeout(timeout);
    if (!res.ok) return null;
    const html = await res.text();
    
    // Try og:image first
    const ogMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i)
      || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
    if (ogMatch) {
      let imgUrl = ogMatch[1];
      // Make absolute
      if (imgUrl.startsWith('/')) {
        const urlObj = new URL(url);
        imgUrl = urlObj.origin + imgUrl;
      }
      // Skip if it's a generic GitHub OG image
      if (imgUrl.includes('github.githubassets.com') || imgUrl.includes('opengraph.githubassets.com')) {
        return null;
      }
      return imgUrl;
    }
    
    // Try twitter:image
    const twMatch = html.match(/<meta[^>]*(?:name|property)=["']twitter:image["'][^>]*content=["']([^"']+)["']/i)
      || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*(?:name|property)=["']twitter:image["']/i);
    if (twMatch) {
      let imgUrl = twMatch[1];
      if (imgUrl.startsWith('/')) {
        const urlObj = new URL(url);
        imgUrl = urlObj.origin + imgUrl;
      }
      if (imgUrl.includes('github.githubassets.com') || imgUrl.includes('opengraph.githubassets.com')) {
        return null;
      }
      return imgUrl;
    }
    
    return null;
  } catch (e) {
    return null;
  }
}

async function main() {
  // Fetch all products with placeholder thumbnails
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/products?select=id,slug,title,url,thumbnail_url&approved=eq.true&thumbnail_url=like.*vibestash.fun/api/og*`,
    {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    }
  );
  const products = await res.json();
  console.log(`Found ${products.length} products with placeholder thumbnails\n`);
  
  let updated = 0;
  let skipped = 0;
  let failed = 0;
  
  for (const p of products) {
    // Skip github.com-only URLs (no real product page)
    if (p.url === 'https://github.com' || p.url.match(/^https:\/\/github\.com\/?$/)) {
      console.log(`[SKIP] ${p.slug} — generic GitHub URL`);
      skipped++;
      continue;
    }
    
    process.stdout.write(`[${p.slug}] Checking ${p.url}... `);
    const ogImage = await fetchOGImage(p.url);
    
    if (ogImage) {
      // Verify image is accessible
      try {
        const imgRes = await fetch(ogImage, { method: 'HEAD', signal: AbortSignal.timeout(5000) });
        if (!imgRes.ok || !(imgRes.headers.get('content-type') || '').startsWith('image')) {
          console.log(`❌ OG image not accessible (${imgRes.status})`);
          failed++;
          continue;
        }
      } catch {
        console.log(`❌ OG image fetch failed`);
        failed++;
        continue;
      }
      
      // Update in Supabase
      const updateRes = await fetch(
        `${SUPABASE_URL}/rest/v1/products?id=eq.${p.id}`,
        {
          method: 'PATCH',
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({ thumbnail_url: ogImage })
        }
      );
      
      if (updateRes.ok) {
        console.log(`✅ Updated → ${ogImage.substring(0, 80)}...`);
        updated++;
      } else {
        console.log(`❌ DB update failed: ${updateRes.status}`);
        failed++;
      }
    } else {
      console.log(`— No OG image found`);
      skipped++;
    }
  }
  
  console.log(`\n=== RESULTS ===`);
  console.log(`Updated: ${updated}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Failed: ${failed}`);
  console.log(`Still placeholder: ${products.length - updated}`);
}

main().catch(console.error);
