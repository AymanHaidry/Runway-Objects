# Runway Objects

Aviation collectibles store where customers can browse, purchase, and track precision aircraft models — each with a unique Runway Passport QR and ROR Registry entry.

## Run & Operate

- `pnpm --filter @workspace/runway-objects run dev` — frontend dev server (port 22997, preview at `/`)
- `pnpm --filter @workspace/api-server run dev` — API server (port 8080)
- Required secrets: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (NOTE: these are swapped in Replit — vite.config.ts auto-detects and corrects)
- Supabase DB setup: run `artifacts/runway-objects/supabase-setup.sql` in Supabase SQL Editor
- To grant admin: `UPDATE profiles SET is_admin = TRUE WHERE email = 'your@email.com';`

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, TailwindCSS, shadcn/ui, wouter (routing), framer-motion
- Auth: Supabase Auth (Google OAuth)
- DB: Supabase (PostgreSQL) via `@supabase/supabase-js`
- Cart: localStorage-based CartContext
- Payment: WhatsApp via `api.whatsapp.com` with order details
- API server: Express 5 (existing, separate artifact)

## Where things live

- `artifacts/runway-objects/src/` — main React app
  - `src/lib/supabase.ts` — Supabase client + all TypeScript types
  - `src/lib/auth.tsx` — AuthContext (Google login, profile, session)
  - `src/lib/cart.tsx` — CartContext (localStorage)
  - `src/lib/whatsapp.ts` — WhatsApp order URL builder
  - `src/pages/` — all route pages
  - `src/components/Navbar.tsx`, `Footer.tsx`, `ProductCard.tsx`
- `artifacts/runway-objects/supabase-setup.sql` — full DB schema + RLS + seed data
- `artifacts/runway-objects/vite.config.ts` — includes secret-swap fix for Supabase
- `artifacts/runway-objects/.env` — corrected VITE_ vars (gitignored)
- `public/logo-light.png`, `public/logo-dark.png` — brand logos

## Architecture decisions

- Supabase secrets were entered swapped (URL in ANON_KEY slot and vice versa); vite.config.ts detects and corrects automatically based on value shape (JWT vs URL)
- Cart uses localStorage for guest support; merges with account on login
- WhatsApp payment: orders are saved to Supabase then user is directed to `api.whatsapp.com` with a formatted order message
- ROR Registry uses a `service_tag` (e.g. RO-2024-A7X3) as a human-readable lookup key alongside UUID
- Admin access is set manually via SQL (`is_admin = TRUE`) — no self-serve admin signup

## Product

- **Home** `/` — hero landing page with featured products, tier overview, CTA
- **Store** `/store` — full product grid with category filter, search, sort
- **Product** `/product/:id` — detail page with images, lore, reviews, add-to-cart
- **Passport** `/passport/:id` — public Runway Passport QR page (story, inspiration, edition)
- **Cart** `/cart` — cart management + WhatsApp checkout
- **Orders** `/orders` — order history with status tracking
- **Account** `/account` — profile, tier display, quick links
- **Achievements** `/achievements` — 11 unlockable achievement badges
- **Membership** `/membership` — Free / Collector / Elite plans
- **Registry** `/registry` — ROR secure registry, service tag lookup, service logs
- **Admin** `/admin` — product CRUD, order status management, stats dashboard

## User preferences

- Supabase Auth + Google OAuth only (no Replit Auth)
- Payment via WhatsApp (api.whatsapp.com), NOT Stripe
- Colors: `#FDF4F7` base, gold accents, solid black
- Fonts: Inter (body), Brittany-style script (logo only)
- Mobile-optimized, sleek "Apple 2050 liquid glass" feel
- Split into multiple files — no monolithic files

## Gotchas

- Supabase secrets are swapped in Replit Secrets tab — this is auto-corrected in vite.config.ts
- Must run `supabase-setup.sql` in Supabase SQL Editor before any data will load
- Must enable Google OAuth in Supabase dashboard: Authentication → Providers → Google
- Add `https://<your-replit-domain>` to Supabase Auth → URL Configuration → Redirect URLs
- WhatsApp number hardcoded in `src/lib/whatsapp.ts` — update `WHATSAPP_NUMBER`

## Pointers

- See `artifacts/runway-objects/supabase-setup.sql` for complete DB schema with RLS policies
