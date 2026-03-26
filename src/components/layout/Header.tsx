'use client';

import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { SearchBar } from './SearchBar';

export function Header() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold tracking-tight text-[#1a1a1a]">
              VibeStash
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-sm text-gray-600 hover:text-[#1a1a1a] transition-colors">
                Explore
              </Link>
              <Link href="/tools" className="text-sm text-gray-600 hover:text-[#1a1a1a] transition-colors">
                Tools
              </Link>
              <Link href="/submit" className="text-sm text-gray-600 hover:text-[#1a1a1a] transition-colors">
                Submit
              </Link>
              <Link href="/supporters" className="text-sm text-gray-600 hover:text-[#1a1a1a] transition-colors">
                Supporters
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <SearchBar />
            {loading ? (
              <div className="w-20 h-9 bg-gray-100 rounded-lg animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/admin"
                  className="text-sm text-gray-600 hover:text-[#1a1a1a] transition-colors"
                >
                  Admin
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-sm text-gray-600 hover:text-[#1a1a1a] transition-colors"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <Link
                href="/auth"
                className="text-sm font-medium bg-[#1a1a1a] text-white px-4 py-2 rounded-lg hover:bg-[#333] transition-colors"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
