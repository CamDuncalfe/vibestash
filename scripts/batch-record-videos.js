#!/usr/bin/env node
/**
 * Batch record videos for all VibeStash products missing video_url.
 * 
 * For each product:
 * 1. Open URL in a new CDP tab
 * 2. Record 8s of frames (10fps) with gentle scrolling
 * 3. Stitch to MP4 with ffmpeg
 * 4. Upload to Supabase storage (product-videos/recordings/<slug>.mp4)
 * 5. Update product's video_url field
 * 6. Close the tab
 * 
 * Skips: app store URLs, github repos, dead URLs
 * 
 * Usage: node batch-record-videos.js [--limit N] [--start-from slug]
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');
const WebSocket = require('ws');

const CDP_URL = 'http://127.0.0.1:9222';
const SUPA_URL = 'https://smfrysqapzwdjfscltmq.supabase.co';
const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZnJ5c3FhcHp3ZGpmc2NsdG1xIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDU1MzU1MiwiZXhwIjoyMDkwMTI5NTUyfQ.6OIb0Currb1nADd3riwFYGp-muQcpsCeH1qycy8P1Tg';
const WIDTH = 1280;
const HEIGHT = 800;
const FPS = 10;
const DURATION_S = 8;
const TOTAL_FRAMES = FPS * DURATION_S;
const FRAME_INTERVAL_MS = 1000 / FPS;

// URLs we can't screenshot
const SKIP_PATTERNS = [
  'apps.apple.com',
  'play.google.com',
  'github.com/',
  'chrome.google.com/webstore',
  'addons.mozilla.org',
  'marketplace.visualstudio.com'
];

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function fetchJSON(url, options = {}) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    const parsedUrl = new URL(url);
    const reqOpts = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.pathname + parsedUrl.search,
      method: options.method || 'GET',
      headers: options.headers || {}
    };
    const req = mod.request(reqOpts, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, data }); }
      });
    });
    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

async function getProducts() {
  // Get products that need videos (approved, no video_url or broken video)
  const url = `${SUPA_URL}/rest/v1/products?approved=eq.true&video_url=is.null&select=slug,title,url&order=slug.asc`;
  const { data } = await fetchJSON(url, {
    headers: { 'apikey': SUPA_KEY, 'Authorization': `Bearer ${SUPA_KEY}` }
  });
  return data;
}

async function createTab(url) {
  return new Promise((resolve, reject) => {
    const reqUrl = new URL(`${CDP_URL}/json/new?${encodeURIComponent(url)}`);
    const req = http.request({
      hostname: reqUrl.hostname,
      port: reqUrl.port,
      path: reqUrl.pathname + reqUrl.search,
      method: 'PUT'
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch { reject(new Error(`Failed to create tab: ${data}`)); }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function closeTab(targetId) {
  return new Promise((resolve) => {
    const reqUrl = new URL(`${CDP_URL}/json/close/${targetId}`);
    const req = http.request({
      hostname: reqUrl.hostname,
      port: reqUrl.port,
      path: reqUrl.pathname,
      method: 'PUT'
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });
    req.on('error', () => resolve('failed'));
    req.end();
  });
}

function connectCDP(wsUrl) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl);
    let msgId = 1;
    const pending = new Map();
    
    ws.on('open', () => {
      const send = (method, params = {}) => {
        return new Promise((res, rej) => {
          const id = msgId++;
          pending.set(id, { resolve: res, reject: rej });
          ws.send(JSON.stringify({ id, method, params }));
        });
      };
      resolve({ ws, send });
    });
    
    ws.on('message', (raw) => {
      const msg = JSON.parse(raw.toString());
      if (msg.id && pending.has(msg.id)) {
        const { resolve: res, reject: rej } = pending.get(msg.id);
        pending.delete(msg.id);
        if (msg.error) rej(new Error(msg.error.message));
        else res(msg.result);
      }
    });
    
    ws.on('error', reject);
    ws.on('close', () => {
      for (const [, { reject: rej }] of pending) {
        rej(new Error('WebSocket closed'));
      }
      pending.clear();
    });
  });
}

async function recordVideo(url, slug) {
  const tmpDir = fs.mkdtempSync('/tmp/vibestash-vid-');
  const outputPath = path.join(tmpDir, `${slug}.mp4`);
  let tab, ws;
  
  try {
    tab = await createTab(url);
    await sleep(1500);
    
    const cdp = await connectCDP(tab.webSocketDebuggerUrl);
    ws = cdp.ws;
    const send = cdp.send;
    
    await send('Emulation.setDeviceMetricsOverride', {
      width: WIDTH, height: HEIGHT, deviceScaleFactor: 1, mobile: false
    });
    
    await send('Page.enable');
    await sleep(4000); // page load time
    
    // Dismiss common popups/modals
    try {
      await send('Runtime.evaluate', {
        expression: `
          // Try to close cookie banners, modals, etc
          document.querySelectorAll('[class*="cookie"] button, [class*="consent"] button, [class*="modal"] button[class*="close"], [aria-label="Close"], [class*="dismiss"]')
            .forEach(b => b.click());
        `
      });
      await sleep(500);
    } catch {}
    
    // Record frames
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const frameStart = Date.now();
      
      // Gentle scroll every 2 seconds
      if (i > 0 && i % 20 === 0) {
        try {
          await send('Runtime.evaluate', {
            expression: 'window.scrollBy({top: 200, behavior: "smooth"})'
          });
        } catch {}
      }
      
      const result = await send('Page.captureScreenshot', {
        format: 'jpeg',
        quality: 80,
        clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT, scale: 1 }
      });
      
      const framePath = path.join(tmpDir, `frame_${String(i).padStart(4, '0')}.jpg`);
      fs.writeFileSync(framePath, Buffer.from(result.data, 'base64'));
      
      const elapsed = Date.now() - frameStart;
      const wait = FRAME_INTERVAL_MS - elapsed;
      if (wait > 0) await sleep(wait);
    }
    
    // Stitch with ffmpeg
    execSync(
      `ffmpeg -y -framerate ${FPS} -i "${tmpDir}/frame_%04d.jpg" ` +
      `-c:v libx264 -pix_fmt yuv420p -preset fast -crf 23 -movflags +faststart "${outputPath}"`,
      { stdio: 'pipe' }
    );
    
    const stats = fs.statSync(outputPath);
    if (stats.size < 5000) {
      throw new Error(`Video too small (${stats.size}B), probably blank`);
    }
    
    return { path: outputPath, size: stats.size };
    
  } finally {
    if (ws) ws.close();
    if (tab) await closeTab(tab.id);
    // Clean up frame files but keep the MP4
    const files = fs.readdirSync(tmpDir).filter(f => f.endsWith('.jpg'));
    files.forEach(f => fs.unlinkSync(path.join(tmpDir, f)));
  }
}

async function uploadToSupabase(filePath, slug) {
  const objectPath = `recordings/${slug}.mp4`;
  const fileBuffer = fs.readFileSync(filePath);
  
  return new Promise((resolve, reject) => {
    const url = new URL(`${SUPA_URL}/storage/v1/object/product-videos/${objectPath}`);
    const req = https.request({
      hostname: url.hostname,
      path: url.pathname,
      method: 'PUT', // upsert
      headers: {
        'apikey': SUPA_KEY,
        'Authorization': `Bearer ${SUPA_KEY}`,
        'Content-Type': 'video/mp4',
        'Content-Length': fileBuffer.length,
        'x-upsert': 'true'
      }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          const publicUrl = `${SUPA_URL}/storage/v1/object/public/product-videos/${objectPath}`;
          resolve(publicUrl);
        } else {
          reject(new Error(`Upload failed (${res.statusCode}): ${data}`));
        }
      });
    });
    req.on('error', reject);
    req.write(fileBuffer);
    req.end();
  });
}

async function updateVideoUrl(slug, videoUrl) {
  const url = `${SUPA_URL}/rest/v1/products?slug=eq.${slug}`;
  const { status } = await fetchJSON(url, {
    method: 'PATCH',
    headers: {
      'apikey': SUPA_KEY,
      'Authorization': `Bearer ${SUPA_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify({ video_url: videoUrl })
  });
  return status;
}

async function main() {
  const args = process.argv.slice(2);
  const limitIdx = args.indexOf('--limit');
  const limit = limitIdx >= 0 ? parseInt(args[limitIdx + 1]) : Infinity;
  const startIdx = args.indexOf('--start-from');
  const startFrom = startIdx >= 0 ? args[startIdx + 1] : null;
  
  console.log('Fetching products without videos...');
  let products = await getProducts();
  
  if (startFrom) {
    const idx = products.findIndex(p => p.slug === startFrom);
    if (idx >= 0) products = products.slice(idx);
  }
  
  // Filter out non-screenshotable URLs
  products = products.filter(p => {
    const dominated = SKIP_PATTERNS.some(pat => p.url.includes(pat));
    if (dominated) console.log(`SKIP ${p.slug} (${p.url}) — non-screenshotable URL`);
    return !dominated;
  });
  
  const total = Math.min(products.length, limit);
  console.log(`\nRecording ${total} products (${products.length} eligible, limit ${limit === Infinity ? 'none' : limit})\n`);
  
  let success = 0, failed = 0, skipped = 0;
  
  for (let i = 0; i < total; i++) {
    const p = products[i];
    const progress = `[${i + 1}/${total}]`;
    
    try {
      console.log(`${progress} Recording ${p.slug} (${p.url})...`);
      
      const { path: videoPath, size } = await recordVideo(p.url, p.slug);
      console.log(`  Recorded: ${(size / 1024).toFixed(0)}KB`);
      
      const publicUrl = await uploadToSupabase(videoPath, p.slug);
      console.log(`  Uploaded: ${publicUrl}`);
      
      await updateVideoUrl(p.slug, publicUrl);
      console.log(`  ✅ DB updated`);
      
      // Clean up the temp mp4
      try { fs.unlinkSync(videoPath); fs.rmdirSync(path.dirname(videoPath)); } catch {}
      
      success++;
      
      // Brief pause between products to not slam CDP
      await sleep(1000);
      
    } catch (err) {
      console.log(`  ❌ FAILED: ${err.message}`);
      failed++;
    }
  }
  
  console.log(`\n${'='.repeat(50)}`);
  console.log(`Done: ${success} success, ${failed} failed, ${skipped} skipped, ${total} total`);
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
