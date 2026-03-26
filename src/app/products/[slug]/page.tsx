import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import type { Product } from '@/types';
import { ProductGrid } from '@/components/products/ProductGrid';
import { ToolBadge } from '@/components/tools/ToolBadge';
import { LikeButton } from '@/components/products/LikeButton';
import { ScreenshotGallery } from '@/components/products/ScreenshotGallery';

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

  return {
    title: `${product.title} — VibeStash`,
    description: product.description || `Check out ${product.title} on VibeStash.`,
    openGraph: {
      title: product.title,
      description: product.description || undefined,
      images: product.thumbnail_url ? [product.thumbnail_url] : undefined,
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  // Fetch product
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('approved', true)
    .single();

  if (!product) notFound();

  const p = product as Product;

  // Increment view count (fire and forget)
  fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/views`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId: p.id }),
  }).catch(() => {});

  // Fetch similar products (same categories, exclude current)
  let similarProducts: Product[] = [];
  if (p.categories.length > 0) {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('approved', true)
      .neq('id', p.id)
      .overlaps('categories', p.categories)
      .limit(3);
    if (data) similarProducts = data as Product[];
  }

  // Build screenshot list: thumbnail first, then screenshots
  const allScreenshots = [
    ...(p.thumbnail_url ? [p.thumbnail_url] : []),
    ...p.screenshots.filter((s) => s !== p.thumbnail_url),
  ];

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-[#1a1a1a] transition-colors mb-8"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
          Back to all products
        </Link>

        {/* Screenshot Gallery */}
        {allScreenshots.length > 0 && (
          <div className="mb-8">
            <ScreenshotGallery screenshots={allScreenshots} title={p.title} />
          </div>
        )}

        {/* Title and visit button */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold text-[#1a1a1a]">{p.title}</h1>
          <a
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FF6B35] text-white text-sm font-medium rounded-lg hover:bg-[#e55a2b] transition-colors shrink-0"
          >
            Visit
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>

        {/* Description */}
        {p.description && (
          <p className="text-gray-600 leading-relaxed mb-8 whitespace-pre-line">
            {p.description}
          </p>
        )}

        {/* Tools Used */}
        {p.tools_used.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-[#1a1a1a] uppercase tracking-wide mb-2">
              Built with
            </h2>
            <div className="flex flex-wrap gap-2">
              {p.tools_used.map((tool) => (
                <ToolBadge key={tool} name={tool} />
              ))}
            </div>
          </div>
        )}

        {/* Tech Stack */}
        {p.tech_stack.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-[#1a1a1a] uppercase tracking-wide mb-2">
              Tech stack
            </h2>
            <div className="flex flex-wrap gap-2">
              {p.tech_stack.map((tech) => (
                <span
                  key={tech}
                  className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-600"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Categories */}
        {p.categories.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-[#1a1a1a] uppercase tracking-wide mb-2">
              Categories
            </h2>
            <div className="flex flex-wrap gap-2">
              {p.categories.map((cat) => (
                <span
                  key={cat}
                  className="text-xs font-medium px-2.5 py-1 rounded-full bg-orange-50 text-[#FF6B35]"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Maker Info */}
        {p.maker_name && (
          <div className="mb-8 flex items-center gap-3">
            {p.maker_avatar_url && (
              <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100">
                <Image
                  src={p.maker_avatar_url}
                  alt={p.maker_name}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
            )}
            <div>
              <p className="text-sm text-gray-400">Made by</p>
              {p.maker_url ? (
                <a
                  href={p.maker_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-[#1a1a1a] hover:text-[#FF6B35] transition-colors"
                >
                  {p.maker_name}
                </a>
              ) : (
                <p className="text-sm font-medium text-[#1a1a1a]">{p.maker_name}</p>
              )}
            </div>
          </div>
        )}

        {/* Like Button */}
        <div className="mb-12">
          <LikeButton productId={p.id} initialCount={p.likes_count} />
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold text-[#1a1a1a] mb-6">
              Similar products
            </h2>
            <ProductGrid products={similarProducts} />
          </section>
        )}
      </div>
    </div>
  );
}
