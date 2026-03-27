import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import type { Product } from '@/types';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tools & AI Assistants | VibeStash',
  description:
    'Explore the tools used to vibe-code amazing products. See which AI assistants and dev tools are most popular.',
};

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default async function ToolsPage() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from('products')
    .select('tools_used, title, slug, thumbnail_url, likes_count')
    .eq('approved', true)
    .order('likes_count', { ascending: false });

  // Aggregate tools from all products' tools_used arrays
  const toolMap = new Map<
    string,
    { count: number; topProducts: Pick<Product, 'title' | 'slug' | 'thumbnail_url'>[] }
  >();

  for (const product of products || []) {
    for (const tool of product.tools_used || []) {
      const existing = toolMap.get(tool);
      if (existing) {
        existing.count++;
        if (existing.topProducts.length < 3) {
          existing.topProducts.push(product);
        }
      } else {
        toolMap.set(tool, { count: 1, topProducts: [product] });
      }
    }
  }

  const tools = Array.from(toolMap.entries())
    .map(([name, data]) => ({ name, slug: slugify(name), ...data }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <section className="pt-16 pb-12 px-6 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-[#1a1a1a] tracking-tight max-w-3xl mx-auto leading-tight">
          Tools &amp; AI Assistants
        </h1>
        <p className="mt-4 text-lg text-gray-500 max-w-xl mx-auto">
          Explore the tools used to vibe-code amazing products
        </p>
      </section>

      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <Link
              key={tool.name}
              href={`/tools/${tool.slug}`}
              className="group block"
            >
              <div className="bg-white rounded-lg border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-[#1a1a1a] text-base">
                    {tool.name}
                  </h3>
                  <span className="text-xs font-medium px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full">
                    {tool.count} {tool.count === 1 ? 'product' : 'products'}
                  </span>
                </div>
                {tool.topProducts.length > 0 && (
                  <div className="flex -space-x-2">
                    {tool.topProducts.map((p) => (
                      <div
                        key={p.slug}
                        className="w-10 h-10 rounded-lg border-2 border-white overflow-hidden bg-gray-100 relative flex-shrink-0"
                      >
                        {p.thumbnail_url ? (
                          <Image
                            src={p.thumbnail_url}
                            alt={p.title}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs font-bold">
                            {p.title.charAt(0)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

        {tools.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-sm">No tools found</p>
          </div>
        )}

        <div className="h-12" />
      </div>
    </div>
  );
}
