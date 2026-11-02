# expliquer-pac : revue

**Livraison :** `out/expliquer-pac.mp4`, 30,0 s, 1920×1080, 25 i/s, H.264 High, yuv420p, sans piste audio, 5,63 Mo (CRF 22). Affiche `out/expliquer-pac.webp`, 1280×720, prise à **23,95 s** : maison complète, personnages, titre « Améliorer le confort ». Un seul rendu complet.

**Affiche :** `render-all.sh` utilise 12 s par défaut pour ce film. L'affiche livrée a été produite à part, avec la même commande ffmpeg. Tout nouveau rendu l'écrasera tant que `poster_time` ne vaut pas 23.95 pour `expliquer-pac`.

## Écarts à la SPEC

- **Aplat des pièces :** vert `#247855` à 13 % d'opacité (pièces chauffées), hors de la palette stricte, sur les feuilles 3 et 4.
- **Balisage généré par script :** la maison et ses couches sont injectées une seule fois au chargement, pour éviter de recopier le dessin sur cinq feuilles. Le rendu reste entièrement déterminé par le temps.
- **Plan large court :** environ 1,2 s, retour compris, pour laisser le temps de lire « Et chez vous ? ».

## Avertissements de `check`

Aucune erreur. Restent les avertissements prévus par la SPEC (`film_silent`, `composition_file_too_large`, `text_occluded` sous `#end`) et d'autres, sans défaut visible sur les images contrôlées :

- `audio_none` : film muet demandé ;
- `contrast_aa_failure` : relevé sur des mots en cours d'apparition par `PH.ink` ;
- `connector_orphan` : le fil, dont une extrémité est hors champ pendant les déplacements ;
- `text_below_floor` : les textes font bien 30 px ou plus, le contrôle les mesure quand la caméra recule ;
- `line_unread` sur la signature commune : 1,90 s, sous les 2 s visées. Elle vient de `PH.outro`, réglée par la SPEC à 27,2 s.

Contrôle relancé sur la composition finale, celle du rendu livré.

## Textes ajoutés, à valider

Comprendre. Avant les travaux, un regard sur toute la maison. Toit, Fenêtres, Air, Chauffage. Réduire les pertes. D'abord l'enveloppe : toit, murs, fenêtres et plancher. Renouveler l'air. L'air neuf entre dans les pièces, l'air usé ressort. Air neuf, Air usé. Adapter le chauffage. Un équipement à la mesure d'une maison mieux isolée. Améliorer le confort. Une maison plus agréable à vivre, pièce après pièce. Et chez vous ? Un projet adapté à votre logement.

Relus à la main selon les règles du skill `avoid-ai-writing`, sans lancer le skill. Aucun chiffre, aide financière, marque ni technologie nommée.

## Non vérifié

Le film n'a pas été regardé en lecture continue : le contrôle porte sur des images fixes, dont des planches tirées du MP4. La fluidité reste à juger à l'œil, surtout la pose des calques vers 21 s et le plan large. Passage en 4K non testé.
