import Link from 'next/link';
import { collections } from '@/data/collections';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Collections — VibeStash',
  description: 'Curated collections of the best vibe-coded products',
};

export default function CollectionsPage() {
  return (
    <div className="px-4 md:px-6 py-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-mbogray-900 dark:text-white mb-2">
        Collections
      </h1>
      <p className="text-mbogray-500 dark:text-mbogray-400 mb-8">
        Curated lists of the best vibe-coded products
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {collections.map((col) => (
          <Link
            key={col.id}
            href={`/collections/${col.slug}`}
            className="group flex flex-col gap-2 rounded-2xl border border-mbogray-200 dark:border-mbogray-700 bg-white dark:bg-mbogray-800/50 p-5 hover:border-mbogray-300 dark:hover:border-mbogray-600 hover:bg-mbogray-50 dark:hover:bg-mbogray-800 transition-colors"
          >
            <span className="text-3xl">{col.emoji}</span>
            <h2 className="text-lg font-semibold text-mbogray-900 dark:text-white group-hover:text-accent transition-colors">
              {col.title}
            </h2>
            <p className="text-sm text-mbogray-500 dark:text-mbogray-400">
              {col.description}
            </p>
            <span className="text-xs text-mbogray-400 dark:text-mbogray-500 mt-auto">
              {col.productSlugs.length} products
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
