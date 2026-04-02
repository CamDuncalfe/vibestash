import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import type { Product } from '@/types';
import { ProductGrid } from '@/components/products/ProductGrid';

import { LikeButton } from '@/components/products/LikeButton';
import { UpvoteButton } from '@/components/products/UpvoteButton';
import { ProductMedia } from '@/components/products/ProductMedia';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: product } = await supabase
    .from('products')
    .select('title, description, thumbnail_url')
    .eq('slug', slug)
    .eq('approved', true)
    .single();

  if (!product) return { title: 'Product Not Found' };

  const desc = product.description || `Check out ${product.title} on VibeStash.`;
  const ogImage = product.thumbnail_url
    || `/api/og?title=${encodeURIComponent(product.title)}&desc=${encodeURIComponent(desc.substring(0, 100))}`;

  return {
    title: `${product.title} — VibeStash`,
    description: desc,
    openGraph: {
      title: product.title,
      description: desc,
      images: [ogImage],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.title,
      description: desc,
      images: [ogImage],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('approved', true)
    .single();

  if (!product) notFound();

  const p = product as Product;

  fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/views`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId: p.id }),
  }).catch(() => {});

  let similarProducts: Product[] = [];
  if (p.categories.length > 0) {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('approved', true)
      .or('flagged_for_removal.is.null,flagged_for_removal.eq.false')
      .neq('id', p.id)
      .overlaps('categories', p.categories)
      .limit(3);
    if (data) similarProducts = data as Product[];
  }

  // allScreenshots kept for ProductMedia fallback
  const allScreenshots = p.screenshots.filter((s) => s !== p.thumbnail_url);

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: p.title,
    url: p.url,
    applicationCategory: p.categories[0] || "WebApplication",
  };
  if (p.description) jsonLd.description = p.description;
  if (p.thumbnail_url) jsonLd.image = p.thumbnail_url;
  if (p.released_at) jsonLd.datePublished = p.released_at;
  if (p.maker_name) {
    const author: Record<string, string> = { "@type": "Person", name: p.maker_name };
    if (p.maker_twitter) {
      author.url = `https://x.com/${p.maker_twitter.replace("@", "")}`;
    } else if (p.maker_url) {
      author.url = p.maker_url;
    }
    jsonLd.author = author;
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-mbogray-400 dark:text-mbogray-500 hover:text-mbogray-800 dark:hover:text-mbogray-200 transition-colors mb-8"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
          Back to all products
        </Link>

        <div className="mb-8">
          <ProductMedia
            videoUrl={p.video_url}
            thumbnailUrl={p.thumbnail_url}
            screenshots={allScreenshots}
            title={p.title}
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold text-mbogray-900 dark:text-white">{p.title}</h1>
          <a
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white text-sm font-medium rounded-full hover:bg-accent-hover transition-colors shrink-0"
          >
            Visit
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>

        {p.description && (
          <p className="text-mbogray-600 dark:text-mbogray-400 leading-relaxed mb-8 whitespace-pre-line">
            {p.description}
          </p>
        )}

        {p.tools_used.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-mbogray-800 dark:text-mbogray-200 uppercase tracking-wide mb-2">
              Built with
            </h2>
            <div className="flex flex-wrap gap-2">
              {p.tools_used.map((tool) => (
                <span key={tool} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-mbogray-100 dark:bg-mbogray-800 text-mbogray-700 dark:text-mbogray-300">{tool}</span>
              ))}
            </div>
          </div>
        )}

        {p.tech_stack.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-mbogray-800 dark:text-mbogray-200 uppercase tracking-wide mb-2">
              Tech stack
            </h2>
            <div className="flex flex-wrap gap-2">
              {p.tech_stack.map((tech) => (
                <span
                  key={tech}
                  className="text-xs font-medium px-2.5 py-1 rounded-full bg-mbogray-100 dark:bg-mbogray-800 text-mbogray-600 dark:text-mbogray-400"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {p.categories.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-mbogray-800 dark:text-mbogray-200 uppercase tracking-wide mb-2">
              Categories
            </h2>
            <div className="flex flex-wrap gap-2">
              {p.categories.map((cat) => (
                <span
                  key={cat}
                  className="text-xs font-medium px-2.5 py-1 rounded-full bg-accent/10 text-accent"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>
        )}

        {p.released_at && (
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-mbogray-800 dark:text-mbogray-200 uppercase tracking-wide mb-2">
              Released
            </h2>
            <p className="text-sm text-mbogray-600 dark:text-mbogray-400">
              {new Date(p.released_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        )}

        {(p.maker_name || p.maker_twitter) && (
          <div className="mb-8 flex items-center gap-3">
            {p.maker_avatar_url && (
              <div className="relative w-10 h-10 rounded-full overflow-hidden bg-mbogray-100 dark:bg-mbogray-700">
                <Image
                  src={p.maker_avatar_url}
                  alt={p.maker_name || 'Maker'}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
            )}
            <div>
              <p className="text-sm text-mbogray-400 dark:text-mbogray-500">Made by</p>
              <div className="flex items-center gap-2">
                {p.maker_url ? (
                  <a
                    href={p.maker_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-mbogray-800 dark:text-mbogray-200 hover:text-accent transition-colors"
                  >
                    {p.maker_name || 'Unknown'}
                </a>
              ) : (
                <p className="text-sm font-medium text-mbogray-800 dark:text-mbogray-200">{p.maker_name || 'Unknown'}</p>
              )}
              {p.maker_twitter && (
                <a
                  href={`https://x.com/${p.maker_twitter.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-accent hover:underline"
                >
                  {p.maker_twitter}
                </a>
              )}
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 mb-8">
          <UpvoteButton productId={p.id} initialCount={p.upvotes_count} />
          <LikeButton productId={p.id} initialCount={p.likes_count} />
        </div>

        {/* X Engagement */}
        {p.x_post_url && (p.x_likes > 0 || p.x_reposts > 0 || p.x_views > 0) && (
          <div className="mb-12">
            <h2 className="text-sm font-semibold text-mbogray-800 dark:text-mbogray-200 uppercase tracking-wide mb-3">
              Engagement on X
            </h2>
            <a
              href={p.x_post_url}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="inline-flex items-center gap-4 rounded-xl border border-mbogray-200 dark:border-mbogray-700 bg-white dark:bg-mbogray-800 px-5 py-3 hover:border-mbogray-300 dark:hover:border-mbogray-600 transition-colors"
            >
              <svg className="w-4 h-4 text-mbogray-800 dark:text-mbogray-200 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              {p.x_views > 0 && (
                <div className="text-center">
                  <p className="text-lg font-bold text-mbogray-900 dark:text-white">{p.x_views >= 1000 ? `${(p.x_views / 1000).toFixed(1).replace(/\.0$/, '')}k` : p.x_views}</p>
                  <p className="text-[11px] text-mbogray-500 dark:text-mbogray-400">views</p>
                </div>
              )}
              {p.x_likes > 0 && (
                <div className="text-center">
                  <p className="text-lg font-bold text-mbogray-900 dark:text-white">{p.x_likes >= 1000 ? `${(p.x_likes / 1000).toFixed(1).replace(/\.0$/, '')}k` : p.x_likes}</p>
                  <p className="text-[11px] text-mbogray-500 dark:text-mbogray-400">likes</p>
                </div>
              )}
              {p.x_reposts > 0 && (
                <div className="text-center">
                  <p className="text-lg font-bold text-mbogray-900 dark:text-white">{p.x_reposts >= 1000 ? `${(p.x_reposts / 1000).toFixed(1).replace(/\.0$/, '')}k` : p.x_reposts}</p>
                  <p className="text-[11px] text-mbogray-500 dark:text-mbogray-400">reposts</p>
                </div>
              )}
              {p.x_replies > 0 && (
                <div className="text-center">
                  <p className="text-lg font-bold text-mbogray-900 dark:text-white">{p.x_replies >= 1000 ? `${(p.x_replies / 1000).toFixed(1).replace(/\.0$/, '')}k` : p.x_replies}</p>
                  <p className="text-[11px] text-mbogray-500 dark:text-mbogray-400">replies</p>
                </div>
              )}
              <span className="text-xs text-mbogray-400 dark:text-mbogray-500 ml-1">View post &rarr;</span>
            </a>
          </div>
        )}

        {similarProducts.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold text-mbogray-900 dark:text-white mb-6">
              Similar products
            </h2>
            <ProductGrid products={similarProducts} />
          </section>
        )}
      </div>
    </div>
    </>
  );
}
