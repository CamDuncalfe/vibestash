import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';
import { collections } from '@/data/collections';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://vibestash.fun';

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/collections`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/tools`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/submit`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${baseUrl}/subscribe`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/supporters`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.1 },
    { url: `${baseUrl}/products/picks`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/products/popular`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
  ];

  // Collection pages
  const collectionPages: MetadataRoute.Sitemap = collections.map((c) => ({
    url: `${baseUrl}/collections/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // Product pages from Supabase
  let productPages: MetadataRoute.Sitemap = [];
  try {
    const supabase = await createClient();
    const { data: products } = await supabase
      .from('products')
      .select('slug, updated_at')
      .eq('approved', true)
      .order('updated_at', { ascending: false });

    if (products) {
      productPages = products.map((p) => ({
        url: `${baseUrl}/products/${p.slug}`,
        lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.5,
      }));
    }
  } catch (e) {
    console.error('Sitemap: failed to fetch products', e);
  }

  // Tool pages - fetch distinct tools from products
  let toolPages: MetadataRoute.Sitemap = [];
  try {
    const supabase = await createClient();
    const { data: tools } = await supabase
      .from('tools')
      .select('slug');

    if (tools) {
      toolPages = tools.map((t) => ({
        url: `${baseUrl}/tools/${t.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }));
    }
  } catch (e) {
    // Tools table might not exist; skip silently
  }

  return [...staticPages, ...collectionPages, ...productPages, ...toolPages];
}
