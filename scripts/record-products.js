#!/usr/bin/env node

/**
 * Record short video clips of VibeStash products using CDP screencast.
 * 
 * Flow:
 * 1. Open product URL in Chrome via CDP
 * 2. Capture frames using Page.startScreencast
 * 3. Convert frames to webm using ffmpeg
 * 4. Upload to Supabase Storage
 * 5. Update product video_url
 * 
 * Usage: node scripts/record-products.js [--limit N] [--product "title"]
 */

const CDP = require('chrome-remote-interface');
const { createClient } = require('@supabase/supabase-js');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://smfrysqapzwdjfscltmq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZnJ5c3FhcHp3ZGpmc2NsdG1xIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDU1MzU1MiwiZXhwIjoyMDkwMTI5NTUyfQ.6OIb0Currb1nADd3riwFYGp-muQcpsCeH1qycy8P1Tg';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const RECORD_DURATION_MS = 4000;  // 4 second clips
const FRAME_RATE = 12;            // 12 fps for small files
const OUTPUT_DIR = '/tmp/vibestash-recordings';
const VIEWPORT_WIDTH = 1280;
const VIEWPORT_HEIGHT = 800;

// Parse args
const args = process.argv.slice(2);
let limit = 10;
let specificProduct = null;
let startFrom = 0;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--limit' && args[i + 1]) limit = parseInt(args[i + 1]);
  if (args[i] === '--product' && args[i + 1]) specificProduct = args[i + 1];
  if (args[i] === '--start' && args[i + 1]) startFrom = parseInt(args[i + 1]);
}

async function ensureStorageBucket() {
  const { data, error } = await supabase.storage.getBucket('product-videos');
  if (error) {
    console.log('Creating product-videos storage bucket...');
    const { error: createError } = await supabase.storage.createBucket('product-videos', {
      public: true,
      fileSizeLimit: 10 * 1024 * 1024, // 10MB max
    });
    if (createError) {
      console.error('Failed to create bucket:', createError);
      return false;
    }
  }
  return true;
}

async function recordProduct(product) {
  const slug = product.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '');
  const framesDir = path.join(OUTPUT_DIR, slug);
  const outputFile = path.join(OUTPUT_DIR, `${slug}.mp4`);

  // Clean up any previous attempt
  if (fs.existsSync(framesDir)) fs.rmSync(framesDir, { recursive: true });
  fs.mkdirSync(framesDir, { recursive: true });

  let client;
  let targetId;

  try {
    // Create a new tab
    const target = await CDP.New({ port: 9222, url: 'about:blank' });
    targetId = target.id;

    client = await CDP({ port: 9222, target: targetId });
    const { Page, Runtime, Emulation } = client;

    await Page.enable();

    // Set viewport
    await Emulation.setDeviceMetricsOverride({
      width: VIEWPORT_WIDTH,
      height: VIEWPORT_HEIGHT,
      deviceScaleFactor: 1,
      mobile: false,
    });

    // Navigate to the product
    console.log(`  Loading ${product.url}...`);
    await Page.navigate({ url: product.url });
    
    // Wait for page load
    await new Promise((resolve) => {
      const timeout = setTimeout(resolve, 8000);
      Page.loadEventFired().then(() => {
        clearTimeout(timeout);
        setTimeout(resolve, 2000); // Extra 2s for animations
      });
    });

    // Capture frames using Page.captureScreenshot in a loop
    console.log(`  Recording ${RECORD_DURATION_MS / 1000}s clip...`);
    const totalFrames = Math.floor((RECORD_DURATION_MS / 1000) * FRAME_RATE);
    const frameInterval = 1000 / FRAME_RATE;

    for (let i = 0; i < totalFrames; i++) {
      const { data: screenshotData } = await Page.captureScreenshot({
        format: 'jpeg',
        quality: 80,
        clip: {
          x: 0, y: 0,
          width: VIEWPORT_WIDTH,
          height: VIEWPORT_HEIGHT,
          scale: 1,
        },
      });

      const framePath = path.join(framesDir, `frame_${String(i).padStart(4, '0')}.jpg`);
      fs.writeFileSync(framePath, Buffer.from(screenshotData, 'base64'));

      // Try to interact slightly (scroll down a bit) mid-recording
      if (i === Math.floor(totalFrames / 3)) {
        try {
          await Runtime.evaluate({
            expression: 'window.scrollBy({ top: 200, behavior: "smooth" })',
          });
        } catch {}
      }
      if (i === Math.floor(totalFrames * 2 / 3)) {
        try {
          await Runtime.evaluate({
            expression: 'window.scrollBy({ top: 200, behavior: "smooth" })',
          });
        } catch {}
      }

      await new Promise(r => setTimeout(r, frameInterval));
    }

    // Convert frames to mp4 with ffmpeg
    console.log(`  Converting to mp4...`);
    const ffmpegCmd = `ffmpeg -y -framerate ${FRAME_RATE} -i "${framesDir}/frame_%04d.jpg" -c:v libx264 -preset fast -crf 28 -pix_fmt yuv420p -vf "scale=640:400" -movflags +faststart "${outputFile}" 2>/dev/null`;
    execSync(ffmpegCmd);

    const fileSize = fs.statSync(outputFile).size;
    console.log(`  Video size: ${(fileSize / 1024).toFixed(0)}KB`);

    // Upload to Supabase Storage
    console.log(`  Uploading to Supabase Storage...`);
    const fileBuffer = fs.readFileSync(outputFile);
    const storagePath = `recordings/${slug}.mp4`;

    const { error: uploadError } = await supabase.storage
      .from('product-videos')
      .upload(storagePath, fileBuffer, {
        contentType: 'video/mp4',
        upsert: true,
      });

    if (uploadError) {
      console.error(`  Upload failed: ${uploadError.message}`);
      return null;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('product-videos')
      .getPublicUrl(storagePath);

    const publicUrl = urlData.publicUrl;
    console.log(`  Public URL: ${publicUrl}`);

    // Update product
    const { error: updateError } = await supabase
      .from('products')
      .update({ video_url: publicUrl })
      .eq('id', product.id);

    if (updateError) {
      console.error(`  DB update failed: ${updateError.message}`);
      return null;
    }

    return publicUrl;

  } catch (e) {
    console.error(`  Error recording ${product.title}: ${e.message}`);
    return null;
  } finally {
    if (client) await client.close();
    // Close the tab
    if (targetId) {
      try { await CDP.Close({ port: 9222, id: targetId }); } catch {}
    }
    // Cleanup temp files
    if (fs.existsSync(framesDir)) fs.rmSync(framesDir, { recursive: true });
    if (fs.existsSync(outputFile)) fs.unlinkSync(outputFile);
  }
}

async function main() {
  // Ensure output dir
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // Ensure bucket
  const bucketOk = await ensureStorageBucket();
  if (!bucketOk) return;

  // Get products needing videos
  let query = supabase
    .from('products')
    .select('id, title, url, slug')
    .is('video_url', null)
    .or('flagged_for_removal.is.null,flagged_for_removal.eq.false')
    .order('title');

  if (specificProduct) {
    query = query.ilike('title', `%${specificProduct}%`);
  }

  const { data: products, error } = await query;
  if (error) { console.error(error); return; }

  const batch = products.slice(startFrom, startFrom + limit);
  console.log(`\nRecording ${batch.length} products (of ${products.length} total needing videos)\n`);

  let success = 0;
  let failed = 0;

  for (let i = 0; i < batch.length; i++) {
    const product = batch[i];
    console.log(`\n[${i + 1}/${batch.length}] ${product.title}`);
    
    const result = await recordProduct(product);
    if (result) {
      success++;
    } else {
      failed++;
    }

    // Small delay between recordings
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log(`\n=== RECORDING COMPLETE ===`);
  console.log(`Success: ${success}`);
  console.log(`Failed: ${failed}`);
  console.log(`Remaining: ${products.length - startFrom - batch.length}`);
}

main().catch(console.error);
