'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Product } from '@/types';

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();

const emptyForm = {
  title: '',
  slug: '',
  url: '',
  description: '',
  thumbnail_url: '',
  screenshots: '',
  tools_used: '',
  categories: '',
  tech_stack: '',
  maker_name: '',
  maker_url: '',
  featured: false,
  x_post_url: '',
  x_likes: '',
  x_reposts: '',
  x_replies: '',
  x_views: '',
  released_at: '',
  maker_twitter: '',
  maker_avatar_url: '',
};

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  const fetchProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    setProducts((data as Product[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [supabase]);

  const handleTitleChange = (title: string) => {
    setForm((f) => ({
      ...f,
      title,
      slug: editingId ? f.slug : slugify(title),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      title: form.title,
      slug: form.slug,
      url: form.url,
      description: form.description || null,
      thumbnail_url: form.thumbnail_url || null,
      screenshots: form.screenshots ? form.screenshots.split(',').map((s) => s.trim()) : [],
      tools_used: form.tools_used ? form.tools_used.split(',').map((s) => s.trim()) : [],
      categories: form.categories ? form.categories.split(',').map((s) => s.trim()) : [],
      tech_stack: form.tech_stack ? form.tech_stack.split(',').map((s) => s.trim()) : [],
      maker_name: form.maker_name || null,
      maker_url: form.maker_url || null,
      featured: form.featured,
      approved: true,
      x_post_url: form.x_post_url || null,
      x_likes: parseInt(form.x_likes) || 0,
      x_reposts: parseInt(form.x_reposts) || 0,
      x_replies: parseInt(form.x_replies) || 0,
      x_views: parseInt(form.x_views) || 0,
      released_at: form.released_at || null,
      maker_twitter: form.maker_twitter || null,
      maker_avatar_url: form.maker_avatar_url || null,
    };

    if (editingId) {
      await supabase.from('products').update(payload).eq('id', editingId);
    } else {
      await supabase.from('products').insert(payload);
    }

    setForm(emptyForm);
    setShowForm(false);
    setEditingId(null);
    setSaving(false);
    fetchProducts();
  };

  const handleEdit = (product: Product) => {
    setForm({
      title: product.title,
      slug: product.slug,
      url: product.url,
      description: product.description ?? '',
      thumbnail_url: product.thumbnail_url ?? '',
      screenshots: product.screenshots.join(', '),
      tools_used: product.tools_used.join(', '),
      categories: product.categories.join(', '),
      tech_stack: product.tech_stack.join(', '),
      maker_name: product.maker_name ?? '',
      maker_url: product.maker_url ?? '',
      featured: product.featured,
      x_post_url: product.x_post_url ?? '',
      x_likes: product.x_likes ? product.x_likes.toString() : '',
      x_reposts: product.x_reposts ? product.x_reposts.toString() : '',
      x_replies: product.x_replies ? product.x_replies.toString() : '',
      x_views: product.x_views ? product.x_views.toString() : '',
      released_at: product.released_at ?? '',
      maker_twitter: product.maker_twitter ?? '',
      maker_avatar_url: product.maker_avatar_url ?? '',
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    await supabase.from('products').delete().eq('id', id);
    fetchProducts();
  };

  const cancelForm = () => {
    setForm(emptyForm);
    setShowForm(false);
    setEditingId(null);
  };

  if (loading) {
    return <div className="text-gray-400 text-sm">Loading products...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#1a1a1a]">Products</h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="text-sm font-medium bg-[#FF6B35] text-white px-4 py-2 rounded-lg hover:bg-[#e55a2b] transition-colors"
          >
            Add Product
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-[#1a1a1a] mb-4">
            {editingId ? 'Edit Product' : 'New Product'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Title *</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
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
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1">URL *</label>
              <input
                type="url"
                required
                value={form.url}
                onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35]"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Thumbnail URL</label>
              <input
                type="text"
                value={form.thumbnail_url}
                onChange={(e) => setForm((f) => ({ ...f, thumbnail_url: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Screenshots (comma separated URLs)</label>
              <input
                type="text"
                value={form.screenshots}
                onChange={(e) => setForm((f) => ({ ...f, screenshots: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Tools Used (comma separated)</label>
              <input
                type="text"
                value={form.tools_used}
                onChange={(e) => setForm((f) => ({ ...f, tools_used: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Categories (comma separated)</label>
              <input
                type="text"
                value={form.categories}
                onChange={(e) => setForm((f) => ({ ...f, categories: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Tech Stack (comma separated)</label>
              <input
                type="text"
                value={form.tech_stack}
                onChange={(e) => setForm((f) => ({ ...f, tech_stack: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Maker Name</label>
              <input
                type="text"
                value={form.maker_name}
                onChange={(e) => setForm((f) => ({ ...f, maker_name: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Maker URL</label>
              <input
                type="text"
                value={form.maker_url}
                onChange={(e) => setForm((f) => ({ ...f, maker_url: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Maker Twitter</label>
              <input
                type="text"
                value={form.maker_twitter}
                onChange={(e) => setForm((f) => ({ ...f, maker_twitter: e.target.value }))}
                placeholder="@handle"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Maker Avatar URL</label>
              <input
                type="text"
                value={form.maker_avatar_url}
                onChange={(e) => setForm((f) => ({ ...f, maker_avatar_url: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Release Date</label>
              <input
                type="date"
                value={form.released_at}
                onChange={(e) => setForm((f) => ({ ...f, released_at: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35]"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1">X Post URL</label>
              <input
                type="url"
                value={form.x_post_url}
                onChange={(e) => setForm((f) => ({ ...f, x_post_url: e.target.value }))}
                placeholder="https://x.com/user/status/123"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">X Views</label>
              <input
                type="number"
                value={form.x_views}
                onChange={(e) => setForm((f) => ({ ...f, x_views: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">X Likes</label>
              <input
                type="number"
                value={form.x_likes}
                onChange={(e) => setForm((f) => ({ ...f, x_likes: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">X Reposts</label>
              <input
                type="number"
                value={form.x_reposts}
                onChange={(e) => setForm((f) => ({ ...f, x_reposts: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">X Replies</label>
              <input
                type="number"
                value={form.x_replies}
                onChange={(e) => setForm((f) => ({ ...f, x_replies: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35]"
              />
            </div>
            <div className="flex items-center gap-2 md:col-span-2">
              <input
                type="checkbox"
                id="featured"
                checked={form.featured}
                onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
                className="rounded border-gray-300 text-[#FF6B35] focus:ring-[#FF6B35]"
              />
              <label htmlFor="featured" className="text-sm text-gray-600">Featured</label>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-6">
            <button
              type="submit"
              disabled={saving}
              className="text-sm font-medium bg-[#FF6B35] text-white px-4 py-2 rounded-lg hover:bg-[#e55a2b] transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : editingId ? 'Update Product' : 'Create Product'}
            </button>
            <button
              type="button"
              onClick={cancelForm}
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
              <th className="text-left px-4 py-3 font-medium text-gray-500">Title</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Slug</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Approved</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Featured</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Views</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Likes</th>
              <th className="text-right px-4 py-3 font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                  No products yet.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="border-b border-gray-50 last:border-0">
                  <td className="px-4 py-3 text-[#1a1a1a] font-medium">{product.title}</td>
                  <td className="px-4 py-3 text-gray-500">{product.slug}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block w-2 h-2 rounded-full ${
                        product.approved ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block w-2 h-2 rounded-full ${
                        product.featured ? 'bg-[#FF6B35]' : 'bg-gray-300'
                      }`}
                    />
                  </td>
                  <td className="px-4 py-3 text-gray-500">{product.views_count}</td>
                  <td className="px-4 py-3 text-gray-500">{product.likes_count}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-xs text-[#FF6B35] hover:underline mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
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
