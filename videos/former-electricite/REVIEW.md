# former-electricite : relecture

Formation pratique à l'intelligence artificielle. Rendu du 2026-11-02, premier rendu complet retenu.

| Mesure | Valeur |
|---|---|
| Durée | 30,00 s, 750 images, 25 i/s |
| Format | 1920×1080, H.264, yuv420p, muet |
| Poids | 5 205 365 octets, CRF 20 (plafond 6 Mo) |
| Affiche | `out/former-electricite.webp`, 1280×720, prise à **9,9 s** (les trois documents de « Produire des contenus ») |

## Écarts et points à connaître

- **Temps d'affiche :** `render-all.sh` prend 12 s par défaut, en plein vol. L'affiche a été refaite à 9,9 s avec la même commande ffmpeg. Tout nouveau passage du script l'écrasera tant que `poster_time` ne contient pas `former-electricite) echo 9.9`.
- **Loupe :** à sa sortie, vers 20,9 s, son manche passe sur la fin de « décision » pendant quelques images. Défaut laissé tel quel, le texte reste affiché jusqu'à 21,4 s.
- **Résultat de `check` :** 0 erreur. Avertissements attendus : `film_silent`, `audio_none`, `composition_file_too_large`, `text_occluded`, ainsi que `text_below_floor` lié au plan large et aux réductions de caméra. `contrast_aa_failure` vient du gris de départ de `PH.ink`. `line_unread` compte les lignes tapées lettre par lettre comme des mots, et « Une formation en quatre compétences. » reste à l'écran environ 1,6 s. La signature de fin dure 1,9 s pour 2 s demandées : elle vient de la fin commune à `t = 27,2`.
- **Textes :** relecture `avoid-ai-writing` faite à la main, sans le détecteur ni `references/patterns.md`, sur des règles calibrées pour l'anglais. Aucun motif relevé.

## Vérifié

Planche de 16 images et images pleine taille à 9,9 s et 20,9 s tirées du MP4 ; métadonnées lues avec ffprobe. Images fixes de la composition avant rendu, milieux de déplacement compris.

## Non vérifié

Le film n'a pas été regardé en lecture continue : fluidité et temps de lecture sont jugés sur images fixes. Pas de rendu 4K. Pas d'intégration au site (coordinatrice).
