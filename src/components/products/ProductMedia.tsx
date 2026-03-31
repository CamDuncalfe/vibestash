'use client';

import { useState, useRef } from 'react';

interface ProductMediaProps {
  videoUrl: string | null;
  thumbnailUrl: string | null;
  screenshots: string[];
  title: string;
}

export function ProductMedia({ videoUrl, thumbnailUrl, screenshots, title }: ProductMediaProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // If we have a video, show it prominently
  if (videoUrl) {
    return (
      <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-mbogray-100 dark:bg-mbogray-800 group cursor-pointer" onClick={togglePlay}>
        <video
          ref={videoRef}
          src={videoUrl}
          poster={thumbnailUrl || undefined}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        />
        {/* Play/Pause overlay */}
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
          <div className="w-14 h-14 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
            {isPlaying ? (
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Fall back to thumbnail (using regular img to avoid next/image fill issues with Supabase URLs)
  const allImages = [
    ...(thumbnailUrl ? [thumbnailUrl] : []),
    ...screenshots.filter((s) => s !== thumbnailUrl),
  ];

  if (allImages.length === 0) return null;

  return (
    <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-mbogray-100 dark:bg-mbogray-800">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={allImages[0]}
        alt={`${title} preview`}
        className="w-full h-full object-cover"
        loading="eager"
      />
    </div>
  );
}
