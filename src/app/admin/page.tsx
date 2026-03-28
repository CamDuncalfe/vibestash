'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Submission } from '@/types';

interface Stats {
  products: number;
  pendingSubmissions: number;
  tools: number;
  categories: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ products: 0, pendingSubmissions: 0, tools: 0, categories: 0 });
  const [recentSubmissions, setRecentSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      const [productsRes, submissionsRes, toolsRes, categoriesRes, recentRes] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('submissions').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('tools').select('*', { count: 'exact', head: true }),
        supabase.from('categories').select('*', { count: 'exact', head: true }),
        supabase.from('submissions').select('*').order('created_at', { ascending: false }).limit(5),
      ]);

      setStats({
        products: productsRes.count ?? 0,
        pendingSubmissions: submissionsRes.count ?? 0,
        tools: toolsRes.count ?? 0,
        categories: categoriesRes.count ?? 0,
      });
      setRecentSubmissions((recentRes.data as Submission[]) ?? []);
      setLoading(false);
    }

    fetchData();
  }, [supabase]);

  if (loading) {
    return <div className="text-mbogray-400 dark:text-mbogray-500 text-sm">Loading dashboard...</div>;
  }

  const statCards = [
    { label: 'Total Products', value: stats.products },
    { label: 'Pending Submissions', value: stats.pendingSubmissions },
    { label: 'Total Tools', value: stats.tools },
    { label: 'Total Categories', value: stats.categories },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-mbogray-900 dark:text-white mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white dark:bg-mbogray-800 border border-mbogray-100 dark:border-mbogray-700 rounded-xl p-5">
            <p className="text-sm text-mbogray-500 dark:text-mbogray-400 mb-1">{card.label}</p>
            <p className="text-3xl font-bold text-mbogray-900 dark:text-white">{card.value}</p>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-semibold text-mbogray-900 dark:text-white mb-4">Recent Submissions</h2>
      {recentSubmissions.length === 0 ? (
        <p className="text-sm text-mbogray-400 dark:text-mbogray-500">No submissions yet.</p>
      ) : (
        <div className="bg-white dark:bg-mbogray-800 border border-mbogray-100 dark:border-mbogray-700 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-mbogray-100 dark:border-mbogray-700">
                <th className="text-left px-4 py-3 font-medium text-mbogray-500 dark:text-mbogray-400">Name</th>
                <th className="text-left px-4 py-3 font-medium text-mbogray-500 dark:text-mbogray-400">URL</th>
                <th className="text-left px-4 py-3 font-medium text-mbogray-500 dark:text-mbogray-400">Status</th>
                <th className="text-left px-4 py-3 font-medium text-mbogray-500 dark:text-mbogray-400">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentSubmissions.map((sub) => (
                <tr key={sub.id} className="border-b border-mbogray-50 dark:border-mbogray-700 last:border-0">
                  <td className="px-4 py-3 text-mbogray-800 dark:text-mbogray-200">{sub.product_name ?? '—'}</td>
                  <td className="px-4 py-3 text-mbogray-500 dark:text-mbogray-400 truncate max-w-[200px]">{sub.product_url}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        sub.status === 'pending'
                          ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'
                          : sub.status === 'approved'
                          ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                          : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                      }`}
                    >
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-mbogray-400 dark:text-mbogray-500">
                    {new Date(sub.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
