#!/usr/bin/env node
const CDP = require('chrome-remote-interface');

const SUPABASE_URL = 'https://smfrysqapzwdjfscltmq.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZnJ5c3FhcHp3ZGpmc2NsdG1xIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDU1MzU1MiwiZXhwIjoyMDkwMTI5NTUyfQ.6OIb0Currb1nADd3riwFYGp-muQcpsCeH1qycy8P1Tg';

const PRODUCTS = [
  { slug: 'browseruse', title: 'BrowserUse', desc: 'Open-source AI browser automation', color: '#0f172a' },
  { slug: 'indiepage', title: 'IndiePage', desc: 'Link-in-bio for indie hackers', color: '#1e293b' },
  { slug: 'pixelme', title: 'PixelMe', desc: 'Turn selfies into retro pixel art', color: '#4c1d95' },
  { slug: 'plock', title: 'Plock', desc: 'Ask AI about anything on your screen', color: '#0c4a6e' },
  { slug: 'quickmvp', title: 'QuickMVP', desc: 'Describe your startup, get a landing page in 60s', color: '#065f46' },
  { slug: 'rapidpages', title: 'RapidPages', desc: 'AI-generated landing pages from a description', color: '#1e3a5f' },
  { slug: 'vibechess', title: 'VibeChess', desc: 'Chess with AI commentary that roasts your moves', color: '#1a1a2e' },
  { slug: 'wanna-app', title: 'Wanna', desc: 'Find people nearby who wanna do the same thing', color: '#7c2d12' },
];

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  const target = await (await fetch('http://127.0.0.1:9222/json/new?about:blank', { method: 'PUT' })).json();
  const client = await CDP({ target: target.webSocketDebuggerUrl });
  const { Page, Emulation } = client;
  await Page.enable();
  await Emulation.setDeviceMetricsOverride({ width: 1280, height: 800, deviceScaleFactor: 2, mobile: false });

  for (const { slug, title, desc, color } of PRODUCTS) {
    console.log(`🎨 ${slug}`);
    
    const html = `<html><body style="margin:0;display:flex;align-items:center;justify-content:center;width:1280px;height:800px;background:${color};font-family:-apple-system,BlinkMacSystemFont,sans-serif;"><div style="text-align:center;color:white;padding:60px;"><div style="font-size:64px;font-weight:800;margin-bottom:16px;letter-spacing:-2px;">${title}</div><div style="font-size:24px;opacity:0.7;max-width:600px;margin:0 auto;line-height:1.4;">${desc}</div><div style="margin-top:40px;font-size:16px;opacity:0.4;">vibestash.fun</div></div></body></html>`;
    
    const dataUrl = 'data:text/html;base64,' + Buffer.from(html).toString('base64');
    await Page.navigate({ url: dataUrl });
    await sleep(1000);
    
    const { data } = await Page.captureScreenshot({ format: 'png', clip: { x: 0, y: 0, width: 1280, height: 800, scale: 1 } });
    const buffer = Buffer.from(data, 'base64');
    
    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/screenshots/thumbnails/${slug}.png`, {
      method: 'POST',
      headers: { 'apikey': SERVICE_ROLE_KEY, 'Authorization': `Bearer ${SERVICE_ROLE_KEY}`, 'Content-Type': 'image/png', 'x-upsert': 'true' },
      body: buffer
    });
    
    const res2 = await fetch(`${SUPABASE_URL}/rest/v1/products?slug=eq.${slug}`, {
      method: 'PATCH',
      headers: { 'apikey': SERVICE_ROLE_KEY, 'Authorization': `Bearer ${SERVICE_ROLE_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
      body: JSON.stringify({ thumbnail_url: `${SUPABASE_URL}/storage/v1/object/public/screenshots/thumbnails/${slug}.png` })
    });
    
    console.log(`  ✅ Upload: ${res.ok}, DB: ${res2.ok}`);
  }

  try { await fetch(`http://127.0.0.1:9222/json/close/${target.id}`); } catch (e) {}
  await client.close();
  console.log('\n🏁 Done!');
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
