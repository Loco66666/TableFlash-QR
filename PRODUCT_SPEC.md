cat > PRODUCT_SPEC.md <<'EOF'
# TableFlash — Product Specification

## One-liner

TableFlash is a QR menu SaaS that lets restaurants receive customer orders from phones without online payment, while helping them collect more customer reviews.

## Target Customers

- Restaurants
- Snacks
- Bars
- Food trucks
- Brasseries
- Fast casual restaurants
- Small local hospitality businesses

## Target Users

### Restaurant owner

Needs:
- update menu quickly
- avoid printed menu changes
- receive orders more efficiently
- reduce waiting time
- collect customer reviews
- keep existing payment process

### Restaurant staff

Needs:
- see incoming orders
- accept or refuse orders
- update order status
- know the table
- know if payment must happen at counter or server

### Customer

Needs:
- scan QR code
- browse menu quickly
- see prices and allergens
- order without creating an account
- pay normally at counter or server
- track order status
- leave a review after meal

## Core MVP

### Restaurant Dashboard

- Authentication
- Restaurant onboarding
- Menu categories
- Menu items
- Prices
- Photos
- Allergens
- Promotions
- Availability / rupture
- QR code general
- QR code per table
- Orders dashboard
- Reviews dashboard
- Simple statistics
- Billing later

### Public Customer Side

- Public restaurant menu
- Table-specific menu
- Mobile-first design
- Product list
- Cart
- Order submission
- Order tracking
- Review form
- Google review link

## Order Rules

- No online payment for food orders in MVP.
- Customers pay at the counter or to the server.
- Orders start with status `new`.
- Restaurant must validate orders before preparation.
- Restaurant can refuse an order.
- Restaurant can mark order as to_pay, paid, preparing, ready, served or cancelled.

## Order Statuses

- new
- accepted
- refused
- to_pay
- paid
- preparing
- ready
- served
- cancelled

## Payment Statuses

- unpaid
- paid
- cancelled

## Payment Method

MVP value:

- cash_or_counter

Meaning:

The payment is handled physically at the counter or by the server.

## Review Rules

- Customers can leave a review after the meal.
- Reviews include rating 1 to 5 and optional comment.
- The app can show a Google review button if the restaurant configured a Google review URL.
- Do not implement aggressive review gating.
- Do not hide negative feedback.

## Pricing

Starter — 29 €/month:
- QR menu
- categories
- menu items
- allergens
- availability
- general QR
- basic reviews

Pro — 59 €/month:
- Starter features
- table QR codes
- customer orders
- order dashboard
- order statuses
- promotions
- simple stats

Premium — 99 €/month:
- Pro features
- future advanced features
- priority support

Pilot offer:
- 14 days free
- installation offered
- first 10 restaurants
- founder price 49 €/month

## Success Criteria for MVP

A real restaurant must be able to:

1. create an account
2. create its restaurant profile
3. create menu categories
4. create menu items
5. generate a QR menu
6. generate table QR codes
7. let a customer scan the QR code
8. let a customer add items to cart
9. let a customer submit an order
10. see the order in dashboard
11. accept the order
12. update order status
13. let customer track status
14. let customer leave review
15. see review in dashboard
EOF