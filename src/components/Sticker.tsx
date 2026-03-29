import Image from 'next/image';

/**
 * Emoji → 3D sticker mapping
 * Microsoft Fluent Emoji 3D (MIT license)
 */
const STICKER_MAP: Record<string, string> = {
  '⭐': '/stickers/star.png',
  '🔥': '/stickers/fire.png',
  '💰': '/stickers/money-bag.png',
  '🎮': '/stickers/video-game.png',
  '⚡': '/stickers/lightning.png',
  '🤪': '/stickers/zany.png',
  '💜': '/stickers/purple-heart.png',
  '🧡': '/stickers/orange-heart.png',
  '🌐': '/stickers/globe.png',
  '🛠️': '/stickers/wrench.png',
  '🚀': '/stickers/rocket.png',
  '🎉': '/stickers/party.png',
};

interface StickerProps {
  emoji: string;
  size?: number;
  className?: string;
  alt?: string;
}

export function Sticker({ emoji, size = 24, className = '', alt }: StickerProps) {
  const src = STICKER_MAP[emoji];

  if (!src) {
    // Fallback: render the emoji as text if no sticker found
    return <span className={className}>{emoji}</span>;
  }

  return (
    <Image
      src={src}
      alt={alt || emoji}
      width={size}
      height={size}
      className={`inline-block ${className}`}
      draggable={false}
    />
  );
}

/**
 * Get sticker path for a given emoji (useful for non-component contexts)
 */
export function getStickerPath(emoji: string): string | null {
  return STICKER_MAP[emoji] || null;
}
