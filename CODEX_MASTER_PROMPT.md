# Codex master prompt TableFlash

TableFlash is a mobile-first SaaS for restaurants.

The primary users are restaurant owners and staff using phones and tablets during service.

## Product priority

1. Mobile and tablet usability
2. Restaurant operational clarity
3. Fast actions
4. No visual bugs
5. No unnecessary features
6. Desktop is secondary

## Never create

- horizontal overflow on mobile
- clipped text
- letter-by-letter broken labels
- unclear buttons
- fake/demo/internal wording in UI
- non-functional buttons
- oversized cards on mobile
- complex desktop-first layouts

## Every screen must answer

- What is happening?
- What needs attention?
- What can the user do now?

## Main app sections

- Accueil
- Commandes
- Menu
- QR
- Avis
- Plus

## Core rules

- one column on mobile
- bottom navigation or compact mobile navigation
- buttons minimum 44px high
- primary action obvious
- advanced options hidden
- no Supabase/Auth/Stripe/database unless explicitly requested
- local-only behavior until backend phase
- no hydration errors
- no Math.random or Date.now in SSR-visible render
- localStorage only after mount

## Before coding, always identify

1. target route
2. user goal
3. primary action
4. mobile layout
5. tablet layout
6. desktop fallback
7. what must not be touched

## After coding, always report

1. modified files
2. target route
3. mobile behavior
4. tablet behavior
5. desktop behavior
6. removed superfluous elements
7. lint/build result

## Current Sprint

Sprint 1 — Mobile foundation.

Goal:
Stabilize the mobile/tablet layout and navigation without changing business logic.

Routes:
- /dashboard
- /dashboard/orders
- /dashboard/menu
- /dashboard/tables
- /dashboard/reviews
- /dashboard/statistics
- /dashboard/settings

Do:
- audit global layout
- simplify mobile navigation
- prevent horizontal overflow
- keep existing features
- make buttons and cards mobile friendly

Do not:
- add backend
- add auth
- add payment
- rewrite all pages at once
- remove existing business logic
