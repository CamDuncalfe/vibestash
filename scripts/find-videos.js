#!/usr/bin/env node

/**
 * Video finder for VibeStash products.
 * Strategy:
 * 1. Check if the product's x_post_url has a video (X video posts)
 * 2. Search YouTube for "{product name} demo" and grab the top result embed
 * 3. Try to find mp4/webm on the product's own site
 * 
 * For now: focus on products that have X posts with video content,
 * and manually curate YouTube embeds for the most popular products.
 */

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://smfrysqapzwdjfscltmq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZnJ5c3FhcHp3ZGpmc2NsdG1xIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDU1MzU1MiwiZXhwIjoyMDkwMTI5NTUyfQ.6OIb0Currb1nADd3riwFYGp-muQcpsCeH1qycy8P1Tg'
);

// Curated video URLs for well-known products
// These are direct mp4/webm URLs or high-quality demo videos
// We need direct video file URLs (mp4/webm) for the hover player
const CURATED_VIDEOS = {
  // Format: 'product_title_lowercase': 'direct_video_url'
  // We'll populate this by searching
};

async function findVideosFromSites() {
  const { data: products, error } = await supabase
    .from('products')
    .select('id, title, url, x_post_url, video_url')
    .is('video_url', null)
    .or('flagged_for_removal.is.null,flagged_for_removal.eq.false')
    .order('title');

  if (error) {
    console.error('Error fetching products:', error);
    return;
  }

  console.log(`\n${products.length} products need video URLs.\n`);

  // For each product, try to fetch its homepage and look for video tags
  let found = 0;
  let checked = 0;

  for (const product of products) {
    if (!product.url) continue;
    checked++;

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      const res = await fetch(product.url, {
        signal: controller.signal,
        headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' },
        redirect: 'follow',
      });
      clearTimeout(timeout);

      if (!res.ok) continue;

      const html = await res.text();

      // Look for direct video sources
      const videoPatterns = [
        // <video src="...mp4">
        /(?:<video[^>]*\ssrc=["'])([^"']+\.(?:mp4|webm))["']/gi,
        // <source src="...mp4">
        /(?:<source[^>]*\ssrc=["'])([^"']+\.(?:mp4|webm))["']/gi,
        // og:video meta tag
        /(?:property=["']og:video["'][^>]*content=["'])([^"']+)["']/gi,
        /(?:content=["'])([^"']+)["'][^>]*property=["']og:video["']/gi,
      ];

      let videoUrl = null;
      for (const pattern of videoPatterns) {
        const match = pattern.exec(html);
        if (match && match[1]) {
          let url = match[1];
          // Make absolute URL if relative
          if (url.startsWith('/')) {
            const base = new URL(product.url);
            url = `${base.origin}${url}`;
          } else if (!url.startsWith('http')) {
            url = new URL(url, product.url).href;
          }
          videoUrl = url;
          break;
        }
      }

      if (videoUrl) {
        console.log(`✅ ${product.title}: ${videoUrl}`);
        const { error: updateError } = await supabase
          .from('products')
          .update({ video_url: videoUrl })
          .eq('id', product.id);
        if (updateError) {
          console.error(`  Error updating: ${updateError.message}`);
        } else {
          found++;
        }
      }
    } catch (e) {
      // Timeout or fetch error, skip
    }

    // Progress every 50
    if (checked % 50 === 0) {
      console.log(`... checked ${checked}/${products.length}, found ${found} videos`);
    }
  }

  console.log(`\n=== DONE ===`);
  console.log(`Checked: ${checked}`);
  console.log(`Videos found: ${found}`);
}

findVideosFromSites().catch(console.error);
