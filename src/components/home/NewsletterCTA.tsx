'use client';

import { useState, useEffect } from 'react';

const SUBSCRIBED_KEY = 'vibestash_newsletter_subscribed';

export function NewsletterCTA() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [mounted, setMounted] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDismissed(localStorage.getItem(SUBSCRIBED_KEY) === 'true');
  }, []);

  if (mounted && dismissed) return null;

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
    <div className="md:col-span-2 rounded-xl border border-mbogray-200 dark:border-mbogray-700 bg-mbogray-50 dark:bg-mbogray-800/60 overflow-hidden">
      <div className="flex flex-col md:flex-row items-center gap-6 px-6 py-8 md:py-6">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-mbogray-900 dark:text-white">
            Stay in the loop
          </h3>
          <p className="mt-1 text-sm text-mbogray-500 dark:text-mbogray-400">
            The best new vibe-coded products, in your inbox every week. Free, no spam.
          </p>
        </div>

        <div className="w-full md:w-auto shrink-0">
          {status === 'success' ? (
            <p className="text-sm font-medium text-green-600 dark:text-green-400">
              You&apos;re in! Check your inbox.
            </p>
          ) : (
            <form onSubmit={handleSubscribe} className="flex items-center gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="h-9 w-full md:w-56 px-3 text-sm bg-white dark:bg-mbogray-800 border border-mbogray-200 dark:border-mbogray-700 rounded-full text-mbogray-800 dark:text-mbogray-200 placeholder:text-mbogray-400 dark:placeholder:text-mbogray-500 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="h-9 px-5 text-sm font-medium bg-accent text-white rounded-full hover:bg-accent-hover transition-colors disabled:opacity-50 shrink-0"
              >
                {status === 'loading' ? '...' : 'Subscribe'}
              </button>
            </form>
          )}
          {status === 'error' && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">Something went wrong. Try again.</p>
          )}
        </div>
      </div>
    </div>
  );
}
