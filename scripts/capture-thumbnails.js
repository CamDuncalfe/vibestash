#!/usr/bin/env node
// Capture OG images or screenshots for all VibeStash products
// Uploads to Supabase Storage and updates product records

const SUPABASE_URL = 'https://smfrysqapzwdjfscltmq.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZnJ5c3FhcHp3ZGpmc2NsdG1xIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDU1MzU1MiwiZXhwIjoyMDkwMTI5NTUyfQ.6OIb0Currb1nADd3riwFYGp-muQcpsCeH1qycy8P1Tg';

async function getProducts() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/products?select=id,slug,url,title&order=created_at.asc`, {
    headers: {
      'apikey': SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
    }
  });
  return res.json();
}

async function getOgImage(url) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(url, { 
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' }
    });
    clearTimeout(timeout);
    const html = await res.text();
    
    // Try og:image first, then twitter:image
    const ogMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i)
      || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
    
    if (ogMatch) return ogMatch[1];
    
    const twitterMatch = html.match(/<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i)
      || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']twitter:image["']/i);
    
    if (twitterMatch) return twitterMatch[1];
    
    return null;
  } catch (e) {
    console.log(`  ⚠️ Failed to fetch ${url}: ${e.message}`);
    return null;
  }
}

async function downloadImage(imageUrl, refUrl) {
  try {
    // Resolve relative URLs
    let fullUrl = imageUrl;
    if (imageUrl.startsWith('/')) {
      const u = new URL(refUrl);
      fullUrl = `${u.protocol}//${u.host}${imageUrl}`;
    } else if (!imageUrl.startsWith('http')) {
      fullUrl = new URL(imageUrl, refUrl).href;
    }
    
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const res = await fetch(fullUrl, { 
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' }
    });
    clearTimeout(timeout);
    
    if (!res.ok) return null;
    
    const contentType = res.headers.get('content-type') || 'image/png';
    const buffer = Buffer.from(await res.arrayBuffer());
    
    if (buffer.length < 1000) return null; // Too small, probably not a real image
    
    return { buffer, contentType };
  } catch (e) {
    console.log(`  ⚠️ Failed to download image: ${e.message}`);
    return null;
  }
}

async function uploadToSupabase(slug, buffer, contentType) {
  const ext = contentType.includes('png') ? 'png' : contentType.includes('webp') ? 'webp' : 'jpg';
  const path = `thumbnails/${slug}.${ext}`;
  
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/screenshots/${path}`, {
    method: 'POST',
    headers: {
      'apikey': SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': contentType,
      'x-upsert': 'true'
    },
    body: buffer
  });
  
  if (!res.ok) {
    const err = await res.text();
    console.log(`  ❌ Upload failed: ${err}`);
    return null;
  }
  
  return `${SUPABASE_URL}/storage/v1/object/public/screenshots/${path}`;
}

async function updateProduct(id, thumbnailUrl) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${id}`, {
    method: 'PATCH',
    headers: {
      'apikey': SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify({ thumbnail_url: thumbnailUrl })
  });
  return res.ok;
}

async function main() {
  const products = await getProducts();
  console.log(`Processing ${products.length} products for thumbnails...\n`);
  
  let success = 0;
  let failed = 0;
  
  for (const product of products) {
    console.log(`📸 ${product.title} (${product.url})`);
    
    // Try OG image
    const ogUrl = await getOgImage(product.url);
    
    if (ogUrl) {
      console.log(`  Found OG image: ${ogUrl.substring(0, 80)}...`);
      const img = await downloadImage(ogUrl, product.url);
      
      if (img) {
        const publicUrl = await uploadToSupabase(product.slug, img.buffer, img.contentType);
        if (publicUrl) {
          await updateProduct(product.id, publicUrl);
          console.log(`  ✅ Uploaded & linked: ${publicUrl}`);
          success++;
          continue;
        }
      }
    }
    
    console.log(`  ⏭️ No OG image found, will need manual screenshot`);
    failed++;
  }
  
  console.log(`\n🏁 Done! ${success} thumbnails set, ${failed} need manual screenshots`);
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
