---
health: onTrack
---

# Activité — 14 septembre 2026 (suite)

## Hotfix quiz — temps de pause compté à tort (v2.5.1)

- Bug remonté en prod juste après la v2.5.0 : le "Total Time" affiché en fin de quizz pouvait dépasser la durée configurée sur le module (ex. 63m37s pour une limite de 60 min)
- Cause : le suivi du temps par question tournait sur une horloge réelle indépendante de la mise en pause (pause manuelle ou popup "Temps écoulé"), donc le temps passé en pause était compté comme du temps de réponse actif
- Correctif : le suivi se met désormais en pause/reprise en même temps que le quizz ; tests de régression ajoutés
- Déployé en production (v2.5.1)
