# SPEC — système vidéo Phaness

GOAL : qu'un prospect voie en 20 s que Phaness rend un sujet clair, et que les quatre formats sortent du même moule.

OUTPUT : HyperFrames, 1920×1080, 30 i/s, 21 à 25 s, muet, texte français.

TIME : intro 3,6 s · étapes (chevauchement de 0,25 s avec l'intro) · fin 3,8 s dont 1,0 s de montée des nuages et ≥ 2 s de tenue du logo.

LOOK
- Fond `#F5F7FB` en dégradé léger vers `#EEF2F8`, trois nuages lointains à faible contraste qui dérivent à ~2 px/s.
- Encre `#0B1633` (titres, volumes sombres), secondaire `#4A5878`, accent `#E34234` : chiffre du compteur, barre de progression, trait sous le titre, et l'objet clé de chaque étape. Jamais deux focales vermillon concurrentes.
- Geist variable. Titre d'intro 108 px / 660 / −4,5 %. Titre d'étape 84 px (70 px si long) / 640 / −3,5 %. Sous-titre 38–40 px / 420. Libellés 30 px. Plancher 28 px.
- Matière : argile douce. Dégradé radial éclairé en haut à gauche, ombre portée dy 20–34 px, flou 20–30 px, opacité 0,13–0,16, ombre de contact floue sous chaque objet. Aucune arête vive (rayons ≥ 10 px, jointures arrondies).
- Monde : chaque objet repose sur un socle-nuage.

GRILLE : colonne texte x 200–880 (dans la zone titre 80 %), scène x 940–1720, y 110–970. Compteur y 236, bloc titre y 430, progression y 900.

MOTION
- Arrivées : `expo.out` 0,4 s pour le texte (flou 10 px → 0), ressorts `elastic.out(1, 0.6–0.85)` pour les objets (amortissement premium).
- Sorties : flou 8 px + fondu, 0,2 s `power2.in`, 40 % plus courtes que les entrées.
- Compteur : le chiffre roule (0,55 s `expo.inOut`) ; le segment de progression se remplit (0,7 s `expo.out`).
- Mouvement continu seulement là où il a un sens : fluide, ventilateur, air (linéaires) ; nuages du fond.
- Transitions : nuages qui s'envolent (intro → étapes), échange flouté sur une même scène (entre étapes), poussée caméra (radiateur), banc de nuages qui monte (→ fin).

SHOTS
- Intro : format + titre + trait vermillon + sous-titre à gauche, nuages et sphère vermillon à droite.
- Étapes : un objet par étape (PAS : triangle + zone, téléphone 15/18/112, trousse + pouls ; EPI : mannequin équipé pièce par pièce, puis « Pas d'EPI, pas de chantier. » ; PAC : schéma qui se construit, une pièce par étape, le fluide circule ; Radiateur : robinet, récipient et chiffon, clé, gouttes, manomètre 1–1,5 bar, chaleur qui revient).
- Fin : « phaness » lettre à lettre, « Vidéo de démonstration ».

BANNED : fond sombre, glow, néon, particules, dégradés violets, cartes en verre, trois cartes alignées, texte qui bouge pendant la lecture, logo en coin, boucles de respiration sur les titres.

QA : chaque milieu d'étape (texte entier lisible, rien hors cadre), chaque raccord, la tenue finale du logo.
