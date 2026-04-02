'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Product, Category } from '@/types';
import { ProductGrid } from '@/components/products/ProductGrid';
import { Pagination } from '@/components/products/Pagination';
import { NewsletterCTA } from './NewsletterCTA';

const PRODUCTS_PER_PAGE = 12;

type SortMode = 'trending' | 'new' | 'rising';

const SORT_TABS: { value: SortMode; label: string }[] = [
  { value: 'trending', label: 'Trending' },
  { value: 'new', label: 'New' },
  { value: 'rising', label: 'Rising' },
];

function SortTabs({
  active,
  onSelect,
}: {
  active: SortMode;
  onSelect: (sort: SortMode) => void;
}) {
  return (
    <div className="flex items-center gap-1.5">
      {SORT_TABS.map((tab) => {
        const isActive = active === tab.value;
        return (
          <button
            key={tab.value}
            onClick={() => onSelect(tab.value)}
            className={`inline-flex flex-none select-none items-center justify-center rounded-xl px-4 py-1 text-sm font-semibold leading-7 border transition-colors ${
              isActive
                ? 'border-mbogray-900 dark:border-white bg-mbogray-900 dark:bg-white text-white dark:text-mbogray-900'
                : 'border-mbogray-200 dark:border-mbogray-700 text-mbogray-600 dark:text-mbogray-300 hover:bg-mbogray-100 dark:hover:bg-mbogray-700'
            }`}
          >
            {tab.value === 'trending' && <span className="text-accent mr-1.5">&#9679;</span>}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

function CategoryFilter({
  categories,
  activeSlug,
  productCounts,
  onSelect,
}: {
  categories: Category[];
  activeSlug?: string;
  productCounts: Record<string, number>;
  onSelect: (slug?: string) => void;
}) {
  const formatCount = (n: number) => {
    if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k`;
    return n.toString();
  };

  return (
    <div className="flex flex-row items-center gap-3">
      <span className="hidden md:inline-flex items-center text-sm font-medium text-mbogray-400 dark:text-mbogray-500 select-none shrink-0">
        Filters
      </span>

      <div className="scrollbar-hide flex flex-row items-center gap-1.5 overflow-x-auto">
        <button
          onClick={() => onSelect(undefined)}
          className={`group inline-flex flex-none select-none items-center justify-center rounded-xl px-3.5 py-0.5 text-sm leading-7 border transition-colors ${
            !activeSlug
              ? 'border-mbogray-900 dark:border-white bg-mbogray-900 dark:bg-white text-white dark:text-mbogray-900'
              : 'border-mbogray-200 dark:border-mbogray-700 text-mbogray-900 dark:text-mbogray-200 bg-mbogray-50 dark:bg-mbogray-800 hover:bg-mbogray-100 dark:hover:bg-mbogray-700'
          }`}
        >
          All
        </button>

        {categories.filter((cat) => (productCounts[cat.slug] || 0) > 0).map((cat) => {
          const isActive = activeSlug === cat.slug;
          const count = productCounts[cat.slug];
          return (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.slug)}
              className={`group inline-flex flex-none select-none items-center justify-center rounded-xl px-3.5 py-0.5 text-sm leading-7 border transition-colors ${
                isActive
                  ? 'border-mbogray-900 dark:border-white bg-mbogray-900 dark:bg-white text-white dark:text-mbogray-900'
                  : 'border-mbogray-200 dark:border-mbogray-700 text-mbogray-900 dark:text-mbogray-200 bg-mbogray-50 dark:bg-mbogray-800 hover:bg-mbogray-100 dark:hover:bg-mbogray-700'
              }`}
            >
              {cat.name}
              {count != null && count > 0 && !isActive && (
                <span className="ml-1.5 hidden group-hover:inline-flex rounded-full bg-accent px-2 py-0.5 text-xs text-white">
                  {formatCount(count)}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function GridSkeleton() {
  return (
    <div className="grid w-full grid-flow-row grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-2 animate-pulse">
          <div className="border-preview">
            <div className="aspect-[16/10] w-full bg-mbogray-100 dark:bg-mbogray-800 rounded" />
          </div>
          <div className="h-4 w-2/3 bg-mbogray-100 dark:bg-mbogray-800 rounded" />
          <div className="h-3 w-1/2 bg-mbogray-100 dark:bg-mbogray-800 rounded" />
        </div>
      ))}
    </div>
  );
}

export function HomeContent({
  initialProducts,
  initialTotal,
  categories,
  productCounts,
  initialCategory,
  initialPage,
  initialSort,
  showHero = false,
  potdProduct,
}: {
  initialProducts: Product[];
  initialTotal: number;
  categories: Category[];
  productCounts: Record<string, number>;
  initialCategory?: string;
  initialPage: number;
  initialSort?: SortMode;
  showHero?: boolean;
  potdProduct?: Product | null;
}) {
  const [activeSlug, setActiveSlug] = useState(initialCategory);
  const [sortMode, setSortMode] = useState<SortMode>(initialSort || 'trending');
  const [products, setProducts] = useState(initialProducts);
  const [totalPages, setTotalPages] = useState(Math.ceil(initialTotal / PRODUCTS_PER_PAGE));
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isLoading, setIsLoading] = useState(false);

  const fetchProducts = useCallback(async (categorySlug?: string, page = 1, sort: SortMode = 'trending') => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (categorySlug) {
        const cat = categories.find((c) => c.slug === categorySlug);
        if (cat) params.set('category', cat.name);
      }
      params.set('page', page.toString());
      params.set('limit', PRODUCTS_PER_PAGE.toString());
      params.set('sort', sort);

      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();

      setProducts(data.products || []);
      setTotalPages(Math.ceil((data.total || 0) / PRODUCTS_PER_PAGE));
    } catch {
      // keep existing products on error
    } finally {
      setIsLoading(false);
    }
  }, [categories]);

  const updateUrl = (slug?: string, sort?: SortMode) => {
    const params = new URLSearchParams();
    if (slug) params.set('category', slug);
    if (sort && sort !== 'trending') params.set('sort', sort);
    const url = params.toString() ? `/?${params.toString()}` : '/';
    window.history.replaceState(null, '', url);
  };

  const handleFilterSelect = (slug?: string) => {
    setActiveSlug(slug);
    setCurrentPage(1);
    updateUrl(slug, sortMode);
    fetchProducts(slug, 1, sortMode);
  };

  const handleSortSelect = (sort: SortMode) => {
    setSortMode(sort);
    setCurrentPage(1);
    updateUrl(activeSlug, sort);
    fetchProducts(activeSlug, 1, sort);
  };

  // Sync state when server re-renders with new props (pagination via Link navigation)
  useEffect(() => {
    setProducts(initialProducts);
    setTotalPages(Math.ceil(initialTotal / PRODUCTS_PER_PAGE));
    setCurrentPage(initialPage);
    setActiveSlug(initialCategory);
    setSortMode(initialSort || 'trending');
  }, [initialProducts, initialTotal, initialPage, initialCategory, initialSort]);

  const isFirstPage = currentPage === 1 && !activeSlug;

  // Prepend POTD to the grid on the first page if it's not already in the list
  const gridProducts = (() => {
    if (!isFirstPage || !potdProduct) return products;
    const filtered = products.filter((p) => p.id !== potdProduct.id);
    return [potdProduct, ...filtered].slice(0, PRODUCTS_PER_PAGE);
  })();

  return (
    <div className="relative min-h-screen">
      <div className="px-4 md:px-6">
        {showHero && currentPage === 1 && !activeSlug && (
          <section className="pt-10 pb-2 max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-bold text-mbogray-900 dark:text-white tracking-tight">
              Welcome to VibeStash
            </h1>
            <p className="mt-3 text-base text-mbogray-500 dark:text-mbogray-400 leading-relaxed">
              The best apps, tools, and games built with vibe coding. Curated daily, shipped by makers worldwide.
            </p>
          </section>
        )}

        <section className="py-6 flex flex-col gap-3">
          <SortTabs active={sortMode} onSelect={handleSortSelect} />
          <CategoryFilter
            categories={categories}
            activeSlug={activeSlug}
            productCounts={productCounts}
            onSelect={handleFilterSelect}
          />
        </section>

        <section className="min-h-[400px]">
          {isLoading ? (
            <GridSkeleton />
          ) : (
            <ProductGrid
              products={gridProducts}
              insertAfter={{ index: 8, node: <NewsletterCTA /> }}
              potdId={isFirstPage && potdProduct ? potdProduct.id : undefined}
            />
          )}
        </section>

        {totalPages > 1 && (
          <div className="mt-12 mb-12">
            <Pagination currentPage={currentPage} totalPages={totalPages} />
          </div>
        )}
      </div>
    </div>
  );
}
