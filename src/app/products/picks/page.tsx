import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import type { Product } from '@/types';
import { ProductGrid } from '@/components/products/ProductGrid';
import { Pagination } from '@/components/products/Pagination';
import type { Metadata } from 'next';

const PRODUCTS_PER_PAGE = 24;

export const metadata: Metadata = {
  title: 'VibeStash Picks — Hand-Picked Vibe-Coded Apps',
  description:
    'Hand-picked vibe-coded apps our team loves. The best of the best from VibeStash.',
};

export default async function PicksPage({
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
    .eq('featured', true)
    .order('likes_count', { ascending: false })
    .order('created_at', { ascending: false })
    .range(from, to);

  const totalPages = Math.ceil((count || 0) / PRODUCTS_PER_PAGE);

  return (
    <div className="min-h-screen">
      <section className="pt-16 pb-12 px-6 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-mbogray-900 dark:text-white tracking-tight max-w-3xl mx-auto leading-tight">
          VibeStash Picks
        </h1>
        <p className="mt-4 text-lg text-mbogray-500 dark:text-mbogray-400 max-w-xl mx-auto">
          Hand-picked vibe-coded apps our team loves
        </p>
      </section>

      <div className="max-w-6xl mx-auto px-6">
        <section>
          <ProductGrid products={(products as Product[]) || []} featured />
        </section>

        <Suspense fallback={null}>
          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </Suspense>

        <div className="h-12" />
      </div>
    </div>
  );
}
