# QA checklist TableFlash

Avant chaque validation, tester les tailles suivantes :
- 360px
- 390px
- 430px
- 768px
- 1024px
- 1366px

## Checklist mobile

- pas de scroll horizontal
- pas de texte coupé
- pas de label cassé
- pas de bouton trop petit
- pas de carte trop large
- pas de grille desktop forcée
- action principale visible
- navigation claire
- contenu lisible au doigt
- sections avancées cachées ou pliables

## Checklist pages restaurateur

### Accueil
- service lisible
- commandes à traiter visibles
- action principale claire
- pas trop de cartes

### Commandes
- filtres simples
- une commande lisible rapidement
- statut compréhensible
- action suivante évidente

### Menu
- ajouter produit visible
- catégories simples
- prix lisible
- disponibilité lisible
- édition produit utilisable sur mobile

### QR
- ajouter table visible
- copier lien simple
- voir QR simple
- impression pas envahissante

### Avis
- avis à traiter visibles
- lien Google clair
- actions simples

### Statistiques
- chiffres utiles uniquement
- filtres simples
- graphique lisible
- résumé actionnable

### Réglages
- sections pliables
- horaires compréhensibles
- commandes compréhensibles
- QR compréhensible
- avis Google compréhensible

## Checklist technique

Avant commit :
- npm run lint si disponible
- npm run build si possible
- vérifier erreurs console
- vérifier hydratation
- vérifier localStorage
- vérifier navigation mobile
