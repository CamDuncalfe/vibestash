'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import type { Category } from '@/types';

export function CategoryFilter({ categories, activeSlug }: { categories: Category[]; activeSlug?: string }) {
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

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => handleClick()}
        className={`text-sm px-4 py-1.5 rounded-full border transition-colors ${
          !activeSlug
            ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]'
            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
        }`}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => handleClick(cat.slug)}
          className={`text-sm px-4 py-1.5 rounded-full border transition-colors ${
            activeSlug === cat.slug
              ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]'
              : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
          }`}
        >
          {cat.icon} {cat.name}
        </button>
      ))}
    </div>
  );
}
