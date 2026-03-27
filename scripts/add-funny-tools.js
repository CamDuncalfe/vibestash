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

const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();

const funnyTools = [
  {
    title: 'ThisPersonDoesNotExist',
    slug: 'this-person-does-not-exist',
    url: 'https://thispersondoesnotexist.com',
    description: 'AI-generated faces that look real but don\'t exist. Refresh for a new person. Weirdly addictive.',
    categories: ['AI', 'Fun'],
    tools_used: ['StyleGAN'],
    tech_stack: [],
    screenshots: [],
    approved: true
  },
  {
    title: 'InspiroBot',
    slug: 'inspirobot',
    url: 'https://inspirobot.me',
    description: 'AI that generates hilariously nonsensical inspirational posters. Sometimes deep, mostly absurd.',
    categories: ['AI', 'Fun'],
    tools_used: [],
    tech_stack: [],
    screenshots: [],
    approved: true
  },
  {
    title: 'The Password Game',
    slug: 'the-password-game',
    url: 'https://neal.fun/password-game/',
    description: 'Create a password that meets increasingly ridiculous requirements. You will lose.',
    categories: ['Games'],
    tools_used: [],
    tech_stack: [],
    screenshots: [],
    approved: true
  },
  {
    title: 'Infinite Craft',
    slug: 'infinite-craft',
    url: 'https://neal.fun/infinite-craft/',
    description: 'Combine elements to discover new ones. Start with water, fire, wind, earth. Addictive.',
    categories: ['Games'],
    tools_used: [],
    tech_stack: [],
    screenshots: [],
    approved: true
  },
  {
    title: 'Absurd Trolley Problems',
    slug: 'absurd-trolley-problems',
    url: 'https://neal.fun/absurd-trolley-problems/',
    description: 'The trolley problem but increasingly absurd. Would you rather kill 5 clowns or 1 mime?',
    categories: ['Games'],
    tools_used: [],
    tech_stack: [],
    screenshots: [],
    approved: true
  },
  {
    title: 'Draw a Perfect Circle',
    slug: 'draw-a-perfect-circle',
    url: 'https://neal.fun/perfect-circle/',
    description: 'Can you draw a perfect circle freehand? Spoiler: you cannot.',
    categories: ['Games'],
    tools_used: [],
    tech_stack: [],
    screenshots: [],
    approved: true
  },
  {
    title: 'Design the next iPhone',
    slug: 'design-the-next-iphone',
    url: 'https://neal.fun/design-the-next-iphone/',
    description: 'Add cameras to an iPhone. See how ridiculous it gets. Infinite cameras mode unlocked.',
    categories: ['Fun'],
    tools_used: [],
    tech_stack: [],
    screenshots: [],
    approved: true
  },
  {
    title: 'Asteroid Launcher',
    slug: 'asteroid-launcher',
    url: 'https://neal.fun/asteroid-launcher/',
    description: 'Drop an asteroid anywhere on Earth. See the destruction. Educational and terrifying.',
    categories: ['Fun'],
    tools_used: [],
    tech_stack: [],
    screenshots: [],
    approved: true
  },
  {
    title: 'Hacker Typer',
    slug: 'hacker-typer',
    url: 'https://hackertyper.net',
    description: 'Look like a hacker in movies. Just mash the keyboard. Perfect for pranks.',
    categories: ['Fun'],
    tools_used: [],
    tech_stack: [],
    screenshots: [],
    approved: true
  },
  {
    title: 'Pointer Pointer',
    slug: 'pointer-pointer',
    url: 'https://pointerpointer.com',
    description: 'Move your cursor. A photo appears of someone pointing exactly at it. Every. Single. Time.',
    categories: ['Fun'],
    tools_used: [],
    tech_stack: [],
    screenshots: [],
    approved: true
  },
  {
    title: 'The Useless Web',
    slug: 'the-useless-web',
    url: 'https://theuselessweb.com',
    description: 'Takes you to a random useless website. Perfect when you should be working.',
    categories: ['Fun'],
    tools_used: [],
    tech_stack: [],
    screenshots: [],
    approved: true
  },
  {
    title: 'Weavesilk',
    slug: 'weavesilk',
    url: 'http://weavesilk.com',
    description: 'Draw beautiful symmetrical patterns. Mesmerizing and chill. Warning: time vortex.',
    categories: ['Art'],
    tools_used: [],
    tech_stack: [],
    screenshots: [],
    approved: true
  },
  {
    title: 'Quick, Draw!',
    slug: 'quick-draw',
    url: 'https://quickdraw.withgoogle.com',
    description: 'Google\'s AI tries to guess what you\'re drawing. You have 20 seconds. Good luck.',
    categories: ['Games', 'AI'],
    tools_used: ['Machine Learning'],
    tech_stack: [],
    screenshots: [],
    approved: true
  },
  {
    title: 'Akinator',
    slug: 'akinator',
    url: 'https://en.akinator.com',
    description: 'Think of a character. The genie will guess it. Somehow always right. Black magic.',
    categories: ['Games'],
    tools_used: [],
    tech_stack: [],
    screenshots: [],
    approved: true
  },
  {
    title: 'Windows93',
    slug: 'windows93',
    url: 'https://windows93.net',
    description: 'A fictional OS that never existed. Fully functional, completely insane. Peak internet.',
    categories: ['Fun'],
    tools_used: [],
    tech_stack: [],
    screenshots: [],
    approved: true
  },
  {
    title: 'ThisCatDoesNotExist',
    slug: 'this-cat-does-not-exist',
    url: 'https://thiscatdoesnotexist.com',
    description: 'AI-generated cats. Like ThisPersonDoesNotExist but with cats. Obviously better.',
    categories: ['AI', 'Fun'],
    tools_used: ['StyleGAN'],
    tech_stack: [],
    screenshots: [],
    approved: true
  },
  {
    title: 'RoboHash',
    slug: 'robohash',
    url: 'https://robohash.org',
    description: 'Generate unique robot/monster avatars from any text. Same input = same robot. Deterministic chaos.',
    categories: ['Art'],
    tools_used: [],
    tech_stack: [],
    screenshots: [],
    approved: true
  },
  {
    title: 'Sandboxels',
    slug: 'sandboxels',
    url: 'https://neal.fun/sandboxels/',
    description: 'Falling sand game on steroids. Mix elements, watch chaos unfold. RIP productivity.',
    categories: ['Games'],
    tools_used: [],
    tech_stack: [],
    screenshots: [],
    approved: true
  },
  {
    title: 'Internet Artifacts',
    slug: 'internet-artifacts',
    url: 'https://neal.fun/internet-artifacts/',
    description: 'A museum of internet history. From dancing baby to loss.jpg. Nostalgic and cursed.',
    categories: ['Fun'],
    tools_used: [],
    tech_stack: [],
    screenshots: [],
    approved: true
  },
  {
    title: 'Patatap',
    slug: 'patatap',
    url: 'https://patatap.com',
    description: 'Press keys to create sounds and animations. Synesthetic experience in your browser.',
    categories: ['Art', 'Music'],
    tools_used: [],
    tech_stack: [],
    screenshots: [],
    approved: true
  }
];

async function addTools() {
  console.log(`Adding ${funnyTools.length} funny tools...\n`);
  
  for (const tool of funnyTools) {
    const { data, error} = await supabase
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
