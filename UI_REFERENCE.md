cat > UI_REFERENCE.md <<'EOF'
# TableFlash — UI Reference

## Visual Direction

The approved mockups define a premium, clean, modern hospitality SaaS.

The application must visually match these references as closely as possible:

1. Desktop landing page
2. Menu management dashboard
3. Live orders dashboard
4. Mobile customer flow: menu, cart, order tracking, review

## Brand

Name:

TableFlash

Logo:

Green lightning / flash icon + TableFlash wordmark.

Tone:

- professional
- premium
- clean
- modern
- trustworthy
- restaurant-friendly
- simple and practical

## Colors

Primary green:
#047857

Dark green sidebar:
#063F2A

Light green background:
#ECFDF5

Text dark:
#111827

Text muted:
#6B7280

Border:
#E5E7EB

Main background:
#FFFFFF

Soft background:
#F9FAFB

Warning:
#F59E0B

Danger:
#DC2626

Success:
#16A34A

## General UI Style

- white dominant background
- emerald green accents
- dark green sidebar
- rounded cards
- rounded buttons
- subtle shadows
- clean sans-serif typography
- generous spacing
- mobile-first public menu
- desktop-first restaurant dashboard
- clear hierarchy
- French interface text

## Landing Page Reference

Route:

/

Must include:

- navbar
- TableFlash logo
- nav links
- login button
- demo CTA
- hero headline
- hero subheadline
- main CTA
- secondary CTA
- feature pills
- fake dashboard preview
- fake mobile menu preview
- “Comment ça marche”
- pricing cards
- beta offer banner
- social proof cards
- FAQ preview
- footer

Hero headline:

Le menu QR qui prend les commandes et aide les restaurants à récolter plus d’avis clients.

Hero subheadline:

Créez votre menu digital en quelques minutes, laissez vos clients commander depuis leur téléphone, payez à la caisse ou au serveur, et collectez plus d’avis après le repas.

CTA buttons:

- Demander une démo
- Voir l’offre pilote

Feature highlights:

- Menu QR
- Commande sans paiement en ligne
- Avis clients
- QR par table

Pricing:

- Starter 29 €/mois
- Pro 59 €/mois
- Premium 99 €/mois

Beta banner:

14 jours offerts pour les 10 premiers restaurants pilotes

## Dashboard Layout Reference

Sidebar items:

- Tableau de bord
- Menus
- Commandes
- Avis clients
- QR par table
- Statistiques
- Paramètres

Sidebar style:

- dark green or light variant depending page
- TableFlash logo at top
- restaurant selector
- nav items with icons
- active nav item highlighted
- beta offer card
- account block

## Menu Management Page Reference

Route:

/dashboard/menu

Must match the approved menu dashboard mockup.

Include:

- title: Gestion du menu
- buttons: Ajouter une catégorie, Ajouter un produit
- restaurant label: Le Bistrot des Halles
- summary cards:
  - Catégories
  - Produits actifs
  - Produit en rupture
  - Promotions actives
- categories column:
  - Entrées
  - Plats
  - Desserts
  - Boissons
- products list/table:
  - Produit
  - Prix
  - Allergènes
  - Disponibilité
  - Promo
  - Visibilité
- status badges:
  - Disponible
  - Rupture
  - Promo
  - Masqué
- right edit panel:
  - Nom du produit
  - Description
  - Prix
  - Allergènes
  - Disponible
  - Photo
  - Promotion
  - Enregistrer
- public mobile preview

Example products:

- Burger Classique
- Salade César
- Frites Maison
- Limonade
- Tiramisu
- Café gourmand

## Live Orders Dashboard Reference

Route:

/dashboard/orders

Must match the approved live orders dashboard mockup.

Include:

- title: Commandes en direct
- status pill: Service midi en cours
- summary cards:
  - Nouvelles commandes
  - En préparation
  - Prêtes
  - Servies
  - Total du jour
- filters:
  - Toutes
  - Nouvelles
  - En préparation
  - Prêtes
  - Servies
  - À payer
- order cards:
  - order number
  - time
  - table
  - items
  - total
  - status
  - action buttons
- selected order panel:
  - articles commandés
  - notes du client
  - paiement
  - actions rapides
- payment text:
  Paiement à la caisse ou au serveur
- widgets:
  - Top produits du jour
  - Temps moyen de préparation

## Mobile Customer Flow Reference

Routes:

- /r/demo
- /r/demo/table/demo-token
- /r/demo/order/1257
- /r/demo/review

Must match the approved mobile mockup.

Screens:

1. Menu screen
2. Cart screen
3. Order confirmation / tracking screen
4. Review screen

Menu screen:

- restaurant name
- table label
- category tabs
- product cards
- images
- descriptions
- prices
- allergen tags
- plus buttons
- sticky cart button

Cart screen:

- selected items
- quantities
- delete buttons
- optional note
- total
- message:
  Le paiement se fait à la caisse ou auprès du serveur.
- button:
  Envoyer la commande

Tracking screen:

- order accepted
- order number
- table
- status timeline
- payment reminder

Review screen:

- question:
  Comment s’est passée votre expérience ?
- star rating
- optional comment
- button:
  Envoyer mon avis
- secondary button:
  Laisser aussi un avis Google

## Important UI Rules

- Keep French copy.
- Keep premium green/white style.
- Keep dashboard dense but readable.
- Keep public menu very mobile-friendly.
- Do not redesign without user approval.
- Static mockups must be visually close before connecting database.
EOF