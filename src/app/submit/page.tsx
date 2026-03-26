'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import type { Tool } from '@/types';

export default function SubmitPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const [tools, setTools] = useState<Tool[]>([]);
  const [productUrl, setProductUrl] = useState('');
  const [productName, setProductName] = useState('');
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [makerName, setMakerName] = useState('');
  const [makerUrl, setMakerUrl] = useState('');
  const [comments, setComments] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    supabase
      .from('tools')
      .select('*')
      .order('name')
      .then(({ data }) => {
        if (data) setTools(data as Tool[]);
      });
  }, [supabase]);

  function toggleTool(toolName: string) {
    setSelectedTools((prev) =>
      prev.includes(toolName)
        ? prev.filter((t) => t !== toolName)
        : [...prev, toolName]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const { error: insertError } = await supabase.from('submissions').insert({
      user_id: user?.id,
      product_url: productUrl,
      product_name: productName || null,
      tools_used: selectedTools,
      maker_name: makerName || null,
      maker_url: makerUrl || null,
      comments: comments || null,
      status: 'pending',
    });

    if (insertError) {
      setError(insertError.message);
      setSubmitting(false);
    } else {
      setSubmitted(true);
      setSubmitting(false);
    }
  }

  if (authLoading) {
    return (
      <main className="min-h-[calc(100vh-160px)] flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading...</p>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  if (submitted) {
    return (
      <main className="min-h-[calc(100vh-160px)] flex items-center justify-center px-4">
        <div className="w-full max-w-lg text-center">
          <div className="bg-white border border-gray-200 rounded-lg p-10">
            <h1 className="text-2xl font-bold text-[#1a1a1a]">Thank you!</h1>
            <p className="mt-3 text-gray-500">
              Your submission has been received and will be reviewed shortly.
            </p>
            <button
              onClick={() => router.push('/')}
              className="mt-6 inline-flex rounded-lg bg-[#FF6B35] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#e55a2a] transition-colors"
            >
              Back to home
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white border border-gray-200 rounded-lg p-8">
        <h1 className="text-2xl font-bold text-[#1a1a1a]">
          Submit a product
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Share a vibe-coded product with the community
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label
              htmlFor="productUrl"
              className="block text-sm font-medium text-[#1a1a1a]"
            >
              Product URL <span className="text-red-500">*</span>
            </label>
            <input
              id="productUrl"
              type="url"
              value={productUrl}
              onChange={(e) => setProductUrl(e.target.value)}
              placeholder="https://example.com"
              required
              className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-[#1a1a1a] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="productName"
              className="block text-sm font-medium text-[#1a1a1a]"
            >
              Product name
            </label>
            <input
              id="productName"
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="My Awesome App"
              className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-[#1a1a1a] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1a1a1a]">
              Tools used
            </label>
            <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
              {tools.map((tool) => (
                <label
                  key={tool.id}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm cursor-pointer transition-colors ${
                    selectedTools.includes(tool.name)
                      ? 'border-[#FF6B35] bg-orange-50 text-[#FF6B35]'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedTools.includes(tool.name)}
                    onChange={() => toggleTool(tool.name)}
                    className="sr-only"
                  />
                  {tool.name}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="makerName"
              className="block text-sm font-medium text-[#1a1a1a]"
            >
              Maker name
            </label>
            <input
              id="makerName"
              type="text"
              value={makerName}
              onChange={(e) => setMakerName(e.target.value)}
              placeholder="Jane Doe"
              className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-[#1a1a1a] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="makerUrl"
              className="block text-sm font-medium text-[#1a1a1a]"
            >
              Maker URL
            </label>
            <input
              id="makerUrl"
              type="url"
              value={makerUrl}
              onChange={(e) => setMakerUrl(e.target.value)}
              placeholder="https://twitter.com/janedoe"
              className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-[#1a1a1a] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="comments"
              className="block text-sm font-medium text-[#1a1a1a]"
            >
              Comments
            </label>
            <textarea
              id="comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Anything you'd like us to know about this product..."
              rows={4}
              className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-[#1a1a1a] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent resize-none"
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-[#FF6B35] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#e55a2a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Submitting...' : 'Submit product'}
          </button>
        </form>
      </div>
    </main>
  );
}
