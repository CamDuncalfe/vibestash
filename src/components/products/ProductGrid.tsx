import type { Product } from '@/types';
import { ProductCard } from './ProductCard';

export function ProductGrid({ products, featured }: { products: Product[]; featured?: boolean }) {
  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-mbogray-400 dark:text-mbogray-500 text-sm">No products found</p>
      </div>
    );
  }

  return (
    <div className="grid w-full grid-flow-row grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} showFeaturedBadge={featured} />
      ))}
    </div>
  );
}
