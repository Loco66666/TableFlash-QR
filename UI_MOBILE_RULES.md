# UI mobile rules TableFlash

## Règle principale

Mobile d'abord.

Chaque écran doit être utilisable sur :
- 360px
- 390px
- 430px
- 768px
- 1024px
- desktop 1366px

## Mobile

Sur mobile :
- une seule colonne par défaut
- une section claire
- une action principale
- aucune grille desktop forcée
- aucun scroll horizontal

## Textes

Interdit :
- texte coupé lettre par lettre
- labels cassés
- boutons incompréhensibles
- titres trop longs

Si un texte est trop long, le raccourcir.

## Boutons

Tous les boutons doivent être explicites.

Mauvais :
- Prévisualiser
- Actualiser
- Réorganiser
- Période personnalisée

Meilleur :
- Voir le menu client
- Actualiser les commandes
- Changer l'ordre des catégories
- Voir cette période

Boutons :
- hauteur minimum 44px
- zone tactile confortable
- texte lisible
- action claire

## Layout

À respecter :
- pas de overflow horizontal
- cartes pleine largeur sur mobile
- padding mobile 16px
- padding tablette 20px
- border-radius généreux
- sections avancées pliables
- pas de cartes énormes inutiles

## Typographie

Mobile :
- titre page : 24px à 28px max
- titre section : 20px à 22px
- texte normal : 14px à 16px
- labels courts

## Navigation

Mobile :
- navigation basse ou compacte
- maximum 5 entrées principales
- labels courts

Tablette :
- sidebar compacte ou navigation lisible

Desktop :
- sidebar possible
- mais le desktop ne doit pas casser le mobile

## Hydratation

Interdit dans le rendu initial SSR-visible :
- Date.now()
- Math.random()
- lecture localStorage directe
- valeurs variables côté serveur/client

LocalStorage uniquement après mount.
