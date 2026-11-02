# REVIEW : vidéos V3

## `presentation-phaness` (rendu du 2026-11-02, Windows)

| Fichier | Valeur |
|---|---|
| `out/presentation-phaness.mp4` | 40,0 s, 1000 images, 4,68 Mo, CRF 20, H.264 High, yuv420p, 1920×1080, 25 i/s, faststart, sans piste audio |
| `out/presentation-phaness.webp` | affiche 1280×720, image à 21,6 s (vue éclatée) |

Plafond de 8 Mo non atteint : le CRF de départ suffit, l'image reste nette. Un rendu prend environ 1 min 30 sur ce PC.

### Choix créatifs
- **DA « table de storyboard » :** un plan-séquence sur six feuilles, en 2D vectoriel avec perspective CSS, relié par un fil. Écarté : WebGL, plus lourd à tenir pour quatre sujets variés.
- **Idée du film :** le nœud noir (le sujet complexe) se tire en ligne droite verte. Cette ligne construit chaque offre, puis le grand recul à 32 s montre que tout était un storyboard, avant le cadre vide « Et votre sujet ? », qui invite à se projeter.
- **Transitions :** recul et inclinaison en suivant le fil (trois fois), anneau qui se remplit et devient la feuille suivante, bord de feuille où le fil change de couleur, poussée vers le cadre vide, vert qui s'ouvre depuis le bouton de lecture.

### Contrôlé
- `hyperframes check` : 0 erreur. Avertissements gardés : `film_silent` (muet voulu), `composition_file_too_large` (une composition par film, pour le plan-séquence), `text_occluded` et `contrast_aa_failure` sur des textes masqués par la fin commune ou vus au grand recul, `text_below_floor` sur des textes réduits au grand recul.
- Images extraites du MP4 final : planche de 16 images, plus 3 images en pleine taille (15 s, 21,6 s, 33 s). Images fixes de milieux de déplacement avant rendu.
- ffprobe : codec, format, taille, cadence, durée, absence d'audio.
- Verrou de `render-all.sh` : présent pendant un rendu, retiré après un échec volontaire (film inexistant, code de sortie 1).
- Gabarit `_system/template/` : `check` sans erreur et images fixes sur une copie temporaire. `build.mjs --new` n'a pas été exécuté : il aurait effacé un dossier métier.

### Non vérifié
- Le mouvement n'a pas été regardé en temps réel : seules des images fixes ont été vues. Fluidité et lecture des sauts du personnage restent à juger à l'œil.
- Le skill `avoid-ai-writing` n'a pas été exécuté en entier : les textes viennent surtout du site ; les lignes nouvelles (voir `presentation-phaness/DECOUPAGE.md`) ont été relues à la main.
- Rendu 4K, affichage sur téléphone, intégration au héros du site.
- Aucun second regard extérieur sur le film.

### Point faible
La feuille « Former » : le personnage reste petit à côté des marches. Avec plus de temps, serrer le cadrage sur lui pendant les sauts.

## Films métier

À venir : chaque session ajoute ici sa section, ou la donne à la coordinatrice.

## Bilan V3 (2026-11-02)

| Film | Durée | Poids | Affiche | Revue |
|---|---|---|---|---|
| `presentation-phaness` | 40 s | 4,7 Mo | 21,6 s | ci-dessus |
| `former-electricite` | 30 s | 5,2 Mo | 9,9 s | `former-electricite/REVIEW.md` |
| `securiser-usine` | 30 s | 4,3 Mo | 13,7 s | `securiser-usine/REVIEW.md` |
| `expliquer-pac` | 30 s | 5,6 Mo | 23,95 s | `expliquer-pac/REVIEW.md` |
| `accompagner-solaire` | 30 s | 5,3 Mo | 13,4 s | `accompagner-solaire/REVIEW.md` |

Contrôlés sur images extraites, pas en lecture continue. Validation par l'utilisateur à venir.
