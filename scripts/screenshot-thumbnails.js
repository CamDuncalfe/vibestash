#!/usr/bin/env node
/**
 * screenshot-thumbnails.js
 * Takes CDP screenshots of product websites that have no thumbnails,
 * uploads them to Supabase Storage, and updates the product record.
 * 
 * Usage: node scripts/screenshot-thumbnails.js [--limit N] [--start-from SLUG]
 */

const { createClient } = require('@supabase/supabase-js');
const WebSocket = require('ws');

const sb = createClient(
  'https://smfrysqapzwdjfscltmq.supabase.co',
  // service role key for writes
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZnJ5c3FhcHp3ZGpmc2NsdG1xIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDU1MzU1MiwiZXhwIjoyMDkwMTI5NTUyfQ.6OIb0Currb1nADd3riwFYGp-muQcpsCeH1qycy8P1Tg'
);

const CDP_URL = 'http://127.0.0.1:9222';
const VIEWPORT = { width: 1280, height: 800 };
const LOAD_WAIT = 4000; // ms to wait after load

async function getNewTab() {
  const res = await fetch(`${CDP_URL}/json/new`, { method: 'PUT' });
  const tab = await res.json();
  return tab;
}

async function closeTab(tabId) {
  try { await fetch(`${CDP_URL}/json/close/${tabId}`); } catch {}
}

function cdpConnect(wsUrl) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl);
    let id = 0;
    const pending = new Map();

    ws.on('open', () => resolve({
      send(method, params = {}) {
        return new Promise((res, rej) => {
          const msgId = ++id;
          pending.set(msgId, { res, rej });
          ws.send(JSON.stringify({ id: msgId, method, params }));
        });
      },
      close() { ws.close(); }
    }));

    ws.on('message', (raw) => {
      const msg = JSON.parse(raw.toString());
      if (msg.id && pending.has(msg.id)) {
        const { res, rej } = pending.get(msg.id);
        pending.delete(msg.id);
        if (msg.error) rej(new Error(msg.error.message));
        else res(msg.result);
      }
    });

    ws.on('error', reject);
    setTimeout(() => reject(new Error('WS timeout')), 10000);
  });
}

async function screenshotProduct(url, slug) {
  const tab = await getNewTab();
  const cdp = await cdpConnect(tab.webSocketDebuggerUrl);

  try {
    // Set viewport
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: VIEWPORT.width,
      height: VIEWPORT.height,
      deviceScaleFactor: 1,
      mobile: false
    });

    // Navigate with timeout
    await cdp.send('Page.enable');
    const navPromise = cdp.send('Page.navigate', { url });
    const navTimeout = new Promise((_, rej) => setTimeout(() => rej(new Error('Navigation timeout')), 15000));
    await Promise.race([navPromise, navTimeout]);

    // Wait for load + extra time for JS rendering
    await new Promise(r => setTimeout(r, LOAD_WAIT));

    // Screenshot
    const { data } = await cdp.send('Page.captureScreenshot', {
      format: 'jpeg',
      quality: 80,
      clip: { x: 0, y: 0, width: VIEWPORT.width, height: VIEWPORT.height, scale: 1 }
    });

    // Convert base64 to buffer
    const buffer = Buffer.from(data, 'base64');
    
    // Upload to Supabase Storage
    const filename = `thumbnails/${slug}.jpg`;
    const { error: uploadErr } = await sb.storage
      .from('product-videos')
      .upload(filename, buffer, {
        contentType: 'image/jpeg',
        upsert: true
      });

    if (uploadErr) throw new Error(`Upload failed: ${uploadErr.message}`);

    // Get public URL
    const { data: urlData } = sb.storage
      .from('product-videos')
      .getPublicUrl(filename);

    return urlData.publicUrl;
  } finally {
    cdp.close();
    await closeTab(tab.id);
  }
}

async function main() {
  const args = process.argv.slice(2);
  let limit = 200;
  let startFrom = null;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--limit' && args[i + 1]) limit = parseInt(args[i + 1]);
    if (args[i] === '--start-from' && args[i + 1]) startFrom = args[i + 1];
  }

  // Get products missing thumbnails
  let query = sb.from('products')
    .select('id,title,url,slug')
    .eq('approved', true)
    .is('thumbnail_url', null)
    .order('title');

  if (startFrom) query = query.gte('slug', startFrom);
  
  const { data: products, error } = await query.limit(limit);
  if (error) { console.error('Query error:', error); return; }

  console.log(`Found ${products.length} products without thumbnails (limit ${limit})`);

  let success = 0, fail = 0;

  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const progress = `[${i + 1}/${products.length}]`;

    // Skip non-http URLs (app store links etc)
    if (!p.url || (!p.url.startsWith('http://') && !p.url.startsWith('https://'))) {
      console.log(`${progress} SKIP ${p.title} — not a web URL`);
      fail++;
      continue;
    }

    try {
      const publicUrl = await Promise.race([
        screenshotProduct(p.url, p.slug),
        new Promise((_, rej) => setTimeout(() => rej(new Error('Product timeout (30s)')), 30000))
      ]);

      // Update product
      const { error: updateErr } = await sb.from('products')
        .update({ thumbnail_url: publicUrl })
        .eq('id', p.id);

      if (updateErr) throw new Error(`DB update failed: ${updateErr.message}`);

      console.log(`${progress} OK ${p.title} → ${publicUrl.substring(0, 80)}...`);
      success++;
    } catch (err) {
      console.log(`${progress} ERR ${p.title} — ${err.message}`);
      fail++;
    }

    // Small delay between screenshots
    await new Promise(r => setTimeout(r, 500));
  }

  console.log(`\nDone: ${success} success, ${fail} failed, ${products.length} total`);
}

main().catch(console.error);
