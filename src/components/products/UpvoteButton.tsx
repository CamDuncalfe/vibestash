'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

interface UpvoteButtonProps {
  productId: string;
  initialCount: number;
  variant?: 'default' | 'card';
}

export function UpvoteButton({ productId, initialCount, variant = 'default' }: UpvoteButtonProps) {
  const [count, setCount] = useState(initialCount);
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function checkUpvoteStatus() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('upvotes')
        .select('id')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .single();

      setIsUpvoted(!!data);
    }

    checkUpvoteStatus();
  }, [productId, supabase]);

  const handleUpvote = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = '/auth';
      return;
    }

    setIsLoading(true);

    if (isUpvoted) {
      const { error } = await supabase
        .from('upvotes')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (!error) {
        setIsUpvoted(false);
        setCount(count - 1);
        await supabase.rpc('decrement_upvotes', { product_id: productId });
      }
    } else {
      const { error } = await supabase
        .from('upvotes')
        .insert({ user_id: user.id, product_id: productId });

      if (!error) {
        setIsUpvoted(true);
        setCount(count + 1);
        await supabase.rpc('increment_upvotes', { product_id: productId });
      }
    }

    setIsLoading(false);
  };

  const isCard = variant === 'card';

  return (
    <button
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleUpvote(); }}
      disabled={isLoading}
      className={`flex flex-none cursor-pointer items-center justify-center rounded-full transition-colors select-none disabled:opacity-50 ${
        isCard
          ? `w-9 h-9 ${
              isUpvoted
                ? 'bg-accent text-white'
                : 'bg-mbogray-800/80 dark:bg-mbogray-700/90 text-mbogray-300 dark:text-mbogray-400 hover:bg-mbogray-700 dark:hover:bg-mbogray-600'
            }`
          : `h-8 gap-1 border px-2.5 text-xs font-medium ${
              isUpvoted
                ? 'border-accent bg-accent text-white'
                : 'border-mbogray-200 dark:border-mbogray-700 bg-white dark:bg-mbogray-800 text-mbogray-600 dark:text-mbogray-300 hover:bg-mbogray-50 dark:hover:bg-mbogray-700'
            }`
      }`}
      title={isUpvoted ? 'Remove upvote' : 'Upvote this product'}
    >
      <svg
        className={isCard ? 'w-3.5 h-3.5' : 'w-3 h-3'}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 15l7-7 7 7"
        />
      </svg>
      {!isCard && count > 0 && <span>{count}</span>}
    </button>
  );
}
