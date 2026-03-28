'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
}) {
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const buildHref = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page > 1) {
      params.set('page', page.toString());
    } else {
      params.delete('page');
    }
    const qs = params.toString();
    return qs ? `/?${qs}` : '/';
  };

  const handleClick = (page: number, e: React.MouseEvent) => {
    if (onPageChange) {
      e.preventDefault();
      onPageChange(page);
    }
    // If no onPageChange, let the Link navigate naturally
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter(
      (p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2
    );

  return (
    <div className="flex items-center justify-center gap-2">
      {currentPage <= 1 ? (
        <span
          className="px-4 py-2 text-sm rounded-full border border-mbogray-200 dark:border-mbogray-700 text-mbogray-600 dark:text-mbogray-400 opacity-30 cursor-not-allowed transition-colors"
        >
          Previous
        </span>
      ) : (
        <Link
          href={buildHref(currentPage - 1)}
          onClick={(e) => handleClick(currentPage - 1, e)}
          scroll={true}
          className="px-4 py-2 text-sm rounded-full border border-mbogray-200 dark:border-mbogray-700 text-mbogray-600 dark:text-mbogray-400 hover:bg-mbogray-50 dark:hover:bg-mbogray-800 transition-colors"
        >
          Previous
        </Link>
      )}

      {pages.map((page, i) => (
        <span key={page}>
          {i > 0 && pages[i - 1] !== page - 1 && (
            <span className="px-1 text-mbogray-300 dark:text-mbogray-600">...</span>
          )}
          {page === currentPage ? (
            <span
              className="inline-flex items-center justify-center w-9 h-9 text-sm rounded-full bg-mbogray-900 dark:bg-white text-white dark:text-mbogray-900"
            >
              {page}
            </span>
          ) : (
            <Link
              href={buildHref(page)}
              onClick={(e) => handleClick(page, e)}
              scroll={true}
              className="inline-flex items-center justify-center w-9 h-9 text-sm rounded-full hover:bg-mbogray-50 dark:hover:bg-mbogray-800 text-mbogray-600 dark:text-mbogray-400 transition-colors"
            >
              {page}
            </Link>
          )}
        </span>
      ))}

      {currentPage >= totalPages ? (
        <span
          className="px-4 py-2 text-sm rounded-full border border-mbogray-200 dark:border-mbogray-700 text-mbogray-600 dark:text-mbogray-400 opacity-30 cursor-not-allowed transition-colors"
        >
          Next
        </span>
      ) : (
        <Link
          href={buildHref(currentPage + 1)}
          onClick={(e) => handleClick(currentPage + 1, e)}
          scroll={true}
          className="px-4 py-2 text-sm rounded-full border border-mbogray-200 dark:border-mbogray-700 text-mbogray-600 dark:text-mbogray-400 hover:bg-mbogray-50 dark:hover:bg-mbogray-800 transition-colors"
        >
          Next
        </Link>
      )}
    </div>
  );
}
