'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const goToPage = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
    } else {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', page.toString());
      router.push(`?${params.toString()}`);
    }
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage <= 1}
        className="px-4 py-2 text-sm rounded-full border border-mbogray-200 dark:border-mbogray-700 text-mbogray-600 dark:text-mbogray-400 hover:bg-mbogray-50 dark:hover:bg-mbogray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        Previous
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1)
        .filter(
          (p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2
        )
        .map((page, i, arr) => (
          <span key={page}>
            {i > 0 && arr[i - 1] !== page - 1 && (
              <span className="px-1 text-mbogray-300 dark:text-mbogray-600">...</span>
            )}
            <button
              onClick={() => goToPage(page)}
              className={`w-9 h-9 text-sm rounded-full transition-colors ${
                page === currentPage
                  ? 'bg-mbogray-900 dark:bg-white text-white dark:text-mbogray-900'
                  : 'hover:bg-mbogray-50 dark:hover:bg-mbogray-800 text-mbogray-600 dark:text-mbogray-400'
              }`}
            >
              {page}
            </button>
          </span>
        ))}
      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="px-4 py-2 text-sm rounded-full border border-mbogray-200 dark:border-mbogray-700 text-mbogray-600 dark:text-mbogray-400 hover:bg-mbogray-50 dark:hover:bg-mbogray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        Next
      </button>
    </div>
  );
}
