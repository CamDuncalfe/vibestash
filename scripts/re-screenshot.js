#!/usr/bin/env node
/**
 * re-screenshot.js
 * Re-captures screenshots for products that have fallback/placeholder thumbnails.
 * Targets products with vibestash.fun/api/og thumbnails (text-only, no product shown).
 * Skips GitHub-only URLs since those aren't screenshotable as products.
 */

const { createClient } = require('@supabase/supabase-js');
const WebSocket = require('ws');

const sb = createClient(
  'https://smfrysqapzwdjfscltmq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZnJ5c3FhcHp3ZGpmc2NsdG1xIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDU1MzU1MiwiZXhwIjoyMDkwMTI5NTUyfQ.6OIb0Currb1nADd3riwFYGp-muQcpsCeH1qycy8P1Tg'
);

const CDP_URL = 'http://127.0.0.1:9222';
const VIEWPORT = { width: 1280, height: 800 };
const LOAD_WAIT = 5000;

// Skip these URLs — they won't produce useful product screenshots
const SKIP_DOMAINS = ['github.com', 'npmjs.com'];

async function getNewTab() {
  const res = await fetch(`${CDP_URL}/json/new`, { method: 'PUT' });
  return await res.json();
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
    setTimeout(() => reject(new Error('WS timeout')), 15000);
  });
}

async function screenshotProduct(url, slug) {
  const tab = await getNewTab();
  const cdp = await cdpConnect(tab.webSocketDebuggerUrl);

  try {
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: VIEWPORT.width,
      height: VIEWPORT.height,
      deviceScaleFactor: 1,
      mobile: false
    });

    await cdp.send('Page.enable');
    await cdp.send('Page.navigate', { url });
    await new Promise(r => setTimeout(r, LOAD_WAIT));

    const { data: screenshotData } = await cdp.send('Page.captureScreenshot', {
      format: 'jpeg',
      quality: 85,
      clip: { x: 0, y: 0, width: VIEWPORT.width, height: VIEWPORT.height, scale: 1 }
    });

    const buffer = Buffer.from(screenshotData, 'base64');
    const filename = `screenshots/${slug}.jpg`;

    const { error: uploadErr } = await sb.storage
      .from('product-videos')
      .upload(filename, buffer, {
        contentType: 'image/jpeg',
        upsert: true
      });

    if (uploadErr) throw new Error(`Upload failed: ${uploadErr.message}`);

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
  // Get products with fallback thumbnails
  const { data: products, error } = await sb.from('products')
    .select('id,title,url,slug,thumbnail_url')
    .eq('approved', true)
    .like('thumbnail_url', '%vibestash.fun/api/og%')
    .order('title');

  if (error) { console.error('Query error:', error); return; }
  console.log(`Found ${products.length} products with fallback thumbnails`);

  let success = 0, fail = 0, skipped = 0;

  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const progress = `[${i + 1}/${products.length}]`;

    // Skip non-web URLs
    if (!p.url || (!p.url.startsWith('http://') && !p.url.startsWith('https://'))) {
      console.log(`${progress} SKIP ${p.title} — not a web URL`);
      skipped++;
      continue;
    }

    // Skip GitHub/npm pages
    const domain = new URL(p.url).hostname;
    if (SKIP_DOMAINS.some(d => domain === d || domain.endsWith('.' + d))) {
      console.log(`${progress} SKIP ${p.title} — ${domain} (not a product page)`);
      skipped++;
      continue;
    }

    try {
      const publicUrl = await screenshotProduct(p.url, p.slug);

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

    await new Promise(r => setTimeout(r, 1000));
  }

  console.log(`\nDone: ${success} success, ${fail} failed, ${skipped} skipped, ${products.length} total`);
}

main().catch(console.error);
