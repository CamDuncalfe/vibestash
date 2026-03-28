#!/usr/bin/env node

/**
 * Record video clips AND capture thumbnails for VibeStash products.
 * Only targets products that are missing EITHER video OR thumbnail.
 * 
 * Usage: node scripts/record-and-thumb.js [--limit N] [--start N] [--product "title"] [--thumb-only]
 */

const CDP = require('chrome-remote-interface');
const { createClient } = require('@supabase/supabase-js');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://smfrysqapzwdjfscltmq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZnJ5c3FhcHp3ZGpmc2NsdG1xIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDU1MzU1MiwiZXhwIjoyMDkwMTI5NTUyfQ.6OIb0Currb1nADd3riwFYGp-muQcpsCeH1qycy8P1Tg';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const RECORD_DURATION_MS = 4000;
const FRAME_RATE = 12;
const OUTPUT_DIR = '/tmp/vibestash-recordings';
const VIEWPORT_WIDTH = 1280;
const VIEWPORT_HEIGHT = 800;

const args = process.argv.slice(2);
let limit = 50;
let specificProduct = null;
let startFrom = 0;
let thumbOnly = false;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--limit' && args[i + 1]) limit = parseInt(args[i + 1]);
  if (args[i] === '--product' && args[i + 1]) specificProduct = args[i + 1];
  if (args[i] === '--start' && args[i + 1]) startFrom = parseInt(args[i + 1]);
  if (args[i] === '--thumb-only') thumbOnly = true;
}

async function ensureBuckets() {
  for (const bucket of ['product-videos', 'product-thumbnails']) {
    const { error } = await supabase.storage.getBucket(bucket);
    if (error) {
      const { error: createError } = await supabase.storage.createBucket(bucket, {
        public: true,
        fileSizeLimit: bucket === 'product-videos' ? 10 * 1024 * 1024 : 2 * 1024 * 1024,
      });
      if (createError) console.error(`Failed to create ${bucket}:`, createError);
    }
  }
}

async function processProduct(product) {
  const slug = product.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '');
  const framesDir = path.join(OUTPUT_DIR, slug);
  const videoFile = path.join(OUTPUT_DIR, `${slug}.mp4`);
  const thumbFile = path.join(OUTPUT_DIR, `${slug}-thumb.jpg`);

  const needsVideo = !product.video_url && !thumbOnly;
  const needsThumb = !product.thumbnail_url;

  if (!needsVideo && !needsThumb) return 'skip';

  if (fs.existsSync(framesDir)) fs.rmSync(framesDir, { recursive: true });
  fs.mkdirSync(framesDir, { recursive: true });

  let client;
  let targetId;

  try {
    const target = await CDP.New({ port: 9222, url: 'about:blank' });
    targetId = target.id;
    client = await CDP({ port: 9222, target: targetId });
    const { Page, Runtime, Emulation } = client;

    await Page.enable();
    await Emulation.setDeviceMetricsOverride({
      width: VIEWPORT_WIDTH, height: VIEWPORT_HEIGHT,
      deviceScaleFactor: 1, mobile: false,
    });

    await Page.navigate({ url: product.url });
    await new Promise((resolve) => {
      const timeout = setTimeout(resolve, 8000);
      Page.loadEventFired().then(() => { clearTimeout(timeout); setTimeout(resolve, 2000); });
    });

    // Capture thumbnail (higher quality, before scrolling)
    if (needsThumb) {
      const { data: thumbData } = await Page.captureScreenshot({
        format: 'jpeg', quality: 90,
        clip: { x: 0, y: 0, width: VIEWPORT_WIDTH, height: VIEWPORT_HEIGHT, scale: 1 },
      });
      fs.writeFileSync(thumbFile, Buffer.from(thumbData, 'base64'));

      // Upload thumbnail
      const thumbBuffer = fs.readFileSync(thumbFile);
      const thumbPath = `screenshots/${slug}.jpg`;
      const { error: thumbUploadErr } = await supabase.storage
        .from('product-thumbnails')
        .upload(thumbPath, thumbBuffer, { contentType: 'image/jpeg', upsert: true });

      if (!thumbUploadErr) {
        const { data: thumbUrlData } = supabase.storage.from('product-thumbnails').getPublicUrl(thumbPath);
        await supabase.from('products').update({ thumbnail_url: thumbUrlData.publicUrl }).eq('id', product.id);
        console.log(`  📸 Thumbnail: ${thumbUrlData.publicUrl}`);
      }
    }

    // Record video
    if (needsVideo) {
      const totalFrames = Math.floor((RECORD_DURATION_MS / 1000) * FRAME_RATE);
      const frameInterval = 1000 / FRAME_RATE;

      for (let i = 0; i < totalFrames; i++) {
        const { data: screenshotData } = await Page.captureScreenshot({
          format: 'jpeg', quality: 80,
          clip: { x: 0, y: 0, width: VIEWPORT_WIDTH, height: VIEWPORT_HEIGHT, scale: 1 },
        });
        fs.writeFileSync(path.join(framesDir, `frame_${String(i).padStart(4, '0')}.jpg`), Buffer.from(screenshotData, 'base64'));

        if (i === Math.floor(totalFrames / 3)) {
          try { await Runtime.evaluate({ expression: 'window.scrollBy({ top: 200, behavior: "smooth" })' }); } catch {}
        }
        if (i === Math.floor(totalFrames * 2 / 3)) {
          try { await Runtime.evaluate({ expression: 'window.scrollBy({ top: 200, behavior: "smooth" })' }); } catch {}
        }
        await new Promise(r => setTimeout(r, frameInterval));
      }

      execSync(`ffmpeg -y -framerate ${FRAME_RATE} -i "${framesDir}/frame_%04d.jpg" -c:v libx264 -preset fast -crf 28 -pix_fmt yuv420p -vf "scale=640:400" -movflags +faststart "${videoFile}" 2>/dev/null`);

      const fileSize = fs.statSync(videoFile).size;
      const videoBuffer = fs.readFileSync(videoFile);
      const videoPath = `recordings/${slug}.mp4`;

      const { error: vidUploadErr } = await supabase.storage
        .from('product-videos')
        .upload(videoPath, videoBuffer, { contentType: 'video/mp4', upsert: true });

      if (!vidUploadErr) {
        const { data: vidUrlData } = supabase.storage.from('product-videos').getPublicUrl(videoPath);
        await supabase.from('products').update({ video_url: vidUrlData.publicUrl }).eq('id', product.id);
        console.log(`  🎬 Video: ${vidUrlData.publicUrl} (${(fileSize / 1024).toFixed(0)}KB)`);
      }
    }

    return 'ok';
  } catch (e) {
    console.error(`  ❌ Error: ${e.message}`);
    return 'error';
  } finally {
    if (client) await client.close();
    if (targetId) { try { await CDP.Close({ port: 9222, id: targetId }); } catch {} }
    if (fs.existsSync(framesDir)) fs.rmSync(framesDir, { recursive: true });
    if (fs.existsSync(videoFile)) fs.unlinkSync(videoFile);
    if (fs.existsSync(thumbFile)) fs.unlinkSync(thumbFile);
  }
}

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  await ensureBuckets();

  // Get products needing EITHER video or thumbnail
  let query = supabase
    .from('products')
    .select('id, title, url, video_url, thumbnail_url')
    .or('flagged_for_removal.is.null,flagged_for_removal.eq.false')
    .order('title');

  if (specificProduct) {
    query = query.ilike('title', `%${specificProduct}%`);
  }

  const { data: allProducts, error } = await query;
  if (error) { console.error(error); return; }

  // Filter to those needing work
  const products = allProducts.filter(p => {
    if (!p.url) return false;
    if (thumbOnly) return !p.thumbnail_url;
    return !p.video_url || !p.thumbnail_url;
  });

  const batch = products.slice(startFrom, startFrom + limit);
  console.log(`\nProcessing ${batch.length} products (of ${products.length} needing work)\n`);

  let success = 0, failed = 0, skipped = 0;

  for (let i = 0; i < batch.length; i++) {
    console.log(`[${i + 1}/${batch.length}] ${batch[i].title} (${!batch[i].video_url ? '🎬' : ''}${!batch[i].thumbnail_url ? '📸' : ''})`);
    const result = await processProduct(batch[i]);
    if (result === 'ok') success++;
    else if (result === 'error') failed++;
    else skipped++;
    await new Promise(r => setTimeout(r, 500));
  }

  console.log(`\n=== DONE === Success: ${success} | Failed: ${failed} | Skipped: ${skipped} | Remaining: ${products.length - startFrom - batch.length}`);
}

main().catch(console.error);
