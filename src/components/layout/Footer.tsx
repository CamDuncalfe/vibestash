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
    <footer className="bg-white border-t border-gray-100 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-lg font-bold tracking-tight text-[#1a1a1a]">VibeStash</h3>
            <p className="mt-2 text-sm text-gray-500 max-w-md">
              A curated gallery of the best vibe-coded apps and products.
              Discover software built with AI tools.
            </p>
            <form onSubmit={handleSubscribe} className="mt-4 flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 max-w-xs h-10 px-3 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                required
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="h-10 px-4 text-sm font-medium bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors disabled:opacity-50"
              >
                {status === 'loading' ? '...' : 'Subscribe'}
              </button>
            </form>
            {status === 'success' && (
              <p className="mt-2 text-sm text-green-600">Subscribed!</p>
            )}
            {status === 'error' && (
              <p className="mt-2 text-sm text-red-600">Something went wrong. Try again.</p>
            )}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[#1a1a1a] mb-3">Browse</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-sm text-gray-500 hover:text-[#1a1a1a] transition-colors">Explore</Link></li>
              <li><Link href="/products/popular" className="text-sm text-gray-500 hover:text-[#1a1a1a] transition-colors">Popular</Link></li>
              <li><Link href="/products/picks" className="text-sm text-gray-500 hover:text-[#1a1a1a] transition-colors">Picks</Link></li>
              <li><Link href="/tools" className="text-sm text-gray-500 hover:text-[#1a1a1a] transition-colors">Tools</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[#1a1a1a] mb-3">Company</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-sm text-gray-500 hover:text-[#1a1a1a] transition-colors">About</Link></li>
              <li><Link href="/submit" className="text-sm text-gray-500 hover:text-[#1a1a1a] transition-colors">Submit a Product</Link></li>
              <li><Link href="/supporters" className="text-sm text-gray-500 hover:text-[#1a1a1a] transition-colors">Supporters</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">&copy; {new Date().getFullYear()} VibeStash. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
