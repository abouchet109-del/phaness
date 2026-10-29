# Inspirations vidéo : awesome-opus5-5-videos

Source : https://github.com/yihui-dev/awesome-opus5-5-videos (lecture seule, clone peu profond dans `D:/Temp/phaness-refs/awesome-opus5-5-videos`, rien exécuté).
Contenu : 703 prompts de vidéos réalisées avec Claude Opus 5.5 en HTML / Canvas / SVG / Three.js (dossier `prompts/`, un fichier par vidéo, bloc « Prompt » à copier). Catégories du README : motion graphics, explainers, 3D scenes, jeux.

## Idées clés pour nos vidéos HyperFrames

**Caméra, 3D, transitions**
- Brief de showreel explicite : « kinetic typography, transitions, 2D/3D, géométrie abstraite, particules, distorsion, masquage, compositing, lumière, profondeur, mouvement de caméra continu ». Chaque plan doit enchaîner naturellement sur le suivant.
- Caméra qui zoome pour que chaque état remplisse le cadre (« the camera zooms so each state fills the frame ») : un plan = un état, pas de fondu lent.
- Caméra en spirale ou en travelling vertical (« spirals up through the shafts », « camera looks straight down ») pour relier les scènes.
- Rythme : « something moves every second, big type, bold color, real camera moves, no slow fades ».
- Orbite interactive et zoom à la molette dans les démos 3D, à transposer en mouvement scripté pour la vidéo.
- Pour la 3D réaliste (objets mécaniques) : décomposer l'objet en sous-parties, ouvrir une coupe, faire passer des faisceaux de lumière colorés qui convergent.

**Typographie, lumière, matériaux**
- Typographie cinétique grosse et contrastée ; couleur forte, pas de dégradé mou.
- Lumière et ambiance qui suivent la musique (« lights, camera and mood follow the music »).
- Profondeur par couches (particules, distorsion, GLSL) plutôt que par effets plaqués.

**Formuler un brief**
- Nommer la durée (« 15-second motion graphics showreel »), le style (« art-directed, pas une collection d'effets ») et l'objectif (« l'ouverture qui fait embaucher »).
- Découper en tranches temporelles (« 26–33 s : la caméra spirale… ») : c'est la forme la plus efficace vue dans les prompts.
- Demander un fichier HTML unique puis un enregistrement de la page : même chaîne que HyperFrames.

## Exemples à ouvrir (chemins locaux)

- `D:/Temp/phaness-refs/awesome-opus5-5-videos/prompts/lukasersil-726495.md` : showreel 15 s, catégorie 3D, Three.js + GLSL. Modèle de brief à suivre.
- Prompts contenant « camera » et « zoom » (liste via `grep -il "camera" prompts/*.md`) : `prompts/0xrathi-511319.md`, `prompts/0xspikez-483865.md`, `prompts/0xvalure-331584.md`, `prompts/0xwast3-222104.md`, `prompts/aayush4soni-644283.md`.
- `D:/Temp/phaness-refs/awesome-opus5-5-videos/prompts/daniel-haida-636937.md` : le plus long prompt du dépôt (19 Ko), à parcourir pour la structure par plans.
- Prompts non encore lus en détail : `prompts/froessell-562325.md`, `prompts/twoclipping-000267.md`, `prompts/morse-369333.md`.

## Limites
- Ce sont des prompts pour HTML/Three.js, pas du HyperFrames : reprendre les intentions (cadrage, rythme, DA), pas le code.
- Droits : vidéos de créateurs tiers. S'inspirer de la mise en scène et des techniques, ne rien copier (textes, visuels, code) dans nos livrables.
