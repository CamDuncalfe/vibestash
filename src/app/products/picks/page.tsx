import { createClient } from '@/lib/supabase/server';
import type { Product } from '@/types';
import { ProductGrid } from '@/components/products/ProductGrid';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'VibeStash Picks',
  description: 'Hand-picked favorites from the VibeStash team.',
};

export default async function PicksPage() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('approved', true)
    .eq('featured', true)
    .order('featured_at', { ascending: false });

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-[#1a1a1a] mb-2">
          VibeStash Picks
        </h1>
        <p className="text-gray-500 mb-10">
          Hand-picked favorites from the VibeStash team
        </p>
        <ProductGrid products={(products as Product[]) || []} />
      </div>
    </div>
  );
}
