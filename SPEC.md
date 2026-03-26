# VibeStash — Product Specification

## What is VibeStash?
A curated gallery/showcase of the best vibe-coded apps and products. Think MaxiBestOf.one but for vibe-coded software instead of website design inspiration.

**Domain:** vibestash.fun
**Handle:** @vibestashfun (X, IG, TikTok)

## Reference Site: MaxiBestOf.one
We are closely modeling the UX, structure, and feature set of MaxiBestOf.one (a curated website design inspiration gallery). Key differences:
- Instead of "websites," we showcase "apps" / "products" (vibe-coded)
- Instead of "fonts in use," we show "tools used" (Cursor, v0, Bolt, Lovable, Claude, etc.)
- Instead of "categories" like Fashion/E-commerce, we have categories like: SaaS, Mobile App, Chrome Extension, CLI Tool, Game, AI Tool, Marketplace, Social, Productivity, Developer Tool, etc.
- Instead of "technologies" (Shopify, Webflow), we show "stack" (Next.js, React, Supabase, etc.)

## Core Data Model

### Product (the main entity — equivalent to "website" on MaxiBestOf)
- id (uuid)
- title (string) — app/product name
- slug (string, unique) — URL-friendly
- url (string) — link to the live product
- description (text) — short blurb about the product
- thumbnail_url (string) — screenshot/preview image
- screenshots (string[]) — array of screenshot URLs (desktop + mobile)
- maker_name (string) — who built it
- maker_url (string, optional) — maker's website or X profile
- maker_avatar_url (string, optional)
- tools_used (string[]) — e.g. ["Cursor", "v0", "Claude", "Bolt"]
- categories (string[]) — e.g. ["SaaS", "AI Tool"]
- tech_stack (string[]) — e.g. ["Next.js", "Supabase", "Tailwind"]
- featured (boolean, default false) — "VibeStash Picks"
- featured_at (timestamp, nullable)
- submitted_by (uuid, nullable) — references auth.users
- approved (boolean, default false)
- approved_at (timestamp, nullable)
- created_at (timestamp)
- updated_at (timestamp)
- views_count (integer, default 0)
- likes_count (integer, default 0)

### Category
- id (uuid)
- name (string)
- slug (string, unique)
- description (string, optional)
- icon (string, optional) — emoji or icon name
- order (integer)

### Tool (equivalent to "font" on MaxiBestOf)
- id (uuid)
- name (string) — e.g. "Cursor", "v0", "Bolt", "Claude"
- slug (string, unique)
- url (string, optional) — link to the tool
- logo_url (string, optional)
- description (string, optional)
- products_count (integer, default 0) — denormalized count

### Collection (user-created collections)
- id (uuid)
- user_id (uuid) — references auth.users
- name (string)
- description (string, optional)
- is_public (boolean, default false)
- created_at (timestamp)
- updated_at (timestamp)

### CollectionItem
- id (uuid)
- collection_id (uuid)
- product_id (uuid)
- added_at (timestamp)

### Like (user favorites)
- id (uuid)
- user_id (uuid)
- product_id (uuid)
- created_at (timestamp)
- UNIQUE(user_id, product_id)

### NewsletterSubscriber
- id (uuid)
- email (string, unique)
- subscribed_at (timestamp)
- unsubscribed_at (timestamp, nullable)
- is_active (boolean, default true)

### Submission (user-submitted products for review)
- id (uuid)
- user_id (uuid, nullable)
- product_url (string)
- comments (text, optional)
- status (enum: pending, approved, rejected)
- created_at (timestamp)
- reviewed_at (timestamp, nullable)

## Pages & Routes

### Public Pages
1. **`/`** — Home feed. Grid of products, sorted by newest. Category filter bar at top. Newsletter CTA mid-page. Pagination.
2. **`/products`** — Same as home but explicit products listing with filters.
3. **`/products/[slug]`** — Product detail page. Full screenshots (desktop/mobile toggle), tools used, tech stack, categories, maker info, similar products grid, visit link.
4. **`/products/popular`** — Most viewed/liked products.
5. **`/products/picks`** — VibeStash Picks (featured = true).
6. **`/products/[category-slug]`** — Category filtered view (e.g. /products/saas, /products/mobile-app).
7. **`/tools`** — Tool directory (equivalent to /typefaces). Grid of all tools with product counts.
8. **`/tools/[slug]`** — Tool detail. All products built with this tool.
9. **`/tools/popular`** — Most-used tools.
10. **`/submit`** — Submit a product form (URL + comments + optional profile link). Requires auth.
11. **`/supporters`** — Pricing page. Supporter tiers with Stripe Checkout.
12. **`/about`** — About VibeStash.
13. **`/sponsor`** — Advertising info page.

### Auth Pages
14. **`/auth`** — Sign in / Sign up. Use Supabase Auth with Google OAuth + Magic Link.
15. **`/auth/callback`** — OAuth callback handler.

### User Pages (authenticated)
16. **`/dashboard`** — User dashboard. Saved collections, favorites, submitted products.
17. **`/collections/[id]`** — View a collection.

### Admin Pages
18. **`/admin`** — Admin dashboard (protected). Manage products, review submissions, manage categories/tools.
19. **`/admin/products`** — CRUD products.
20. **`/admin/submissions`** — Review queue.
21. **`/admin/categories`** — Manage categories.
22. **`/admin/tools`** — Manage tools.

## Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** Supabase (Postgres)
- **Auth:** Supabase Auth (Google OAuth + Magic Link)
- **Storage:** Supabase Storage (for screenshots)
- **Payments:** Stripe (supporter subscriptions)
- **Deployment:** Vercel
- **Search:** Supabase full-text search (pg_trgm)

## Design Direction
- Clean, minimal, editorial feel (like MaxiBestOf)
- White/light background, strong typography
- Red/orange accent color (placeholder — Cam will provide branding later)
- 3-column grid for product cards on desktop, 2 on tablet, 1 on mobile
- Product cards show: thumbnail, title, tools used (small badges), categories
- Each card has: save to collection button, like/favorite button, "find similar" button
- Hover: subtle lift, visit button appears

## Supporter Tiers (Stripe)
### Free
- Browse all products
- Submit products
- Save up to 5 favorites

### Supporter ($5/month or $48/year)
- Unlimited favorites
- Save to private collections
- Full-resolution screenshots
- Find similar products
- Filter by tools, stack, category
- Early access to new features

### Team ($35/month or $336/year)
- Everything in Supporter
- Unlimited team members
- Shared collections
- Centralized billing

## Key Features to Build (MVP Priority)

### P0 — Must Have
- [x] Product grid feed (home page)
- [x] Category filtering
- [x] Product detail page with screenshots
- [x] Tool directory
- [x] User auth (Supabase)
- [x] Submit product form
- [x] Like/favorite products
- [x] Newsletter signup
- [x] Admin panel (CRUD products, review submissions)
- [x] Responsive design
- [x] Search (quick search bar)

### P1 — Should Have
- [ ] Stripe payments (supporter tiers)
- [ ] Collections (save products to collections)
- [ ] "Find similar" feature
- [ ] Popular products page
- [ ] VibeStash Picks (featured)

### P2 — Nice to Have
- [ ] Sponsor/advertising page
- [ ] MCP server (like MaxiBestOf has)
- [ ] Weekly digest email
- [ ] Product of the week

## Supabase Setup
- Use the existing Supabase org (Cam's org)
- Create a NEW project called "VibeStash" in the org
- Region: US East 1 (same as Frankly)
- Enable: Auth (Google OAuth + magic link), Storage, RLS policies

## Environment Variables Needed
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=  (later)
STRIPE_SECRET_KEY=  (later)
STRIPE_WEBHOOK_SECRET=  (later)
```

## File Structure
```
vibestash/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Home feed
│   │   ├── layout.tsx                  # Root layout
│   │   ├── products/
│   │   │   ├── page.tsx               # Products listing
│   │   │   ├── [slug]/page.tsx        # Product detail
│   │   │   ├── popular/page.tsx       # Popular products
│   │   │   └── picks/page.tsx         # Featured picks
│   │   ├── tools/
│   │   │   ├── page.tsx               # Tool directory
│   │   │   ├── [slug]/page.tsx        # Tool detail
│   │   │   └── popular/page.tsx       # Popular tools
│   │   ├── submit/page.tsx            # Submit form
│   │   ├── supporters/page.tsx        # Pricing
│   │   ├── about/page.tsx             # About
│   │   ├── sponsor/page.tsx           # Sponsor info
│   │   ├── auth/
│   │   │   ├── page.tsx               # Sign in/up
│   │   │   └── callback/route.ts      # OAuth callback
│   │   ├── dashboard/page.tsx         # User dashboard
│   │   ├── collections/
│   │   │   └── [id]/page.tsx          # Collection view
│   │   ├── admin/
│   │   │   ├── page.tsx               # Admin dashboard
│   │   │   ├── products/page.tsx      # Manage products
│   │   │   ├── submissions/page.tsx   # Review queue
│   │   │   ├── categories/page.tsx    # Manage categories
│   │   │   └── tools/page.tsx         # Manage tools
│   │   └── api/
│   │       ├── products/route.ts
│   │       ├── tools/route.ts
│   │       ├── categories/route.ts
│   │       ├── collections/route.ts
│   │       ├── likes/route.ts
│   │       ├── submissions/route.ts
│   │       ├── newsletter/route.ts
│   │       ├── search/route.ts
│   │       └── stripe/
│   │           ├── checkout/route.ts
│   │           └── webhook/route.ts
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── SearchBar.tsx
│   │   ├── products/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   ├── ProductDetail.tsx
│   │   │   └── CategoryFilter.tsx
│   │   ├── tools/
│   │   │   ├── ToolBadge.tsx
│   │   │   └── ToolGrid.tsx
│   │   ├── auth/
│   │   │   └── AuthForm.tsx
│   │   ├── admin/
│   │   │   ├── ProductForm.tsx
│   │   │   └── SubmissionReview.tsx
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Modal.tsx
│   │       └── Pagination.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts              # Browser client
│   │   │   ├── server.ts              # Server client
│   │   │   └── admin.ts               # Service role client
│   │   ├── stripe.ts
│   │   └── utils.ts
│   └── types/
│       └── index.ts                    # TypeScript types
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql     # Database schema
├── public/
├── .env.local
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Admin Access
- Admin check: Supabase `user_metadata.role === 'admin'` or a dedicated `admins` table
- For MVP: hardcode admin emails in a config (cam@layertwodesign.com, dev@layertwodesign.com)
