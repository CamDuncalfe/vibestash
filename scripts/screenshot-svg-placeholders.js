#!/usr/bin/env node
// Capture screenshots for all products with SVG placeholder thumbnails
const CDP = require('chrome-remote-interface');

const SUPABASE_URL = 'https://smfrysqapzwdjfscltmq.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZnJ5c3FhcHp3ZGpmc2NsdG1xIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDU1MzU1MiwiZXhwIjoyMDkwMTI5NTUyfQ.6OIb0Currb1nADd3riwFYGp-muQcpsCeH1qycy8P1Tg';

// All 22 products with SVG placeholders
const PRODUCTS = [
  { slug: 'ambient-weather-app', url: 'https://ambientweather.app' },
  { slug: 'browseruse', url: 'https://browseruse.com' },
  { slug: 'desolation-game', url: 'https://desolation.game' },
  { slug: 'diagram-ai', url: 'https://diagram.com' },
  { slug: 'gameboy-live', url: 'https://gameboy.live' },
  { slug: 'gravity-sim', url: 'https://gravitysim.co' },
  { slug: 'indiepage', url: 'https://indiepage.co' },
  { slug: 'marble-race', url: 'https://marble.rest' },
  { slug: 'peanut-game', url: 'https://peanut.game' },
  { slug: 'pika-screen', url: 'https://pika.style' },
  { slug: 'pixelme', url: 'https://pixelme.style' },
  { slug: 'plock', url: 'https://plock.dev' },
  { slug: 'ponder-journal', url: 'https://ponder.us' },
  { slug: 'pong-wars', url: 'https://pong-wars.koenvangilst.nl' },
  { slug: 'pricetag', url: 'https://pricetag.dev' },
  { slug: 'quickmvp', url: 'https://quickmvp.app' },
  { slug: 'rapidpages', url: 'https://rapidpages.com' },
  { slug: 'svgvibes', url: 'https://svgvibes.com' },
  { slug: 'sweaterify', url: 'https://sweaterify.com' },
  { slug: 'textbee', url: 'https://textbee.dev' },
  { slug: 'vibechess', url: 'https://vibechess.com' },
  { slug: 'wanna-app', url: 'https://wanna.live' },
];

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function uploadToSupabase(slug, base64Data) {
  const buffer = Buffer.from(base64Data, 'base64');
  const path = `thumbnails/${slug}.png`;
  
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/screenshots/${path}`, {
    method: 'POST',
    headers: {
      'apikey': SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': 'image/png',
      'x-upsert': 'true'
    },
    body: buffer
  });
  
  if (!res.ok) {
    console.log(`  ❌ Upload failed for ${slug}: ${await res.text()}`);
    return null;
  }
  return `${SUPABASE_URL}/storage/v1/object/public/screenshots/${path}`;
}

async function updateProduct(slug, thumbnailUrl) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/products?slug=eq.${slug}`, {
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
  console.log(`🚀 Capturing screenshots for ${PRODUCTS.length} products with SVG placeholders\n`);
  
  // Create new tab via CDP
  const target = await (await fetch('http://127.0.0.1:9222/json/new?about:blank', { method: 'PUT' })).json();
  const client = await CDP({ target: target.webSocketDebuggerUrl });
  const { Page, Emulation, Network } = client;
  
  await Page.enable();
  await Network.enable();
  
  // Desktop viewport
  await Emulation.setDeviceMetricsOverride({
    width: 1280,
    height: 800,
    deviceScaleFactor: 2,
    mobile: false
  });
  
  let success = 0;
  let failed = [];
  
  for (const { slug, url } of PRODUCTS) {
    console.log(`📸 [${success + failed.length + 1}/${PRODUCTS.length}] ${slug} → ${url}`);
    
    try {
      // Navigate with timeout
      const navPromise = Page.navigate({ url });
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Nav timeout')), 15000));
      await Promise.race([navPromise, timeoutPromise]);
      
      // Wait for load + render
      try {
        await Promise.race([
          Page.loadEventFired(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Load timeout')), 10000))
        ]);
      } catch (e) {
        // Proceed anyway, some sites never fire load event
      }
      await sleep(3000); // Extra settle time
      
      const { data } = await Page.captureScreenshot({ 
        format: 'png',
        clip: { x: 0, y: 0, width: 1280, height: 800, scale: 1 }
      });
      
      const publicUrl = await uploadToSupabase(slug, data);
      if (publicUrl) {
        const updated = await updateProduct(slug, publicUrl);
        console.log(`  ✅ Uploaded & ${updated ? 'updated DB' : 'DB update failed'}`);
        success++;
      } else {
        failed.push(slug);
      }
    } catch (e) {
      console.log(`  ⚠️ Failed: ${e.message}`);
      failed.push(slug);
    }
  }
  
  // Close the tab
  try {
    await fetch(`http://127.0.0.1:9222/json/close/${target.id}`);
  } catch (e) {}
  await client.close();
  
  console.log(`\n🏁 Done! ${success}/${PRODUCTS.length} screenshots captured`);
  if (failed.length > 0) {
    console.log(`❌ Failed: ${failed.join(', ')}`);
  }
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
