import { createClient } from '@/lib/supabase/server';
import type { Product, Category } from '@/types';
import { HomeContent } from '@/components/home/HomeContent';

const PRODUCTS_PER_PAGE = 12;

// Deterministic date-based hash for Product of the Day
function dateHash(dateStr: string): number {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    const char = dateStr.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const activeCategory = params.category;
  const currentPage = Math.max(1, parseInt(params.page || '1', 10));
  const sort = (params.sort as 'trending' | 'new' | 'rising') || 'trending';

  const supabase = await createClient();

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true });

  // Get product counts per category for the filter badges
  const { data: allProducts } = await supabase
    .from('products')
    .select('categories')
    .eq('approved', true)
    .or('flagged_for_removal.is.null,flagged_for_removal.eq.false');

  const productCounts: Record<string, number> = {};
  if (allProducts && categories) {
    for (const product of allProducts) {
      for (const catName of product.categories || []) {
        const cat = (categories as Category[]).find(
          (c) => c.name.toLowerCase() === catName.toLowerCase()
        );
        if (cat) {
          productCounts[cat.slug] = (productCounts[cat.slug] || 0) + 1;
        }
      }
    }
  }

  let activeCategoryName: string | undefined;
  if (activeCategory && categories) {
    const match = categories.find((c: Category) => c.slug === activeCategory);
    if (match) activeCategoryName = match.name;
  }

  let query = supabase
    .from('products')
    .select('*', { count: 'exact' })
    .eq('approved', true)
    .or('flagged_for_removal.is.null,flagged_for_removal.eq.false');

  if (sort === 'new') {
    query = query.order('created_at', { ascending: false });
  } else if (sort === 'rising') {
    query = query
      .order('upvotes_count', { ascending: false })
      .order('created_at', { ascending: false });
  } else {
    // trending (default): featured first, then by engagement, then recency
    query = query
      .order('featured', { ascending: false })
      .order('released_at', { ascending: false, nullsFirst: false })
      .order('upvotes_count', { ascending: false })
      .order('likes_count', { ascending: false })
      .order('created_at', { ascending: false });
  }

  if (activeCategoryName) {
    query = query.contains('categories', [activeCategoryName]);
  }

  const isFirstPage = currentPage === 1 && !activeCategory;
  const fetchCount = isFirstPage ? PRODUCTS_PER_PAGE + 1 : PRODUCTS_PER_PAGE;
  const from = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const to = from + fetchCount - 1;
  query = query.range(from, to);

  const { data: products, count } = await query;

  // Product of the Day: deterministic daily pick (only products with video+thumbnail)
  let potdProduct: Product | null = null;
  const { data: approvedIds } = await supabase
    .from('products')
    .select('id')
    .eq('approved', true)
    .or('flagged_for_removal.is.null,flagged_for_removal.eq.false')
    .not('video_url', 'is', null)
    .not('thumbnail_url', 'is', null);

  if (approvedIds && approvedIds.length > 0) {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const index = dateHash(today) % approvedIds.length;
    const pickedId = approvedIds[index].id;
    const { data: potd } = await supabase
      .from('products')
      .select('*')
      .eq('id', pickedId)
      .single();
    if (potd) potdProduct = potd as Product;
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "VibeStash",
            description: "Discover the best vibe-coded apps and products",
            url: "https://vibestash.fun",
          }),
        }}
      />
      <HomeContent
        initialProducts={(products as Product[]) || []}
        initialTotal={count || 0}
        categories={(categories as Category[]) || []}
        productCounts={productCounts}
        initialCategory={activeCategory}
        initialPage={currentPage}
        initialSort={sort}
        showHero
        potdProduct={potdProduct}
      />
    </>
  );
}
