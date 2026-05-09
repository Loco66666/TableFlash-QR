cat > CODEX_CONTEXT.md <<'EOF'
# TableFlash — Codex Context

## Product

TableFlash is a SaaS web application for restaurants, snacks, bars and food trucks.

Positioning:

“TableFlash — le menu QR qui prend les commandes et aide les restaurants à récolter plus d’avis clients.”

## MVP Goal

A restaurant must be able to:

1. create an account
2. create a restaurant profile
3. create menu categories
4. create menu items
5. manage prices, photos, allergens, promotions and availability
6. generate a public QR menu
7. generate table-specific QR codes
8. let customers browse the menu without an account
9. let customers add items to a cart
10. let customers submit an order without online payment
11. let the restaurant accept, refuse and manage orders
12. let customers track their order status
13. let customers leave a review after the meal
14. let the restaurant view reviews
15. manage restaurant SaaS subscription plans later with Stripe

## Important MVP Rules

- No native mobile app.
- No customer account.
- No online payment from customers.
- Customers pay at the counter or to the server.
- The restaurant must validate orders before preparation.
- QR codes can be general or table-specific.
- The public menu must be fast and mobile-first.
- Supabase RLS is mandatory.
- A restaurant owner must never access another restaurant’s data.
- Keep the MVP focused on menu, QR codes, orders and reviews.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide React
- React Hook Form
- Zod
- Supabase Auth
- Supabase Postgres
- Supabase Storage
- Stripe Billing later
- Resend later
- Vercel deployment

## Commercial Plans

Starter — 29 €/month:
- QR menu
- categories
- menu items
- allergens
- stock availability
- general QR code
- basic reviews

Pro — 59 €/month:
- everything in Starter
- QR codes per table
- customer orders
- restaurant order dashboard
- order statuses
- promotions
- simple statistics

Premium — 99 €/month:
- everything in Pro
- kitchen display later
- multiple staff accounts later
- upsells later
- advanced statistics later
- priority support

Beta offer:
- 14-day free trial
- installation offered
- first 5 to 10 local restaurants
- founder price: 49 €/month if they continue after beta

## Development Rules for Codex

Work step by step.

Do not build everything at once.

For each task:
1. explain the files you will modify
2. implement only the requested scope
3. keep code clean and typed
4. include test instructions
5. do not add extra features unless requested

Never add:
- food delivery
- booking
- marketplace
- online customer payment
- native mobile app
- complex inventory
- POS integration
EOF