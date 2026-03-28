import { createClient } from '@/lib/supabase/server';
import type { Product, Category } from '@/types';
import { HomeContent } from '@/components/home/HomeContent';

const PRODUCTS_PER_PAGE = 12;

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
        const cat = (categories as Category[]).find((c) => c.name === catName);
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

  const from = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const to = from + PRODUCTS_PER_PAGE - 1;
  query = query.range(from, to);

  const { data: products, count } = await query;

  return (
    <HomeContent
      initialProducts={(products as Product[]) || []}
      initialTotal={count || 0}
      categories={(categories as Category[]) || []}
      productCounts={productCounts}
      initialCategory={activeCategory}
      initialPage={currentPage}
      initialSort={sort}
    />
  );
}
