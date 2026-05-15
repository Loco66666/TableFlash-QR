# Roadmap mobile-first TableFlash

## Vision

TableFlash doit devenir un outil simple pour les restaurateurs.

Objectifs principaux :
1. Créer son menu
2. Générer ses QR par table
3. Recevoir les commandes
4. Suivre les commandes
5. Demander des avis après repas
6. Voir les chiffres importants
7. Régler son restaurant facilement

Tout ce qui ne sert pas directement à ça doit être supprimé, simplifié, caché ou repoussé.

## Principe fondamental

Mobile et tablette d'abord.

Le restaurateur utilise TableFlash :
- sur téléphone
- sur tablette
- au comptoir
- en salle
- pendant le service
- rapidement

Chaque écran doit être pensé d'abord entre 390px et 768px.

## Navigation cible

Mobile :
- Accueil
- Commandes
- Menu
- QR
- Plus

Dans Plus :
- Avis
- Statistiques
- Réglages
- Aide

Desktop :
- peut garder une sidebar
- ne doit pas imposer son layout au mobile

## Sprints

### Sprint 1 — Socle mobile
- créer/stabiliser les composants mobile-first
- refaire navigation mobile/tablette
- corriger layout global
- empêcher scroll horizontal
- garder les fonctionnalités existantes

Validation :
- toutes les pages s'ouvrent sur mobile
- aucun scroll horizontal
- aucun texte coupé
- navigation claire

### Sprint 2 — Commandes
- refaire /dashboard/orders mobile-first
- simplifier les statuts
- rendre les actions évidentes
- tester client vers dashboard

Validation :
- gérer une commande en moins de 10 secondes

### Sprint 3 — Menu
- refaire /dashboard/menu mobile-first
- édition produit simple
- catégories simples
- disponibilité, rupture et promo visibles

Validation :
- ajouter/modifier un produit sur téléphone sans galérer

### Sprint 4 — QR
- refaire /dashboard/tables
- cartes QR simples
- copier lien
- voir QR
- préparer impression

Validation :
- créer une table et récupérer son QR en moins de 30 secondes

### Sprint 5 — Avis
- refaire /dashboard/reviews
- simplifier les filtres
- avis à traiter
- lien Google
- archive/réponse

Validation :
- le restaurateur sait quels avis traiter ou utiliser

### Sprint 6 — Statistiques
- refaire /dashboard/statistics mobile-first
- filtres utiles
- graphiques simples
- horaires automatiques
- résumé actionnable

Validation :
- comprendre son service en moins de 20 secondes

### Sprint 7 — Réglages
- refaire /dashboard/settings mobile-first
- sections pliables
- horaires clairs
- commandes claires
- QR clair
- avis clair
- apparence simplifiée

Validation :
- régler son établissement sans aide

### Sprint 8 — Page client
- refaire menu public QR
- produits lisibles
- panier simple
- confirmation claire
- suivi sans doublons
- avis après repas

Validation :
- un client commande sans demander d'explication

### Sprint 9 — QA complète
- tests mobile/tablette/desktop
- tests commandes
- tests avis
- tests QR
- tests images
- tests hydratation
- tests build/lint
