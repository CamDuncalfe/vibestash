const { createClient } = require('@supabase/supabase-js');
const https = require('https');
const http = require('http');
const { URL } = require('url');

const sb = createClient(
  'https://smfrysqapzwdjfscltmq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZnJ5c3FhcHp3ZGpmc2NsdG1xIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDU1MzU1MiwiZXhwIjoyMDkwMTI5NTUyfQ.6OIb0Currb1nADd3riwFYGp-muQcpsCeH1qycy8P1Tg'
);

function fetchHtml(url, timeout = 8000, maxRedirects = 3) {
  return new Promise((resolve, reject) => {
    if (maxRedirects <= 0) return reject(new Error('Too many redirects'));
    
    let parsedUrl;
    try { parsedUrl = new URL(url); } catch { return reject(new Error('Bad URL')); }
    
    const proto = parsedUrl.protocol === 'https:' ? https : http;
    const req = proto.get(url, {
      timeout,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml'
      },
      rejectUnauthorized: false
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        try {
          const next = new URL(res.headers.location, url).href;
          res.resume();
          return fetchHtml(next, timeout, maxRedirects - 1).then(resolve).catch(reject);
        } catch { return reject(new Error('Bad redirect URL')); }
      }
      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      
      let data = '';
      res.setEncoding('utf8');
      res.on('data', chunk => {
        data += chunk;
        // Only need the <head> section for meta tags
        if (data.length > 50000) {
          res.destroy();
          resolve(data);
        }
      });
      res.on('end', () => resolve(data));
      res.on('error', reject);
    });
    
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
    setTimeout(() => { req.destroy(); }, timeout + 1000);
  });
}

function extractOgImage(html) {
  const patterns = [
    /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i,
    /<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i,
    /<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i,
    /<meta[^>]*content=["']([^"']+)["'][^>]*name=["']twitter:image["']/i,
    /<meta[^>]*name=["']twitter:image:src["'][^>]*content=["']([^"']+)["']/i,
    /<meta[^>]*content=["']([^"']+)["'][^>]*name=["']twitter:image:src["']/i,
  ];
  
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match && match[1]) return match[1];
  }
  return null;
}

function makeAbsolute(imgUrl, baseUrl) {
  try {
    if (imgUrl.startsWith('http')) return imgUrl;
    return new URL(imgUrl, baseUrl).href;
  } catch {
    return null;
  }
}

async function main() {
  const { data: products, error } = await sb.from('products')
    .select('id,title,url,slug')
    .is('thumbnail_url', null)
    .order('title');

  if (error) { console.error('DB error:', error.message); process.exit(1); }
  console.log(`Found ${products.length} products without thumbnails\n`);

  let updated = 0, missed = 0, skipped = 0, errored = 0;

  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const prefix = `[${i+1}/${products.length}]`;
    
    // Skip non-web URLs
    if (!p.url || (!p.url.startsWith('http://') && !p.url.startsWith('https://'))) {
      console.log(`${prefix} SKIP ${p.title} — not a web URL`);
      skipped++;
      continue;
    }
    if (p.url.includes('apps.apple.com') || p.url.includes('play.google.com') || p.url.includes('chrome.google.com/webstore')) {
      console.log(`${prefix} SKIP ${p.title} — store link`);
      skipped++;
      continue;
    }

    try {
      const html = await fetchHtml(p.url);
      const rawImg = extractOgImage(html);

      if (!rawImg) {
        console.log(`${prefix} MISS ${p.title}`);
        missed++;
        continue;
      }

      const imgUrl = makeAbsolute(rawImg, p.url);
      if (!imgUrl) {
        console.log(`${prefix} MISS ${p.title} — bad image URL`);
        missed++;
        continue;
      }

      const { error: ue } = await sb.from('products')
        .update({ thumbnail_url: imgUrl })
        .eq('id', p.id);

      if (ue) {
        console.log(`${prefix} FAIL ${p.title} — ${ue.message}`);
        errored++;
      } else {
        console.log(`${prefix} OK   ${p.title} → ${imgUrl.substring(0, 80)}`);
        updated++;
      }
    } catch (err) {
      console.log(`${prefix} ERR  ${p.title} — ${err.message}`);
      errored++;
    }

    // 300ms between requests
    await new Promise(r => setTimeout(r, 300));
  }

  console.log(`\n=== DONE ===`);
  console.log(`Updated: ${updated} | Missed: ${missed} | Skipped: ${skipped} | Errors: ${errored}`);
  console.log(`Total processed: ${products.length}`);
}

main().catch(err => { console.error('Fatal:', err.message); process.exit(1); });
