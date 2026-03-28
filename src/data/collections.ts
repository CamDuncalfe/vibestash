export interface CollectionConfig {
  id: string;
  title: string;
  slug: string;
  description: string;
  emoji: string;
  productSlugs: string[];
}

export const collections: CollectionConfig[] = [
  {
    id: 'built-in-a-weekend',
    title: 'Built in a Weekend',
    slug: 'built-in-a-weekend',
    description: 'Products shipped in 48 hours or less',
    emoji: '⚡',
    productSlugs: [
      'slapmac',
      'fly-pieter',
      'is-it-vibe-coded',
      'waddle-box',
      'prompt-minecraft',
      'doom-captcha',
      'pong-wars',
      'milk-avatar',
      'doomscroll',
      'draw-a-perfect-circle',
    ],
  },
  {
    id: 'making-money',
    title: 'Making Money',
    slug: 'making-money',
    description: 'Products with revenue or paying users',
    emoji: '💰',
    productSlugs: [
      'inthebulletin',
      'subscribr',
      'menugen',
      'post-bridge',
      'scorpio-survival-ai',
      'feynman',
      'notchy',
      'make-ideas-great-again',
      'cureight',
    ],
  },
  {
    id: 'ai-games',
    title: 'AI Games',
    slug: 'ai-games',
    description: 'Games built with AI tools',
    emoji: '🎮',
    productSlugs: [
      'scorpio-survival-ai',
      'prompt-minecraft',
      'ai-dungeon',
      'semantris',
      'vibechess',
      'uncivilized',
      'absurd-trolley-problems',
      'waddle-box',
    ],
  },
  {
    id: 'staff-picks',
    title: 'Staff Picks',
    slug: 'staff-picks',
    description: 'Our favorites from the VibeStash collection',
    emoji: '⭐',
    productSlugs: [
      'menugen',
      'post-bridge',
      'slapmac',
      'iso-weather',
      'feynman',
      'notchy',
      'git-city',
      'scorpio-survival-ai',
      'make-ideas-great-again',
      'subscribr',
    ],
  },
  {
    id: 'most-viral',
    title: 'Most Viral',
    slug: 'most-viral',
    description: 'Highest engagement on X',
    emoji: '🔥',
    productSlugs: [
      'slapmac',
      'scorpio-survival-ai',
      'git-city',
      'post-bridge',
      'menugen',
      'make-ideas-great-again',
      'feynman',
      'iso-weather',
    ],
  },
];
