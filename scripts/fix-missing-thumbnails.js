#!/usr/bin/env node
/**
 * Fetches OG images for products with null thumbnail_url.
 * Falls back to VibeStash branded placeholder if no OG image found.
 */

const SUPABASE_URL = 'https://smfrysqapzwdjfscltmq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZnJ5c3FhcHp3ZGpmc2NsdG1xIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDU1MzU1MiwiZXhwIjoyMDkwMTI5NTUyfQ.6OIb0Currb1nADd3riwFYGp-muQcpsCeH1qycy8P1Tg';
const VIBESTASH_OG_BASE = 'https://vibestash.fun/api/og';

async function fetchOGImage(url) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; VibeStash/1.0)' },
      redirect: 'follow',
    });
    clearTimeout(timeout);
    
    if (!res.ok) return null;
    
    const html = await res.text();
    
    // Try og:image first
    const ogMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i)
      || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
    
    if (ogMatch && ogMatch[1]) {
      let imgUrl = ogMatch[1];
      // Resolve relative URLs
      if (imgUrl.startsWith('/')) {
        const urlObj = new URL(url);
        imgUrl = `${urlObj.origin}${imgUrl}`;
      }
      // Filter out generic/useless OG images
      if (imgUrl.includes('github.com') && imgUrl.includes('opengraph')) return null; // GitHub generic OG
      if (imgUrl.includes('play.google.com')) return null;
      if (imgUrl.includes('apps.apple.com')) return null;
      return imgUrl;
    }
    
    // Try twitter:image
    const twMatch = html.match(/<meta[^>]*(?:name|property)=["']twitter:image["'][^>]*content=["']([^"']+)["']/i)
      || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*(?:name|property)=["']twitter:image["']/i);
    
    if (twMatch && twMatch[1]) {
      let imgUrl = twMatch[1];
      if (imgUrl.startsWith('/')) {
        const urlObj = new URL(url);
        imgUrl = `${urlObj.origin}${imgUrl}`;
      }
      return imgUrl;
    }
    
    return null;
  } catch (e) {
    return null;
  }
}

async function getPlaceholder(title, slug) {
  return `${VIBESTASH_OG_BASE}?title=${encodeURIComponent(title)}&slug=${encodeURIComponent(slug)}`;
}

async function main() {
  // Fetch products with null thumbnails
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/products?select=slug,title,url&approved=eq.true&thumbnail_url=is.null&limit=100`,
    {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    }
  );
  
  const products = await res.json();
  console.log(`Found ${products.length} products with missing thumbnails\n`);
  
  let ogFound = 0;
  let placeholderUsed = 0;
  let failed = 0;
  
  for (const product of products) {
    const { slug, title, url } = product;
    process.stdout.write(`[${slug}] Checking ${url}... `);
    
    let thumbnailUrl = await fetchOGImage(url);
    
    if (thumbnailUrl) {
      console.log(`✅ OG image found`);
      ogFound++;
    } else {
      thumbnailUrl = await getPlaceholder(title, slug);
      console.log(`📦 Using placeholder`);
      placeholderUsed++;
    }
    
    // Update in Supabase
    const updateRes = await fetch(
      `${SUPABASE_URL}/rest/v1/products?slug=eq.${encodeURIComponent(slug)}`,
      {
        method: 'PATCH',
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({ thumbnail_url: thumbnailUrl }),
      }
    );
    
    if (!updateRes.ok) {
      console.log(`  ❌ Failed to update: ${updateRes.status}`);
      failed++;
    }
    
    // Small delay to be nice
    await new Promise(r => setTimeout(r, 300));
  }
  
  console.log(`\n--- Summary ---`);
  console.log(`Total: ${products.length}`);
  console.log(`OG images found: ${ogFound}`);
  console.log(`Placeholders used: ${placeholderUsed}`);
  console.log(`Update failures: ${failed}`);
}

main().catch(console.error);
