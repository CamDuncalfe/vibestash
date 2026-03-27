'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

interface UpvoteButtonProps {
  productId: string;
  initialCount: number;
}

export function UpvoteButton({ productId, initialCount }: UpvoteButtonProps) {
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
      // Remove upvote
      const { error } = await supabase
        .from('upvotes')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (!error) {
        setIsUpvoted(false);
        setCount(count - 1);

        // Update product count
        await supabase.rpc('decrement_upvotes', { product_id: productId });
      }
    } else {
      // Add upvote
      const { error } = await supabase
        .from('upvotes')
        .insert({ user_id: user.id, product_id: productId });

      if (!error) {
        setIsUpvoted(true);
        setCount(count + 1);

        // Update product count
        await supabase.rpc('increment_upvotes', { product_id: productId });
      }
    }

    setIsLoading(false);
  };

  return (
    <button
      onClick={handleUpvote}
      disabled={isLoading}
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-sm font-medium transition-all ${
        isUpvoted
          ? 'bg-[#FF6B35] text-white'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      } disabled:opacity-50`}
      title={isUpvoted ? 'Remove upvote' : 'Upvote this product'}
    >
      <svg
        className={`w-4 h-4 ${isUpvoted ? '' : 'text-gray-500'}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 15l7-7 7 7"
        />
      </svg>
      <span>{count}</span>
    </button>
  );
}
