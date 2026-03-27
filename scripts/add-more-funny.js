const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read .env.local manually
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) env[match[1]] = match[2];
});

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
);

const moreFunny = [
  {
    title: 'Radiooooo',
    slug: 'radiooooo',
    url: 'https://radiooooo.com',
    description: 'Time machine radio. Pick a country and decade, hear music from that era. Oddly addictive.',
    categories: ['Music'],
    tools_used: [],
    tech_stack: [],
    screenshots: [],
    approved: true
  },
  {
    title: 'Silk – Interactive Generative Art',
    slug: 'silk-generative-art',
    url: 'http://weavesilk.com',
    description: 'Draw flowing, symmetrical patterns. Meditative and beautiful. Made by yuri.',
    categories: ['Art'],
    tools_used: [],
    tech_stack: [],
    screenshots: [],
    approved: true
  },
  {
    title: 'Patience, A Git Diff',
    slug: 'patience-diff',
    url: 'https://mzl.la/patience',
    description: 'Git diff that reveals one character at a time. Excruciatingly slow. Perfectly useless.',
    categories: ['Dev', 'Fun'],
    tools_used: [],
    tech_stack: [],
    screenshots: [],
    approved: true
  },
  {
    title: 'Koalas to the Max',
    slug: 'koalas-to-the-max',
    url: 'http://www.koalastothemax.com',
    description: 'Move your cursor over circles. They split into smaller circles. Reveal the koala.',
    categories: ['Fun'],
    tools_used: [],
    tech_stack: [],
    screenshots: [],
    approved: true
  },
  {
    title: 'Donger List',
    slug: 'donger-list',
    url: 'https://dongerlist.com',
    description: 'Copy and paste text emoticons. ( ͡° ͜ʖ ͡°) Essential internet infrastructure.',
    categories: ['Fun'],
    tools_used: [],
    tech_stack: [],
    screenshots: [],
    approved: true
  },
  {
    title: 'The Scale of the Universe',
    slug: 'scale-of-universe',
    url: 'https://htwins.net/scale2/',
    description: 'Zoom from quantum foam to the observable universe. Mind = blown.',
    categories: ['Education', 'Fun'],
    tools_used: [],
    tech_stack: [],
    screenshots: [],
    approved: true
  },
  {
    title: 'Generative FM',
    slug: 'generative-fm',
    url: 'https://generative.fm',
    description: 'Infinite generative music. Never repeats. Focus or chill mode.',
    categories: ['Music'],
    tools_used: ['Tone.js'],
    tech_stack: [],
    screenshots: [],
    approved: true
  },
  {
    title: 'Window Swap',
    slug: 'window-swap',
    url: 'https://window-swap.com',
    description: 'Look through someone else\'s window. Random real windows from around the world.',
    categories: ['Fun'],
    tools_used: [],
    tech_stack: [],
    screenshots: [],
    approved: true
  },
  {
    title: 'Every Noise at Once',
    slug: 'every-noise',
    url: 'https://everynoise.com',
    description: 'Map of every music genre. Click to hear examples. Spotify\'s secret weapon.',
    categories: ['Music'],
    tools_used: [],
    tech_stack: [],
    screenshots: [],
    approved: true
  },
  {
    title: 'The Deep Sea',
    slug: 'the-deep-sea',
    url: 'https://neal.fun/deep-sea/',
    description: 'Scroll down through ocean depths. Learn about creatures along the way. Gets dark.',
    categories: ['Education', 'Fun'],
    tools_used: [],
    tech_stack: [],
    screenshots: [],
    approved: true
  },
  {
    title: 'Life Stats',
    slug: 'life-stats',
    url: 'https://neal.fun/life-stats/',
    description: 'Enter your birthday. See how many times your heart has beaten. Existential crisis included.',
    categories: ['Fun'],
    tools_used: [],
    tech_stack: [],
    screenshots: [],
    approved: true
  },
  {
    title: 'Progress',
    slug: 'progress',
    url: 'https://neal.fun/progress/',
    description: 'How far through the year/day/life are you? Motivating or depressing. You decide.',
    categories: ['Fun'],
    tools_used: [],
    tech_stack: [],
    screenshots: [],
    approved: true
  },
  {
    title: 'Paper Dolls',
    slug: 'paper-dolls',
    url: 'https://neal.fun/paper-dolls/',
    description: 'Dress up paper dolls from different time periods. Wholesome fun.',
    categories: ['Art', 'Fun'],
    tools_used: [],
    tech_stack: [],
    screenshots: [],
    approved: true
  },
  {
    title: 'Let Me Google That For You',
    slug: 'lmgtfy',
    url: 'https://letmegooglethat.com',
    description: 'For people who ask questions they could Google. Passive-aggressive but helpful.',
    categories: ['Fun'],
    tools_used: [],
    tech_stack: [],
    screenshots: [],
    approved: true
  },
  {
    title: 'Incredibox',
    slug: 'incredibox',
    url: 'https://www.incredibox.com',
    description: 'Make music by dragging sounds onto beatboxers. Surprisingly good. Went viral on TikTok.',
    categories: ['Music', 'Games'],
    tools_used: [],
    tech_stack: [],
    screenshots: [],
    approved: true
  },
  {
    title: 'AI Weirdness',
    slug: 'ai-weirdness',
    url: 'https://aiweirdness.com',
    description: 'Blog about AI doing weird things. Not a tool but essential reading. Janelle Shane\'s work.',
    categories: ['AI', 'Fun'],
    tools_used: [],
    tech_stack: [],
    screenshots: [],
    approved: true
  },
  {
    title: 'Random Street View',
    slug: 'random-street-view',
    url: 'https://randomstreetview.com',
    description: 'Drop into a random Google Street View location. Instant teleportation.',
    categories: ['Fun'],
    tools_used: ['Google Maps API'],
    tech_stack: [],
    screenshots: [],
    approved: true
  },
  {
    title: 'GeoGuessr',
    slug: 'geoguessr',
    description: 'Guess where you are from Google Street View. Insanely addictive. Time sink warning.',
    url: 'https://www.geoguessr.com',
    categories: ['Games'],
    tools_used: ['Google Maps'],
    tech_stack: [],
    screenshots: [],
    approved: true
  },
  {
    title: 'Eel Slap',
    slug: 'eel-slap',
    url: 'http://eelslap.com',
    description: 'Move your mouse. An eel slaps a guy. That\'s it. Peak internet 2013.',
    categories: ['Fun'],
    tools_used: [],
    tech_stack: [],
    screenshots: [],
    approved: true
  },
  {
    title: 'Bongo Cat',
    slug: 'bongo-cat',
    url: 'https://bongo.cat',
    description: 'A cat plays bongos with your keyboard. Essential working from home tool.',
    categories: ['Fun', 'Music'],
    tools_used: [],
    tech_stack: [],
    screenshots: [],
    approved: true
  }
];

async function addTools() {
  console.log(`Adding ${moreFunny.length} more funny tools...\n`);
  
  for (const tool of moreFunny) {
    const { data, error } = await supabase
      .from('products')
      .insert(tool)
      .select();
    
    if (error) {
      console.error(`✗ Error adding ${tool.title}:`, error.message);
    } else {
      console.log(`✓ Added ${tool.title}`);
    }
  }
  
  console.log('\nDone!');
}

addTools();
