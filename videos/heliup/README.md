# Film démo HELIUP (30 s, muet, filigrané PHANESS)

Cahier des charges et storyboard validés : `prompts/prompt-video-heliup.md` (à suivre tel quel, sans réécrire le récit, les textes ni les chiffres). Film de prospection : il n'est pas commandé par HELIUP et ne doit pas être publié par elle avant accord.

Rendu : MP4 16:9, 3840 × 2160, 25 i/s, 750 images, sans piste audio, dans `videos/out/heliup-demo.mp4` (non versionné). La composition est écrite en 1920 × 1080 et rendue à l'échelle ×2.

## Structure

```
index.html                racine : hôtes des 6 séquences + couche de filigrane (#wm)
compositions/s1..s6.html  une séquence chacune (plan, coupe, panneau, pose, échelle, carton final)
assets/iso.js             projection axonométrique (plan -> écran, faces verticales, boîtes)
assets/park.js            la zone d'activités (15 bâtiments), partagée par s1, s5 et s6
assets/fx.js              entrées de texte (lignes qui montent sous un masque)
assets/heliup.css         police Lexend (OFL), palette, styles de texte
assets/logo/              logo officiel HELIUP extrait du sprite du site (symbole #logo), tel quel
render.sh                 rendu 4K (même verrou et mêmes caches que ../render-4k.sh)
keyframes/                une image fixe par séquence (JPG 1920 × 1080)
```

## Commandes (depuis `videos/heliup`, Git Bash)

```bash
export PATH="/d/Tools/nodejs:$PATH"
sh ../hf.sh check                                   # lint, runtime, mise en page
sh ../hf.sh snapshot --at 3.5,7,11,19,24,29.96 -o D:/Temp/hyperframes/heliup/snap
sh render.sh                                        # rendu 4K -> ../out/heliup-demo.mp4
```

## Filigrane : un seul réglage

Les trois couches (marquage central, trame répétée, mention « DÉMONSTRATION PHANESS ») sont dans `<div id="wm">` de `index.html`, au-dessus de toutes les séquences. Pour rendre la version propre après accord : ajouter l'attribut `data-hidden` à cet élément, puis relancer `sh render.sh`. Rien d'autre ne change. Ne pas rendre la version propre avant accord.

## Repères de montage

| Séquence | Temps | Contenu |
|---|---|---|
| s1 | 0 – 4,4 s | zone d'activités en vue aérienne, plongée sur le toit central |
| s2 | 3,7 – 9,2 s | coupe du bâtiment central, système conventionnel, cote ~15 kg/m² |
| s3 | 8,4 – 14,8 s | panneau Stykon® : 5 kg/m², vue éclatée, 3 mm |
| s4 | 14,6 – 21,4 s | pose collée, poseurs, repères de certification |
| s5 | 20,6 – 26,0 s | retour à la vue aérienne, toits équipés, trame cyan |
| s6 | 26,0 – 30 s | logo, signature, appel à l'action |

Les séquences se recouvrent de quelques dixièmes de seconde : chaque transition prolonge le mouvement de caméra (plongée, balayage de coupe, panneau qui descend, remontée). Le toit central s'aligne par construction entre s1 et s2, et entre s4 et s5 (même projection, même ancre écran 990, 600) ; vérifié par superposition d'images seulement entre s1 et s2.

## Choix

- Dessin entièrement en SVG, sans photo ni image générée. Faces verticales et plans au sol dessinés dans l'espace du plan, puis projetés par matrice.
- Registre HyperFrames consulté (compteur, caméra, titres, transitions, vue éclatée) : `count-up` (30 i/s, trois teintes imposées) et `exploded-stack` (WebGL, réseau) ne conviennent pas ; compteur, éclaté, balayages et caméra sont donc écrits à la main en GSAP.
- Textes : voir `docs/JOURNAL.md` pour le contrôle `avoid-ai-writing` (aucun texte modifié).
- Écart au storyboard : la seconde ligne de la séquence 1 (« La réglementation pousse à les équiper. ») entre à 2,3 s au lieu de « vers 2,8 s », pour tenir le temps de lecture minimal du contrôle (1,7 s) avant la plongée.
- Avertissements `check` connus et acceptés : `film_silent` et `audio_none` (muet voulu), `text_below_floor` (sur-titres de 20 px, légendes de 22 à 24 px et mention de démonstration de 22 px, tailles demandées par le cahier des charges).
