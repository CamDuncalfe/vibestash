#!/usr/bin/env node
// Take CDP screenshots of products missing thumbnails and upload to Supabase
const CDP = require('chrome-remote-interface');

const SUPABASE_URL = 'https://smfrysqapzwdjfscltmq.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZnJ5c3FhcHp3ZGpmc2NsdG1xIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDU1MzU1MiwiZXhwIjoyMDkwMTI5NTUyfQ.6OIb0Currb1nADd3riwFYGp-muQcpsCeH1qycy8P1Tg';

// Products that need manual screenshots
const MISSING = [
  // slug -> URL mapping
  { slug: 'cowboy-shooter', url: 'https://cowboy.raymelon.com' },
  { slug: 'crash-out-diary', url: 'https://crashoutdiary.vercel.app' },
  { slug: 'menugen', url: 'https://www.menugen.app' },
  { slug: 'storypot', url: 'https://app.thestorypot.com' },
  { slug: 'tetdle', url: 'https://tetdle.com' },
  { slug: 'scene-pixels', url: 'https://www.scenepixels.com' },
  { slug: 'great-taxi-assignment', url: 'https://great-taxi-assignment.netlify.app' },
  { slug: 'tower-of-time', url: 'https://github.com/maciej-trebacz/tower-of-time-game' },
  { slug: 'vector-tango', url: 'https://www.vector-tango.com' },
  { slug: 'poker-slam', url: 'https://apps.apple.com/app/poker-slam/id6746056702' },
  { slug: 'crashy-zorg', url: 'https://play.google.com/store/apps/details?id=com.blobware.crashyzorg' },
  { slug: 'bitchat', url: 'https://github.com/nicknish/bitchat' }, // Replace GitHub logo
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
  // Create a new tab for screenshots
  const { webSocketDebuggerUrl } = await (await fetch('http://127.0.0.1:9222/json/version')).json();
  
  // Create new target (Chrome requires PUT)
  const target = await (await fetch('http://127.0.0.1:9222/json/new?about:blank', { method: 'PUT' })).json();
  
  const client = await CDP({ target: target.webSocketDebuggerUrl });
  const { Page, Emulation, Network } = client;
  
  await Page.enable();
  await Network.enable();
  
  // Set viewport
  await Emulation.setDeviceMetricsOverride({
    width: 1280,
    height: 800,
    deviceScaleFactor: 2,
    mobile: false
  });
  
  let success = 0;
  
  for (const { slug, url } of MISSING) {
    console.log(`📸 Screenshotting ${slug} (${url})`);
    
    try {
      await Page.navigate({ url });
      await sleep(4000); // Wait for page to render
      
      const { data } = await Page.captureScreenshot({ 
        format: 'png',
        clip: { x: 0, y: 0, width: 1280, height: 800, scale: 1 }
      });
      
      const publicUrl = await uploadToSupabase(slug, data);
      if (publicUrl) {
        await updateProduct(slug, publicUrl);
        console.log(`  ✅ ${publicUrl}`);
        success++;
      }
    } catch (e) {
      console.log(`  ⚠️ Error: ${e.message}`);
    }
  }
  
  // Close the tab
  await fetch(`http://127.0.0.1:9222/json/close/${target.id}`, { method: 'GET' });
  await client.close();
  
  console.log(`\n🏁 Done! ${success}/${MISSING.length} screenshots captured`);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
