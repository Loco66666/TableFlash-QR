cat > ROADMAP.md <<'EOF'
# TableFlash — Development Roadmap

## Phase 0 — Repository Setup

- README exists
- GitHub repository initialized
- Codespace created
- Next.js app initialized
- First commit pushed

## Phase 1 — Project Documentation

Create:

- CODEX_CONTEXT.md
- PRODUCT_SPEC.md
- UI_REFERENCE.md
- ROADMAP.md

Goal:

Prevent Codex from drifting away from the validated MVP and visual direction.

## Phase 2 — Static Landing Page

Route:

/

Build landing page matching UI reference.

Sections:

- navbar
- hero
- CTA
- product preview
- feature highlights
- how it works
- pricing
- beta banner
- social proof
- FAQ
- footer

No Supabase.
No auth.
No Stripe.

## Phase 3 — Dashboard Layout

Routes:

- /dashboard
- /dashboard/menu
- /dashboard/orders
- /dashboard/reviews
- /dashboard/tables
- /dashboard/statistics
- /dashboard/settings

Build:

- dashboard shell
- sidebar
- header
- placeholder pages

No Supabase yet.

## Phase 4 — Static Menu Dashboard

Route:

/dashboard/menu

Build static menu management UI matching mockup.

Include:

- summary cards
- categories
- products table
- status badges
- edit panel
- mobile preview

## Phase 5 — Static Orders Dashboard

Route:

/dashboard/orders

Build static live orders UI matching mockup.

Include:

- summary cards
- filters
- order cards
- selected order panel
- payment note
- widgets

## Phase 6 — Static Customer Mobile Flow

Routes:

- /r/demo
- /r/demo/table/demo-token
- /r/demo/order/1257
- /r/demo/review

Build static mobile-first customer experience:

- menu
- cart
- order tracking
- review

## Phase 7 — Design System

Install and configure:

- shadcn/ui
- lucide-react
- reusable components

Extract components while preserving approved design.

## Phase 8 — Supabase Setup

Add:

- Supabase browser client
- Supabase server client
- env variables
- auth helpers

No schema yet.

## Phase 9 — Database Schema

Create Supabase migration:

- profiles
- restaurants
- restaurant_staff
- categories
- menu_items
- menu_item_options
- menu_item_option_values
- restaurant_tables
- orders
- order_items
- order_item_options
- reviews
- subscriptions

Add:

- UUID keys
- foreign keys
- indexes
- updated_at triggers
- RLS policies
- seed data

## Phase 10 — Authentication

Build:

- /login
- /register
- logout
- protected dashboard
- automatic profile creation

## Phase 11 — Restaurant Onboarding

Build:

- /onboarding
- create restaurant
- create owner staff relation
- slug validation
- redirect to dashboard

## Phase 12 — Connected Menu Management

Connect /dashboard/menu to Supabase.

Implement:

- categories CRUD
- menu items CRUD
- availability
- visibility
- promotions
- allergens
- price in cents

## Phase 13 — Product Images

Add Supabase Storage for menu item images.

## Phase 14 — Connected Public Menu

Connect:

- /r/[slug]
- /r/[slug]/table/[token]

Public menu must be readable without login.

## Phase 15 — QR Code Management

Build:

- /dashboard/tables
- general QR
- table QR
- copy URL
- download PNG
- deactivate table

## Phase 16 — Customer Cart

Add:

- add to cart
- update quantity
- remove item
- item notes
- total
- localStorage
- sticky cart button

## Phase 17 — Order Creation

Allow customer to submit order.

Rules:

- no online payment
- status new
- payment_status unpaid
- payment_method cash_or_counter
- redirect to tracking page

## Phase 18 — Connected Orders Dashboard

Connect /dashboard/orders to Supabase.

Implement:

- list orders
- filter orders
- selected order detail
- status updates
- restaurant isolation

## Phase 19 — Customer Order Tracking

Connect:

/r/[slug]/order/[orderNumber]

Show:

- status timeline
- order summary
- payment message
- review CTA when served

## Phase 20 — Customer Reviews

Build:

- public review page
- dashboard reviews page
- average rating
- review list
- Google review link

## Phase 21 — Simple Statistics

Build:

- orders today
- potential revenue
- average basket
- top products
- review count
- average rating

## Phase 22 — Stripe Billing

Build:

- /dashboard/billing
- Stripe checkout
- customer portal
- webhook
- subscription updates

Stripe is only for restaurant SaaS subscription, not for food orders.

## Phase 23 — Plan Limits

Implement server-side guards.

Starter:

- QR menu
- reviews
- general QR only
- no orders

Pro:

- orders
- table QR
- promotions
- simple stats

Premium:

- future advanced features

## Phase 24 — Emails

Add Resend later.

Emails:

- welcome
- trial ending soon
- negative review alert
- optional daily summary

## Phase 25 — Demo Mode

Create demo restaurant:

Le Bistrot des Halles

Demo data:

- categories
- products
- tables
- orders
- reviews

## Phase 26 — Quality and Security Audit

Check:

- TypeScript
- ESLint
- build
- RLS
- tenant isolation
- protected routes
- public route safety
- responsive design
- loading states
- error states

## Phase 27 — Vercel Deployment

Prepare:

- env documentation
- deployment checklist
- Supabase setup
- Stripe setup
- production build

## Phase 28 — Sales Kit

Prepare:

- demo QR
- offer page
- sales script
- flyer
- pricing
- beta conditions

## Phase 29 — Pilot Beta

Test with 5 to 10 restaurants.

Measure:

- scans
- orders
- reviews
- bugs
- objections
- willingness to pay

## Phase 30 — Convert and Improve

Convert pilot restaurants to paying customers.

Improve only based on repeated real feedback.
EOF