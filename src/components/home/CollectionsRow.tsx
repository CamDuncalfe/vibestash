'use client';

import Link from 'next/link';
import { collections } from '@/data/collections';

export function CollectionsRow() {
  return (
    <div className="px-4 md:px-6 pb-2">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-mbogray-300">Collections</h2>
        <Link
          href="/collections"
          className="text-xs text-mbogray-500 hover:text-mbogray-300 transition-colors"
        >
          View all &rarr;
        </Link>
      </div>
      <div className="scrollbar-hide flex gap-3 overflow-x-auto pb-1">
        {collections.map((col) => (
          <Link
            key={col.id}
            href={`/collections/${col.slug}`}
            className="flex-none flex items-center gap-2 rounded-xl border border-mbogray-700 bg-mbogray-800/50 px-4 py-2.5 hover:border-mbogray-600 hover:bg-mbogray-800 transition-colors"
          >
            <span className="text-lg">{col.emoji}</span>
            <div className="min-w-0">
              <span className="text-sm font-medium text-mbogray-200 whitespace-nowrap">
                {col.title}
              </span>
              <span className="ml-1.5 text-xs text-mbogray-500">
                {col.productSlugs.length}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
