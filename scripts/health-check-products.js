#!/usr/bin/env node
/**
 * Health check all approved products — flag any with dead URLs.
 * Reports: live, dead (4xx/5xx/timeout), redirect, and connection refused.
 */

const SUPABASE_URL = 'https://smfrysqapzwdjfscltmq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZnJ5c3FhcHp3ZGpmc2NsdG1xIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDU1MzU1MiwiZXhwIjoyMDkwMTI5NTUyfQ.6OIb0Currb1nADd3riwFYGp-muQcpsCeH1qycy8P1Tg';

async function checkUrl(url) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' },
      redirect: 'follow'
    });
    clearTimeout(timeout);
    return { status: res.status, ok: res.ok, finalUrl: res.url };
  } catch (e) {
    if (e.name === 'AbortError') return { status: 'TIMEOUT', ok: false };
    return { status: `ERROR: ${e.message?.substring(0, 50)}`, ok: false };
  }
}

async function main() {
  // Fetch all approved, non-flagged products
  let allProducts = [];
  let offset = 0;
  while (true) {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/products?select=id,slug,title,url&approved=eq.true&or=(flagged_for_removal.is.null,flagged_for_removal.eq.false)&order=slug&offset=${offset}&limit=100`,
      {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      }
    );
    const batch = await res.json();
    if (!batch.length) break;
    allProducts = allProducts.concat(batch);
    offset += 100;
  }

  console.log(`Checking ${allProducts.length} approved products...\n`);

  const dead = [];
  const timeout = [];
  const errors = [];
  let live = 0;

  // Process in batches of 10 for speed
  for (let i = 0; i < allProducts.length; i += 10) {
    const batch = allProducts.slice(i, i + 10);
    const results = await Promise.all(
      batch.map(async (p) => {
        const result = await checkUrl(p.url);
        return { ...p, result };
      })
    );

    for (const r of results) {
      if (r.result.ok) {
        live++;
      } else if (r.result.status === 'TIMEOUT') {
        console.log(`⏱️  TIMEOUT: ${r.slug} → ${r.url}`);
        timeout.push(r);
      } else if (typeof r.result.status === 'number' && r.result.status >= 400) {
        console.log(`💀 DEAD (${r.result.status}): ${r.slug} → ${r.url}`);
        dead.push(r);
      } else {
        console.log(`⚠️  ERROR: ${r.slug} → ${r.url} (${r.result.status})`);
        errors.push(r);
      }
    }
  }

  console.log(`\n=== HEALTH CHECK RESULTS ===`);
  console.log(`✅ Live: ${live}`);
  console.log(`💀 Dead (4xx/5xx): ${dead.length}`);
  console.log(`⏱️  Timeout: ${timeout.length}`);
  console.log(`⚠️  Errors: ${errors.length}`);

  if (dead.length > 0) {
    console.log(`\n--- DEAD PRODUCTS (should remove) ---`);
    for (const d of dead) {
      console.log(`  ${d.slug}: ${d.url} (${d.result.status})`);
    }
  }

  if (timeout.length > 0) {
    console.log(`\n--- TIMEOUT PRODUCTS (investigate) ---`);
    for (const t of timeout) {
      console.log(`  ${t.slug}: ${t.url}`);
    }
  }

  if (errors.length > 0) {
    console.log(`\n--- ERROR PRODUCTS (investigate) ---`);
    for (const e of errors) {
      console.log(`  ${e.slug}: ${e.url} (${e.result.status})`);
    }
  }
}

main().catch(console.error);
