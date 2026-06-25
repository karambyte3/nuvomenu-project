# Nuvomenu — Claude Code project guide

You are building **Nuvomenu**, a multi-tenant SaaS platform that lets restaurant businesses create and manage digital menus through a dashboard, with a public guest-facing menu accessible via QR code or link. No native app is involved — everything is web-based.

Read this file fully before touching any code. It is the single source of truth for architecture, conventions, and decisions already made.

---

## Project overview

| Property | Value |
|---|---|
| Product | Digital QR menu SaaS for restaurants |
| Users | Restaurant owners / staff (dashboard) · Guests (public menu) |
| Business model | Subscription via Stripe (Free trial → Pro → Chain) |
| Repo structure | Monorepo — one Next.js app, all surfaces |

---

## Tech stack — exact versions

| Layer | Tool | Notes |
|---|---|---|
| Framework | Next.js 15 App Router (TypeScript) | Use Server Components by default |
| Database | Supabase (PostgreSQL) | RLS on every table |
| Auth | Supabase Auth | Email + Google OAuth |
| Storage | Supabase Storage + Uploadthing | Uploadthing for dish photos |
| UI | Tailwind CSS v4 + shadcn/ui | Components live in `components/ui/` |
| Validation | Zod | Every Server Action validates input with Zod first |
| Forms | react-hook-form + @hookform/resolvers/zod | Pair with shadcn Form components |
| Payments | Stripe (Billing + Customer Portal) | Webhooks sync to Supabase |
| Email | Resend + React Email | Templates in `emails/` |
| QR codes | `qrcode` npm package | Server-side generation only |
| Drag-to-reorder | dnd kit | Menu item and category reordering |
| Deployment | Vercel | ISR for public menu pages |
| Error tracking | Sentry | Wrap API routes and Server Actions |
| Analytics | Vercel Analytics | Already integrated via `@vercel/analytics` |
| AI coding tool | Claude Code / Cursor / Windsurf | You are reading this |

**Do not introduce new dependencies without flagging it.** If a library is needed that isn't listed above, say so explicitly and wait for confirmation before installing.

---

## Folder structure

```
nuvomenu/
├── app/
│   ├── (marketing)/              # Public landing pages — no auth required
│   │   ├── page.tsx              # Homepage
│   │   ├── pricing/page.tsx
│   │   └── layout.tsx            # Marketing layout (nav + footer)
│   │
│   ├── (auth)/                   # Auth flows
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   ├── invite/[token]/page.tsx
│   │   └── layout.tsx
│   │
│   ├── (dashboard)/              # Owner/staff dashboard — auth-gated
│   │   ├── layout.tsx            # Sidebar layout, checks subscription
│   │   ├── page.tsx              # Redirect to /venues
│   │   ├── venues/
│   │   │   ├── page.tsx          # Venue list
│   │   │   └── [id]/
│   │   │       ├── page.tsx      # Venue overview
│   │   │       ├── menu/page.tsx # Menu builder
│   │   │       ├── qr/page.tsx   # QR code download
│   │   │       └── settings/page.tsx
│   │   ├── account/page.tsx      # Profile + billing portal
│   │   └── new-venue/page.tsx    # Onboarding flow
│   │
│   └── p/
│       └── [slug]/               # Public guest-facing menu (ISR)
│           └── page.tsx
│
├── components/
│   ├── ui/                       # shadcn/ui components (do not edit manually)
│   ├── menu/                     # Menu builder components
│   │   ├── MenuBuilder.tsx       # Main drag-and-drop interface
│   │   ├── CategoryBlock.tsx
│   │   ├── MenuItemCard.tsx
│   │   └── ItemForm.tsx          # Add/edit item drawer
│   ├── venue/
│   │   ├── VenueCard.tsx
│   │   ├── QRCodeCard.tsx
│   │   └── VenueSettingsForm.tsx
│   ├── guest/                    # Public menu components
│   │   ├── GuestMenu.tsx
│   │   ├── CategoryTabs.tsx
│   │   ├── DishCard.tsx
│   │   └── LanguageSwitcher.tsx
│   └── shared/
│       ├── Logo.tsx
│       ├── SubscriptionGate.tsx  # Blocks features above plan limit
│       └── UploadImage.tsx       # Uploadthing wrapper
│
├── actions/                      # Next.js Server Actions
│   ├── venues.ts
│   ├── categories.ts
│   ├── menu-items.ts
│   ├── staff.ts
│   └── billing.ts
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # Browser Supabase client
│   │   ├── server.ts             # Server Supabase client (cookies)
│   │   └── middleware.ts         # Session refresh
│   ├── stripe/
│   │   ├── client.ts             # Stripe singleton
│   │   └── webhooks.ts           # Webhook event handlers
│   ├── qr.ts                     # QR code generation helpers
│   ├── validations/
│   │   ├── venue.ts              # Zod schemas for venues
│   │   ├── menu-item.ts          # Zod schemas for items
│   │   └── staff.ts
│   └── utils.ts                  # cn(), formatPrice(), slugify()
│
├── emails/                       # React Email templates
│   ├── WelcomeEmail.tsx
│   ├── TrialExpiryEmail.tsx
│   ├── TeamInviteEmail.tsx
│   └── SubscriptionConfirmEmail.tsx
│
├── hooks/
│   ├── useVenue.ts               # Supabase realtime subscription
│   └── useSubscription.ts        # Current plan status
│
├── types/
│   └── database.types.ts         # Generated by Supabase CLI — do not edit
│
├── middleware.ts                  # Auth session + route protection
├── supabase/
│   └── migrations/               # SQL migration files
└── CLAUDE.md                     # This file
```

---

## Database schema

All tables use UUID primary keys and `created_at` / `updated_at` timestamps. **Every table has RLS enabled** — never disable RLS, never use the service role key on the client.

### Core tables

```sql
-- Extends auth.users — created automatically on signup via trigger
profiles (
  id uuid PRIMARY KEY REFERENCES auth.users,
  full_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now()
)

-- A restaurant, café, or bar
venues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES profiles NOT NULL,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,       -- used in /p/[slug] — permanent, immutable
  description text,
  address text,
  phone text,
  wifi_password text,
  logo_url text,
  cover_url text,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
)

-- Menu categories (e.g. Starters, Mains, Drinks)
categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id uuid REFERENCES venues NOT NULL,
  name text NOT NULL,
  position integer NOT NULL DEFAULT 0,
  visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
)

-- Individual menu items
menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES categories NOT NULL,
  name text NOT NULL,
  description text,
  price numeric(10,2),
  old_price numeric(10,2),         -- null when no promotion active
  image_url text,
  visible boolean DEFAULT true,
  unavailable boolean DEFAULT false,  -- "temporarily unavailable" toggle
  is_new boolean DEFAULT false,
  is_featured boolean DEFAULT false,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
)

-- Multi-language support — one row per item per locale
item_translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid REFERENCES menu_items NOT NULL,
  locale text NOT NULL,            -- e.g. 'es', 'it', 'fr'
  name text NOT NULL,
  description text,
  UNIQUE (item_id, locale)
)

-- Staff members with limited dashboard access
staff_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id uuid REFERENCES venues NOT NULL,
  user_id uuid REFERENCES profiles,
  email text NOT NULL,             -- used for invite before they sign up
  role text NOT NULL CHECK (role IN ('editor', 'viewer')),
  invite_token text UNIQUE,        -- null once accepted
  invited_at timestamptz DEFAULT now(),
  accepted_at timestamptz
)

-- Stripe billing — synced from webhook events
subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES profiles NOT NULL,
  stripe_customer_id text UNIQUE NOT NULL,
  stripe_subscription_id text UNIQUE,
  plan text NOT NULL CHECK (plan IN ('trial', 'pro', 'chain')),
  status text NOT NULL,            -- Stripe status: active, past_due, canceled...
  trial_ends_at timestamptz,
  current_period_end timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
)
```

### RLS policies — the pattern

Every table follows this pattern. Use it exactly:

```sql
-- venues: owners see their own, staff see assigned venues
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owners can manage their venues"
ON venues FOR ALL
USING (owner_id = auth.uid());

CREATE POLICY "staff can read assigned venues"
ON venues FOR SELECT
USING (
  id IN (
    SELECT venue_id FROM staff_members
    WHERE user_id = auth.uid()
    AND accepted_at IS NOT NULL
  )
);
```

For child tables (`categories`, `menu_items`), chain back through `venue_id`:

```sql
CREATE POLICY "owners can manage categories"
ON categories FOR ALL
USING (
  venue_id IN (
    SELECT id FROM venues WHERE owner_id = auth.uid()
  )
);
```

**The public guest menu reads without auth.** Add a separate SELECT policy for public rows:

```sql
CREATE POLICY "public can read visible menu items"
ON menu_items FOR SELECT
USING (visible = true);
```

---

## Supabase client usage

Use the **server client** everywhere in Server Components, Server Actions, and Route Handlers. Use the **browser client** only in Client Components that need real-time subscriptions.

```typescript
// lib/supabase/server.ts — use in Server Components and Actions
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: ... } }
  )
}
```

**Never use the service role key outside of `lib/stripe/webhooks.ts`.**

---

## Server Actions — the pattern

Every mutation goes through a Server Action. Always validate with Zod before touching the database.

```typescript
// actions/menu-items.ts
'use server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { menuItemSchema } from '@/lib/validations/menu-item'
import { revalidatePath } from 'next/cache'

export async function createMenuItem(formData: unknown) {
  const supabase = createClient()

  // 1. Auth check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthenticated' }

  // 2. Validate input
  const parsed = menuItemSchema.safeParse(formData)
  if (!parsed.success) return { error: parsed.error.flatten() }

  // 3. Ownership check — verify they own the category's venue
  // (RLS is the safety net, this is defence-in-depth)

  // 4. Write
  const { data, error } = await supabase
    .from('menu_items')
    .insert(parsed.data)
    .select()
    .single()

  if (error) return { error: error.message }

  // 5. Revalidate the public menu page
  revalidatePath(`/p/${venueSlug}`)

  return { data }
}
```

Return shape is always `{ data } | { error }`. Never throw from a Server Action.

---

## Public menu page — rendering strategy

The guest menu at `/p/[slug]` is the highest-traffic route. Use ISR:

```typescript
// app/p/[slug]/page.tsx
export const revalidate = 60 // revalidate every 60 seconds

export async function generateStaticParams() {
  // Pre-build all active venue slugs at deploy time
  const supabase = createClient()
  const { data } = await supabase.from('venues').select('slug').eq('active', true)
  return data?.map(v => ({ slug: v.slug })) ?? []
}
```

When a restaurant owner updates their menu via the dashboard, call `revalidatePath('/p/[slug]')` at the end of every relevant Server Action to push the new version within 60 seconds.

**Do not use `'use client'` on the guest menu page.** It must be a Server Component for performance. Language switching is the only interactive element — handle it with a URL search param (`?lang=es`) and read it server-side.

---

## Authentication and route protection

```typescript
// middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function middleware(request) {
  // Refresh session cookie on every request
  // Redirect unauthenticated users away from (dashboard) routes
  // Redirect authenticated users away from (auth) routes
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|p/).*)']
}
```

Public paths that must **never** require auth: `/`, `/pricing`, `/p/[slug]`, `/api/webhooks/stripe`.

---

## Stripe integration

### Subscription plans

| Plan | Stripe Price ID env var | Venues | Staff seats |
|---|---|---|---|
| Trial | — (free, 30 days) | 1 | 0 |
| Pro | `STRIPE_PRICE_PRO_MONTHLY` | 1 | 3 |
| Chain | `STRIPE_PRICE_CHAIN_MONTHLY` | Unlimited | Unlimited |

### Webhook handler

```typescript
// app/api/webhooks/stripe/route.ts
export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature')!
  const body = await req.text()
  const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      await syncSubscription(event.data.object)
      break
    case 'customer.subscription.deleted':
      await cancelSubscription(event.data.object)
      break
  }

  return NextResponse.json({ received: true })
}
```

Sync all subscription state into the `subscriptions` table. **Never trust the client to report plan status** — always read from Supabase.

### Feature gating

Use the `SubscriptionGate` component and the `useSubscription` hook to guard plan-limited features. Check plan limits in Server Actions before writing, not just in the UI.

---

## QR code generation

QR codes point to `https://nuvomenu.com/p/[slug]`. The slug is **permanent and never changes**, even if the venue renames. Generate and regenerate QR codes server-side using the `qrcode` package. Offer PNG download and SVG download from the `/venues/[id]/qr` page.

```typescript
// lib/qr.ts
import QRCode from 'qrcode'

export async function generateQRCode(slug: string): Promise<string> {
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/p/${slug}`
  return QRCode.toDataURL(url, {
    width: 400,
    margin: 2,
    color: { dark: '#0F6E56', light: '#FFFFFF' }
  })
}
```

---

## Image uploads — Uploadthing

Use Uploadthing for all dish photo and venue logo uploads. Configure an `imageUploader` file route that validates file type (`image/*`), max size (4MB), and returns the URL to store in Supabase.

```typescript
// app/api/uploadthing/core.ts
import { createUploadthing } from 'uploadthing/next'
const f = createUploadthing()

export const ourFileRouter = {
  dishImage: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .middleware(async () => {
      const user = await getUser()
      if (!user) throw new Error('Unauthorized')
      return { userId: user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { url: file.url }
    }),
}
```

After upload, save the returned URL to `menu_items.image_url` via a Server Action.

---

## Email — Resend + React Email

Trigger emails from Server Actions or Supabase Edge Functions. Never send email from client-side code.

```typescript
// lib/email.ts
import { Resend } from 'resend'
const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendTeamInvite({ to, venueName, inviteUrl }: InviteEmailProps) {
  await resend.emails.send({
    from: 'Nuvomenu <hello@nuvomenu.com>',
    to,
    subject: `You've been invited to manage ${venueName} on Nuvomenu`,
    react: TeamInviteEmail({ venueName, inviteUrl }),
  })
}
```

### Required email triggers

| Event | Template |
|---|---|
| Signup | `WelcomeEmail` |
| Trial day 25 | `TrialExpiryEmail` |
| Staff invite | `TeamInviteEmail` |
| Subscription confirmed | `SubscriptionConfirmEmail` |

---

## Multi-language menus

Supported locales are stored in `item_translations`. The guest reads the locale from `?lang=` search param, falling back to the item's default (English) name if no translation exists.

```typescript
// In the guest menu Server Component
const lang = searchParams.lang ?? 'en'
// Fetch items with their translation for this locale
// Fall back to base name/description if translation missing
```

Never hard-code locale strings. Use a `SUPPORTED_LOCALES` constant:

```typescript
export const SUPPORTED_LOCALES = ['en', 'es', 'it', 'fr', 'pt', 'de', 'ar'] as const
export type Locale = typeof SUPPORTED_LOCALES[number]
```

---

## Design system

The Nuvomenu brand palette — use these exact values throughout the UI:

```typescript
// In tailwind.config.ts / CSS variables
'teal-primary':  '#1D9E75',   // buttons, active states, links
'teal-deep':     '#0F6E56',   // logo, header backgrounds, icon fills
'teal-soft':     '#9FE1CB',   // tints, hover states, success indicators
'teal-tint':     '#E1F5EE',   // background tints, badges
'ink':           '#2C2C2A',   // primary text
'stone':         '#5F5E5A',   // secondary text
'mist':          '#F1EFE8',   // page backgrounds
'amber-accent':  '#EF9F27',   // promotional badges, highlights only
```

Logo: serif N in a rounded square, deep teal background, soft teal arc beneath. See `/public/logo.svg`.

Typography in the marketing site: Fraunces (serif, headlines) + DM Sans (sans, UI). In the dashboard and guest menu: DM Sans only.

---

## Naming conventions

| Thing | Convention | Example |
|---|---|---|
| Components | PascalCase | `MenuItemCard.tsx` |
| Server Actions | camelCase verb-noun | `createMenuItem`, `updateVenue`, `deleteCategory` |
| Supabase tables | snake_case plural | `menu_items`, `staff_members` |
| Route files | Next.js standard | `page.tsx`, `layout.tsx`, `route.ts` |
| Zod schemas | camelCase + `Schema` | `menuItemSchema`, `venueSchema` |
| Env vars | SCREAMING_SNAKE | `STRIPE_WEBHOOK_SECRET` |

---

## Environment variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=         # server-only, webhooks only

# Stripe
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_PRO_MONTHLY=
STRIPE_PRICE_CHAIN_MONTHLY=

# Resend
RESEND_API_KEY=

# Uploadthing
UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=

# App
NEXT_PUBLIC_APP_URL=               # https://nuvomenu.com in prod
```

---

## Critical rules — never break these

1. **RLS is always on.** Never bypass it with the service role key except in the Stripe webhook handler.
2. **Validate before writing.** Every Server Action runs Zod validation before any Supabase call.
3. **The slug is permanent.** `venues.slug` is set at creation and never mutated. QR codes depend on it.
4. **The guest menu is a Server Component.** Never add `'use client'` to `/app/p/[slug]/page.tsx` or its direct children.
5. **No client-side Supabase writes.** All mutations go through Server Actions. The browser client is read-only + realtime only.
6. **Return `{ data } | { error }` from every action.** Never throw. Let the caller decide how to surface errors.
7. **Revalidate after every menu mutation.** Call `revalidatePath('/p/[slug]')` at the end of any action that changes menu content.
8. **Enable the Supabase connection pooler (PgBouncer) from day one.** Set `?pgbouncer=true` on the database URL. The default connection limit will cause production issues at scale.

---

## What to build — phase order

Build in this sequence. Do not skip phases.

**Phase 1 — Foundation**
- Supabase project setup, schema migrations, RLS policies
- Next.js app scaffold with route groups
- Auth (signup, login, magic link, Google OAuth)
- Middleware for session refresh and route protection
- Venue creation + slug generation

**Phase 2 — Menu builder**
- Category CRUD with drag-to-reorder (dnd kit)
- Menu item CRUD with Uploadthing photo upload
- Visible/hidden toggle, unavailable toggle
- Old price / new price fields
- Public guest menu page with ISR

**Phase 3 — Monetisation**
- Stripe Billing integration
- Free trial logic (30 days, tracked in subscriptions table)
- Subscription plans: Pro and Chain
- Stripe Customer Portal for self-serve billing
- Stripe webhook handler
- SubscriptionGate component

**Phase 4 — Teams and multi-language**
- Staff invite flow (email → accept → scoped dashboard access)
- Multi-venue support for Chain plan
- item_translations table + language switcher on guest menu
- Resend email integration

**Phase 5 — Polish**
- QR code download page (PNG + SVG)
- Onboarding flow for new venues
- Sentry error tracking
- Vercel Analytics
- Performance audit of guest menu page

---

## Useful commands

```bash
# Generate Supabase TypeScript types (run after any schema change)
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/database.types.ts

# Run Supabase locally
npx supabase start

# Push a migration
npx supabase db push

# Run Stripe webhook listener locally
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Start dev server
pnpm dev
```

---

*Last updated: June 2026. If you find a conflict between this file and a code comment, this file wins.*
