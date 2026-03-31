#!/usr/bin/env node
/**
 * Record a ~8 second video of a product page using CDP screencast.
 * Takes CDP screenshots at intervals, then stitches with ffmpeg.
 * 
 * Usage: node record-product-video.js <url> <output.mp4> [--scroll] [--click selector]
 * 
 * Outputs MP4 at 1280x800, 10fps, ~8 seconds.
 */

const http = require('http');
const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');
const WebSocket = require('ws');

const CDP_URL = 'http://127.0.0.1:9222';
const WIDTH = 1280;
const HEIGHT = 800;
const FPS = 10;
const DURATION_S = 8;
const TOTAL_FRAMES = FPS * DURATION_S;
const FRAME_INTERVAL_MS = 1000 / FPS;

async function getTargets() {
  return new Promise((resolve, reject) => {
    http.get(`${CDP_URL}/json/list`, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
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
      res.on('end', () => resolve(JSON.parse(data)));
    });
    req.on('error', reject);
    req.end();
  });
}

async function closeTab(targetId) {
  return new Promise((resolve) => {
    http.get(`${CDP_URL}/json/close/${targetId}`, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', () => resolve('failed'));
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
    
    ws.on('message', (data) => {
      const msg = JSON.parse(data.toString());
      if (msg.id && pending.has(msg.id)) {
        const { resolve: res, reject: rej } = pending.get(msg.id);
        pending.delete(msg.id);
        if (msg.error) rej(new Error(msg.error.message));
        else res(msg.result);
      }
    });
    
    ws.on('error', reject);
  });
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  const url = process.argv[2];
  const outputPath = process.argv[3];
  const doScroll = process.argv.includes('--scroll');
  
  if (!url || !outputPath) {
    console.error('Usage: node record-product-video.js <url> <output.mp4> [--scroll]');
    process.exit(1);
  }
  
  const tmpDir = fs.mkdtempSync('/tmp/vibestash-video-');
  
  try {
    // Create a new tab
    console.log(`Opening ${url}...`);
    const tab = await createTab(url);
    const targetId = tab.id;
    
    await sleep(1000); // let tab initialize
    
    // Connect via CDP
    const { ws, send } = await connectCDP(tab.webSocketDebuggerUrl);
    
    // Set viewport
    await send('Emulation.setDeviceMetricsOverride', {
      width: WIDTH,
      height: HEIGHT,
      deviceScaleFactor: 1,
      mobile: false
    });
    
    // Wait for page load
    await send('Page.enable');
    await sleep(4000); // give page time to load and render
    
    console.log(`Recording ${TOTAL_FRAMES} frames at ${FPS}fps...`);
    
    // Capture frames
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const frameStart = Date.now();
      
      // Scroll slightly every 20 frames (every 2 seconds)
      if (doScroll && i > 0 && i % 20 === 0) {
        await send('Runtime.evaluate', {
          expression: 'window.scrollBy({top: 200, behavior: "smooth"})'
        });
      }
      
      // Take screenshot
      const result = await send('Page.captureScreenshot', {
        format: 'jpeg',
        quality: 80,
        clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT, scale: 1 }
      });
      
      const framePath = path.join(tmpDir, `frame_${String(i).padStart(4, '0')}.jpg`);
      fs.writeFileSync(framePath, Buffer.from(result.data, 'base64'));
      
      // Maintain frame timing
      const elapsed = Date.now() - frameStart;
      const waitTime = FRAME_INTERVAL_MS - elapsed;
      if (waitTime > 0) await sleep(waitTime);
    }
    
    console.log('Stitching frames with ffmpeg...');
    
    // Stitch with ffmpeg
    execSync(`ffmpeg -y -framerate ${FPS} -i "${tmpDir}/frame_%04d.jpg" -c:v libx264 -pix_fmt yuv420p -preset fast -crf 23 -movflags +faststart "${outputPath}"`, {
      stdio: 'pipe'
    });
    
    const stats = fs.statSync(outputPath);
    console.log(`Done! ${outputPath} (${(stats.size / 1024).toFixed(0)}KB)`);
    
    // Close the tab
    ws.close();
    await closeTab(targetId);
    
  } finally {
    // Cleanup frames
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
