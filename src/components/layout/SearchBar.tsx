'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import type { Product } from '@/types';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.products || []);
          setOpen(true);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div ref={ref} className="relative hidden sm:block">
      <input
        type="text"
        placeholder="Search products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query.trim() && results.length > 0 && setOpen(true)}
        className="w-48 lg:w-64 h-9 px-3 text-sm bg-mbogray-50 dark:bg-mbogray-800 border border-mbogray-200 dark:border-mbogray-700 rounded-lg text-mbogray-800 dark:text-mbogray-200 placeholder:text-mbogray-400 dark:placeholder:text-mbogray-500 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
      />
      {loading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="w-3.5 h-3.5 border-2 border-mbogray-300 dark:border-mbogray-600 border-t-mbogray-600 dark:border-t-mbogray-300 rounded-full animate-spin" />
        </div>
      )}
      {open && results.length > 0 && (
        <div className="absolute top-full mt-2 w-80 bg-white dark:bg-mbogray-800 border border-mbogray-200 dark:border-mbogray-700 rounded-xl shadow-lg dark:shadow-black/40 overflow-hidden z-50">
          {results.slice(0, 6).map((product) => (
            <button
              key={product.id}
              onClick={() => {
                router.push(`/products/${product.slug}`);
                setOpen(false);
                setQuery('');
              }}
              className="w-full text-left px-4 py-3 hover:bg-mbogray-50 dark:hover:bg-mbogray-700 transition-colors border-b border-mbogray-50 dark:border-mbogray-700 last:border-0"
            >
              <p className="text-sm font-medium text-mbogray-800 dark:text-mbogray-200">{product.title}</p>
              {product.description && (
                <p className="text-xs text-mbogray-500 dark:text-mbogray-400 mt-0.5 line-clamp-1">
                  {product.description}
                </p>
              )}
            </button>
          ))}
        </div>
      )}
      {open && query.trim() && results.length === 0 && !loading && (
        <div className="absolute top-full mt-2 w-80 bg-white dark:bg-mbogray-800 border border-mbogray-200 dark:border-mbogray-700 rounded-xl shadow-lg dark:shadow-black/40 p-4 z-50">
          <p className="text-sm text-mbogray-500 dark:text-mbogray-400">No results found</p>
        </div>
      )}
    </div>
  );
}
