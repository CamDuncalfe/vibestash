'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Category } from '@/types';

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();

const emptyForm = { name: '', slug: '', icon: '', sort_order: '0' };

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true });
    setCategories((data as Category[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, [supabase]);

  const handleNameChange = (name: string) => {
    setForm((f) => ({ ...f, name, slug: slugify(name) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    await supabase.from('categories').insert({
      name: form.name,
      slug: form.slug,
      icon: form.icon || null,
      sort_order: parseInt(form.sort_order, 10) || 0,
    });

    setForm(emptyForm);
    setShowForm(false);
    setSaving(false);
    fetchCategories();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    await supabase.from('categories').delete().eq('id', id);
    fetchCategories();
  };

  if (loading) {
    return <div className="text-gray-400 text-sm">Loading categories...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#1a1a1a]">Categories</h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="text-sm font-medium bg-[#FF6B35] text-white px-4 py-2 rounded-lg hover:bg-[#e55a2b] transition-colors"
          >
            Add Category
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-[#1a1a1a] mb-4">New Category</h2>
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
              <label className="block text-xs font-medium text-gray-500 mb-1">Icon (emoji)</label>
              <input
                type="text"
                value={form.icon}
                onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Sort Order</label>
              <input
                type="number"
                value={form.sort_order}
                onChange={(e) => setForm((f) => ({ ...f, sort_order: e.target.value }))}
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
              {saving ? 'Saving...' : 'Create Category'}
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
              <th className="text-left px-4 py-3 font-medium text-gray-500">Icon</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Name</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Slug</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Sort Order</th>
              <th className="text-right px-4 py-3 font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                  No categories yet.
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat.id} className="border-b border-gray-50 last:border-0">
                  <td className="px-4 py-3 text-lg">{cat.icon ?? '—'}</td>
                  <td className="px-4 py-3 text-[#1a1a1a] font-medium">{cat.name}</td>
                  <td className="px-4 py-3 text-gray-500">{cat.slug}</td>
                  <td className="px-4 py-3 text-gray-500">{cat.sort_order}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(cat.id)}
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
