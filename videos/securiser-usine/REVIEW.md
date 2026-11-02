# Revue : securiser-usine

**Livrable :** `out/securiser-usine.mp4`, 30,00 s, 750 images, 1920×1080, 25 i/s, H.264, yuv420p, muet, 4 268 843 octets (4,3 Mo, plafond 6 Mo), CRF 20. Un seul rendu complet.

**Affiche :** `out/securiser-usine.webp`, tirée du master à **13,7 s** (compagnon équipé, cinq coches, fil autour de lui), avec la commande ffmpeg de `render-all.sh`. Ce script utilise 12,0 s pour ce film et réécrirait l'affiche à un nouveau rendu : il faudrait y ajouter `securiser-usine) echo 13.7`.

## Contrôles faits

- `check` : 0 erreur.
- Images fixes de chaque feuille avant rendu, dont trois en pleine taille à 13,4 et 13,7 s sur la feuille 2 ; les autres feuilles sur planches.
- Sur le MP4 : planche de 16 images, images à 7,28, 10,4, 14,6, 14,64, 14,68, 14,72, 16,9 et 24,4 s. La plongée dans le casque reste entièrement verte au raccord caché (14,64 à 14,72 s), sans éclair.

## Écarts

- **Feuille 2 de 8,5 s** au lieu de 4 à 5 s : les EPI sont le sujet du film. Feuilles 1, 3 et 4 raccourcies à environ 4 s.
- **Bonhomme réécrit :** `_system/parts/figure.svg.html` n'a pas d'articulations. Le film a son propre personnage aux mêmes proportions, avec cinématique inverse, pieds qui ne glissent pas et vue de profil.
- **Pistes échantillonnées :** les poses sont précalculées image par image et peintes depuis une horloge GSAP (`onUpdate`, comme le nœud du film de marque). Le temps de la timeline reste la seule entrée, mais `hf.sh render` à une autre cadence garderait des pas de 1/25 s.
- **Casque blanc en gros plan** sur la feuille verte, alors qu'il est vert sur le personnage : choix de contraste, traité comme un dessin technique.
- **Bras devant le casque** pendant la pose (vers 7,3 s, environ 0,5 s) : assumé, le geste passe par le sommet du casque.

## Alertes `check` conservées

- `film_silent`, `audio_none` : film muet demandé.
- `composition_file_too_large`, `text_occluded` sur le plan final : prévus par `SPEC.md`.
- `contrast_aa_failure` sur « À chaque poste » : mesuré pendant l'entrée du texte, à l'état transitoire.
- `text_below_floor` : étiquettes en 30 px CSS, sous 28 px à l'écran à z 0,93 et dans le plan large. Règle de `SPEC.md` respectée.
- `line_unread` : signature à l'écran 1,90 s pour 2,00 s attendues. Vient de `PH.outro` à 27,2 s et concerne les films de 30 s : à arbitrer par la coordinatrice.

## Non vérifié

- **Le film n'a pas été regardé en lecture continue :** rythme, marche et enchaînement des gestes sont jugés sur images fixes uniquement. Priorité pour un œil humain : 6,5 à 12,2 s (les gestes) et 19 à 23,5 s (les marches).
- **Textes :** relus selon `avoid-ai-writing` en audit manuel, sans lancer le détecteur et sans lire son catalogue complet, calibré pour l'anglais. Aucun motif relevé.
- Rendu 4K non essayé.
