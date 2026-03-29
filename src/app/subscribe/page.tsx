import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { SubscribeContent } from './SubscribeContent';

export const metadata: Metadata = {
  title: 'Subscribe — VibeStash',
  description: 'New vibe-coded drops in your inbox every week. Free. No spam. Just the good stuff.',
};

export default async function SubscribePage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from('products')
    .select('id, title, slug, thumbnail_url')
    .eq('approved', true)
    .order('created_at', { ascending: false })
    .limit(6);

  return <SubscribeContent recentProducts={products || []} />;
}
