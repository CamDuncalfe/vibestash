'use client';

import { useState, useEffect } from 'react';

const SUBSCRIBED_KEY = 'vibestash_newsletter_subscribed';

interface RecentProduct {
  id: string;
  title: string;
  slug: string;
  thumbnail_url: string | null;
}

export function SubscribeContent({ recentProducts }: { recentProducts: RecentProduct[] }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (localStorage.getItem(SUBSCRIBED_KEY) === 'true') {
      setStatus('success');
    }
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus('success');
        setEmail('');
        localStorage.setItem(SUBSCRIBED_KEY, 'true');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-16">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-mbogray-900 dark:text-white">
          Never miss a vibe
        </h1>
        <p className="mt-3 text-mbogray-500 dark:text-mbogray-400 max-w-md mx-auto">
          new drops every week. the weird, the wild, and the weirdly useful. straight to your inbox.
        </p>
      </div>

      {/* Recent product thumbnails */}
      {recentProducts.length > 0 && (
        <div className="mt-10 grid grid-cols-3 gap-3">
          {recentProducts.map((p) => (
            <div key={p.id} className="border-preview">
              {p.thumbnail_url ? (
                <img
                  src={p.thumbnail_url}
                  alt={p.title}
                  className="aspect-[16/10] w-full object-cover rounded"
                />
              ) : (
                <div className="aspect-[16/10] w-full bg-mbogray-100 dark:bg-mbogray-800 rounded flex items-center justify-center">
                  <span className="text-xs text-mbogray-400">{p.title}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Subscribe form */}
      <div className="mt-10 text-center">
        {status === 'success' ? (
          <p className="text-sm font-medium text-green-600 dark:text-green-400">
            You&apos;re subscribed! Check your inbox for weekly picks.
          </p>
        ) : (
          <form onSubmit={handleSubscribe} className="flex items-center justify-center gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="h-10 w-full max-w-xs px-4 text-sm bg-white dark:bg-mbogray-800 border border-mbogray-200 dark:border-mbogray-700 rounded-full text-mbogray-800 dark:text-mbogray-200 placeholder:text-mbogray-400 dark:placeholder:text-mbogray-500 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="h-10 px-5 text-sm font-medium bg-accent text-white rounded-full hover:bg-accent-hover transition-colors disabled:opacity-50 shrink-0"
            >
              {status === 'loading' ? '...' : 'Subscribe'}
            </button>
          </form>
        )}
        {status === 'error' && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">Something went wrong. Try again.</p>
        )}
      </div>

      {/* Value props */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
        <div>
          <div className="text-2xl mb-2">&#127775;</div>
          <h3 className="text-sm font-semibold text-mbogray-900 dark:text-white">Weekly curated picks</h3>
          <p className="mt-1 text-xs text-mbogray-500 dark:text-mbogray-400">
            The best new products, hand-selected every week.
          </p>
        </div>
        <div>
          <div className="text-2xl mb-2">&#128161;</div>
          <h3 className="text-sm font-semibold text-mbogray-900 dark:text-white">New tool spotlights</h3>
          <p className="mt-1 text-xs text-mbogray-500 dark:text-mbogray-400">
            Discover AI coding tools before everyone else.
          </p>
        </div>
        <div>
          <div className="text-2xl mb-2">&#128104;&#8205;&#128187;</div>
          <h3 className="text-sm font-semibold text-mbogray-900 dark:text-white">Maker stories</h3>
          <p className="mt-1 text-xs text-mbogray-500 dark:text-mbogray-400">
            Behind-the-scenes from builders shipping with AI.
          </p>
        </div>
      </div>

      <p className="mt-10 text-center text-xs text-mbogray-400 dark:text-mbogray-500">
        100% free. Unsubscribe anytime.
      </p>
    </main>
  );
}
