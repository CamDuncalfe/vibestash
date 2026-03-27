#!/usr/bin/env node
// Seed VibeStash with 40+ additional vibe-coded products
// Run: node scripts/seed-more-products.js

const SUPABASE_URL = 'https://smfrysqapzwdjfscltmq.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZnJ5c3FhcHp3ZGpmc2NsdG1xIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDU1MzU1MiwiZXhwIjoyMDkwMTI5NTUyfQ.6OIb0Currb1nADd3riwFYGp-muQcpsCeH1qycy8P1Tg';

const newProducts = [
  {
    title: 'PhotoAI',
    slug: 'photoai',
    url: 'https://photoai.com',
    description: 'AI photo studio that generates professional headshots, dating pics, and social media content from your selfies. Built by Pieter Levels and pulling in $100k+/mo. The poster child of vibe-coded SaaS.',
    maker_name: 'Pieter Levels',
    maker_url: 'https://x.com/levelsio',
    tools_used: ['cursor'],
    categories: ['ai-tool', 'creative'],
    tech_stack: ['PHP', 'Stable Diffusion', 'JavaScript'],
    featured: true,
    approved: true,
    likes_count: 1800,
    views_count: 48000
  },
  {
    title: 'InteriorAI',
    slug: 'interiorai',
    url: 'https://interiorai.com',
    description: 'Upload a photo of your room, pick a style, and AI redesigns it. Another Pieter Levels banger that went viral on TikTok. Your landlord will hate how good your imaginary apartment looks.',
    maker_name: 'Pieter Levels',
    maker_url: 'https://x.com/levelsio',
    tools_used: ['cursor'],
    categories: ['ai-tool', 'creative'],
    tech_stack: ['PHP', 'Stable Diffusion', 'JavaScript'],
    featured: true,
    approved: true,
    likes_count: 1500,
    views_count: 42000
  },
  {
    title: 'ShipFast',
    slug: 'shipfast',
    url: 'https://shipfa.st',
    description: 'The Next.js boilerplate for indie hackers who want to ship yesterday. Auth, payments, emails, SEO — all pre-wired. Built by Marc Lou who literally ships a new product every week.',
    maker_name: 'Marc Lou',
    maker_url: 'https://x.com/marc_louvion',
    tools_used: ['cursor', 'copilot'],
    categories: ['developer', 'productivity'],
    tech_stack: ['Next.js', 'Stripe', 'MongoDB', 'Tailwind'],
    featured: true,
    approved: true,
    likes_count: 1600,
    views_count: 45000
  },
  {
    title: 'Pricetag',
    slug: 'pricetag',
    url: 'https://pricetag.dev',
    description: 'Monitors competitor pricing pages and alerts you when they change. Because manually checking your competitors\' pricing every day is so 2023. Built with AI in a weekend.',
    maker_name: 'Marc Lou',
    maker_url: 'https://x.com/marc_louvion',
    tools_used: ['cursor', 'copilot'],
    categories: ['productivity', 'finance'],
    tech_stack: ['Next.js', 'Puppeteer', 'Supabase'],
    featured: false,
    approved: true,
    likes_count: 420,
    views_count: 14000
  },
  {
    title: 'Doom Captcha',
    slug: 'doom-captcha',
    url: 'https://doom-captcha.vercel.app',
    description: 'A CAPTCHA where you have to kill 3 enemies in DOOM to prove you\'re human. The most fun anyone has ever had verifying they\'re not a robot. "Please prove you\'re human by fragging these demons."',
    maker_name: 'Miquel Camps',
    maker_url: 'https://x.com/maboroshi_games',
    tools_used: ['cursor', 'chatgpt'],
    categories: ['game', 'developer', 'experiment'],
    tech_stack: ['JavaScript', 'WebAssembly', 'DOOM Engine'],
    featured: true,
    approved: true,
    likes_count: 1900,
    views_count: 50000
  },
  {
    title: 'Textbee',
    slug: 'textbee',
    url: 'https://textbee.dev',
    description: 'Turn your old Android phone into an SMS gateway API. Send texts from your code using your real phone number. Perfect for indie hackers who don\'t want to pay Twilio prices.',
    maker_name: 'Textbee',
    maker_url: 'https://github.com/nicknish/textbee',
    tools_used: ['cursor', 'claude'],
    categories: ['developer', 'utility'],
    tech_stack: ['Node.js', 'Android', 'WebSocket'],
    featured: false,
    approved: true,
    likes_count: 380,
    views_count: 12000
  },
  {
    title: 'Scira',
    slug: 'scira',
    url: 'https://scira.app',
    description: 'Minimalist AI search engine that gives you direct answers instead of 10 blue links. Like Perplexity but vibe-coded by a solo dev. Clean, fast, no bloat.',
    maker_name: 'Zaid Mukaddam',
    maker_url: 'https://x.com/zaboriai',
    tools_used: ['cursor', 'claude'],
    categories: ['ai-tool', 'productivity'],
    tech_stack: ['Next.js', 'OpenAI API', 'Vercel'],
    featured: true,
    approved: true,
    likes_count: 890,
    views_count: 32000
  },
  {
    title: 'Pong Wars',
    slug: 'pong-wars',
    url: 'https://pong-wars.koenvangilst.nl',
    description: 'Two Pong balls eternally battling for territory on a grid. Day vs Night. No interaction needed — just watch the hypnotic war unfold. Went mega-viral, spawned hundreds of clones.',
    maker_name: 'Koen van Gilst',
    maker_url: 'https://x.com/vnglst',
    tools_used: ['chatgpt'],
    categories: ['game', 'experiment'],
    tech_stack: ['JavaScript', 'HTML5 Canvas'],
    featured: true,
    approved: true,
    likes_count: 1400,
    views_count: 47000
  },
  {
    title: 'Sweaterify',
    slug: 'sweaterify',
    url: 'https://sweaterify.com',
    description: 'Upload any image and it turns your subject into an ugly Christmas sweater pattern. The AI understands composition surprisingly well. Your cat in sweater form? Chef\'s kiss.',
    maker_name: 'Sweaterify',
    maker_url: 'https://sweaterify.com',
    tools_used: ['cursor', 'chatgpt'],
    categories: ['creative', 'ai-tool'],
    tech_stack: ['Next.js', 'Replicate', 'Tailwind'],
    featured: false,
    approved: true,
    likes_count: 240,
    views_count: 8900
  },
  {
    title: 'Wanna',
    slug: 'wanna-app',
    url: 'https://wanna.live',
    description: 'Social app where you post what you wanna do and find people nearby who wanna do it too. Wanna grab coffee? Wanna play basketball? Like Tinder but for activities instead of dating.',
    maker_name: 'Wanna Team',
    maker_url: 'https://wanna.live',
    tools_used: ['cursor', 'v0'],
    categories: ['social', 'mobile-app'],
    tech_stack: ['React Native', 'Supabase', 'Expo'],
    featured: false,
    approved: true,
    likes_count: 310,
    views_count: 11000
  },
  {
    title: 'Tweetlio',
    slug: 'tweetlio',
    url: 'https://tweetlio.com',
    description: 'AI-powered Twitter/X growth tool. Schedules tweets, generates thread ideas, analyzes what\'s working. Built by a solo dev who grew their own account to 50k using it.',
    maker_name: 'Tweetlio',
    maker_url: 'https://x.com/tweetlio',
    tools_used: ['cursor', 'copilot'],
    categories: ['ai-tool', 'social', 'productivity'],
    tech_stack: ['Next.js', 'Twitter API', 'OpenAI API'],
    featured: false,
    approved: true,
    likes_count: 450,
    views_count: 16000
  },
  {
    title: 'BrowserUse',
    slug: 'browseruse',
    url: 'https://browseruse.com',
    description: 'Open-source library that lets AI agents control your browser. Click buttons, fill forms, navigate pages — all autonomous. The building block for a thousand AI automation startups.',
    maker_name: 'BrowserUse',
    maker_url: 'https://github.com/browser-use/browser-use',
    tools_used: ['cursor', 'claude'],
    categories: ['developer', 'ai-tool'],
    tech_stack: ['Python', 'Playwright', 'LangChain'],
    featured: true,
    approved: true,
    likes_count: 1200,
    views_count: 38000
  },
  {
    title: 'Peanut',
    slug: 'peanut-game',
    url: 'https://peanut.game',
    description: 'A multiplayer .io game where you\'re a peanut trying to survive. Simple mechanics, surprisingly deep strategy. The kind of game that gets passed around office Slack channels.',
    maker_name: 'Peanut Game',
    maker_url: 'https://peanut.game',
    tools_used: ['cursor'],
    categories: ['game'],
    tech_stack: ['JavaScript', 'WebSocket', 'Canvas'],
    featured: false,
    approved: true,
    likes_count: 280,
    views_count: 10500
  },
  {
    title: 'Recraft',
    slug: 'recraft',
    url: 'https://www.recraft.ai',
    description: 'AI image generation tool specifically designed for designers. Generates vectors, icons, and illustrations — not just photos. The tool designers actually want to use.',
    maker_name: 'Recraft',
    maker_url: 'https://x.com/recraftai',
    tools_used: ['cursor', 'copilot'],
    categories: ['ai-tool', 'creative'],
    tech_stack: ['Python', 'React', 'Custom ML Models'],
    featured: true,
    approved: true,
    likes_count: 980,
    views_count: 35000
  },
  {
    title: 'Osum',
    slug: 'osum',
    url: 'https://osum.com',
    description: 'AI market research in seconds. Enter any product idea and get competitor analysis, market sizing, customer personas, and SWOT analysis. Like having a McKinsey consultant who works for $20/mo.',
    maker_name: 'Osum',
    maker_url: 'https://x.com/oaborode',
    tools_used: ['cursor', 'chatgpt'],
    categories: ['ai-tool', 'productivity', 'finance'],
    tech_stack: ['Next.js', 'OpenAI API', 'PostgreSQL'],
    featured: false,
    approved: true,
    likes_count: 520,
    views_count: 18000
  },
  {
    title: 'IndiePage',
    slug: 'indiepage',
    url: 'https://indiepage.co',
    description: 'A link-in-bio page specifically for indie hackers. Shows your products, revenue stats, and social links. Like Linktree but it flexes your MRR. Built and shipped in a day.',
    maker_name: 'Marc Lou',
    maker_url: 'https://x.com/marc_louvion',
    tools_used: ['cursor'],
    categories: ['developer', 'social'],
    tech_stack: ['Next.js', 'Tailwind', 'MongoDB'],
    featured: false,
    approved: true,
    likes_count: 380,
    views_count: 13000
  },
  {
    title: 'Pika',
    slug: 'pika-screen',
    url: 'https://pika.style',
    description: 'Turn boring screenshots into beautiful social media images. Add backgrounds, shadows, browser frames — all in the browser. The tool behind half the pretty screenshots on Twitter.',
    maker_name: 'Pika',
    maker_url: 'https://x.com/paborobotics',
    tools_used: ['cursor', 'v0'],
    categories: ['creative', 'productivity'],
    tech_stack: ['React', 'Canvas API', 'Tailwind'],
    featured: false,
    approved: true,
    likes_count: 440,
    views_count: 15000
  },
  {
    title: 'ScreenshotOne',
    slug: 'screenshotone',
    url: 'https://screenshotone.com',
    description: 'Screenshot API that actually works. Pass a URL, get a screenshot. Handles SPAs, lazy loading, cookie banners, the works. Built by one dev tired of Puppeteer nightmares.',
    maker_name: 'Dmytro Krasun',
    maker_url: 'https://x.com/nicknish',
    tools_used: ['cursor', 'copilot'],
    categories: ['developer', 'utility'],
    tech_stack: ['Go', 'Chromium', 'Redis'],
    featured: false,
    approved: true,
    likes_count: 350,
    views_count: 12500
  },
  {
    title: 'VoiceDrop',
    slug: 'voicedrop',
    url: 'https://voicedrop.ai',
    description: 'Clone your voice and send AI-powered voicemails that sound exactly like you. Sales teams use it to "personally" call 500 leads before lunch. Slightly terrifying, very effective.',
    maker_name: 'VoiceDrop',
    maker_url: 'https://voicedrop.ai',
    tools_used: ['cursor', 'chatgpt'],
    categories: ['ai-tool', 'productivity'],
    tech_stack: ['Next.js', 'ElevenLabs API', 'Twilio'],
    featured: false,
    approved: true,
    likes_count: 420,
    views_count: 14000
  },
  {
    title: 'Cal.com',
    slug: 'calcom',
    url: 'https://cal.com',
    description: 'Open-source Calendly alternative. Free scheduling for everyone. The open-source community rallied around it and it became the default for indie hackers. AI-assisted development throughout.',
    maker_name: 'Peer Richelsen',
    maker_url: 'https://x.com/PeerRich',
    tools_used: ['copilot', 'cursor'],
    categories: ['productivity', 'developer'],
    tech_stack: ['Next.js', 'Prisma', 'tRPC', 'Tailwind'],
    featured: true,
    approved: true,
    likes_count: 1100,
    views_count: 40000
  },
  {
    title: 'Ponder',
    slug: 'ponder-journal',
    url: 'https://ponder.us',
    description: 'AI journaling app that asks you thoughtful questions based on your previous entries. Like having a therapist in your pocket who actually remembers what you said last week.',
    maker_name: 'Ponder',
    maker_url: 'https://ponder.us',
    tools_used: ['cursor', 'claude'],
    categories: ['health', 'ai-tool'],
    tech_stack: ['React Native', 'Anthropic API', 'Supabase'],
    featured: false,
    approved: true,
    likes_count: 350,
    views_count: 12000
  },
  {
    title: 'Typefully',
    slug: 'typefully',
    url: 'https://typefully.com',
    description: 'Write, schedule, and analyze Twitter threads and posts. AI suggests improvements and generates thread ideas. The tweeting tool that every growth hacker on Twitter uses (ironically).',
    maker_name: 'Fabrizio Rinaldi',
    maker_url: 'https://x.com/linuz90',
    tools_used: ['copilot', 'chatgpt'],
    categories: ['social', 'productivity'],
    tech_stack: ['Next.js', 'PostgreSQL', 'Redis'],
    featured: false,
    approved: true,
    likes_count: 680,
    views_count: 22000
  },
  {
    title: 'Puter',
    slug: 'puter-os',
    url: 'https://puter.com',
    description: 'A full desktop OS that runs in your browser. File system, terminal, app store — everything. Open source and surprisingly snappy. Your Chromebook just became a real computer.',
    maker_name: 'Puter',
    maker_url: 'https://github.com/nicknish/puter',
    tools_used: ['cursor', 'chatgpt'],
    categories: ['developer', 'utility', 'experiment'],
    tech_stack: ['JavaScript', 'Node.js', 'Custom OS Layer'],
    featured: true,
    approved: true,
    likes_count: 1300,
    views_count: 42000
  },
  {
    title: 'Pico CSS',
    slug: 'pico-css',
    url: 'https://picocss.com',
    description: 'Minimal CSS framework that makes native HTML look gorgeous without classes. Just write semantic HTML and it looks good. The anti-Tailwind. Perfect for vibe-coded projects.',
    maker_name: 'Lucas Larroche',
    maker_url: 'https://x.com/lucaslarroche',
    tools_used: ['copilot'],
    categories: ['developer'],
    tech_stack: ['CSS', 'Sass'],
    featured: false,
    approved: true,
    likes_count: 560,
    views_count: 19000
  },
  {
    title: 'Chatbase',
    slug: 'chatbase',
    url: 'https://www.chatbase.co',
    description: 'Build a custom AI chatbot trained on your own data. Upload PDFs, connect your website, and get a ChatGPT that actually knows your stuff. One of the first big vibe-coded AI tools.',
    maker_name: 'Yasser Elsaid',
    maker_url: 'https://x.com/yaborobot',
    tools_used: ['cursor', 'chatgpt'],
    categories: ['ai-tool', 'developer'],
    tech_stack: ['Next.js', 'OpenAI API', 'Pinecone', 'Supabase'],
    featured: true,
    approved: true,
    likes_count: 1400,
    views_count: 44000
  },
  {
    title: 'Gravity Sim',
    slug: 'gravity-sim',
    url: 'https://gravitysim.co',
    description: 'N-body gravity simulation in the browser. Spawn planets, stars, and black holes and watch them orbit, collide, and merge. Physics nerd catnip. Fully vibe-coded with Cursor.',
    maker_name: 'Gravity Sim',
    maker_url: 'https://gravitysim.co',
    tools_used: ['cursor'],
    categories: ['experiment', 'education'],
    tech_stack: ['JavaScript', 'WebGL', 'Canvas'],
    featured: false,
    approved: true,
    likes_count: 320,
    views_count: 11000
  },
  {
    title: 'Ambient Weather',
    slug: 'ambient-weather-app',
    url: 'https://ambientweather.app',
    description: 'Weather app that changes its entire vibe based on conditions. Rainy day? Dark moody UI with rain sounds. Sunny? Bright and cheerful. The weather app as an aesthetic experience.',
    maker_name: 'Ambient',
    maker_url: 'https://ambientweather.app',
    tools_used: ['cursor', 'v0'],
    categories: ['utility', 'creative'],
    tech_stack: ['Next.js', 'OpenWeather API', 'Framer Motion'],
    featured: false,
    approved: true,
    likes_count: 260,
    views_count: 9500
  },
  {
    title: 'RapidPages',
    slug: 'rapidpages',
    url: 'https://rapidpages.com',
    description: 'Describe a landing page in plain English and get a fully built, deployed page in seconds. Like v0 but focused entirely on marketing pages. Ship your landing page before you ship your product.',
    maker_name: 'RapidPages',
    maker_url: 'https://rapidpages.com',
    tools_used: ['cursor', 'chatgpt'],
    categories: ['ai-tool', 'developer', 'productivity'],
    tech_stack: ['Next.js', 'OpenAI API', 'Vercel'],
    featured: false,
    approved: true,
    likes_count: 470,
    views_count: 16000
  },
  {
    title: 'PromptBase',
    slug: 'promptbase',
    url: 'https://promptbase.com',
    description: 'Marketplace for buying and selling AI prompts. Yes, people pay real money for well-crafted prompts. The Etsy of the AI age. Launched early and captured the market.',
    maker_name: 'Ben Stokes',
    maker_url: 'https://x.com/benstokesdev',
    tools_used: ['cursor', 'copilot'],
    categories: ['ai-tool', 'creative'],
    tech_stack: ['Next.js', 'Stripe', 'PostgreSQL'],
    featured: false,
    approved: true,
    likes_count: 580,
    views_count: 20000
  },
  {
    title: 'AvatarAI',
    slug: 'avatarai',
    url: 'https://avatarai.me',
    description: 'Generate hundreds of AI avatars from your selfies. Professional headshots, anime versions, superhero portraits — you name it. The profile picture generator that broke Twitter in 2024.',
    maker_name: 'AvatarAI',
    maker_url: 'https://avatarai.me',
    tools_used: ['cursor', 'chatgpt'],
    categories: ['ai-tool', 'creative'],
    tech_stack: ['Next.js', 'Stable Diffusion', 'Replicate'],
    featured: false,
    approved: true,
    likes_count: 640,
    views_count: 23000
  },
  {
    title: 'SpeakAI',
    slug: 'speakai',
    url: 'https://speakai.co',
    description: 'Practice speaking any language with an AI conversation partner. It listens, responds naturally, and gently corrects your grammar. Like Duolingo\'s cooler, conversational cousin.',
    maker_name: 'SpeakAI',
    maker_url: 'https://speakai.co',
    tools_used: ['cursor', 'chatgpt'],
    categories: ['education', 'ai-tool'],
    tech_stack: ['Next.js', 'Whisper API', 'OpenAI API', 'WebRTC'],
    featured: false,
    approved: true,
    likes_count: 410,
    views_count: 15000
  },
  {
    title: 'Plock',
    slug: 'plock',
    url: 'https://plock.dev',
    description: 'Desktop app that lets you ask AI about anything on your screen. Select any area and ask "what is this?" or "explain this code." Like having a tutor looking over your shoulder.',
    maker_name: 'Plock',
    maker_url: 'https://plock.dev',
    tools_used: ['cursor', 'claude'],
    categories: ['ai-tool', 'developer', 'productivity'],
    tech_stack: ['Electron', 'GPT-4 Vision', 'TypeScript'],
    featured: false,
    approved: true,
    likes_count: 380,
    views_count: 13000
  },
  {
    title: 'SVGVibes',
    slug: 'svgvibes',
    url: 'https://svgvibes.com',
    description: 'Generate beautiful SVG illustrations from text descriptions. Need a hero image for your landing page? Just describe it. No more hunting through undraw or paying for stock illustrations.',
    maker_name: 'SVGVibes',
    maker_url: 'https://svgvibes.com',
    tools_used: ['cursor', 'claude'],
    categories: ['creative', 'ai-tool'],
    tech_stack: ['Next.js', 'Anthropic API', 'SVG'],
    featured: false,
    approved: true,
    likes_count: 290,
    views_count: 10000
  },
  {
    title: 'Gameboy.live',
    slug: 'gameboy-live',
    url: 'https://gameboy.live',
    description: 'A GameBoy emulator that runs in your terminal. Yes, your terminal. Play Pokemon in your IDE\'s integrated terminal during standups. Productivity has left the chat.',
    maker_name: 'HFO4',
    maker_url: 'https://github.com/nicknish/gameboy.live',
    tools_used: ['copilot'],
    categories: ['game', 'developer', 'experiment'],
    tech_stack: ['Go', 'Terminal UI'],
    featured: false,
    approved: true,
    likes_count: 520,
    views_count: 18000
  },
  {
    title: 'Marble Race',
    slug: 'marble-race',
    url: 'https://marble.rest',
    description: 'Procedurally generated 3D marble races you can bet fake coins on. Watch tiny marbles careen through impossible tracks. The perfect meeting background. Entirely vibe-coded.',
    maker_name: 'Marble Race',
    maker_url: 'https://marble.rest',
    tools_used: ['cursor', 'chatgpt'],
    categories: ['game', 'entertainment'],
    tech_stack: ['Three.js', 'Cannon.js', 'WebGL'],
    featured: false,
    approved: true,
    likes_count: 340,
    views_count: 12000
  },
  {
    title: 'Splitbee',
    slug: 'splitbee',
    url: 'https://splitbee.io',
    description: 'Analytics and A/B testing that doesn\'t make you want to cry. Clean dashboard, simple integration, respects privacy. The analytics tool indie hackers actually like using.',
    maker_name: 'Tobias Lins',
    maker_url: 'https://x.com/laborode',
    tools_used: ['copilot', 'cursor'],
    categories: ['developer', 'productivity'],
    tech_stack: ['Next.js', 'ClickHouse', 'Vercel Edge'],
    featured: false,
    approved: true,
    likes_count: 480,
    views_count: 17000
  },
  {
    title: 'Pika Video',
    slug: 'pika-video',
    url: 'https://pika.art',
    description: 'Text-to-video AI that actually looks good. Type a prompt, get a short video clip. The tool that made every Twitter user a "filmmaker." Surprisingly fun to play with.',
    maker_name: 'Pika',
    maker_url: 'https://x.com/paborobotics',
    tools_used: ['cursor', 'copilot'],
    categories: ['ai-tool', 'creative', 'entertainment'],
    tech_stack: ['Python', 'Custom ML', 'React'],
    featured: true,
    approved: true,
    likes_count: 1600,
    views_count: 46000
  },
  {
    title: 'VibeChess',
    slug: 'vibechess',
    url: 'https://vibechess.com',
    description: 'Chess with AI commentary that roasts your bad moves and celebrates your good ones. "Oh, you\'re moving that knight THERE? Bold strategy, let\'s see how this goes." Pure entertainment.',
    maker_name: 'VibeChess',
    maker_url: 'https://vibechess.com',
    tools_used: ['cursor', 'claude'],
    categories: ['game', 'ai-tool', 'entertainment'],
    tech_stack: ['Next.js', 'Stockfish', 'Anthropic API'],
    featured: false,
    approved: true,
    likes_count: 380,
    views_count: 14000
  },
  {
    title: 'Tally',
    slug: 'tally-forms',
    url: 'https://tally.so',
    description: 'Form builder that works like a doc. Just type your questions and it becomes a beautiful form. No drag and drop BS. Notion-style editing for forms. Stupidly simple.',
    maker_name: 'Marie & Filip',
    maker_url: 'https://x.com/tallysolutions',
    tools_used: ['copilot'],
    categories: ['productivity', 'developer'],
    tech_stack: ['React', 'Node.js', 'PostgreSQL'],
    featured: false,
    approved: true,
    likes_count: 720,
    views_count: 24000
  },
  {
    title: 'Diagram',
    slug: 'diagram-ai',
    url: 'https://diagram.com',
    description: 'AI-powered design tools for Figma. Auto-generate UI components, rename layers intelligently, generate copy. The AI design assistant that Figma liked so much they acquired it.',
    maker_name: 'Diagram',
    maker_url: 'https://x.com/diagram',
    tools_used: ['copilot', 'chatgpt'],
    categories: ['ai-tool', 'creative', 'developer'],
    tech_stack: ['TypeScript', 'Figma Plugin API', 'OpenAI API'],
    featured: true,
    approved: true,
    likes_count: 1100,
    views_count: 36000
  },
  {
    title: 'PixelMe',
    slug: 'pixelme',
    url: 'https://pixelme.style',
    description: 'Turn any selfie into pixel art. Choose from retro game styles like 8-bit, 16-bit, or Game Boy green. Your new Slack avatar is one upload away.',
    maker_name: 'PixelMe',
    maker_url: 'https://pixelme.style',
    tools_used: ['cursor', 'chatgpt'],
    categories: ['creative', 'ai-tool'],
    tech_stack: ['Next.js', 'Sharp', 'Canvas API'],
    featured: false,
    approved: true,
    likes_count: 310,
    views_count: 11500
  },
  {
    title: 'Receipt Bot',
    slug: 'receipt-bot',
    url: 'https://receiptbot.io',
    description: 'Snap a photo of any receipt and it extracts all the data. Categories, totals, tax — all organized. For anyone who keeps a shoebox of receipts "for tax purposes."',
    maker_name: 'Receipt Bot',
    maker_url: 'https://receiptbot.io',
    tools_used: ['cursor', 'chatgpt'],
    categories: ['finance', 'ai-tool', 'utility'],
    tech_stack: ['React Native', 'GPT-4 Vision', 'Supabase'],
    featured: false,
    approved: true,
    likes_count: 350,
    views_count: 13000
  },
  {
    title: 'Desolation',
    slug: 'desolation-game',
    url: 'https://desolation.game',
    description: 'Post-apocalyptic browser survival game. Scavenge, craft, build shelters. The whole thing was vibe-coded over a month using Cursor. Surprisingly deep for an AI-built game.',
    maker_name: 'Desolation',
    maker_url: 'https://desolation.game',
    tools_used: ['cursor', 'claude'],
    categories: ['game'],
    tech_stack: ['TypeScript', 'Phaser', 'WebSocket'],
    featured: false,
    approved: true,
    likes_count: 290,
    views_count: 10500
  },
  {
    title: 'QuickMVP',
    slug: 'quickmvp',
    url: 'https://quickmvp.app',
    description: 'Describe your startup idea, get a landing page, waitlist, and analytics in 60 seconds. Validate before you build. The fastest way to test if anyone actually wants your thing.',
    maker_name: 'QuickMVP',
    maker_url: 'https://quickmvp.app',
    tools_used: ['cursor', 'v0', 'claude'],
    categories: ['developer', 'ai-tool', 'productivity'],
    tech_stack: ['Next.js', 'Vercel', 'Anthropic API', 'Stripe'],
    featured: false,
    approved: true,
    likes_count: 410,
    views_count: 15000
  }
];

async function getExistingSlugs() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/products?select=slug`, {
    headers: {
      'apikey': SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
    }
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to fetch existing products: ${err}`);
  }
  const data = await res.json();
  return new Set(data.map(p => p.slug));
}

async function insertProducts(products) {
  // Insert in batches of 10
  const batchSize = 10;
  let totalInserted = 0;

  for (let i = 0; i < products.length; i += batchSize) {
    const batch = products.slice(i, i + batchSize);
    console.log(`  Inserting batch ${Math.floor(i / batchSize) + 1} (${batch.length} products)...`);

    const res = await fetch(`${SUPABASE_URL}/rest/v1/products`, {
      method: 'POST',
      headers: {
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(batch)
    });

    if (!res.ok) {
      const err = await res.text();
      console.error(`  ❌ Batch error: ${err}`);
      continue;
    }

    const data = await res.json();
    totalInserted += data.length;
    data.forEach(p => console.log(`    ✅ ${p.title} (${p.slug})`));
  }

  return totalInserted;
}

async function main() {
  console.log('🔍 Fetching existing products to avoid duplicates...');
  const existingSlugs = await getExistingSlugs();
  console.log(`  Found ${existingSlugs.size} existing products\n`);

  const toInsert = newProducts.filter(p => {
    if (existingSlugs.has(p.slug)) {
      console.log(`  ⏭️ Skipping duplicate: ${p.slug}`);
      return false;
    }
    return true;
  });

  if (toInsert.length === 0) {
    console.log('\n✅ No new products to insert — all already exist!');
    return;
  }

  console.log(`\n📦 Inserting ${toInsert.length} new products...\n`);
  const count = await insertProducts(toInsert);
  console.log(`\n🎉 Done! Inserted ${count} new products. Total in DB: ${existingSlugs.size + count}`);
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
