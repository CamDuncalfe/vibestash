'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { Sticker } from '@/components/Sticker';
import { createClient } from '@/lib/supabase/client';
import type { Product } from '@/types';

export default function ReviewPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const supabase = createClient();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push('/auth'); return; }
    supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        const admin = data?.is_admin === true;
        setIsAdmin(admin);
        if (admin) fetchFlaggedProducts();
      });
  }, [user, authLoading]);

  if (authLoading || isAdmin === null) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-mbogray-400 dark:text-mbogray-500 text-sm">Loading...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-mbogray-900 dark:text-white mb-2">Access denied</h1>
          <p className="text-mbogray-500 dark:text-mbogray-400 text-sm">You do not have permission to view this page.</p>
          <Link href="/" className="text-sm text-accent hover:underline mt-4 inline-block">Go back home</Link>
        </div>
      </div>
    );
  }

  async function fetchFlaggedProducts() {
    setLoading(true);
    try {
      const res = await fetch('/api/review');
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error('Error fetching flagged products:', err);
    }
    setLoading(false);
  }

  async function handleKeep(product: Product) {
    setActionLoading((prev) => ({ ...prev, [product.id]: true }));
    try {
      const res = await fetch('/api/review', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: product.id }),
      });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== product.id));
      } else {
        const data = await res.json();
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      console.error('Error keeping product:', err);
    }
    setActionLoading((prev) => ({ ...prev, [product.id]: false }));
  }

  async function handleRemove(product: Product) {
    if (!confirm(`Delete "${product.title}" permanently? This cannot be undone.`)) return;

    setActionLoading((prev) => ({ ...prev, [product.id]: true }));
    try {
      const res = await fetch('/api/review', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: product.id }),
      });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== product.id));
      } else {
        const data = await res.json();
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      console.error('Error deleting product:', err);
    }
    setActionLoading((prev) => ({ ...prev, [product.id]: false }));
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-64 bg-mbogray-200 dark:bg-mbogray-800 rounded" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 mt-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="aspect-[16/10] bg-mbogray-200 dark:bg-mbogray-800 rounded" />
                  <div className="h-4 w-3/4 bg-mbogray-200 dark:bg-mbogray-800 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-mbogray-400 dark:text-mbogray-500 hover:text-mbogray-800 dark:hover:text-mbogray-200 transition-colors mb-4"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
            Back to home
          </Link>
          <h1 className="text-3xl font-bold text-mbogray-900 dark:text-white">
            Product Review
          </h1>
          <p className="mt-2 text-mbogray-500 dark:text-mbogray-400">
            {products.length} product{products.length !== 1 ? 's' : ''} flagged for review
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-mbogray-500 dark:text-mbogray-400 text-lg">
              No flagged products. All clear! <Sticker emoji="🎉" size={24} className="ml-1" />
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="flex flex-col gap-2">
                {/* Image */}
                <div className="relative">
                  <Link href={product.url || '#'} target="_blank">
                    <div className="border-preview">
                      {product.thumbnail_url ? (
                        <Image
                          src={product.thumbnail_url}
                          alt={product.title}
                          width={700}
                          height={438}
                          className="aspect-[16/10] h-full w-full rounded object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                          loading="lazy"
                        />
                      ) : (
                        <div className="aspect-[16/10] w-full bg-mbogray-50 dark:bg-mbogray-800 flex items-center justify-center text-mbogray-300 dark:text-mbogray-600 rounded">
                          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* FLAGGED badge */}
                  <span className="absolute top-2 left-2 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide bg-red-500 text-white rounded">
                    Flagged
                  </span>
                </div>

                {/* Info */}
                <div>
                  <a
                    href={product.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-mbogray-800 dark:text-mbogray-200 hover:text-accent transition-colors truncate block"
                  >
                    {product.title}
                  </a>
                  {product.flag_reason && (
                    <p className="text-xs text-red-400 dark:text-red-400 mt-0.5">
                      {product.flag_reason}
                    </p>
                  )}
                  {product.description && (
                    <p className="line-clamp-2 text-[13px] text-mbogray-500 dark:text-mbogray-400 mt-0.5">
                      {product.description}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-1">
                  <button
                    onClick={() => handleKeep(product)}
                    disabled={actionLoading[product.id]}
                    className="flex-1 px-3 py-1.5 text-sm font-medium rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border border-emerald-500/20 transition-colors disabled:opacity-50"
                  >
                    Keep
                  </button>
                  <button
                    onClick={() => handleRemove(product)}
                    disabled={actionLoading[product.id]}
                    className="flex-1 px-3 py-1.5 text-sm font-medium rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 transition-colors disabled:opacity-50"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
