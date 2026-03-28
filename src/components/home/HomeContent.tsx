'use client';

import { useState, useEffect, useCallback, useTransition } from 'react';
import type { Product, Category } from '@/types';
import { ProductGrid } from '@/components/products/ProductGrid';
import { Pagination } from '@/components/products/Pagination';

const PRODUCTS_PER_PAGE = 12;

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
          <span className="text-accent mr-1.5">&#9679;</span>
          Trending
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
}: {
  initialProducts: Product[];
  initialTotal: number;
  categories: Category[];
  productCounts: Record<string, number>;
  initialCategory?: string;
  initialPage: number;
}) {
  const [activeSlug, setActiveSlug] = useState(initialCategory);
  const [products, setProducts] = useState(initialProducts);
  const [totalPages, setTotalPages] = useState(Math.ceil(initialTotal / PRODUCTS_PER_PAGE));
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isLoading, setIsLoading] = useState(false);
  const [, startTransition] = useTransition();

  const fetchProducts = useCallback(async (categorySlug?: string, page = 1) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (categorySlug) {
        const cat = categories.find((c) => c.slug === categorySlug);
        if (cat) params.set('category', cat.name);
      }
      params.set('page', page.toString());
      params.set('limit', PRODUCTS_PER_PAGE.toString());
      params.set('sort', 'trending');

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

  const handleFilterSelect = (slug?: string) => {
    setActiveSlug(slug);
    setCurrentPage(1);

    // Update URL without navigation
    const params = new URLSearchParams();
    if (slug) params.set('category', slug);
    const url = params.toString() ? `/?${params.toString()}` : '/';
    window.history.replaceState(null, '', url);

    startTransition(() => {
      fetchProducts(slug, 1);
    });
  };

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);

    const params = new URLSearchParams();
    if (activeSlug) params.set('category', activeSlug);
    if (page > 1) params.set('page', page.toString());
    const url = params.toString() ? `/?${params.toString()}` : '/';
    window.history.pushState(null, '', url);

    startTransition(() => {
      fetchProducts(activeSlug, page);
    });
  }, [activeSlug, fetchProducts, startTransition]);

  // Handle pagination from URL (back/forward)
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get('category') || undefined;
      const page = Math.max(1, parseInt(params.get('page') || '1', 10));
      setActiveSlug(cat);
      setCurrentPage(page);
      fetchProducts(cat, page);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [fetchProducts]);

  return (
    <div className="relative min-h-screen">
      <div className="px-4 md:px-6">
        <section className="py-6">
          <CategoryFilter
            categories={categories}
            activeSlug={activeSlug}
            productCounts={productCounts}
            onSelect={handleFilterSelect}
          />
        </section>

        <section className="min-h-[400px]">
          {isLoading ? <GridSkeleton /> : <ProductGrid products={products} />}
        </section>

        {totalPages > 1 && (
          <div className="mt-12 mb-12">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          </div>
        )}
      </div>
    </div>
  );
}
