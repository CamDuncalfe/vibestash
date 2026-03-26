import { createClient } from '@/lib/supabase/server';
import type { Product } from '@/types';
import { ProductGrid } from '@/components/products/ProductGrid';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Popular Products — VibeStash',
  description: 'Most viewed and loved products on VibeStash.',
};

export default async function PopularPage() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('approved', true)
    .order('views_count', { ascending: false })
    .order('likes_count', { ascending: false })
    .limit(24);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-[#1a1a1a] mb-2">
          Popular Products
        </h1>
        <p className="text-gray-500 mb-10">
          Most viewed and loved products on VibeStash
        </p>
        <ProductGrid products={(products as Product[]) || []} />
      </div>
    </div>
  );
}
