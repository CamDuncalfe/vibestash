'use client';

import { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export function LikeButton({
  productId,
  initialCount,
  initialLiked = false,
  variant = 'default',
}: {
  productId: string;
  initialCount: number;
  initialLiked?: boolean;
  variant?: 'default' | 'card';
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

  const isCard = variant === 'card';

  return (
    <button
      onClick={handleClick}
      className={`flex flex-none cursor-pointer items-center justify-center rounded-full transition-colors select-none ${
        isCard
          ? `w-9 h-9 ${
              liked
                ? 'bg-accent/20 text-accent'
                : 'bg-mbogray-800/80 dark:bg-mbogray-700/90 text-mbogray-300 dark:text-mbogray-400 hover:bg-mbogray-700 dark:hover:bg-mbogray-600'
            }`
          : `h-8 w-8 border ${
              liked
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-mbogray-200 dark:border-mbogray-700 bg-white dark:bg-mbogray-800 text-mbogray-400 dark:text-mbogray-500 hover:bg-mbogray-50 dark:hover:bg-mbogray-700 hover:text-accent'
            }`
      }`}
      aria-label={liked ? 'Unlike' : 'Like'}
    >
      <svg
        className={isCard ? 'w-4 h-4' : 'w-3.5 h-3.5'}
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
    </button>
  );
}
