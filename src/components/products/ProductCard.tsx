'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/types';
import { LikeButton } from './LikeButton';
import { UpvoteButton } from './UpvoteButton';
import { timeAgo } from '@/lib/timeago';

function formatCount(n: number) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  return n.toString();
}

function XEngagementBar({ product }: { product: Product }) {
  const hasEngagement = product.x_post_url && (product.x_likes > 0 || product.x_reposts > 0 || product.x_views > 0);
  if (!hasEngagement) return null;

  return (
    <a
      href={product.x_post_url!}
      target="_blank"
      rel="noopener noreferrer nofollow"
      onClick={(e) => e.stopPropagation()}
      className="flex items-center gap-3 text-[11px] text-mbogray-400 dark:text-mbogray-500 hover:text-mbogray-600 dark:hover:text-mbogray-300 transition-colors mt-1"
    >
      {/* X logo */}
      <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
      {product.x_views > 0 && (
        <span className="flex items-center gap-0.5">
          {formatCount(product.x_views)} views
        </span>
      )}
      {product.x_likes > 0 && (
        <span className="flex items-center gap-0.5">
          {formatCount(product.x_likes)} likes
        </span>
      )}
      {product.x_reposts > 0 && (
        <span className="flex items-center gap-0.5">
          {formatCount(product.x_reposts)} reposts
        </span>
      )}
    </a>
  );
}

export function ProductCard({ product }: { product: Product; showFeaturedBadge?: boolean }) {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div className="group relative flex cursor-pointer flex-col gap-2">
      <Link
        href={`/products/${product.slug}`}
        className="group/image relative max-w-full cursor-pointer"
      >
        <div
          className="relative"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div className="border-preview">
            {product.thumbnail_url ? (
              <Image
                src={product.thumbnail_url}
                alt={product.title}
                width={700}
                height={438}
                className={`aspect-[16/10] h-full w-full rounded object-cover transition-opacity duration-300 ${
                  isHovering && product.video_url ? 'opacity-0' : 'opacity-100'
                }`}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                loading="lazy"
              />
            ) : (
              <div className="aspect-[16/10] w-full bg-mbogray-50 dark:bg-mbogray-800 flex items-center justify-center text-mbogray-300 dark:text-mbogray-600">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}

            {/* Play icon indicator for video cards */}
            {product.video_url && (
              <div
                className={`absolute top-2 right-2 z-10 flex items-center justify-center w-6 h-6 rounded-full bg-white/60 text-white transition-opacity duration-200 ${
                  isHovering ? 'opacity-0' : 'opacity-70'
                }`}
              >
                <svg className="w-3 h-3 ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            )}

            {/* Video on hover */}
            {product.video_url && isHovering && (
              <video
                src={product.video_url}
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover rounded"
              />
            )}
          </div>

          {/* Hover-reveal action buttons overlaid on image */}
          <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <UpvoteButton productId={product.id} initialCount={product.upvotes_count} variant="card" />
            <LikeButton productId={product.id} initialCount={product.likes_count} variant="card" />
            {product.url && (
              <a
                href={product.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                title={`Visit ${product.title}`}
                onClick={(e) => e.stopPropagation()}
                className="flex h-9 w-9 flex-none cursor-pointer items-center justify-center rounded-full bg-mbogray-800/80 dark:bg-mbogray-700/90 text-mbogray-300 dark:text-mbogray-400 hover:bg-mbogray-700 dark:hover:bg-mbogray-600 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </Link>

      <div className="relative">
        <div className="grow">
          <Link
            href={`/products/${product.slug}`}
            className="flex items-center truncate text-sm font-medium text-mbogray-800 dark:text-mbogray-200 hover:text-accent transition-colors"
          >
            {product.title}
          </Link>
          {product.description && (
            <p className="truncate text-[13px] text-mbogray-500 dark:text-mbogray-400">
              {product.description}
            </p>
          )}
          <div className="flex items-center gap-2 mt-0.5 truncate">
            {(product.maker_name || product.maker_twitter) && (
              <a
                href={product.maker_twitter ? `https://x.com/${product.maker_twitter.replace('@', '')}` : product.maker_url || '#'}
                target="_blank"
                rel="noopener noreferrer nofollow"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1.5 shrink-0 hover:opacity-80 transition-opacity"
              >
                {product.maker_avatar_url ? (
                  <Image
                    src={product.maker_avatar_url}
                    alt={product.maker_name || ''}
                    width={18}
                    height={18}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-[18px] h-[18px] rounded-full bg-mbogray-200 dark:bg-mbogray-700 flex items-center justify-center">
                    <span className="text-[10px] text-mbogray-500 dark:text-mbogray-400">
                      {(product.maker_name || product.maker_twitter || '?').charAt(0).replace('@', '').toUpperCase()}
                    </span>
                  </div>
                )}
                <span className="text-[12px] text-mbogray-500 dark:text-mbogray-400">
                  {product.maker_twitter || product.maker_name}
                </span>
              </a>
            )}
            {(product.maker_name || product.maker_twitter) && product.tools_used.length > 0 && (
              <span className="text-mbogray-300 dark:text-mbogray-600 text-[12px]">·</span>
            )}
            {product.tools_used.length > 0 && (
              <span className="text-mbogray-400 dark:text-mbogray-500 text-[12px] truncate">
                {product.tools_used.slice(0, 3).join(', ')}
                {product.tools_used.length > 3 && `, +${product.tools_used.length - 3}`}
              </span>
            )}
            {product.created_at && (
              <>
                <span className="text-mbogray-300 dark:text-mbogray-600 text-[12px]">·</span>
                <span className="text-mbogray-400 dark:text-mbogray-500 text-[11px] shrink-0">
                  {timeAgo(product.created_at)}
                </span>
              </>
            )}
          </div>
          <XEngagementBar product={product} />
        </div>
      </div>
    </div>
  );
}
