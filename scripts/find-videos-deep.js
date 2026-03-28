#!/usr/bin/env node

/**
 * Deep video finder - checks for background videos, lazy-loaded videos,
 * data-src attributes, and other non-standard video embeds
 */

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://smfrysqapzwdjfscltmq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZnJ5c3FhcHp3ZGpmc2NsdG1xIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDU1MzU1MiwiZXhwIjoyMDkwMTI5NTUyfQ.6OIb0Currb1nADd3riwFYGp-muQcpsCeH1qycy8P1Tg'
);

async function deepScan() {
  const { data: products, error } = await supabase
    .from('products')
    .select('id, title, url')
    .is('video_url', null)
    .or('flagged_for_removal.is.null,flagged_for_removal.eq.false')
    .order('title');

  if (error) { console.error(error); return; }
  console.log(`${products.length} products still need videos.\n`);

  let found = 0;
  let checked = 0;

  for (const product of products) {
    if (!product.url) continue;
    checked++;

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);

      const res = await fetch(product.url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml',
        },
        redirect: 'follow',
      });
      clearTimeout(timeout);

      if (!res.ok) continue;
      const html = await res.text();

      // More aggressive patterns
      const allPatterns = [
        // Standard video src
        /<video[^>]*src=["']([^"']+\.(?:mp4|webm|mov))[^"']*["']/gi,
        /<source[^>]*src=["']([^"']+\.(?:mp4|webm|mov))[^"']*["']/gi,
        // data-src, data-video, data-lazy
        /data-(?:src|video|lazy|poster)=["']([^"']+\.(?:mp4|webm|mov))[^"']*["']/gi,
        // OG video
        /(?:og:video|og:video:url|og:video:secure_url)[^>]*content=["']([^"']+)["']/gi,
        /content=["']([^"']+\.(?:mp4|webm|mov))[^"']*["'][^>]*property/gi,
        // Twitter player
        /twitter:player[^>]*content=["']([^"']+)["']/gi,
        // JSON/JS strings containing video URLs
        /["']([^"']*(?:videos?|media|assets|cdn)[^"']*\.(?:mp4|webm))[^"']*["']/gi,
        // Cloudinary/imgix video
        /["'](https?:\/\/[^"']*(?:cloudinary|imgix|uploadcare|res\.cloudinary)[^"']*\.(?:mp4|webm))[^"']*["']/gi,
        // Vimeo progressive (direct mp4)
        /["'](https?:\/\/[^"']*vimeocdn[^"']*\.mp4[^"']*)["']/gi,
      ];

      let videoUrl = null;
      for (const pattern of allPatterns) {
        let match;
        while ((match = pattern.exec(html)) !== null) {
          let url = match[1];
          // Skip tracking pixels, tiny files, thumbnails
          if (url.includes('pixel') || url.includes('track') || url.includes('analytics')) continue;
          if (url.includes('.gif') || url.includes('poster')) continue;
          // Make absolute
          if (url.startsWith('/')) {
            const base = new URL(product.url);
            url = `${base.origin}${url}`;
          } else if (!url.startsWith('http')) {
            try { url = new URL(url, product.url).href; } catch { continue; }
          }
          videoUrl = url;
          break;
        }
        if (videoUrl) break;
      }

      if (videoUrl) {
        // Verify it's actually accessible with a HEAD request
        try {
          const headController = new AbortController();
          const headTimeout = setTimeout(() => headController.abort(), 3000);
          const headRes = await fetch(videoUrl, {
            method: 'HEAD',
            signal: headController.signal,
            redirect: 'follow',
          });
          clearTimeout(headTimeout);
          
          const contentType = headRes.headers.get('content-type') || '';
          if (headRes.ok && (contentType.includes('video') || videoUrl.match(/\.(mp4|webm)(\?|$)/))) {
            console.log(`✅ ${product.title}: ${videoUrl}`);
            await supabase.from('products').update({ video_url: videoUrl }).eq('id', product.id);
            found++;
          } else {
            // Content type doesn't match video, skip
          }
        } catch {
          // HEAD request failed, try anyway if URL looks good
          if (videoUrl.match(/\.(mp4|webm)$/)) {
            console.log(`⚠️ ${product.title}: ${videoUrl} (HEAD failed, URL looks valid)`);
            await supabase.from('products').update({ video_url: videoUrl }).eq('id', product.id);
            found++;
          }
        }
      }
    } catch (e) {
      // Skip
    }

    if (checked % 50 === 0) {
      console.log(`... checked ${checked}/${products.length}, found ${found} videos`);
    }
  }

  console.log(`\n=== DEEP SCAN DONE ===`);
  console.log(`Checked: ${checked}`);
  console.log(`Videos found: ${found}`);
}

deepScan().catch(console.error);
