'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { createClient } from '@/lib/supabase/client';

const navItems = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Products', href: '/admin/products' },
  { label: 'Submissions', href: '/admin/submissions' },
  { label: 'Categories', href: '/admin/categories' },
  { label: 'Tools', href: '/admin/tools' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push('/auth');
      return;
    }

    supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        setIsAdmin(data?.is_admin === true);
      });
  }, [user, authLoading, router, supabase]);

  if (authLoading || isAdmin === null) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-mbogray-400 dark:text-mbogray-500 text-sm">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-mbogray-900 dark:text-white mb-2">Access denied</h1>
          <p className="text-mbogray-500 dark:text-mbogray-400 text-sm">You do not have permission to view this page.</p>
          <Link href="/" className="text-sm text-accent hover:underline mt-4 inline-block">
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex gap-8">
        <aside className="w-56 shrink-0">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-mbogray-400 dark:text-mbogray-500 mb-4">
            Admin
          </h2>
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive =
                item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive
                      ? 'bg-accent/10 text-accent font-medium'
                      : 'text-mbogray-600 dark:text-mbogray-400 hover:text-mbogray-800 dark:hover:text-mbogray-200 hover:bg-mbogray-50 dark:hover:bg-mbogray-800'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
