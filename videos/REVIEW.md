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

## Rendu 4K (2026-11-02)

`sh render-4k.sh` écrit `out-4k/` (non versionné) : `presentation-phaness` 18,9 Mo, `former-electricite` 20,8 Mo, `securiser-usine` 15,5 Mo, `expliquer-pac` 25,2 Mo, `accompagner-solaire` 27,5 Mo. 3840 × 2160, 25 i/s, durées conformes, muets. Le site garde les fichiers 1080p de `out/`.

Netteté mesurée contre le 1080p agrandi : les plans à plat gagnent vraiment en détail (rapport 3 à 7 sur l'énergie des contours), les plans où la caméra est inclinée très peu (1,5 à 2), et le texte y reste aussi doux qu'un 1080p agrandi. La cause probable est la rastérisation des couches 3D inclinées par Chrome, non confirmée. Un essai avec `zoom: 2` et une composition en 3840 × 2160 change le cadrage : écarté.

## `heliup` : film démo HELIUP (rendu du 2026-11-12, Windows)

Film de prospection hors site, d'après `prompts/prompt-video-heliup.md`. Direction créative : Opus ; production : Sonnet 5.5 ; rendus, extractions d'images et relances : sous-agents Haiku en effort low.

| Fichier | Valeur |
|---|---|
| `out/heliup-demo.mp4` | 30,0 s, 750 images, 37,1 Mo, H.264, yuv420p, 3840 × 2160, 25 i/s, faststart, sans piste audio, filigrane PHANESS actif. Rendu en 3 min environ. |
| `heliup/keyframes/seq1.jpg` à `seq6.jpg` | une image fixe par séquence, 1920 × 1080 |

### Contrôlé (sur images extraites du MP4 final)
- Les 14 temps de la liste de la section 11 du prompt (1 s à 28 s) et la dernière image : bâtiment central reconnaissable en vue aérienne, en coupe et en gros plan ; vue de la séquence 5 sous le même angle et la même implantation que la séquence 1 ; panneaux à plat sans rail, cadre épais, lest ni inclinaison (seul le système conventionnel de la séquence 2 est incliné et lesté) ; charpente jamais déformée ; aucun rouge, orange ou vert ; logo officiel en blanc bleuté, sans déformation ; textes dans la zone centrale de 1080 px et jamais coupés ; carton final lisible et immobile (dérive de caméra et reflet arrêtés à 29,6 s).
- Alignement des transitions par superposition à 50 % : plongée (s1) sur coupe (s2).
- Filigrane : présent sur toutes les images extraites ; `data-hidden` sur `#wm` le retire (test sur une image, 7,9 s), sans autre changement.
- ffprobe : codec, résolution, cadence, 750 images, 30,000 s, aucun flux audio.
- `hyperframes check` : 0 erreur ; avertissements gardés : `film_silent`, `audio_none`, `text_below_floor` (tailles du cahier des charges).
- Textes : contrôle `avoid-ai-writing` (voix professional, détection seule) : aucun texte modifié (voir `docs/JOURNAL.md`). Espaces insécables avant « % », « ? » ; apostrophes typographiques ; « m² » en vrai exposant.

### Non vérifié
- Le mouvement n'a pas été regardé en lecture continue : seules des images fixes ont été vues (fluidité des transitions, enchaînement du balayage s4 → s5, lecture réelle des textes).
- Les 750 images ne sont pas toutes contrôlées : le filigrane est une couche toujours affichée, vérifiée sur 15 images extraites et par construction, pas image par image.
- Temps de lecture : seule la ligne de la séquence 1 a été mesurée par `check` ; les autres durées d'affichage (légendes de la séquence 4, de 1,0 à 1,5 s pour la plus courte) n'ont pas été jugées à l'œil.
- Les faits affichés viennent du prompt (section 9) ; le site de HELIUP n'a pas été relu pour les recouper.
- Aucun second regard extérieur ; aucune version propre rendue (volontairement, avant accord de HELIUP).

## `homevert` : film démo HOME Vert (rendu du 2026-11-14, Windows)

Film de prospection hors site, d'après `prompts/prompt-video-homevert.md`. Production : Sonnet 5.5 ; rendus, extractions d'images et relances : sous-agents Haiku en effort low.

| Fichier | Valeur |
|---|---|
| `out/homevert-demo.mp4` | 30,0 s, 750 images, 37,5 Mo, H.264 High, yuv420p, 3840 × 2160, 25 i/s, faststart, sans piste audio, filigrane PHANESS actif. Rendu en 4 à 5 min. |
| `out/homevert-demo-20mo.mp4` | même définition et même durée, 19,1 Mo (H.264 High, 2 passes, 5,2 Mb/s), sans piste audio |
| `homevert/keyframes/seq1.jpg` à `seq7.jpg` | une image fixe par séquence (2,2 s ; 5,8 s ; 9,6 s ; 14,9 s ; 19,0 s ; 24,4 s ; 28,5 s), 1920 × 1080, extraites du MP4 |

### Contrôlé (sur images extraites du MP4 final)
- Liste de la section 12 du prompt : durée 30,000 s et 750 images (ffprobe) ; aucun flux audio (ffprobe : un seul flux, vidéo) ; logo officiel net, non déformé, signature « L'habitat Econome » lisible (28,5 s et dernière image) ; palette (vert, anthracite, gris clair, matières autorisées) ; Poppins sur tous les textes ; trait vert continu de 1,7 s à 25,5 s sur les images extraites (s1, s2, carte, ligne de s3 à s5, boucle de s6, soulignement de s7) ; filigranes présents sur toutes les images extraites (17 + 7 + 6), carton final compris ; aucun chiffre, montant, pourcentage ni libellé de fausse interface.
- Tracés : l'apparition progressive du trait a été contrôlée à 2,0 s, 2,3 s, 6,45 s, 16,25 s et 22,6 s (après correction du piège décrit dans `docs/JOURNAL.md`).
- Raccords : différences d'images (PSNR) de part et d'autre des six raccords (3,0 ; 7,0 ; 11,0 ; 16,0 ; 21,0 ; 25,5 s), sans saut isolé.
- `hyperframes check` : 0 erreur ; avertissements gardés : `film_silent`, `audio_none`, `text_below_floor` (cartouche de démonstration à 22 px, taille demandée).
- Textes : contrôle `avoid-ai-writing` (voix professional, détection seule), aucun texte modifié.

### Non vérifié
- Le mouvement n'a pas été regardé en lecture continue : fluidité des raccords s1 → s2 (zoom autour d'un coin de panneau) et s2 → s3 (maison réduite dans la carte), lecture réelle des textes.
- Les 750 images ne sont pas toutes contrôlées : le filigrane est une couche toujours affichée, vérifiée sur 30 images extraites et par construction.
- Temps de lecture des étiquettes courtes (s4, s5 : 1,0 à 1,5 s pour la plus courte).
- Recoupement des offres avec le site : le prompt fait foi. Les cartes de s4 et s6 et la maison sont abstraites.
- Aucun second regard extérieur ; aucune version propre rendue (volontairement, avant accord de HOME Vert).
