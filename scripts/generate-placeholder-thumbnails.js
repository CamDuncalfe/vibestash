#!/usr/bin/env node
// Generate colorful SVG placeholder thumbnails for products without thumbnails
// Uploads to Supabase Storage and updates product records
// Run: node scripts/generate-placeholder-thumbnails.js

const SUPABASE_URL = 'https://smfrysqapzwdjfscltmq.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZnJ5c3FhcHp3ZGpmc2NsdG1xIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDU1MzU1MiwiZXhwIjoyMDkwMTI5NTUyfQ.6OIb0Currb1nADd3riwFYGp-muQcpsCeH1qycy8P1Tg';

// Color palettes for gradients
const PALETTES = [
  ['#667eea', '#764ba2'],  // Purple dream
  ['#f093fb', '#f5576c'],  // Pink sunset
  ['#4facfe', '#00f2fe'],  // Ocean blue
  ['#43e97b', '#38f9d7'],  // Fresh green
  ['#fa709a', '#fee140'],  // Peach glow
  ['#a18cd1', '#fbc2eb'],  // Lavender mist
  ['#fccb90', '#d57eeb'],  // Warm aurora
  ['#e0c3fc', '#8ec5fc'],  // Soft sky
  ['#f5576c', '#ff9a76'],  // Coral fire
  ['#667eea', '#43e97b'],  // Cool mint
  ['#ff9a9e', '#fecfef'],  // Rose quartz
  ['#a1c4fd', '#c2e9fb'],  // Ice blue
  ['#fbc2eb', '#a6c1ee'],  // Cotton candy
  ['#ff6b6b', '#feca57'],  // Hot lemon
  ['#48dbfb', '#ff9ff3'],  // Bubblegum
];

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function generateSVG(title, slug) {
  const hash = hashString(slug);
  const palette = PALETTES[hash % PALETTES.length];
  const angle = (hash % 360);

  // Truncate title for display
  const displayTitle = title.length > 20 ? title.substring(0, 18) + '…' : title;
  const fontSize = displayTitle.length > 14 ? 28 : 36;

  // Generate some decorative shapes
  const shapes = [];
  for (let i = 0; i < 5; i++) {
    const cx = ((hash * (i + 1) * 137) % 800);
    const cy = ((hash * (i + 1) * 251) % 400);
    const r = 30 + ((hash * (i + 1)) % 60);
    const opacity = 0.08 + ((hash * (i + 1)) % 10) / 100;
    shapes.push(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="white" opacity="${opacity}"/>`);
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%" gradientTransform="rotate(${angle})">
      <stop offset="0%" style="stop-color:${palette[0]}"/>
      <stop offset="100%" style="stop-color:${palette[1]}"/>
    </linearGradient>
  </defs>
  <rect width="800" height="400" fill="url(#bg)"/>
  ${shapes.join('\n  ')}
  <text x="400" y="185" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="${fontSize}" font-weight="700" fill="white" opacity="0.95">${escapeXml(displayTitle)}</text>
  <text x="400" y="230" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="16" fill="white" opacity="0.6">vibestash.com</text>
</svg>`;
}

function escapeXml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

async function getProductsWithoutThumbnails() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/products?select=id,slug,title&thumbnail_url=is.null&order=created_at.asc`,
    {
      headers: {
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
      }
    }
  );
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to fetch products: ${err}`);
  }
  return res.json();
}

async function uploadSVG(slug, svgContent) {
  const path = `thumbnails/${slug}.svg`;
  const buffer = Buffer.from(svgContent, 'utf-8');

  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/screenshots/${path}`, {
    method: 'POST',
    headers: {
      'apikey': SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': 'image/svg+xml',
      'x-upsert': 'true'
    },
    body: buffer
  });

  if (!res.ok) {
    const err = await res.text();
    console.log(`  ❌ Upload failed for ${slug}: ${err}`);
    return null;
  }

  return `${SUPABASE_URL}/storage/v1/object/public/screenshots/${path}`;
}

async function updateProduct(id, thumbnailUrl) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${id}`, {
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
  console.log('🔍 Fetching products without thumbnails...');
  const products = await getProductsWithoutThumbnails();
  console.log(`  Found ${products.length} products needing thumbnails\n`);

  if (products.length === 0) {
    console.log('✅ All products already have thumbnails!');
    return;
  }

  let success = 0;
  let failed = 0;

  for (const product of products) {
    console.log(`🎨 ${product.title} (${product.slug})`);

    const svg = generateSVG(product.title, product.slug);
    const publicUrl = await uploadSVG(product.slug, svg);

    if (publicUrl) {
      const updated = await updateProduct(product.id, publicUrl);
      if (updated) {
        console.log(`  ✅ ${publicUrl}`);
        success++;
      } else {
        console.log(`  ❌ Failed to update product record`);
        failed++;
      }
    } else {
      failed++;
    }
  }

  console.log(`\n🏁 Done! ${success} thumbnails generated, ${failed} failed`);
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
