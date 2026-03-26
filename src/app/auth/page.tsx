'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const supabase = createClient();

  async function handleGoogleSignIn() {
    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/auth/callback',
      },
    });

    if (error) {
      setMessage({ type: 'error', text: error.message });
      setLoading(false);
    }
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin + '/auth/callback',
      },
    });

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({
        type: 'success',
        text: 'Check your email for a magic link to sign in.',
      });
      setEmail('');
    }

    setLoading(false);
  }

  return (
    <main className="min-h-[calc(100vh-160px)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white border border-gray-200 rounded-lg p-8">
          <h1 className="text-2xl font-bold text-[#1a1a1a] text-center">
            Sign in to VibeStash
          </h1>
          <p className="mt-2 text-sm text-gray-500 text-center">
            Discover and save the best vibe-coded products
          </p>

          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="mt-8 w-full flex items-center justify-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-[#1a1a1a] hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs text-gray-400">or</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <form onSubmit={handleMagicLink}>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[#1a1a1a]"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-[#1a1a1a] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
            />
            <button
              type="submit"
              disabled={loading}
              className="mt-3 w-full rounded-lg bg-[#FF6B35] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#e55a2a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send magic link
            </button>
          </form>

          {message && (
            <div
              className={`mt-4 rounded-lg px-4 py-3 text-sm ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-700'
                  : 'bg-red-50 text-red-700'
              }`}
            >
              {message.text}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
