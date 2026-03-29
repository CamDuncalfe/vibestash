#!/usr/bin/env node
/**
 * re-screenshot-external.js
 * Re-captures screenshots for products that have external (non-Supabase) thumbnails.
 * Goal: consistent 1280x800 thumbnails for all products.
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
const SKIP_DOMAINS = ['github.com', 'npmjs.com', 'apps.apple.com', 'play.google.com'];

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

    if (uploadErr) throw new Error(`Upload: ${uploadErr.message}`);

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
  // Get products with non-Supabase thumbnails
  const { data: all, error } = await sb.from('products')
    .select('id,title,url,slug,thumbnail_url')
    .eq('approved', true)
    .order('title');

  if (error) { console.error('Query error:', error); return; }

  const products = all.filter(p => p.thumbnail_url && !p.thumbnail_url.includes('supabase'));
  console.log(`Found ${products.length} products with external thumbnails`);

  let success = 0, fail = 0, skipped = 0;

  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const progress = `[${i + 1}/${products.length}]`;

    if (!p.url || (!p.url.startsWith('http://') && !p.url.startsWith('https://'))) {
      console.log(`${progress} SKIP ${p.slug} — not a web URL`);
      skipped++;
      continue;
    }

    try {
      const domain = new URL(p.url).hostname;
      if (SKIP_DOMAINS.some(d => domain === d || domain.endsWith('.' + d))) {
        console.log(`${progress} SKIP ${p.slug} — ${domain}`);
        skipped++;
        continue;
      }
    } catch {
      console.log(`${progress} SKIP ${p.slug} — invalid URL`);
      skipped++;
      continue;
    }

    try {
      const publicUrl = await screenshotProduct(p.url, p.slug);

      const { error: updateErr } = await sb.from('products')
        .update({ thumbnail_url: publicUrl })
        .eq('id', p.id);

      if (updateErr) throw new Error(`DB: ${updateErr.message}`);

      console.log(`${progress} OK ${p.slug}`);
      success++;
    } catch (err) {
      console.log(`${progress} ERR ${p.slug} — ${err.message}`);
      fail++;
    }

    await new Promise(r => setTimeout(r, 800));
  }

  console.log(`\nDone: ${success} OK, ${fail} failed, ${skipped} skipped`);
}

main().catch(console.error);
