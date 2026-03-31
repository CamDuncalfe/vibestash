#!/usr/bin/env node
/**
 * Interactive video recorder for VibeStash products.
 * 
 * Records CDP sessions with real interaction (clicks, scrolls, typing, mouse moves).
 * Each product gets a custom interaction script defined inline.
 * 
 * Usage: node interactive-record.js <slug> <url> [--duration 10]
 * 
 * Interaction is controlled via a sequence of CDP commands injected during recording.
 * The interaction plan is passed as a JSON file or inline argument.
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
const FPS = 12;

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function createTab(url) {
  return new Promise((resolve, reject) => {
    const reqUrl = new URL(`${CDP_URL}/json/new?${encodeURIComponent(url)}`);
    const req = http.request({
      hostname: reqUrl.hostname, port: reqUrl.port,
      path: reqUrl.pathname + reqUrl.search, method: 'PUT'
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

function closeTab(targetId) {
  return new Promise((resolve) => {
    const req = http.request({
      hostname: '127.0.0.1', port: 9222,
      path: `/json/close/${targetId}`, method: 'PUT'
    }, res => { let d = ''; res.on('data', c => d += c); res.on('end', () => resolve(d)); });
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
      const send = (method, params = {}) => new Promise((res, rej) => {
        const id = msgId++;
        pending.set(id, { resolve: res, reject: rej });
        ws.send(JSON.stringify({ id, method, params }));
      });
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
      for (const [, { reject: rej }] of pending) rej(new Error('WS closed'));
      pending.clear();
    });
  });
}

// Mouse helpers
async function mouseClick(send, x, y, button = 'left') {
  await send('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button, clickCount: 1 });
  await sleep(50);
  await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button, clickCount: 1 });
}

async function mouseMove(send, x, y) {
  await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y });
}

async function mouseDrag(send, x1, y1, x2, y2, steps = 10) {
  await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: x1, y: y1, button: 'left', clickCount: 1 });
  for (let i = 1; i <= steps; i++) {
    const x = x1 + (x2 - x1) * (i / steps);
    const y = y1 + (y2 - y1) * (i / steps);
    await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y, button: 'left' });
    await sleep(30);
  }
  await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: x2, y: y2, button: 'left', clickCount: 1 });
}

async function typeText(send, text) {
  for (const char of text) {
    await send('Input.dispatchKeyEvent', { type: 'keyDown', text: char });
    await send('Input.dispatchKeyEvent', { type: 'keyUp', text: char });
    await sleep(80);
  }
}

async function pressKey(send, key, code) {
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key, code, windowsVirtualKeyCode: 0 });
  await sleep(50);
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key, code, windowsVirtualKeyCode: 0 });
}

async function scrollDown(send, x, y, deltaY = 200) {
  await send('Input.dispatchMouseEvent', { type: 'mouseWheel', x, y, deltaX: 0, deltaY });
}

/**
 * Execute an interaction plan during recording.
 * Plan format: array of actions with timing
 * [
 *   { at: 0, action: 'wait' },  // just wait (page loads)
 *   { at: 2000, action: 'click', x: 640, y: 400 },
 *   { at: 3000, action: 'move', x: 800, y: 300 },
 *   { at: 4000, action: 'scroll', y: 300 },
 *   { at: 5000, action: 'type', text: 'hello world' },
 *   { at: 6000, action: 'key', key: 'Enter', code: 'Enter' },
 *   { at: 7000, action: 'eval', expr: 'document.querySelector("button").click()' },
 *   { at: 8000, action: 'drag', x1: 100, y1: 100, x2: 500, y2: 400 },
 * ]
 */
async function executeInteractions(send, plan, startTime) {
  for (const step of plan) {
    const elapsed = Date.now() - startTime;
    const wait = step.at - elapsed;
    if (wait > 0) await sleep(wait);
    
    try {
      switch (step.action) {
        case 'wait': break;
        case 'click': await mouseClick(send, step.x, step.y); break;
        case 'move': await mouseMove(send, step.x, step.y); break;
        case 'drag': await mouseDrag(send, step.x1, step.y1, step.x2, step.y2, step.steps); break;
        case 'scroll': await scrollDown(send, step.x || 640, step.y || 400, step.delta || 200); break;
        case 'type': await typeText(send, step.text); break;
        case 'key': await pressKey(send, step.key, step.code || step.key); break;
        case 'eval': await send('Runtime.evaluate', { expression: step.expr }); break;
        case 'clicks': // rapid clicks at different positions
          for (const pos of step.positions) {
            await mouseClick(send, pos[0], pos[1]);
            await sleep(step.delay || 200);
          }
          break;
      }
    } catch (e) {
      console.log(`  [interaction] ${step.action} failed: ${e.message}`);
    }
  }
}

async function record(slug, url, durationS, plan) {
  const tmpDir = fs.mkdtempSync('/tmp/vibestash-vid-');
  const outputPath = path.join(tmpDir, `${slug}.mp4`);
  const totalFrames = FPS * durationS;
  const frameInterval = 1000 / FPS;
  let tab, ws;
  
  try {
    console.log(`  Opening ${url}...`);
    tab = await createTab(url);
    await sleep(1500);
    
    const cdp = await connectCDP(tab.webSocketDebuggerUrl);
    ws = cdp.ws;
    const send = cdp.send;
    
    await send('Emulation.setDeviceMetricsOverride', {
      width: WIDTH, height: HEIGHT, deviceScaleFactor: 1, mobile: false
    });
    await send('Page.enable');
    
    // Wait for page to load
    console.log(`  Waiting for page load...`);
    await sleep(4000);
    
    // Dismiss popups
    try {
      await send('Runtime.evaluate', {
        expression: `document.querySelectorAll('[class*="cookie"] button, [class*="consent"] button, [class*="modal"] button[class*="close"], [aria-label="Close"], [class*="dismiss"]').forEach(b => b.click());`
      });
      await sleep(300);
    } catch {}
    
    console.log(`  Recording ${durationS}s at ${FPS}fps (${totalFrames} frames)...`);
    
    const startTime = Date.now();
    
    // Start interactions in background
    const interactionPromise = executeInteractions(send, plan, startTime);
    
    // Capture frames
    for (let i = 0; i < totalFrames; i++) {
      const frameStart = Date.now();
      
      const result = await send('Page.captureScreenshot', {
        format: 'jpeg', quality: 80,
        clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT, scale: 1 }
      });
      
      const framePath = path.join(tmpDir, `frame_${String(i).padStart(4, '0')}.jpg`);
      fs.writeFileSync(framePath, Buffer.from(result.data, 'base64'));
      
      const elapsed = Date.now() - frameStart;
      const wait = frameInterval - elapsed;
      if (wait > 0) await sleep(wait);
    }
    
    await interactionPromise;
    
    // Stitch with ffmpeg
    console.log(`  Stitching with ffmpeg...`);
    execSync(
      `ffmpeg -y -framerate ${FPS} -i "${tmpDir}/frame_%04d.jpg" ` +
      `-c:v libx264 -pix_fmt yuv420p -preset fast -crf 23 -movflags +faststart "${outputPath}"`,
      { stdio: 'pipe' }
    );
    
    let stats = fs.statSync(outputPath);
    console.log(`  Video: ${(stats.size / 1024).toFixed(0)}KB`);
    
    // Compress if too large (>5MB)
    if (stats.size > 5 * 1024 * 1024) {
      console.log(`  Compressing (${(stats.size / 1024 / 1024).toFixed(1)}MB > 5MB limit)...`);
      const compressedPath = outputPath.replace('.mp4', '-compressed.mp4');
      execSync(
        `ffmpeg -y -i "${outputPath}" -vf "scale=720:-2" -c:v libx264 -preset medium -crf 30 -movflags +faststart "${compressedPath}"`,
        { stdio: 'pipe' }
      );
      fs.unlinkSync(outputPath);
      fs.renameSync(compressedPath, outputPath);
      stats = fs.statSync(outputPath);
      console.log(`  Compressed: ${(stats.size / 1024).toFixed(0)}KB`);
    }
    
    // Clean up frames
    fs.readdirSync(tmpDir).filter(f => f.endsWith('.jpg')).forEach(f => fs.unlinkSync(path.join(tmpDir, f)));
    
    return { path: outputPath, size: stats.size, tmpDir };
    
  } finally {
    if (ws) ws.close();
    if (tab) await closeTab(tab.id);
  }
}

async function uploadToSupabase(filePath, slug) {
  const objectPath = `recordings/${slug}.mp4`;
  const fileBuffer = fs.readFileSync(filePath);
  return new Promise((resolve, reject) => {
    const url = new URL(`${SUPA_URL}/storage/v1/object/product-videos/${objectPath}`);
    const req = https.request({
      hostname: url.hostname, path: url.pathname, method: 'PUT',
      headers: {
        'apikey': SUPA_KEY, 'Authorization': `Bearer ${SUPA_KEY}`,
        'Content-Type': 'video/mp4', 'Content-Length': fileBuffer.length,
        'x-upsert': 'true'
      }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(`${SUPA_URL}/storage/v1/object/public/product-videos/${objectPath}`);
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
  return new Promise((resolve, reject) => {
    const url = new URL(`${SUPA_URL}/rest/v1/products?slug=eq.${slug}`);
    const body = JSON.stringify({ video_url: videoUrl });
    const req = https.request({
      hostname: url.hostname, path: url.pathname + url.search, method: 'PATCH',
      headers: {
        'apikey': SUPA_KEY, 'Authorization': `Bearer ${SUPA_KEY}`,
        'Content-Type': 'application/json', 'Prefer': 'return=minimal'
      }
    }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(res.statusCode));
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  const args = process.argv.slice(2);
  const slug = args[0];
  const url = args[1];
  const durationIdx = args.indexOf('--duration');
  const duration = durationIdx >= 0 ? parseInt(args[durationIdx + 1]) : 10;
  const planIdx = args.indexOf('--plan');
  const planFile = planIdx >= 0 ? args[planIdx + 1] : null;
  
  if (!slug || !url) {
    console.log('Usage: node interactive-record.js <slug> <url> [--duration N] [--plan plan.json]');
    process.exit(1);
  }
  
  let plan = [];
  if (planFile) {
    plan = JSON.parse(fs.readFileSync(planFile, 'utf8'));
  } else if (args.indexOf('--plan-inline') >= 0) {
    plan = JSON.parse(args[args.indexOf('--plan-inline') + 1]);
  }
  
  console.log(`Recording ${slug} (${url}) for ${duration}s with ${plan.length} interactions...`);
  
  const { path: videoPath, size, tmpDir } = await record(slug, url, duration, plan);
  
  console.log(`Uploading to Supabase...`);
  const publicUrl = await uploadToSupabase(videoPath, slug);
  console.log(`Uploaded: ${publicUrl}`);
  
  const status = await updateVideoUrl(slug, publicUrl);
  console.log(`DB updated (${status})`);
  
  // Cleanup
  try { fs.unlinkSync(videoPath); fs.rmdirSync(tmpDir); } catch {}
  
  console.log(`✅ Done: ${slug}`);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
