#!/usr/bin/env node
/**
 * Fetches OG images for products missing thumbnails.
 * Reads <meta property="og:image"> from each product URL.
 * Updates Supabase with the found image URLs.
 */

const { createClient } = require('@supabase/supabase-js');

const sb = createClient(
  'https://smfrysqapzwdjfscltmq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZnJ5c3FhcHp3ZGpmc2NsdG1xIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDU1MzU1MiwiZXhwIjoyMDkwMTI5NTUyfQ.6OIb0Currb1nADd3riwFYGp-muQcpsCeH1qycy8P1Tg'
);

async function fetchOGImage(url) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'text/html',
      },
      redirect: 'follow',
    });
    clearTimeout(timeout);
    
    if (!res.ok) return null;
    
    const html = await res.text();
    
    // Try og:image first
    let match = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i);
    if (!match) {
      match = html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
    }
    // Try twitter:image as fallback
    if (!match) {
      match = html.match(/<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i);
    }
    if (!match) {
      match = html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']twitter:image["']/i);
    }
    
    if (match && match[1]) {
      let imgUrl = match[1];
      // Resolve relative URLs
      if (imgUrl.startsWith('/')) {
        const u = new URL(url);
        imgUrl = `${u.protocol}//${u.host}${imgUrl}`;
      }
      return imgUrl;
    }
    
    return null;
  } catch (err) {
    return null;
  }
}

async function main() {
  // Get all products missing thumbnails
  const { data: nullThumbs } = await sb.from('products').select('id, title, url, thumbnail_url').is('thumbnail_url', null);
  const { data: emptyThumbs } = await sb.from('products').select('id, title, url, thumbnail_url').eq('thumbnail_url', '');
  const products = [...(nullThumbs || []), ...(emptyThumbs || [])];
  
  console.log(`Found ${products.length} products missing thumbnails\n`);
  
  let updated = 0;
  let failed = [];
  
  for (const p of products) {
    process.stdout.write(`  ${p.title} (${p.url})... `);
    
    const ogImage = await fetchOGImage(p.url);
    
    if (ogImage) {
      const { error } = await sb.from('products').update({ thumbnail_url: ogImage }).eq('id', p.id);
      if (error) {
        console.log(`DB ERROR: ${error.message}`);
        failed.push({ title: p.title, reason: 'db error' });
      } else {
        console.log(`✅ ${ogImage.substring(0, 80)}...`);
        updated++;
      }
    } else {
      console.log('❌ No OG image found');
      failed.push({ title: p.title, url: p.url, reason: 'no og:image' });
    }
    
    // Small delay between requests
    await new Promise(r => setTimeout(r, 500));
  }
  
  console.log(`\n--- Results ---`);
  console.log(`Updated: ${updated}/${products.length}`);
  console.log(`Failed: ${failed.length}`);
  if (failed.length > 0) {
    console.log('\nFailed products:');
    failed.forEach(f => console.log(`  - ${f.title}: ${f.reason} (${f.url || ''})`));
  }
}

main().catch(console.error);
