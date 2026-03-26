'use client';

import { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export function LikeButton({
  productId,
  initialCount,
  initialLiked = false,
}: {
  productId: string;
  initialCount: number;
  initialLiked?: boolean;
}) {
  const { user } = useAuth();
  const router = useRouter();
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      router.push('/auth');
      return;
    }

    if (loading) return;
    setLoading(true);

    const supabase = createClient();

    if (liked) {
      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);
      if (!error) {
        setLiked(false);
        setCount((c) => Math.max(0, c - 1));
      }
    } else {
      const { error } = await supabase
        .from('likes')
        .insert({ user_id: user.id, product_id: productId });
      if (!error) {
        setLiked(true);
        setCount((c) => c + 1);
      }
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-1 text-xs text-gray-400 hover:text-accent transition-colors shrink-0"
      aria-label={liked ? 'Unlike' : 'Like'}
    >
      <svg
        className={`w-4 h-4 ${liked ? 'text-accent fill-accent' : ''}`}
        fill={liked ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      {count > 0 && <span>{count}</span>}
    </button>
  );
}
