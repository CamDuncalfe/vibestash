import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Uses service role key to bypass RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { submissionId } = body;

  if (!submissionId) {
    return NextResponse.json({ error: 'submissionId is required' }, { status: 400 });
  }

  // Fetch the submission
  const { data: submission, error: fetchErr } = await supabase
    .from('submissions')
    .select('*')
    .eq('id', submissionId)
    .single();

  if (fetchErr || !submission) {
    return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
  }

  if (submission.status === 'approved') {
    return NextResponse.json({ error: 'Already approved' }, { status: 400 });
  }

  // Generate slug from product name
  const productName = submission.product_name || new URL(submission.product_url).hostname;
  let slug = slugify(productName);

  // Ensure slug is unique
  const { data: existing } = await supabase
    .from('products')
    .select('slug')
    .eq('slug', slug)
    .single();

  if (existing) {
    slug = `${slug}-${Date.now().toString(36)}`;
  }

  // Try to fetch OG image from the product URL
  let thumbnailUrl: string | null = null;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(submission.product_url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'text/html' },
      redirect: 'follow',
    });
    clearTimeout(timeout);
    if (res.ok) {
      const html = await res.text();
      let match = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i);
      if (!match) match = html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
      if (match?.[1]) {
        thumbnailUrl = match[1].startsWith('/')
          ? `${new URL(submission.product_url).origin}${match[1]}`
          : match[1];
      }
    }
  } catch {
    // Fallback to our OG generator
  }

  if (!thumbnailUrl) {
    const title = encodeURIComponent(productName);
    thumbnailUrl = `https://vibestash.fun/api/og?title=${title}&desc=${encodeURIComponent('Discover on VibeStash')}`;
  }

  // Create the product
  const { data: product, error: insertErr } = await supabase
    .from('products')
    .insert({
      title: productName,
      slug,
      url: submission.product_url,
      maker_name: submission.maker_name || null,
      maker_twitter: submission.maker_url?.includes('x.com/') || submission.maker_url?.includes('twitter.com/')
        ? submission.maker_url.split('/').pop()?.replace('@', '') || null
        : null,
      tools_used: submission.tools_used || [],
      thumbnail_url: thumbnailUrl,
      approved: true,
      description: submission.comments || null,
    })
    .select()
    .single();

  if (insertErr) {
    return NextResponse.json({ error: `Failed to create product: ${insertErr.message}` }, { status: 500 });
  }

  // Update submission status
  await supabase
    .from('submissions')
    .update({
      status: 'approved',
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', submissionId);

  return NextResponse.json({ success: true, product });
}
