import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/types';

export function ProductOfTheDay({ product }: { product: Product }) {
  const makerHref = product.maker_twitter
    ? `https://x.com/${product.maker_twitter.replace('@', '')}`
    : product.maker_url || '#';

  return (
    <div className="px-4 md:px-6 pt-6">
      <Link
        href={`/products/${product.slug}`}
        className="group relative flex flex-col md:flex-row items-stretch overflow-hidden rounded-2xl border border-mbogray-700 bg-mbogray-900 hover:border-mbogray-600 transition-colors"
      >
        {/* Thumbnail */}
        <div className="relative w-full md:w-80 lg:w-96 shrink-0">
          {product.thumbnail_url ? (
            <Image
              src={product.thumbnail_url}
              alt={product.title}
              width={700}
              height={438}
              className="aspect-[16/10] md:aspect-auto md:h-full w-full object-cover"
              sizes="(max-width: 768px) 100vw, 384px"
              priority
            />
          ) : (
            <div className="aspect-[16/10] md:h-full w-full bg-mbogray-800 flex items-center justify-center text-mbogray-600">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col justify-center gap-3 p-5 md:p-6 lg:p-8 min-w-0">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-bold text-amber-400 border border-amber-500/25">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              Product of the Day
            </span>
          </div>

          <h2 className="text-xl md:text-2xl font-bold text-white group-hover:text-accent transition-colors truncate">
            {product.title}
          </h2>

          {product.description && (
            <p className="text-sm md:text-base text-mbogray-400 line-clamp-2">
              {product.description}
            </p>
          )}

          <div className="flex items-center gap-3 mt-1">
            {(product.maker_name || product.maker_twitter) && (
              <span className="flex items-center gap-2 text-sm text-mbogray-400">
                {product.maker_avatar_url ? (
                  <Image
                    src={product.maker_avatar_url}
                    alt={product.maker_name || ''}
                    width={20}
                    height={20}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <span className="w-5 h-5 rounded-full bg-mbogray-700 flex items-center justify-center text-[10px] text-mbogray-400">
                    {(product.maker_name || '?').charAt(0).toUpperCase()}
                  </span>
                )}
                {product.maker_name}
                {product.maker_twitter && (
                  <span className="text-mbogray-500">{product.maker_twitter}</span>
                )}
              </span>
            )}
          </div>

          <div className="mt-1">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-1.5 text-sm font-semibold text-white group-hover:bg-accent-hover transition-colors">
              Visit
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
