# REVIEW — 4 vidéos de démonstration V2

## Livrables (rendus le 29/10/2026 sous Windows)

| Vidéo | Durée | Poids MP4 | CRF | Affiche |
|---|---|---|---|---|
| `out/expliquer-pac.mp4` | 28,0 s | 5,14 Mo | 22 | `out/expliquer-pac.webp` (vue éclatée, cycle du fluide) |
| `out/securiser-usine.mp4` | 26,0 s | 4,70 Mo | 24 | `out/securiser-usine.webp` (nouvel arrivant équipé) |
| `out/accompagner-solaire.mp4` | 26,0 s | 5,88 Mo | 22 | `out/accompagner-solaire.webp` (panneaux inclinés, boussole) |
| `out/former-electricite.mp4` | 26,0 s | 5,55 Mo | 22 | `out/former-electricite.webp` (pile et colonne de tension) |

Tous : H.264 High, yuv420p, 1920×1080, 30 i/s, faststart, sans piste audio. Affiches WebP 1280×720. Planche contact `out/planche.webp` : pas encore générée (`sh contact-sheet.sh`).

## Ce qui a été vérifié
- `hyperframes check` sur les 4 projets : 0 erreur de lint, de runtime ou de mise en page. Avertissement restant : un message de compilation de shader (précision double) émis par le pilote, sans effet visible.
- Images extraites des MP4 finaux de usine, solaire et électricité (10 par film) : textes entiers, aucune étiquette hors cadre, œuf et logo visibles à la fin. PAC : vérifié sur captures HyperFrames avant le rendu final, pas sur le MP4.
- ffprobe : codec, format de pixel, taille, cadence, durée ; atome `moov` avant `mdat`.

## Affirmations techniques à faire valider par un spécialiste

### Pompe à chaleur (`expliquer-pac`)
- Le cycle à quatre organes, dans l'ordre détendeur → évaporateur → compresseur → condenseur, et le code couleur froid (bleu) / chaud (vermillon) du fluide.
- L'air extérieur traverse l'évaporateur ; l'eau chaude part vers l'intérieur par une liaison aller (vermillon) et revient par une liaison retour.
- Unité extérieure posée sur un support (pieds) et non au sol nu.
- « Mise en service par un professionnel » : vérifier la formulation réglementaire (manipulation des fluides frigorigènes, attestation de capacité).
- Consigne de 19 °C, programmation confort de 6 h à 8 h et de 17 h à 22 h (exemple affiché sur l'anneau), mode éco.

### Usine (`securiser-usine`)
- Équipements montrés : casque, lunettes, gilet haute visibilité, chaussures de sécurité. Ils dépendent du site et du poste ; à adapter au client.
- Allée piétonne délimitée par des bandes jaunes ; chariot élévateur sur une allée séparée ; passage piéton zébré au croisement.
- « Au croisement, stop. » : règle de priorité à confirmer selon le protocole de circulation du site.
- Gyrophare d'alarme sur une machine, chevrons lumineux au sol vers la sortie : signalisation illustrative.
- Le pictogramme du point de rassemblement est stylisé (bleu nuit, quatre flèches). Le pictogramme normalisé (ISO 7010 E007) est vert : à remplacer pour un usage réel.

### Solaire (`accompagner-solaire`)
- Orientation plein sud et inclinaison de 30° comme réglage de référence en France métropolitaine.
- Les panneaux sont montés au sol sur un axe réglable pour rendre l'inclinaison visible ; la plupart des installations résidentielles sont fixes en toiture.
- Écran de l'onduleur : « En production », 2,4 kW (valeur d'exemple).
- Application de suivi : 18,6 kWh produits dans la journée, courbe en cloche de 6 h à 20 h (valeurs d'exemple).
- « Lancez vos appareils en journée. » : conseil d'autoconsommation, valable sans batterie de stockage.

### Électricité (`former-electricite`)
- Pile de 12 V, intensité de 2 A, puissance de 24 W : P = U × I (12 × 2 = 24).
- La colonne qui se remplit représente la tension par analogie (différence de niveau ou de pression). À valider comme choix pédagogique.
- Les charges circulent depuis la borne du haut de la pile vers l'ampoule (sens conventionnel du courant). Le sens réel des électrons est inverse : à préciser si la capsule sert à un public technique.
- L'ampèremètre est placé en série sur le fil.

## Choix créatifs
- Un seul moule : mer de nuages, lumière sous la vallée, plongée à travers le plafond, trois chapitres d'un mot, remontée, œuf de lumière et logo.
- Très peu de texte : un titre, trois mots de chapitre, une à trois étiquettes par chapitre, au plus une phrase par film.
- Toujours une caméra en mouvement : orbites autour des objets, plongées, travelling le long du fil (électricité), passage à travers le mur (PAC).

## Points faibles restants
- Solaire, chapitre « Suivi » du MP4 actuel : la phrase « Lancez vos appareils en journée. » passe sur la maison et l'arbre, et le titre sur le toit. Correction faite dans `src/scene.js` (plan tourné vers les nuages, téléphone à droite), vérifiée en capture, **pas encore re-rendue** : `sh render-all.sh accompagner-solaire`.
- Électricité : l'aiguille de l'ampèremètre passe sur la valeur « 2,0 A » (texture `drawDial`).
- Lumière de l'ampoule assez discrète ; teinte rosée générale du ciel sur les plans de fin.
- Films muets : pas de musique ni de bruitages.
- Personnages sans visage, animation de marche simple (jambes et bras en balancier).
- Les écrans (onduleur, téléphone, thermostat) sont des textures 2D posées sur des volumes.
- La plongée d'ouverture passe par un plan blanc de quelques images (traversée des nuages).
