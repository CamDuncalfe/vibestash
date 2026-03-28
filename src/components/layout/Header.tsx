'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { SearchBar } from './SearchBar';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

export function Header() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const supabase = createClient();
  const [flaggedCount, setFlaggedCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    supabase
      .from('products')
      .select('id', { count: 'exact', head: true })
      .eq('flagged_for_removal', true)
      .then(({ count }) => {
        if (count && count > 0) setFlaggedCount(count);
      });
  }, []);

  useEffect(() => {
    if (!user) { setIsAdmin(false); return; }
    supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        setIsAdmin(data?.is_admin === true);
      });
  }, [user, supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <header className="relative z-20 bg-white dark:bg-[#0a0a0a] border-b border-mbogray-100 dark:border-mbogray-800">
      <div className="mx-auto flex items-center justify-between px-4 md:px-6">
        {/* Left: Logo + Nav links */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center shrink-0">
            <span className="text-xl font-bold tracking-tight text-mbogray-900 dark:text-white">VibeStash</span>
          </Link>
          <nav className="hidden md:flex items-center ml-1">
            <Link
              href="/"
              className="px-3 py-5 text-sm text-mbogray-500 dark:text-mbogray-400 hover:text-mbogray-900 dark:hover:text-white transition-colors"
            >
              Explore
            </Link>
            <Link
              href="/tools"
              className="px-3 py-5 text-sm text-mbogray-500 dark:text-mbogray-400 hover:text-mbogray-900 dark:hover:text-white transition-colors"
            >
              Tools
            </Link>
            <Link
              href="/submit"
              className="px-3 py-5 text-sm text-mbogray-500 dark:text-mbogray-400 hover:text-mbogray-900 dark:hover:text-white transition-colors"
            >
              Submit
            </Link>
            <Link
              href="/supporters"
              className="px-3 py-5 text-sm text-mbogray-500 dark:text-mbogray-400 hover:text-mbogray-900 dark:hover:text-white transition-colors"
            >
              Sponsor
            </Link>
            {isAdmin && flaggedCount > 0 && (
              <Link
                href="/review"
                className="px-3 py-5 text-sm text-red-500 hover:text-red-400 transition-colors flex items-center gap-1"
              >
                Review
                <span className="text-[10px] font-semibold bg-red-500 text-white rounded-full px-1.5 py-0.5 leading-none">
                  {flaggedCount}
                </span>
              </Link>
            )}
          </nav>
        </div>

        {/* Right: Search + Theme + Auth */}
        <div className="flex items-center gap-2">
          <SearchBar />
          <ThemeToggle />
          {loading ? (
            <div className="w-16 h-8 bg-mbogray-100 dark:bg-mbogray-800 rounded-full animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-2">
              {(() => {
                const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture;
                const displayName = user.user_metadata?.full_name || user.user_metadata?.name || user.email;
                const initial = (displayName || '?').charAt(0).toUpperCase();
                return avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={displayName || 'User avatar'}
                    title={displayName || undefined}
                    className="h-7 w-7 rounded-full object-cover"
                  />
                ) : (
                  <div
                    title={displayName || undefined}
                    className="h-7 w-7 rounded-full bg-accent text-white flex items-center justify-center text-xs font-medium"
                  >
                    {initial}
                  </div>
                );
              })()}
              <Link
                href="/admin"
                className="px-3 py-2 text-sm text-mbogray-500 dark:text-mbogray-400 hover:text-mbogray-900 dark:hover:text-white transition-colors"
              >
                Admin
              </Link>
              <button
                onClick={handleSignOut}
                className="px-3 py-2 text-sm text-mbogray-500 dark:text-mbogray-400 hover:text-mbogray-900 dark:hover:text-white transition-colors"
              >
                Sign out
              </button>
            </div>
          ) : (
            <Link
              href="/auth"
              className="text-sm font-medium bg-mbogray-900 dark:bg-white text-white dark:text-mbogray-900 px-4 py-2 rounded-full hover:bg-mbogray-800 dark:hover:bg-mbogray-100 transition-colors"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
