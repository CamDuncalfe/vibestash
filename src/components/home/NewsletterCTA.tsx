'use client';

import { useState, useEffect } from 'react';

const SUBSCRIBED_KEY = 'vibestash_newsletter_subscribed';

export function NewsletterCTA() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [dismissed, setDismissed] = useState(true); // default hidden until we check

  useEffect(() => {
    setDismissed(localStorage.getItem(SUBSCRIBED_KEY) === 'true');
  }, []);

  if (dismissed) return null;

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
    <div className="col-span-full rounded-xl bg-mbogray-50 dark:bg-mbogray-800/60 border border-mbogray-200 dark:border-mbogray-700 px-6 py-8 my-1">
      <div className="max-w-xl mx-auto text-center">
        <h3 className="text-lg font-bold text-mbogray-900 dark:text-white">
          Stay in the loop
        </h3>
        <p className="mt-1.5 text-sm text-mbogray-500 dark:text-mbogray-400">
          Get the best new vibe-coded products in your inbox every week. Free, no spam.
        </p>
        {status === 'success' ? (
          <p className="mt-4 text-sm font-medium text-green-600 dark:text-green-400">
            You&apos;re subscribed! Check your inbox.
          </p>
        ) : (
          <form onSubmit={handleSubscribe} className="mt-4 flex items-center justify-center gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="h-9 w-full max-w-xs px-3 text-sm bg-white dark:bg-mbogray-800 border border-mbogray-200 dark:border-mbogray-700 rounded-full text-mbogray-800 dark:text-mbogray-200 placeholder:text-mbogray-400 dark:placeholder:text-mbogray-500 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="h-9 px-4 text-sm font-medium bg-accent text-white rounded-full hover:bg-accent-hover transition-colors disabled:opacity-50 shrink-0"
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
  );
}
