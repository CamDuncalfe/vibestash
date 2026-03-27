#!/usr/bin/env node
// Capture screenshots from Wayback Machine or generate placeholders for dead sites
const CDP = require('chrome-remote-interface');

const SUPABASE_URL = 'https://smfrysqapzwdjfscltmq.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZnJ5c3FhcHp3ZGpmc2NsdG1xIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDU1MzU1MiwiZXhwIjoyMDkwMTI5NTUyfQ.6OIb0Currb1nADd3riwFYGp-muQcpsCeH1qycy8P1Tg';

// Dead sites - try Wayback, then fallback to generated placeholder
const DEAD_SITES = [
  { slug: 'ambient-weather-app', title: 'Ambient Weather', desc: 'Weather app that changes its entire vibe', color: '#1a365d' },
  { slug: 'desolation-game', title: 'Desolation', desc: 'Post-apocalyptic browser survival game', color: '#2d1b00' },
  { slug: 'gravity-sim', title: 'Gravity Sim', desc: 'N-body gravity simulation in the browser', color: '#0a0a2e' },
  { slug: 'peanut-game', title: 'Peanut', desc: 'Multiplayer .io game', color: '#92400e' },
  { slug: 'pricetag', title: 'Pricetag', desc: 'Monitors competitor pricing pages', color: '#1e3a5f' },
  { slug: 'sweaterify', title: 'Sweaterify', desc: 'Turns images into ugly Christmas sweaters', color: '#991b1b' },
];

// SVGVibes has Wayback snapshot
const WAYBACK_SITES = [
  { slug: 'svgvibes', url: 'http://web.archive.org/web/20250317032045/https://svgvibes.com/' },
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
    console.log(`  ❌ Upload failed: ${await res.text()}`);
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
  const target = await (await fetch('http://127.0.0.1:9222/json/new?about:blank', { method: 'PUT' })).json();
  const client = await CDP({ target: target.webSocketDebuggerUrl });
  const { Page, Emulation, Runtime } = client;
  
  await Page.enable();
  await Emulation.setDeviceMetricsOverride({
    width: 1280, height: 800, deviceScaleFactor: 2, mobile: false
  });

  // 1. Wayback sites
  for (const { slug, url } of WAYBACK_SITES) {
    console.log(`📸 [Wayback] ${slug} → ${url}`);
    try {
      await Page.navigate({ url });
      await sleep(8000);
      const { data } = await Page.captureScreenshot({ format: 'png', clip: { x: 0, y: 0, width: 1280, height: 800, scale: 1 } });
      const publicUrl = await uploadToSupabase(slug, data);
      if (publicUrl) {
        await updateProduct(slug, publicUrl);
        console.log(`  ✅ Done`);
      }
    } catch (e) {
      console.log(`  ⚠️ Failed: ${e.message}`);
    }
  }

  // 2. Dead sites - generate nice placeholders
  for (const { slug, title, desc, color } of DEAD_SITES) {
    console.log(`🎨 [Placeholder] ${slug}`);
    
    const html = `
    <html>
    <body style="margin:0;display:flex;align-items:center;justify-content:center;width:1280px;height:800px;background:${color};font-family:-apple-system,BlinkMacSystemFont,sans-serif;">
      <div style="text-align:center;color:white;padding:60px;">
        <div style="font-size:64px;font-weight:800;margin-bottom:16px;letter-spacing:-2px;">${title}</div>
        <div style="font-size:24px;opacity:0.7;max-width:600px;margin:0 auto;line-height:1.4;">${desc}</div>
        <div style="margin-top:40px;font-size:16px;opacity:0.4;">vibestash.fun</div>
      </div>
    </body>
    </html>`;
    
    const dataUrl = 'data:text/html;base64,' + Buffer.from(html).toString('base64');
    await Page.navigate({ url: dataUrl });
    await sleep(1000);
    
    const { data } = await Page.captureScreenshot({ format: 'png', clip: { x: 0, y: 0, width: 1280, height: 800, scale: 1 } });
    const publicUrl = await uploadToSupabase(slug, data);
    if (publicUrl) {
      await updateProduct(slug, publicUrl);
      console.log(`  ✅ Done`);
    }
  }

  try { await fetch(`http://127.0.0.1:9222/json/close/${target.id}`); } catch (e) {}
  await client.close();
  console.log(`\n🏁 All done!`);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
