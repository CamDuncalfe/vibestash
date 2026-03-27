'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/types';
import { LikeButton } from './LikeButton';
import { UpvoteButton } from './UpvoteButton';

export function ProductCard({ product, showFeaturedBadge }: { product: Product; showFeaturedBadge?: boolean }) {
  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="bg-white rounded-lg border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
        <div className="aspect-[16/10] bg-gray-100 relative overflow-hidden">
          {showFeaturedBadge && product.featured && (
            <span className="absolute top-2 left-2 z-10 text-[11px] font-semibold px-2 py-0.5 bg-amber-400 text-amber-900 rounded-full shadow-sm">
              Staff Pick
            </span>
          )}
          {product.thumbnail_url ? (
            <Image
              src={product.thumbnail_url}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-300">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-[#1a1a1a] text-sm leading-tight">
              {product.title}
            </h3>
            <div className="flex items-center gap-2 shrink-0">
              <UpvoteButton productId={product.id} initialCount={product.upvotes_count} />
              <LikeButton productId={product.id} initialCount={product.likes_count} />
            </div>
          </div>
          {product.tools_used.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {product.tools_used.slice(0, 4).map((tool) => (
                <span
                  key={tool}
                  className="text-[11px] font-medium px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full"
                >
                  {tool}
                </span>
              ))}
              {product.tools_used.length > 4 && (
                <span className="text-[11px] text-gray-400">
                  +{product.tools_used.length - 4}
                </span>
              )}
            </div>
          )}
          {product.categories.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {product.categories.slice(0, 2).map((cat) => (
                <span
                  key={cat}
                  className="text-[11px] px-2 py-0.5 bg-orange-50 text-accent rounded-full"
                >
                  {cat}
                </span>
              ))}
            </div>
          )}
          {(product.maker_name || product.maker_twitter) && (
            <p className="text-xs text-gray-400 mt-2.5">
              by {product.maker_name || 'Unknown'}
              {product.maker_twitter && (
                <>
                  {' '}·{' '}
                  <a
                    href={`https://x.com/${product.maker_twitter.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#FF6B35] hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {product.maker_twitter}
                  </a>
                </>
              )}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
