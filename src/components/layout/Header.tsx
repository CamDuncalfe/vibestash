'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';
import { createClient } from '@/lib/supabase/client';
import { useRouter, usePathname } from 'next/navigation';
import { SearchBar } from './SearchBar';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

export function Header() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  const [flaggedCount, setFlaggedCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setMobileOpen(false);
    router.refresh();
  };

  const navLinks = (
    <>
      <Link href="/" className="px-3 py-3 md:py-5 text-sm text-mbogray-500 dark:text-mbogray-400 hover:text-mbogray-900 dark:hover:text-white transition-colors block">
        Explore
      </Link>
      <Link href="/tools" className="px-3 py-3 md:py-5 text-sm text-mbogray-500 dark:text-mbogray-400 hover:text-mbogray-900 dark:hover:text-white transition-colors block">
        Tools
      </Link>
      <Link href="/submit" className="px-3 py-3 md:py-5 text-sm text-mbogray-500 dark:text-mbogray-400 hover:text-mbogray-900 dark:hover:text-white transition-colors block">
        Submit
      </Link>
      <Link href="/supporters" className="px-3 py-3 md:py-5 text-sm text-mbogray-500 dark:text-mbogray-400 hover:text-mbogray-900 dark:hover:text-white transition-colors block">
        Sponsor
      </Link>
      {isAdmin && flaggedCount > 0 && (
        <Link href="/review" className="px-3 py-3 md:py-5 text-sm text-red-500 hover:text-red-400 transition-colors flex items-center gap-1">
          Review
          <span className="text-[10px] font-semibold bg-red-500 text-white rounded-full px-1.5 py-0.5 leading-none">
            {flaggedCount}
          </span>
        </Link>
      )}
    </>
  );

  return (
    <header className="relative z-20 bg-white dark:bg-[#0a0a0a] border-b border-mbogray-100 dark:border-mbogray-800">
      <div className="mx-auto flex items-center justify-between px-4 md:px-6">
        {/* Left: Hamburger (mobile) + Logo + Nav links (desktop) */}
        <div className="flex items-center">
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden mr-2 p-1.5 rounded-lg text-mbogray-500 dark:text-mbogray-400 hover:bg-mbogray-100 dark:hover:bg-mbogray-800 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

          <Link href="/" className="flex items-center shrink-0">
            <span className="text-xl font-bold tracking-tight text-mbogray-900 dark:text-white">VibeStash</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center ml-1">
            {navLinks}
          </nav>
        </div>

        {/* Right: Search + Theme + Auth */}
        <div className="flex items-center gap-2">
          <SearchBar />
          <ThemeToggle />
          {loading ? (
            <div className="w-16 h-8 bg-mbogray-100 dark:bg-mbogray-800 rounded-full animate-pulse" />
          ) : user ? (
            <div className="hidden md:flex items-center gap-2">
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
              {isAdmin && (
                <Link
                  href="/admin"
                  className="px-3 py-2 text-sm text-mbogray-500 dark:text-mbogray-400 hover:text-mbogray-900 dark:hover:text-white transition-colors"
                >
                  Admin
                </Link>
              )}
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

      {/* Mobile dropdown menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-mbogray-100 dark:border-mbogray-800 bg-white dark:bg-[#0a0a0a]">
          <nav className="flex flex-col px-2 py-2">
            {navLinks}
          </nav>
          {user && (
            <div className="border-t border-mbogray-100 dark:border-mbogray-800 px-2 py-2">
              <div className="flex items-center gap-2 px-3 py-2">
                {(() => {
                  const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture;
                  const displayName = user.user_metadata?.full_name || user.user_metadata?.name || user.email;
                  const initial = (displayName || '?').charAt(0).toUpperCase();
                  return avatarUrl ? (
                    <img src={avatarUrl} alt={displayName || 'User avatar'} className="h-6 w-6 rounded-full object-cover" />
                  ) : (
                    <div className="h-6 w-6 rounded-full bg-accent text-white flex items-center justify-center text-xs font-medium">{initial}</div>
                  );
                })()}
                <span className="text-sm text-mbogray-700 dark:text-mbogray-300 truncate">
                  {user.user_metadata?.full_name || user.user_metadata?.name || user.email}
                </span>
              </div>
              {isAdmin && (
                <Link href="/admin" className="px-3 py-2.5 text-sm text-mbogray-500 dark:text-mbogray-400 hover:text-mbogray-900 dark:hover:text-white transition-colors block">
                  Admin
                </Link>
              )}
              <button
                onClick={handleSignOut}
                className="w-full text-left px-3 py-2.5 text-sm text-mbogray-500 dark:text-mbogray-400 hover:text-mbogray-900 dark:hover:text-white transition-colors"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
