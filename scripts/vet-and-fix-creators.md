# Vibestash Product Vetting & Creator Fix Plan

## Phase 1: Vet Products for Day 1 (Archive Non-Fits)

### Keep (Memeable, Vibe-Coded, Funny)
Products that are:
- Genuinely funny/absurd (DOOMscroll, SlapMac, Crash Out Diary)
- Internet culture classics (Is It Wednesday, Pointer Pointer)
- Creative/weird tools (MenuGen, Tower of Time)
- Playful tech demos (Sandboxels, Dog-e-dex)

### Archive (Not Day 1 Material)
Products that are:
- Generic productivity tools
- Serious SaaS
- Standard templates
- Boring utilities
- Corporate/enterprise tools

## Phase 2: Fix Creator Data (X Handles, PFPs, Links)

For each APPROVED product:
1. Find creator's real X account
2. Get correct handle (no placeholders)
3. Scrape PFP URL from X profile
4. Verify link works (https://x.com/handle)
5. Update Supabase: maker_name, maker_twitter, maker_avatar_url

### Known Issues to Fix
- **Bitchat**: Currently shows "@nickjnish" but was built by Jack Dorsey (@jack) using Goose
- **Sandboxels**: Verify "@R74nCom" is correct
- **All products**: Missing avatars (maker_avatar_url NULL)

## Phase 3: Find Thumbs + Videos

For each APPROVED product:
1. Search X for launch tweet / demo video
2. Download video (use yt-dlp or twitter-dl)
3. Extract thumbnail frame (ffmpeg)
4. Upload to Supabase Storage OR use CDN URLs
5. Update product: thumbnail_url, video_url

### Video Sources Priority
1. Creator's X launch tweet
2. Product Hunt demo
3. Product website hero video
4. YouTube demo (if exists)

## Next Steps
1. Run audit script to get full product list
2. Manual review each product (KEEP or ARCHIVE)
3. Research creators on X
4. Scrape PFPs and verify handles
5. Find and populate media (thumb + video)
