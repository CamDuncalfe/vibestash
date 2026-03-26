import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ProductGrid } from '@/components/products/ProductGrid';
import type { Tool, Product } from '@/types';
import type { Metadata } from 'next';

interface ToolDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ToolDetailPageProps): Promise<Metadata> {
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
    title: `${tool.name} — VibeStash`,
    description: tool.description ?? `Products built with ${tool.name}`,
  };
}

export default async function ToolDetailPage({ params }: ToolDetailPageProps) {
  const { slug } = await params;
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

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('approved', true)
    .filter('tools_used', 'cs', `{${typedTool.name}}`)
    .order('created_at', { ascending: false });

  const allProducts = (products as Product[]) ?? [];

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-10">
        <Link
          href="/tools"
          className="text-sm text-gray-400 hover:text-[#FF6B35] transition-colors"
        >
          &larr; All Tools
        </Link>

        <h1 className="mt-4 text-3xl font-bold text-[#1a1a1a]">
          {typedTool.name}
        </h1>

        {typedTool.description && (
          <p className="mt-2 text-gray-500">{typedTool.description}</p>
        )}

        <div className="mt-4 flex items-center gap-4">
          {typedTool.url && (
            <a
              href={typedTool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-[#FF6B35] hover:underline"
            >
              Visit website
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          )}
          <span className="text-sm text-gray-400">
            {allProducts.length} product{allProducts.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      <ProductGrid products={allProducts} />
    </main>
  );
}
