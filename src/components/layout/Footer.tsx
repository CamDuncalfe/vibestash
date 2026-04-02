'use client';

import Link from 'next/link';
import { useState } from 'react';

export function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

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
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <footer className="bg-white dark:bg-[#0a0a0a] border-t border-mbogray-100 dark:border-mbogray-800 mt-20">
      <div className="px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-lg font-bold tracking-tight text-mbogray-900 dark:text-white">VibeStash</h3>
            <p className="mt-2 text-sm text-mbogray-500 dark:text-mbogray-400 max-w-md">
              the weird stuff people ship at 3am. we collect it so you don&apos;t have to scroll X for 4 hours.
            </p>
            <form onSubmit={handleSubscribe} className="mt-4 flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 max-w-xs h-9 px-3 text-sm bg-white dark:bg-mbogray-800 border border-mbogray-200 dark:border-mbogray-700 rounded-full text-mbogray-800 dark:text-mbogray-200 placeholder:text-mbogray-400 dark:placeholder:text-mbogray-500 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                required
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="h-9 px-4 text-sm font-medium bg-mbogray-900 dark:bg-white text-white dark:text-mbogray-900 rounded-full hover:bg-mbogray-800 dark:hover:bg-mbogray-100 transition-colors disabled:opacity-50"
              >
                {status === 'loading' ? '...' : 'Subscribe'}
              </button>
            </form>
            {status === 'success' && (
              <p className="mt-2 text-sm text-green-600 dark:text-green-400">Subscribed!</p>
            )}
            {status === 'error' && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">Something went wrong. Try again.</p>
            )}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-mbogray-800 dark:text-mbogray-200 mb-3">Browse</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-sm text-mbogray-500 dark:text-mbogray-400 hover:text-accent transition-colors">Explore</Link></li>
              <li><Link href="/products/popular" className="text-sm text-mbogray-500 dark:text-mbogray-400 hover:text-accent transition-colors">Popular</Link></li>
              <li><Link href="/products/picks" className="text-sm text-mbogray-500 dark:text-mbogray-400 hover:text-accent transition-colors">Picks</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-mbogray-800 dark:text-mbogray-200 mb-3">Company</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-sm text-mbogray-500 dark:text-mbogray-400 hover:text-accent transition-colors">About</Link></li>
              <li><Link href="/submit" className="text-sm text-mbogray-500 dark:text-mbogray-400 hover:text-accent transition-colors">Submit a Product</Link></li>
              <li><Link href="/subscribe" className="text-sm text-mbogray-500 dark:text-mbogray-400 hover:text-accent transition-colors">Subscribe</Link></li>
              <li><Link href="/privacy" className="text-sm text-mbogray-500 dark:text-mbogray-400 hover:text-accent transition-colors">Privacy</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-mbogray-100 dark:border-mbogray-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-mbogray-400 dark:text-mbogray-500">&copy; {new Date().getFullYear()} VibeStash. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="https://x.com/vibestashfun" target="_blank" rel="noopener noreferrer" className="text-mbogray-400 dark:text-mbogray-500 hover:text-accent transition-colors" aria-label="Follow us on X">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
