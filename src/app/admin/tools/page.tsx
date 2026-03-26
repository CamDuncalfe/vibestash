'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Tool } from '@/types';

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();

const emptyForm = { name: '', slug: '', url: '', description: '' };

export default function AdminTools() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  const fetchTools = async () => {
    const { data } = await supabase
      .from('tools')
      .select('*')
      .order('name', { ascending: true });
    setTools((data as Tool[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchTools();
  }, [supabase]);

  const handleNameChange = (name: string) => {
    setForm((f) => ({ ...f, name, slug: slugify(name) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    await supabase.from('tools').insert({
      name: form.name,
      slug: form.slug,
      url: form.url || null,
      description: form.description || null,
    });

    setForm(emptyForm);
    setShowForm(false);
    setSaving(false);
    fetchTools();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tool?')) return;
    await supabase.from('tools').delete().eq('id', id);
    fetchTools();
  };

  if (loading) {
    return <div className="text-gray-400 text-sm">Loading tools...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#1a1a1a]">Tools</h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="text-sm font-medium bg-[#FF6B35] text-white px-4 py-2 rounded-lg hover:bg-[#e55a2b] transition-colors"
          >
            Add Tool
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-[#1a1a1a] mb-4">New Tool</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Name *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Slug</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">URL</label>
              <input
                type="text"
                value={form.url}
                onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
              <input
                type="text"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35]"
              />
            </div>
          </div>
          <div className="flex items-center gap-3 mt-6">
            <button
              type="submit"
              disabled={saving}
              className="text-sm font-medium bg-[#FF6B35] text-white px-4 py-2 rounded-lg hover:bg-[#e55a2b] transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Create Tool'}
            </button>
            <button
              type="button"
              onClick={() => { setForm(emptyForm); setShowForm(false); }}
              className="text-sm text-gray-500 hover:text-[#1a1a1a] transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-4 py-3 font-medium text-gray-500">Name</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Slug</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">URL</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Products</th>
              <th className="text-right px-4 py-3 font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tools.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                  No tools yet.
                </td>
              </tr>
            ) : (
              tools.map((tool) => (
                <tr key={tool.id} className="border-b border-gray-50 last:border-0">
                  <td className="px-4 py-3 text-[#1a1a1a] font-medium">{tool.name}</td>
                  <td className="px-4 py-3 text-gray-500">{tool.slug}</td>
                  <td className="px-4 py-3 text-gray-500 truncate max-w-[200px]">
                    {tool.url ? (
                      <a
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[#FF6B35] hover:underline"
                      >
                        {tool.url}
                      </a>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{tool.products_count}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(tool.id)}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
