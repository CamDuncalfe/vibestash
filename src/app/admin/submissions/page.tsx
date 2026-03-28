'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Submission } from '@/types';

export default function AdminSubmissions() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchSubmissions = async () => {
    const { data } = await supabase
      .from('submissions')
      .select('*')
      .order('created_at', { ascending: false });
    setSubmissions((data as Submission[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchSubmissions();
  }, [supabase]);

  const handleUpdateStatus = async (id: string, status: 'approved' | 'rejected') => {
    if (status === 'approved') {
      // Use the approve API to create a product from the submission
      const res = await fetch('/api/submissions/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submissionId: id }),
      });
      if (!res.ok) {
        const err = await res.json();
        alert(`Failed to approve: ${err.error}`);
        return;
      }
    } else {
      await supabase
        .from('submissions')
        .update({ status, reviewed_at: new Date().toISOString() })
        .eq('id', id);
    }
    fetchSubmissions();
  };

  if (loading) {
    return <div className="text-gray-400 text-sm">Loading submissions...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1a1a1a] mb-6">Submissions</h1>

      {submissions.length === 0 ? (
        <p className="text-sm text-gray-400">No submissions yet.</p>
      ) : (
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-4 py-3 font-medium text-gray-500">Name</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">URL</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Maker</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Tools</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Comments</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Date</th>
                <th className="text-right px-4 py-3 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((sub) => (
                <tr key={sub.id} className="border-b border-gray-50 last:border-0">
                  <td className="px-4 py-3 text-[#1a1a1a]">{sub.product_name ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-500 truncate max-w-[160px]">
                    <a
                      href={sub.product_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#FF6B35] hover:underline"
                    >
                      {sub.product_url}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{sub.maker_name ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {sub.tools_used.length > 0 ? sub.tools_used.join(', ') : '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-500 truncate max-w-[140px]">
                    {sub.comments ?? '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        sub.status === 'pending'
                          ? 'bg-yellow-50 text-yellow-700'
                          : sub.status === 'approved'
                          ? 'bg-green-50 text-green-700'
                          : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {new Date(sub.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {sub.status === 'pending' ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleUpdateStatus(sub.id, 'approved')}
                          className="text-xs font-medium text-green-600 hover:underline"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(sub.id, 'rejected')}
                          className="text-xs font-medium text-red-500 hover:underline"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">Reviewed</span>
                    )}
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
