# VibeStash Curation Rules
> Last updated: 2026-04-01

## What VibeStash Is
A collection of random apps that people are just building. Some are hilarious, some are weirdly addicting, none of them are actual full products. The vibe is: people are building random apps all the time, and here are the best ones.

It doesn't have to be explicitly "vibe coded" or AI-built. If someone just says "hey I built this crazy app," that's enough. The whole premise is people experimenting and shipping small things. Most of them probably used AI, but it's not a requirement.

## What Gets In

### ✅ YES — Add It
- **Solo dev / tiny team projects** — one person had an idea, built it, shipped it
- **Weird, funny, absurd things** — the weirder the better
- **Small utility tools** — as long as they feel like a weekend project, not a startup
- **Creative experiments** — interactive art, physics toys, generative stuff
- **Games that are strange or novel** — not generic clones, but "who would make this?"
- **Vibe-coded products** — things built with AI coding tools (Cursor, Lovable, Bolt, v0, Claude, etc.) — but this label isn't required
- **Classic weird internet** — sites like "Is It Christmas?" or "Eelslap" that embody the indie web spirit
- **Things that wouldn't exist without one person's obsession** — passion projects, niche tools, personal sites that do one thing perfectly

### 🚫 NO — Don't Add It
- **Funded startups or VC-backed products** — if they raised money, they're out
- **Corporate experiments** — Google, Spotify, Meta, Apple side projects (even if fun)
- **Products that look "too legit"** — if it has a pricing page, enterprise tiers, a sales team, or investor logos, skip it. Nothing that looks like an established thing accepting payment.
- **AI agent/wrapper websites** — unless genuinely funny or absurd
- **Generic SaaS tools** — CRMs, dashboards, analytics platforms, project management
- **Famous person's projects** — if the maker is a known tech executive or celebrity, it's not indie (e.g., Karpathy, ex-FAANG directors)
- **Polished award-winning interactive art** — if it won a Webby or FWA, it's graduated beyond indie
- **Generic game clones** — flight sim #47, another tank shooter, racing game with no twist
- **Products with corporate domains or partnerships** — hosted on google.com, spotify.com, etc.

## Vetting Criteria

### The Weekend Test
**Could one person have built this in a weekend?** If the answer is yes, it belongs. If it looks like it took a funded team 3 months, it doesn't.

### No Pricing Pages
If the product has pricing tiers, enterprise plans, or a sales funnel, it's too established. Free, donation-based, or "just vibing" only. Users and downloads are fine. Accepting payment is not.

### Source Signal
Where was it shared? If someone posted it on X/Reddit/HN with "I built this thing" energy, green flag. If it has a PR agency or marketing team behind it, red flag.

### Recency Bias (On Purpose)
Favor stuff that's new and raw over things that have been around for a year and gotten polished up. Fresh > refined.

### No Interactive vs Passive Judgment
Don't filter based on whether the app is interactive or passive. That's not a useful distinction for what we're collecting.

### No Quality Bar
Scrappy is the point. There's no minimum polish level. If it's interesting, weird, fun, or addicting, it's in.

### The Gut Check
1. Could one person have built this in a weekend?
2. Does it have "why does this exist" energy?
3. Would you send this link to a friend with no context?
4. Is it indie? No funding, no corporate backing, no famous founder.

If yes to most → add it. If no → skip it.

## Where to Find Products

### Primary Sources
- **X/Twitter** — search for people posting things they built. Look for:
  - "I built" / "I made" / "just shipped" / "launched" / "side project"
  - "vibe coded" / "vibe coding" / "cursor" / "lovable" / "bolt" / "v0"
  - Small accounts posting their projects (not influencers)
  - Quote tweets of weird tools
- **Hacker News** — "Show HN" posts with weird/fun projects
- **Reddit** — r/sideproject, r/webdev, r/InternetIsBeautiful, r/vibe_coding
- **Product Hunt** — filter for solo makers, weird categories
- **aibuiltgames.com** — curated list of AI-built games

### Secondary Sources
- **neal.fun** — one-person creative web experiments
- **oimo.io** — physics toy experiments
- **theuselessweb.com** — classic weird internet directory
- **Indie Hackers** — solo builder community
- **itch.io** — indie games, especially game jam entries

## Data Requirements
Every product added must have:
- `title` — product name
- `slug` — lowercase, hyphens, no special chars
- `url` — live, working URL (verify with curl or browser)
- `description` — one sentence, what it does/is
- `categories` — array (e.g., ["games"], ["tools"], ["creative"], ["weird"])
- `approved` — set to `true` if it passes the gut check
- `tools_used` — array of AI tools used, if known (e.g., ["cursor"], ["lovable"])
- `maker_twitter` — handle without @, if known

Optional but nice to have:
- `thumbnail_url` — screenshot of the product
- `video_url` — demo video
- `maker_avatar_url` — maker's profile pic
