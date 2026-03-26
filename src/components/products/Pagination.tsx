'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export function Pagination({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage <= 1}
        className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
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
              <span className="px-1 text-gray-300">...</span>
            )}
            <button
              onClick={() => goToPage(page)}
              className={`w-10 h-10 text-sm rounded-lg transition-colors ${
                page === currentPage
                  ? 'bg-[#1a1a1a] text-white'
                  : 'hover:bg-gray-50 text-gray-600'
              }`}
            >
              {page}
            </button>
          </span>
        ))}
      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        Next
      </button>
    </div>
  );
}
