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

const finalBatch = [
  {
    title: 'Staggering Beauty',
    slug: 'staggering-beauty',
    url: 'http://www.staggeringbeauty.com',
    description: 'Wiggle a worm. Wiggle it a LOT. SEIZURE WARNING. Classic weird internet.',
    categories: ['Fun'],
    tools_used: [],
    tech_stack: [],
    screenshots: [],
    approved: true
  },
  {
    title: 'Is It Christmas?',
    slug: 'is-it-christmas',
    url: 'https://isitchristmas.com',
    description: 'Answers the eternal question: is it Christmas? Usually no. Once a year: yes.',
    categories: ['Fun'],
    tools_used: [],
    tech_stack: [],
    screenshots: [],
    approved: true
  },
  {
    title: 'Zoom Earth',
    slug: 'zoom-earth',
    url: 'https://zoom.earth',
    description: 'Real-time weather and storms from space. Beautiful and surprisingly useful.',
    categories: ['Fun', 'Education'],
    tools_used: [],
    tech_stack: [],
    screenshots: [],
    approved: true
  },
  {
    title: 'Little Alchemy',
    slug: 'little-alchemy',
    url: 'https://littlealchemy.com',
    description: 'Combine elements to discover 560+ items. Water + Fire = Steam. Addictive alchemy.',
    categories: ['Games'],
    tools_used: [],
    tech_stack: [],
    screenshots: [],
    approved: true
  },
  {
    title: 'Scribble Diffusion',
    slug: 'scribble-diffusion',
    url: 'https://scribblediffusion.com',
    description: 'Draw a sketch. AI turns it into a refined image. Replicate\'s ControlNet demo.',
    categories: ['AI', 'Art'],
    tools_used: ['Stable Diffusion', 'ControlNet'],
    tech_stack: [],
    screenshots: [],
    approved: true
  },
  {
    title: 'The Infinite Jukebox',
    slug: 'infinite-jukebox',
    url: 'https://eternalbox.dev/jukebox_index.html',
    description: 'Upload a song. It loops forever by jumping between similar beats. Mesmerizing.',
    categories: ['Music'],
    tools_used: [],
    tech_stack: [],
    screenshots: [],
    approved: true
  },
  {
    title: 'The Restart Page',
    slug: 'restart-page',
    url: 'http://www.therestartpage.com',
    description: 'Restart vintage computers. From Windows 95 to Mac OS. Nostalgic boot sounds.',
    categories: ['Fun'],
    tools_used: [],
    tech_stack: [],
    screenshots: [],
    approved: true
  },
  {
    title: 'Null Island',
    slug: 'null-island',
    url: 'https://null-island.netlify.app',
    description: 'The most mapped place on earth that doesn\'t exist. 0°N, 0°E. Geographic null pointer.',
    categories: ['Fun', 'Education'],
    tools_used: [],
    tech_stack: [],
    screenshots: [],
    approved: true
  },
  {
    title: 'Earth.fm',
    slug: 'earth-fm',
    url: 'https://earth.fm',
    description: 'Sounds from nature around the world. Rainforests, oceans, mountains. Ambient paradise.',
    categories: ['Music'],
    tools_used: [],
    tech_stack: [],
    screenshots: [],
    approved: true
  },
  {
    title: 'The Wiki Game',
    slug: 'wiki-game',
    url: 'https://www.thewikigame.com',
    description: 'Race to click from one Wikipedia article to another. Surprisingly competitive.',
    categories: ['Games'],
    tools_used: [],
    tech_stack: [],
    screenshots: [],
    approved: true
  },
  {
    title: 'Space Engine',
    slug: 'space-engine',
    url: 'http://spaceengine.org',
    description: 'Explore a procedurally generated universe. Every star, planet, galaxy. Free (desktop).',
    categories: ['Games', 'Education'],
    tools_used: [],
    tech_stack: [],
    screenshots: [],
    approved: true
  },
  {
    title: 'Radio Garden',
    slug: 'radio-garden',
    url: 'http://radio.garden',
    description: 'Spin a globe. Listen to live radio from anywhere. Instant global travel.',
    categories: ['Music'],
    tools_used: [],
    tech_stack: [],
    screenshots: [],
    approved: true
  },
  {
    title: 'Maze Generator',
    slug: 'maze-generator',
    url: 'https://www.mazegenerator.net',
    description: 'Generate printable mazes. Customizable size and difficulty. Retro but useful.',
    categories: ['Games'],
    tools_used: [],
    tech_stack: [],
    screenshots: [],
    approved: true
  },
  {
    title: 'Type Racer',
    slug: 'type-racer',
    url: 'https://play.typeracer.com',
    description: 'Race against others by typing quotes. Oddly competitive. Good for WPM training.',
    categories: ['Games'],
    tools_used: [],
    tech_stack: [],
    screenshots: [],
    approved: true
  },
  {
    title: 'Monkeytype',
    slug: 'monkeytype',
    url: 'https://monkeytype.com',
    description: 'Minimalist typing test. Clean UI. Tracks WPM and accuracy. Beloved by mechanical keyboard nerds.',
    categories: ['Games'],
    tools_used: [],
    tech_stack: [],
    screenshots: [],
    approved: true
  },
  {
    title: 'Guess the Year',
    slug: 'guess-the-year',
    url: 'https://neal.fun/guess-the-year/',
    description: 'See photos. Guess the year. Harder than you think.',
    categories: ['Games'],
    tools_used: [],
    tech_stack: [],
    screenshots: [],
    approved: true
  },
  {
    title: 'Universe Sandbox',
    slug: 'universe-sandbox',
    url: 'https://universesandbox.com',
    description: 'Physics-based universe simulator. Smash planets. Create black holes. Paid but worth it.',
    categories: ['Games', 'Education'],
    tools_used: [],
    tech_stack: [],
    screenshots: [],
    approved: true
  },
  {
    title: 'Semantris',
    slug: 'semantris',
    url: 'https://research.google.com/semantris/',
    description: 'Word association games powered by AI. Type words related to clues. Fast-paced.',
    categories: ['Games', 'AI'],
    tools_used: ['Machine Learning'],
    tech_stack: [],
    screenshots: [],
    approved: true
  },
  {
    title: 'Can You Run It',
    slug: 'can-you-run-it',
    url: 'https://www.systemrequirementslab.com/cyri',
    description: 'Check if your PC can run a game. Scans your system. Been around forever.',
    categories: ['Games'],
    tools_used: [],
    tech_stack: [],
    screenshots: [],
    approved: true
  },
  {
    title: 'Pixel Thoughts',
    slug: 'pixel-thoughts',
    url: 'http://www.pixelthoughts.co',
    description: '60-second meditation. Puts your problems in cosmic perspective. Calming.',
    categories: ['Fun'],
    tools_used: [],
    tech_stack: [],
    screenshots: [],
    approved: true
  },
  {
    title: 'Cat Bounce',
    slug: 'cat-bounce',
    url: 'http://cat-bounce.com',
    description: 'Bouncing cats. That\'s it. Drag them around. Peak 2011 web.',
    categories: ['Fun'],
    tools_used: [],
    tech_stack: [],
    screenshots: [],
    approved: true
  },
  {
    title: 'Blob Opera',
    slug: 'blob-opera',
    url: 'https://artsandculture.google.com/experiment/blob-opera/AAHWrq360NcGbw',
    description: 'Make blobs sing opera by dragging them. Google\'s ML experiment. Surprisingly musical.',
    categories: ['Music', 'AI'],
    tools_used: ['Machine Learning'],
    tech_stack: [],
    screenshots: [],
    approved: true
  },
  {
    title: 'A Soft Murmur',
    slug: 'a-soft-murmur',
    url: 'https://asoftmurmur.com',
    description: 'Mix ambient sounds. Rain, thunder, waves, fire. Perfect focus tool.',
    categories: ['Music'],
    tools_used: [],
    tech_stack: [],
    screenshots: [],
    approved: true
  },
  {
    title: 'Typatone',
    slug: 'typatone',
    url: 'https://typatone.com',
    description: 'Every letter makes a musical note. Your writing becomes a song.',
    categories: ['Music', 'Fun'],
    tools_used: [],
    tech_stack: [],
    screenshots: [],
    approved: true
  },
  {
    title: 'Font in Use',
    slug: 'font-in-use',
    url: 'https://fontsinuse.com',
    description: 'Archive of typography in the real world. Design nerds rejoice.',
    categories: ['Art'],
    tools_used: [],
    tech_stack: [],
    screenshots: [],
    approved: true
  },
  {
    title: 'Archive.org Wayback Machine',
    slug: 'wayback-machine',
    url: 'https://web.archive.org',
    description: 'Time travel to old websites. 866 billion pages archived. Essential internet history.',
    categories: ['Fun', 'Education'],
    tools_used: [],
    tech_stack: [],
    screenshots: [],
    approved: true
  },
  {
    title: 'Is It Big?',
    slug: 'is-it-big',
    url: 'https://isitbig.org',
    description: 'Upload a photo. It tells you if it\'s big. Absurdist ML at its finest.',
    categories: ['AI', 'Fun'],
    tools_used: ['Machine Learning'],
    tech_stack: [],
    screenshots: [],
    approved: true
  },
  {
    title: 'AI Dungeon',
    slug: 'ai-dungeon',
    url: 'https://aidungeon.io',
    description: 'Infinite text-based adventure game. GPT-powered. Go anywhere, do anything.',
    categories: ['Games', 'AI'],
    tools_used: ['GPT'],
    tech_stack: [],
    screenshots: [],
    approved: true
  },
  {
    title: 'Bruno Simon',
    slug: 'bruno-simon',
    url: 'https://bruno-simon.com',
    description: 'Drive a car around a 3D portfolio. WebGL flex. Inspired thousands of copycats.',
    categories: ['Art'],
    tools_used: ['Three.js'],
    tech_stack: [],
    screenshots: [],
    approved: true
  },
  {
    title: 'Codepen',
    slug: 'codepen',
    url: 'https://codepen.io',
    description: 'Playground for web experiments. Home of vibe-coded demos. Essential for inspiration.',
    categories: ['Dev'],
    tools_used: [],
    tech_stack: [],
    screenshots: [],
    approved: true
  }
];

async function addTools() {
  console.log(`Adding ${finalBatch.length} final tools...\n`);
  
  for (const tool of finalBatch) {
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
  
  console.log('\nDone! Vibestash is now 100% memeable.');
}

addTools();
