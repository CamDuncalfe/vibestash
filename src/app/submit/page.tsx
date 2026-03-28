'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import type { Tool } from '@/types';
import { FAQ } from '@/components/ui/FAQ';

const submitFAQ = [
  {
    question: 'Is it free to submit?',
    answer: 'Yes, completely free. We want to showcase the best vibe-coded products regardless of budget.',
  },
  {
    question: 'How long does review take?',
    answer: 'Usually 1-2 business days. We manually review every submission to ensure quality.',
  },
  {
    question: 'What makes a good submission?',
    answer: 'A live, working product built with AI-assisted coding tools. Include your maker profile and the tools you used for the best listing.',
  },
  {
    question: 'Can I edit my submission later?',
    answer: 'Not yet, but we are working on maker profiles. For now, reach out to us if you need changes.',
  },
];

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
        <p className="text-mbogray-400 dark:text-mbogray-500 text-sm">Loading...</p>
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
          <div className="bg-white dark:bg-mbogray-800 border border-mbogray-200 dark:border-mbogray-700 rounded-lg p-10">
            <h1 className="text-2xl font-bold text-mbogray-900 dark:text-white">Thank you!</h1>
            <p className="mt-3 text-mbogray-500 dark:text-mbogray-400">
              Your submission has been received and will be reviewed shortly.
            </p>
            <button
              onClick={() => router.push('/')}
              className="mt-6 inline-flex rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-hover transition-colors"
            >
              Back to home
            </button>
          </div>
        </div>
      </main>
    );
  }

  const inputClass = "mt-1.5 w-full rounded-lg border border-mbogray-200 dark:border-mbogray-700 bg-white dark:bg-mbogray-800 px-3 py-2 text-sm text-mbogray-800 dark:text-mbogray-200 placeholder:text-mbogray-400 dark:placeholder:text-mbogray-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent";

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white dark:bg-mbogray-800 border border-mbogray-200 dark:border-mbogray-700 rounded-lg p-8">
        <h1 className="text-2xl font-bold text-mbogray-900 dark:text-white">
          Submit a product
        </h1>
        <p className="mt-2 text-sm text-mbogray-500 dark:text-mbogray-400">
          Share a vibe-coded product with the community
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="productUrl" className="block text-sm font-medium text-mbogray-800 dark:text-mbogray-200">
              Product URL <span className="text-red-500">*</span>
            </label>
            <input id="productUrl" type="url" value={productUrl} onChange={(e) => setProductUrl(e.target.value)} placeholder="https://example.com" required className={inputClass} />
          </div>

          <div>
            <label htmlFor="productName" className="block text-sm font-medium text-mbogray-800 dark:text-mbogray-200">
              Product name
            </label>
            <input id="productName" type="text" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="My Awesome App" className={inputClass} />
          </div>

          <div>
            <label className="block text-sm font-medium text-mbogray-800 dark:text-mbogray-200">
              Tools used
            </label>
            <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
              {tools.map((tool) => (
                <label
                  key={tool.id}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm cursor-pointer transition-colors ${
                    selectedTools.includes(tool.name)
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-mbogray-200 dark:border-mbogray-700 text-mbogray-600 dark:text-mbogray-400 hover:border-mbogray-300 dark:hover:border-mbogray-600'
                  }`}
                >
                  <input type="checkbox" checked={selectedTools.includes(tool.name)} onChange={() => toggleTool(tool.name)} className="sr-only" />
                  {tool.name}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="makerName" className="block text-sm font-medium text-mbogray-800 dark:text-mbogray-200">
              Maker name
            </label>
            <input id="makerName" type="text" value={makerName} onChange={(e) => setMakerName(e.target.value)} placeholder="Jane Doe" className={inputClass} />
          </div>

          <div>
            <label htmlFor="makerUrl" className="block text-sm font-medium text-mbogray-800 dark:text-mbogray-200">
              Maker URL
            </label>
            <input id="makerUrl" type="url" value={makerUrl} onChange={(e) => setMakerUrl(e.target.value)} placeholder="https://twitter.com/janedoe" className={inputClass} />
          </div>

          <div>
            <label htmlFor="comments" className="block text-sm font-medium text-mbogray-800 dark:text-mbogray-200">
              Comments
            </label>
            <textarea id="comments" value={comments} onChange={(e) => setComments(e.target.value)} placeholder="Anything you'd like us to know about this product..." rows={4} className={`${inputClass} resize-none`} />
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-700 dark:text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Submitting...' : 'Submit product'}
          </button>
        </form>
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-bold text-mbogray-900 dark:text-white mb-6">
          Frequently asked questions
        </h2>
        <FAQ items={submitFAQ} />
      </div>
    </main>
  );
}
