---
health: onTrack
---

# Activité — 6 octobre 2026 (suite)

## Links par module (THA-596, v2.7.0)

- Modale « Edit module » : nouveau champ « Links du module » sous le support de cours PDF, avec un éditeur de texte riche (gras, italique, listes, liens) — nouveau composant UI `RichTextEditor` basé sur Tiptap
- Côté apprenant : si le champ est renseigné, un onglet « Links » apparaît dès la sélection du module et reste visible pendant l'examen ; il déplie un volet latéral (comme le Mode coopératif) avec le texte mis en forme ; les liens s'ouvrent dans un nouvel onglet. Champ vide = pas d'onglet
- Contenu nettoyé à l'affichage (DOMPurify) et protocoles de liens limités à http(s)/mailto
- Bugs corrigés en cours de route : le contenu enregistré ne s'affichait pas à la réouverture de la modale, puis celui du module précédent s'affichait en changeant de module ; tests de régression ajoutés
- Déployé en production (v2.7.0)
