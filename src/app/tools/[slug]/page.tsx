import { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ProductGrid } from '@/components/products/ProductGrid';
import type { Tool, Product } from '@/types';
import type { Metadata } from 'next';
import { Pagination } from '@/components/products/Pagination';

const PRODUCTS_PER_PAGE = 24;

interface ToolDetailPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: tool } = await supabase
    .from('tools')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!tool) {
    return { title: 'Tool Not Found — VibeStash' };
  }

  return {
    title: `Products built with ${tool.name} | VibeStash`,
    description: tool.description ?? `Discover vibe-coded apps and products built using ${tool.name}.`,
  };
}

export default async function ToolDetailPage({ params, searchParams }: ToolDetailPageProps) {
  const { slug } = await params;
  const sp = await searchParams;
  const currentPage = Math.max(1, parseInt(sp.page || '1', 10));

  const supabase = await createClient();

  const { data: tool } = await supabase
    .from('tools')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!tool) {
    notFound();
  }

  const typedTool = tool as Tool;

  const from = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const to = from + PRODUCTS_PER_PAGE - 1;

  const { data: products, count } = await supabase
    .from('products')
    .select('*', { count: 'exact' })
    .eq('approved', true)
    .or('flagged_for_removal.is.null,flagged_for_removal.eq.false')
    .filter('tools_used', 'cs', `{${typedTool.slug}}`)
    .order('likes_count', { ascending: false })
    .order('created_at', { ascending: false })
    .range(from, to);

  const allProducts = (products as Product[]) ?? [];
  const totalPages = Math.ceil((count || 0) / PRODUCTS_PER_PAGE);

  return (
    <div className="min-h-screen">
      <section className="pt-16 pb-12 px-6 text-center">
        <div className="mb-4">
          <Link
            href="/tools"
            className="text-sm text-mbogray-400 dark:text-mbogray-500 hover:text-accent transition-colors"
          >
            &larr; All Tools
          </Link>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-mbogray-900 dark:text-white tracking-tight max-w-3xl mx-auto leading-tight">
          {typedTool.name}
        </h1>
        {typedTool.description && (
          <p className="mt-4 text-lg text-mbogray-500 dark:text-mbogray-400 max-w-xl mx-auto">
            {typedTool.description}
          </p>
        )}
        <p className="mt-2 text-sm text-mbogray-400 dark:text-mbogray-500">
          {count || 0} {(count || 0) === 1 ? 'product' : 'products'} built with {typedTool.name}
        </p>
      </section>

      <div className="max-w-6xl mx-auto px-6">
        <section>
          <ProductGrid products={allProducts} />
        </section>

        <Suspense fallback={null}>
          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </Suspense>

        <div className="h-12" />
      </div>
    </div>
  );
}
