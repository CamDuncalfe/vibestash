# Vibestash Content Fix — Execution Plan

**Status**: In Progress  
**Started**: 2026-03-27 1:36 PM ET  
**Assigned by**: Cam

---

## Mission

1. ✅ **Build support for thumb + video hover** (DONE — ProductCard updated, video_url column added)
2. 🔄 **Vet all products** — archive non-fits for day 1
3. 🔄 **Fix creator data** — correct X handles, PFPs, links
4. ⏳ **Find media** — thumbs + videos for approved products

---

## Phase 1: Build Support (COMPLETE ✅)

### What Was Done
- Added `video_url` TEXT column to `products` table
- Created index for fast queries
- Updated ProductCard.tsx with hover state
- Video plays on hover (autoPlay, loop, muted)
- Thumbnail shows by default, fades to video on hover
- Updated Product type interface

### Files Changed
- `/Users/jerry/workspace/projects/vibestash/src/types/index.ts`
- `/Users/jerry/workspace/projects/vibestash/src/components/products/ProductCard.tsx`
- Supabase migration: `migrations/add-video-support.sql`

---

## Phase 2: Vet Products (IN PROGRESS 🔄)

### Current State
- **100 products total** in database
- **87 products** have release dates (from Cam's update)
- **13 products** missing release dates
- **ALL products** missing avatars (maker_avatar_url NULL)

### Vetting Criteria

#### KEEP (Memeable, Vibe-Coded, Funny)
- Internet culture classics (Is It Wednesday, Pointer Pointer, Fly.io)
- Genuinely absurd/funny (SlapMac, DOOMscroll, Crash Out Diary)
- Creative/weird tools (MenuGen, Tower of Time, Sandboxels)
- Playful tech demos (Dog-e-dex, Bitchat)
- Vibe-coded meme apps
- Random tools, games, utilities that would never exist without vibe coding

#### ARCHIVE (Not Day 1)
- Generic productivity SaaS
- Serious corporate tools
- Standard templates
- Boring utilities
- Enterprise software
- **🚨 AI agent/wrapper websites** — unless they're funny/absurd. VibeStash is for random tools, weird apps, fun games. Not another AI SaaS. (Rule from Cam, 2026-03-29)

#### MEDIA RULES (from Cam, 2026-03-29)
- **Thumbnails must actually show the product** — no generic OG images, no text-only fallbacks
- **Videos must show the product in action** — not a marketing splash
- **All thumbnails must be the same size** — nothing cropped, consistent aspect ratio across cards
- **All videos must be the same size** — same aspect ratio, fits cleanly in the card

### Known Good Products (Cam's Examples)
1. **SlapMac** — Mac moan app, $5K in 3 days (@anulagarwal)
2. **Sandboxels** — Feb 2026 (@R74nCom — VERIFY)
3. **DOOMscroll**
4. **Tower of Time**
5. **Dog-e-dex**
6. **Crash Out Diary**
7. **MenuGen**

### Action Plan
1. Export full product list (id, title, slug, maker_twitter, released_at)
2. Manual review each product
3. Mark KEEP or ARCHIVE
4. Archive rejects (set approved=false or delete)

---

## Phase 3: Fix Creator Data (IN PROGRESS 🔄)

### Known Issues
- **Bitchat**: Shows "@nickjnish" but was built by Jack Dorsey using Goose (should be @jack)
- **Sandboxels**: "@R74nCom" — verify correct
- **All 100 products**: Missing maker_avatar_url (NULL)

### Creator Data Sources (Priority Order)
1. Product's official X account
2. Launch tweet
3. Product website footer/about
4. GitHub repo (if open source)
5. Product Hunt creator

### Data to Collect Per Product
- `maker_name`: Full name (e.g., "anul agarwal")
- `maker_twitter`: Handle without @ (e.g., "anulagarwal")
- `maker_avatar_url`: Direct link to profile pic (e.g., from X API or CDN)
- `x_post_url`: Launch tweet URL (if exists)

### Example (SlapMac)
```sql
UPDATE products 
SET 
  maker_name = 'anul agarwal',
  maker_twitter = 'anulagarwal',
  maker_avatar_url = '[X PFP URL]',
  x_post_url = 'https://x.com/anulagarwal/status/2037164151223857401'
WHERE slug = 'slapmac';
```

### Action Plan
1. For each APPROVED product:
   - Search X for product name + "launch" or "made" or "built"
   - Find creator's X profile
   - Verify handle
   - Scrape PFP URL (from profile page or API)
   - Update Supabase

---

## Phase 4: Find Media (PENDING ⏳)

### Media Requirements
- **Thumbnail (thumbnail_url)**: Static image, aspect ratio 16:10
- **Video (video_url)**: Short demo clip, MP4/WebM, autoplay-safe

### Sources (Priority Order)
1. **X launch tweet** — usually has video demo
2. **Product Hunt** — demo videos/GIFs
3. **Product website** — hero video
4. **YouTube** — demo walkthrough
5. **Creator's GitHub/portfolio** — assets

### Video Extraction Tools
- `yt-dlp` for Twitter/YouTube
- `ffmpeg` for thumbnail extraction
- Supabase Storage OR direct CDN URLs

### Action Plan
1. For each APPROVED product:
   - Find launch tweet or demo video
   - Download video (`yt-dlp`)
   - Extract thumbnail frame (`ffmpeg -i video.mp4 -ss 00:00:01 -vframes 1 thumb.jpg`)
   - Upload to Supabase Storage OR use direct URLs
   - Update product: `thumbnail_url`, `video_url`

---

## Current Status

### What's Done ✅
- Build supports thumb + video hover
- Migration successful (video_url column added)
- ProductCard updated with hover state
- Product type interface updated

### What's Next 🔄
1. **Export full product list** from Supabase
2. **Manual vet** — mark KEEP/ARCHIVE
3. **Archive rejects**
4. **Research creators on X** for KEEP products
5. **Fix creator data** (handles, PFPs, links)
6. **Find and populate media** (thumbs + videos)

### Immediate Next Steps
1. Create audit script to export product list with current data
2. Start vetting from top of list (sorted by release date)
3. Research SlapMac creator for PFP URL (test case)
4. Build batch update script for creator data
5. Find SlapMac demo video (test case)

---

**Last Updated**: 2026-03-27 1:48 PM ET
