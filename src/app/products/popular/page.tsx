import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import type { Product } from '@/types';
import { ProductGrid } from '@/components/products/ProductGrid';
import { Pagination } from '@/components/products/Pagination';
import type { Metadata } from 'next';

const PRODUCTS_PER_PAGE = 24;

export const metadata: Metadata = {
  title: 'Most Popular Vibe-Coded Apps | VibeStash',
  description:
    'The most liked and viewed products on VibeStash. Discover trending apps built with AI tools like Cursor, v0, Bolt, and Claude.',
};

export default async function PopularPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page || '1', 10));

  const supabase = await createClient();

  const from = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const to = from + PRODUCTS_PER_PAGE - 1;

  const { data: products, count } = await supabase
    .from('products')
    .select('*', { count: 'exact' })
    .eq('approved', true)
    .or('flagged_for_removal.is.null,flagged_for_removal.eq.false')
    .order('likes_count', { ascending: false })
    .order('views_count', { ascending: false })
    .range(from, to);

  const totalPages = Math.ceil((count || 0) / PRODUCTS_PER_PAGE);

  return (
    <div className="min-h-screen">
      <section className="pt-16 pb-12 px-6 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-mbogray-900 dark:text-white tracking-tight max-w-3xl mx-auto leading-tight">
          Most Popular Vibe-Coded Apps
        </h1>
        <p className="mt-4 text-lg text-mbogray-500 dark:text-mbogray-400 max-w-xl mx-auto">
          The most liked and viewed products on VibeStash
        </p>
      </section>

      <div className="max-w-6xl mx-auto px-6">
        <section>
          <ProductGrid products={(products as Product[]) || []} />
        </section>

        <Suspense fallback={null}>
          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </Suspense>

        <div className="h-12" />
      </div>
    </div>
  );
}
