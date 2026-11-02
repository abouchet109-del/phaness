# accompagner-solaire : revue

Rendu final : `out/accompagner-solaire.mp4`, 30,00 s, 750 images, 1920×1080, 25 i/s, H.264 High, yuv420p, muet, 5,31 Mo, CRF 22 (CRF 20 dépassait le plafond de 6 Mo). Deux rendus complets.

## Affiche

`out/accompagner-solaire.webp` est tirée à **13,4 s** : le cadran réglé sur 20,0 °C et la pastille cochée. Elle a été produite avec la commande ffmpeg de `render-all.sh`, depuis le master. **`poster_time` vaut encore 12 s pour ce film dans `render-all.sh`** : relancer ce script sans le changer rétablit une affiche à 12 s, au milieu du geste.

## Écarts et choix

- **Textes ajoutés par ce film** : titres et phrases des cinq feuilles, tous les libellés de l'interface, « Interface fictive, valeurs d'exemple » sur les trois écrans, « Exemple : la durée varie selon le logement » sous la courbe. Ces mentions sont à valider, comme les valeurs d'exemple (18,5 °C ; consigne 19,0 puis 20,0 °C ; réduit 18,0 °C ; plages horaires).
- **Temps compressé à la feuille 4** : la température passe de 18,5 à 20,0 °C en 2,3 s à l'écran. La mention d'exemple sous la courbe évite d'y lire une promesse de durée.
- **Écran Programme** : le bouton maison ramène directement à l'accueil, sans repasser par Chauffage.
- **Interface à 30 px** : à la caméra de repos (z 0,93 à 0,98), le texte s'affiche à environ 29 px, comme dans le film de marque. Dans la maison, la commande est réduite à 13 %, mais son écran est encore éteint.
- **Signature finale** : 1,9 s à l'écran, sous le seuil de 2 s de `check`. Cela vient du `t = 27,2` prescrit par `SPEC.md` pour la fin commune.

## `check`

Aucune erreur réelle. Restent des faux positifs, vérifiés un à un : `text_occluded` et `contrast_aa_failure` sur des calques cachés (chiffres masqués des rouleaux, accueil sous l'écran Chauffage) ; `contrast_aa_failure` et `line_unread` en avertissement sur le plan final et les empreintes ; `first_frame_empty`, `film_silent`, `composition_file_too_large`, `text_below_floor` (commande réduite dans la maison).

## Vérifié

- MP4 final : planche de 16 images, et images extraites à 3,9 ; 6,9 ; 15,84 ; 22,44 et 26,4 s.
- Images pleine taille d'une feuille sur chaque étape, sur le rendu de contrôle précédant les dernières retouches.
- Après retouches : plus de chiffres sur le libellé, icône de radiateur lisible, libellé du bouton conservé à l'appui.

## Non vérifié

- La fluidité en lecture réelle : le contrôle s'est fait sur images fixes.
- Le passage en 4K.
- Textes : passage en détection seule avec `avoid-ai-writing`, sans outil automatique, sur les règles lues au début du catalogue, qui sont calibrées pour l'anglais. Aucune reformulation n'a été jugée nécessaire.
