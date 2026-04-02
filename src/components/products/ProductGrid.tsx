import { Fragment, type ReactNode } from 'react';
import type { Product } from '@/types';
import { ProductCard } from './ProductCard';

export function ProductGrid({
  products,
  featured,
  insertAfter,
  potdId,
}: {
  products: Product[];
  featured?: boolean;
  insertAfter?: { index: number; node: ReactNode };
  potdId?: string;
}) {
  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-mbogray-400 dark:text-mbogray-500 text-sm">No products found</p>
      </div>
    );
  }

  return (
    <div className="grid w-full grid-flow-row grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {products.map((product, i) => (
        <Fragment key={product.id}>
          <ProductCard
            product={product}
            showFeaturedBadge={featured}
            isPotd={product.id === potdId}
          />
          {insertAfter && i === insertAfter.index - 1 && insertAfter.node}
        </Fragment>
      ))}
    </div>
  );
}
