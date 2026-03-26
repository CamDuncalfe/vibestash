'use client';

import { useState } from 'react';
import Image from 'next/image';

export function ScreenshotGallery({
  screenshots,
  title,
}: {
  screenshots: string[];
  title: string;
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (screenshots.length === 0) return null;

  return (
    <div>
      {/* Main Image */}
      <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-gray-100">
        <Image
          src={screenshots[selectedIndex]}
          alt={`${title} screenshot ${selectedIndex + 1}`}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, 720px"
        />
      </div>

      {/* Thumbnails */}
      {screenshots.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {screenshots.map((src, i) => (
            <button
              key={i}
              onClick={() => setSelectedIndex(i)}
              className={`relative w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-colors ${
                i === selectedIndex
                  ? 'border-[#FF6B35]'
                  : 'border-transparent hover:border-gray-300'
              }`}
            >
              <Image
                src={src}
                alt={`${title} thumbnail ${i + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
