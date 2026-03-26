import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import type { Tool } from '@/types';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tools — VibeStash',
  description: 'The AI tools powering the vibe coding revolution',
};

export default async function ToolsPage() {
  const supabase = await createClient();

  const { data: tools } = await supabase
    .from('tools')
    .select('*')
    .order('products_count', { ascending: false });

  const allTools = (tools as Tool[]) ?? [];

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-[#1a1a1a]">Tools</h1>
        <p className="mt-2 text-gray-500">
          The AI tools powering the vibe coding revolution
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allTools.map((tool) => (
          <Link
            key={tool.id}
            href={`/tools/${tool.slug}`}
            className="block bg-white border border-gray-200 rounded-lg p-6 hover:border-[#FF6B35] transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-lg font-semibold text-[#1a1a1a]">
                {tool.name}
              </h2>
              <div className="flex items-center gap-2 shrink-0">
                {tool.products_count > 0 && (
                  <span className="inline-flex items-center rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-medium text-[#FF6B35]">
                    {tool.products_count} product{tool.products_count !== 1 ? 's' : ''}
                  </span>
                )}
                {tool.url && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                )}
              </div>
            </div>
            {tool.description && (
              <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                {tool.description}
              </p>
            )}
          </Link>
        ))}
      </div>

      {allTools.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-400 text-sm">No tools found</p>
        </div>
      )}
    </main>
  );
}
