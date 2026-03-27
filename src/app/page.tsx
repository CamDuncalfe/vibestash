import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import type { Product, Category } from '@/types';
import { ProductGrid } from '@/components/products/ProductGrid';
import { CategoryFilter } from '@/components/products/CategoryFilter';
import { Pagination } from '@/components/products/Pagination';

const PRODUCTS_PER_PAGE = 12;

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const activeCategory = params.category;
  const currentPage = Math.max(1, parseInt(params.page || '1', 10));

  const supabase = await createClient();

  // Fetch categories
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true });

  // Resolve category name from slug if filter is active
  let activeCategoryName: string | undefined;
  if (activeCategory && categories) {
    const match = categories.find((c: Category) => c.slug === activeCategory);
    if (match) activeCategoryName = match.name;
  }

  // Build product query
  let query = supabase
    .from('products')
    .select('*', { count: 'exact' })
    .eq('approved', true)
    .order('featured', { ascending: false })
    .order('upvotes_count', { ascending: false })
    .order('likes_count', { ascending: false })
    .order('created_at', { ascending: false });

  if (activeCategoryName) {
    query = query.contains('categories', [activeCategoryName]);
  }

  const from = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const to = from + PRODUCTS_PER_PAGE - 1;
  query = query.range(from, to);

  const { data: products, count } = await query;

  const totalPages = Math.ceil((count || 0) / PRODUCTS_PER_PAGE);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Hero Section */}
      <section className="pt-16 pb-12 px-6 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-[#1a1a1a] tracking-tight max-w-3xl mx-auto leading-tight">
          Discover the best vibe-coded apps &amp; products
        </h1>
        <p className="mt-4 text-lg text-gray-500 max-w-xl mx-auto">
          A curated gallery of software built with AI tools like Cursor, v0, Bolt, and Claude.
        </p>
      </section>

      <div className="max-w-6xl mx-auto px-6">
        {/* Category Filter */}
        <Suspense fallback={<div className="h-10" />}>
          <section className="mb-10">
            <CategoryFilter
              categories={(categories as Category[]) || []}
              activeSlug={activeCategory}
            />
          </section>
        </Suspense>

        {/* Product Grid */}
        <section>
          <ProductGrid products={(products as Product[]) || []} />
        </section>

        {/* Newsletter CTA */}
        <section className="my-16 py-12 px-8 bg-white rounded-2xl border border-gray-100 text-center">
          <h2 className="text-2xl font-semibold text-[#1a1a1a]">
            Stay in the loop
          </h2>
          <p className="mt-2 text-gray-500 max-w-md mx-auto">
            Get a weekly roundup of the freshest vibe-coded products, tools, and maker stories.
          </p>
          <p className="mt-4 text-sm text-gray-400">
            Subscribe via the form in the footer below.
          </p>
        </section>

        {/* Pagination */}
        <Suspense fallback={null}>
          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </Suspense>

        <div className="h-12" />
      </div>
    </div>
  );
}
