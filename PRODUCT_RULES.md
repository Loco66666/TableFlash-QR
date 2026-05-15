# Product rules TableFlash

## Vision produit

TableFlash est un SaaS mobile-first pour restaurants.

L'utilisateur principal est un restaurateur ou un membre du personnel qui utilise l'application pendant le service, souvent sur téléphone ou tablette.

## Priorités produit

1. Simplicité
2. Rapidité
3. Utilisation mobile/tablette
4. Actions claires
5. Zéro superflu
6. Desktop secondaire

## Fonctionnalités coeur

À garder :
- menu QR
- commande à table
- paiement physique uniquement
- dashboard commandes
- QR par table
- avis après repas
- redirection Google Avis
- statistiques simples
- paramètres restaurant
- images produits
- promotions simples
- rupture produit

## Paiement

Pour le MVP :
- paiement physique uniquement
- pas de Stripe
- pas de paiement en ligne
- pas de tunnel complexe

## Backend

Pour l'instant :
- comportement local uniquement
- ne pas ajouter Supabase
- ne pas ajouter Auth
- ne pas ajouter base distante
- ne pas ajouter Storage

Sauf demande explicite.

## À éviter

Ne jamais afficher dans l'interface restaurateur :
- mock
- demo
- local
- backend
- fake
- maquette
- test data

Utiliser plutôt :
- activité du jour
- données de service
- commandes récentes

## Règle centrale

Si une fonctionnalité n'aide pas directement le restaurateur pendant son service, elle doit être :
- supprimée
- simplifiée
- cachée
- ou repoussée
