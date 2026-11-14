# Film démo HOME Vert (30 s, muet, filigrané PHANESS)

Cahier des charges et storyboard validés : `prompts/prompt-video-homevert.md` (suivi tel quel : sept séquences, minutages, textes, palette, Poppins, trait vert conducteur, trois couches de filigrane). Film de prospection : il n'est pas commandé par HOME Vert et ne doit pas être publié par elle avant accord.

Rendu : MP4 16:9, 3840 × 2160, 25 i/s, 750 images, sans piste audio, dans `videos/out/homevert-demo.mp4` (non versionné), plus une version d'environ 20 Mo pour l'email, `videos/out/homevert-demo-20mo.mp4` (même définition, H.264 à débit moyen fixe, 2 passes). La composition est écrite en 1920 × 1080 et rendue à l'échelle ×2.

## Structure

```
index.html                racine : hôtes des 7 séquences + couche de filigrane (#wm)
compositions/s1..s7.html  une séquence chacune (voir le tableau ci-dessous)
assets/hv.js              projection axonométrique, maison (toit, 20 panneaux, socle), trait vert, caméra de s1-s2, entrées de texte
assets/homevert.css       Poppins 400 à 700 (OFL), palette, styles de texte
assets/logo/              logo officiel HOME Vert (logo.svg du site), inchangé, affiché par <img>
render.sh                 rendu 4K + version email (même verrou et mêmes caches que ../render-4k.sh)
chk.mjs                   résume la sortie JSON de `check` (codes, avertissements)
keyframes/                une image fixe par séquence (JPG 1920 × 1080), extraite du MP4 rendu
```

## Commandes (depuis `videos/homevert`, Git Bash)

```bash
export PATH="/d/Tools/nodejs:$PATH"
sh ../hf.sh check --json 2>/dev/null > D:/Temp/hv-check.json; node chk.mjs D:/Temp/hv-check.json
sh ../hf.sh snapshot --at 2.2,5.6,9.6,14.9,19,24.4,28.5 -o D:/Temp/hyperframes/homevert/snap
sh render.sh                                        # rendu 4K -> ../out/homevert-demo.mp4 puis ../out/homevert-demo-20mo.mp4
```

## Filigrane : un seul réglage

Les trois couches (marquage central, trame répétée, cartouche « DÉMONSTRATION PHANESS / PROPOSITION NON VALIDÉE ») sont dans `<div id="wm">` de `index.html`, au-dessus de toutes les séquences. Le marquage central et la trame passent du clair à l'anthracite selon le fond (s3 sur vert et carte claire) ; sur le carton final, une copie anthracite du marquage central, découpée sur la plaque du logo, s'ajoute. Pour une version propre après accord : attribut `data-hidden` sur `#wm`, puis `sh render.sh`. Ne rendre aucune version propre avant accord.

## Repères de montage

| Séquence | Temps | Contenu |
|---|---|---|
| s1 | 0 – 3,3 s | cellules en gros plan, reflet ambré, « Votre toiture a de l’énergie à offrir. », le trait vert naît du reflet et rejoint le bord du panneau, la caméra recule |
| s2 | 3 – 7,2 s | recul sur la maison (socle bas, toit, 20 panneaux), « Produire une partie de son électricité », trait vers lampe et lave-linge, lien réseau en pointillé ; le trait dessine une carte et le toit s'y inscrit |
| s3 | 7 – 11,2 s | carte de simulation sur fond vert, « Propriétaire » puis « Maison » sélectionnés, bouton qui s'étire en ligne d'avancement |
| s4 | 11 – 16,2 s | ligne d'avancement, trois étapes (carte, dossier, modules), « Un parcours pris en charge » |
| s5 | 16 – 21,2 s | quatre modules sur une base commune : solaire, pompe à chaleur (ventilateur), façade et toiture (passage de matière propre), isolation (couches qui s'écartent) |
| s6 | 21 – 25,7 s | boucle ouverte autour de trois éléments, « Un suivi après les travaux », « Conseil • Garanties • SAV », point vert |
| s7 | 25,5 – 30 s | logo officiel sur plaque claire, « Votre projet prend forme. », « Demander mon devis », « homevert21.fr », « Simulation solaire en ligne » |

Les séquences se recouvrent de quelques dixièmes de seconde, sur une image identique. La caméra de s1 et s2 est une fonction pure du temps absolu (`HV.camAt`) : un zoom uniforme autour du coin de panneau PF, qui reste donc immobile à l'écran pendant le recul. Le trait vert garde une épaisseur d'écran constante pendant ce zoom (`HV.applyCam`).

## Choix

- Dessin entièrement en SVG, sans photo ni image générée. Les photographies du site (toiture solaire, stand) et les quatre illustrations de métiers ont servi de référence de matières et de couleurs seulement.
- Registre HyperFrames consulté (caméra, titres, tracés, transitions, cartes) : rien ne convient à une DA de marque sur mesure (blocs génériques, shaders, carrousels). Tout est écrit à la main en GSAP.
- Textes : voir `docs/JOURNAL.md` pour le contrôle `avoid-ai-writing` (aucun texte modifié).
- Avertissements `check` connus et acceptés : `film_silent` et `audio_none` (muet voulu), `text_below_floor` (cartouche de démonstration à 22 px, taille demandée par le cahier des charges).
- Aucun chiffre, montant, pourcentage ni fausse interface : le bouton de la carte de simulation n'a pas de libellé, les cartes de s6 sont abstraites.
