import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { collections } from '@/data/collections';
import { ProductGrid } from '@/components/products/ProductGrid';
import { Sticker } from '@/components/Sticker';
import type { Product } from '@/types';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  return collections.map((col) => ({ slug: col.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const collection = collections.find((c) => c.slug === slug);
  if (!collection) return {};
  return {
    title: `${collection.title} — VibeStash`,
    description: collection.description,
  };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = collections.find((c) => c.slug === slug);
  if (!collection) notFound();

  const supabase = await createClient();

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('approved', true)
    .in('slug', collection.productSlugs);

  // Preserve the order from the config
  const slugOrder = new Map(collection.productSlugs.map((s, i) => [s, i]));
  const sorted = ((products as Product[]) || []).sort(
    (a, b) => (slugOrder.get(a.slug) ?? 999) - (slugOrder.get(b.slug) ?? 999)
  );

  return (
    <div className="px-4 md:px-6 py-8">
      <Link
        href="/collections"
        className="inline-flex items-center gap-1 text-sm text-mbogray-500 dark:text-mbogray-400 hover:text-mbogray-700 dark:hover:text-mbogray-200 transition-colors mb-4"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Collections
      </Link>

      <div className="flex items-center gap-3 mb-2">
        <Sticker emoji={collection.emoji} size={36} alt={collection.title} />
        <h1 className="text-2xl font-bold text-mbogray-900 dark:text-white">
          {collection.title}
        </h1>
      </div>
      <p className="text-mbogray-500 dark:text-mbogray-400 mb-8">
        {collection.description}
      </p>

      <ProductGrid products={sorted} />
    </div>
  );
}
