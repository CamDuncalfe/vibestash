'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import type { Category } from '@/types';

export function CategoryFilter({
  categories,
  activeSlug,
  productCounts,
}: {
  categories: Category[];
  activeSlug?: string;
  productCounts?: Record<string, number>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleClick = (slug?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) {
      params.set('category', slug);
    } else {
      params.delete('category');
    }
    params.delete('page');
    router.push(`/?${params.toString()}`);
  };

  const formatCount = (n: number) => {
    if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k`;
    return n.toString();
  };

  return (
    <div className="flex flex-row items-center gap-3">
      {/* Filters label */}
      <span className="hidden md:inline-flex items-center text-sm font-medium text-mbogray-400 dark:text-mbogray-500 select-none shrink-0">
        Filters
      </span>

      {/* Scrollable category pills */}
      <div className="scrollbar-hide flex flex-row items-center gap-1.5 overflow-x-auto">
        {/* Trending (default) */}
        <button
          onClick={() => handleClick()}
          className={`group inline-flex flex-none select-none items-center justify-center rounded-xl px-3.5 py-0.5 text-sm leading-7 border transition-colors ${
            !activeSlug
              ? 'border-mbogray-900 dark:border-white bg-mbogray-900 dark:bg-white text-white dark:text-mbogray-900'
              : 'border-mbogray-200 dark:border-mbogray-700 text-mbogray-900 dark:text-mbogray-200 bg-mbogray-50 dark:bg-mbogray-800 hover:bg-mbogray-100 dark:hover:bg-mbogray-700'
          }`}
        >
          <span className="text-accent mr-1.5">&#9679;</span>
          Trending
        </button>

        {categories.map((cat) => {
          const isActive = activeSlug === cat.slug;
          const count = productCounts?.[cat.slug];
          return (
            <button
              key={cat.id}
              onClick={() => handleClick(cat.slug)}
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
