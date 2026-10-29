# SPEC — système vidéo Phaness V2

GOAL : montrer en 26 à 28 s qu'un sujet technique devient clair, avec un niveau de motion design de showreel : vraie 3D, caméra toujours en mouvement, très peu de texte.

OUTPUT : HyperFrames + three.js (WebGL), 1920×1080, 30 i/s, muet. Rendu web H.264 ≤ 6 Mo, affiche WebP 1280×720.

## Le moule commun (`_system/`)

| Temps | Plan | Où |
|---|---|---|
| 0 – 2,4 s | Au-dessus d'une mer de nuages, une vallée mène vers une lumière vermillon sous les nuages. Surtitre (l'offre) et titre en mots qui se défloutent. | `openingKeys()`, `sky.setDawn()` |
| 2,4 – 4,2 s | Plongée à travers le plafond de nuages (fondu blanc en bruit fbm), atterrissage sur l'île du sujet. | `ceilingWhite()` |
| 4,2 – 21,6 s | Trois chapitres de 5 à 6 s : numéro vermillon + un mot, 1 à 3 étiquettes accrochées à des points 3D, au plus une phrase courte. | `rig()`, `PH.chapter/tag/words` |
| 21,6 – 23 s | Remontée à travers les nuages. | `closingKeys()` |
| 23 s – fin | L'œuf de lumière sort de la vallée et s'allume de l'intérieur, « phaness » s'écrit lettre à lettre dessous. | `sky.setEgg()`, `PH.letters` |

`expliquer-pac` garde son découpage d'origine (28 s, œuf à 24 s).

## Look
- Ciel en dégradé (bleu `#8FA6D4` en haut, bande chaude `#FBE4DC` à l'horizon), nuages en argile blanche à ombres froides.
- Sujets en argile douce (`clay`) et plastique (`plastic`) : bleu nuit `#0B1633`, blanc, brume `#DCE3F0`, vermillon `#E34234` pour l'élément clé de chaque plan. Jaune `#F2CF6B` seulement pour les marquages et gilets (usine).
- Lumière : clé chaude, rim vermillon léger, hémisphère bleuté, ombres VSM douces, occlusion ambiante GTAO, profondeur de champ (Bokeh) sur les plans serrés, vignette et grain fin.
- Geist variable pour tout le texte. Titre 112 px, chapitre 68 px, étiquettes 31 px, logo 128 px.

## Motion
- La caméra ne s'arrête jamais : orbites, plongées, travellings (`rig` interpole en sphérique autour d'une cible qui se déplace).
- Objets : ressorts amortis (`E.spring`, ζ ≈ 0,6–0,8), éclatés, montées en échelle.
- Texte : entrée 0,4–0,5 s `expo.out` avec flou de 10 px, sortie 0,2 s.

## Les quatre films
- `expliquer-pac` : unité extérieure qui s'ouvre en vue éclatée, boucle du fluide (froid → chaud), pose sur support et raccordement, technicien, plongée dans le mur jusqu'au thermostat (21 → 19 °C, mode éco).
- `securiser-usine` : atelier vu en plongée, nouvel arrivant équipé pièce par pièce (casque, lunettes, gilet, chaussures), allée piétonne et chariot élévateur au croisement, gyrophare, chevrons au sol jusqu'au point de rassemblement.
- `accompagner-solaire` : soleil qui traverse le ciel, boussole plein sud, panneaux au sol qui s'inclinent à 30°, énergie qui court dans le câble jusqu'à l'onduleur (2,4 kW), téléphone qui trace la courbe de production du jour.
- `former-electricite` : pile 12 V et colonne qui se remplit (tension), travelling le long du fil où les charges accélèrent jusqu'à l'ampèremètre 2 A (intensité), ampoule qui s'allume, 24 W, P = U × I (puissance).

BANNED : diaporama de cartes, texte qui défile, néon, fond sombre, plus de trois étiquettes par chapitre, logo en coin.
