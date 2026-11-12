# Vidéos Phaness (V3)

Cinq films HyperFrames sur une seule DA, la « table de storyboard » : un plan-séquence sur des feuilles posées sur une table, reliées par un fil vert. Scripts : `SCRIPTS.md`. Règles et mode d'emploi : `SPEC.md`.

| Dossier | Emplacement | Sujet | Durée | État |
|---|---|---|---|---|
| `presentation-phaness/` | héros | Film de marque | 40 s | fait |
| `former-electricite/` | Former | Introduction à l'intelligence artificielle | 30 s | à remplacer (contenu V2) |
| `securiser-usine/` | Sécuriser | Les EPI sur un chantier | 30 s | à remplacer (contenu V2) |
| `expliquer-pac/` | Expliquer et vendre | Comprendre la rénovation énergétique | 30 s | à remplacer (contenu V2) |
| `accompagner-solaire/` | Accompagner | Utiliser une pompe à chaleur | 30 s | à remplacer (contenu V2) |

Les dossiers métier gardent leur ancien nom pour ne pas toucher au site. Tant qu'ils contiennent leur V2, ils ne se construisent plus, puisque leur moteur 3D a quitté `_system/` ; `node build.mjs --new <film>` les remplace.

Un sixième film hors site : `heliup/`, film démo de prospection pour HELIUP (30 s, 4K, filigrané PHANESS), avec son propre `render.sh` ; voir `heliup/README.md`. Il n'entre pas dans `build.mjs`, `render-all.sh` ni `render-4k.sh`, et sort dans `out/heliup-demo.mp4`.

Rendus (non versionnés) : `out/<nom>.mp4` (H.264 High, yuv420p, faststart, muet, 25 i/s) et `out/<nom>.webp` (affiche 1280×720).

## Structure

```
_system/
  assets/phaness.css     palette, table, feuilles, type, matières, plaques 3D, fin commune
  assets/phaness.js      PH : caméra, fil, tracés, entrées de texte, fin commune
  assets/fonts, vendor   Geist, GSAP
  parts/                 morceaux à copier dans un film (personnage)
  template/              point de départ d'un film
<film>/
  index.html             racine : une composition
  compositions/film.html tout le film : balisage, styles, minutage
  DECOUPAGE.md           découpage par plans
  assets/                copie de _system/assets (build.mjs), versionnée pour que le film s'ouvre seul
```

## Commandes (Windows, Git Bash, depuis `videos/`)

Node vient de `D:\Tools\nodejs` (`export PATH="/d/Tools/nodejs:$PATH"`). Toujours passer par `hf.sh`, qui garde les caches HyperFrames sur `D:\Tools\hyperframes-cache` et utilise le ffmpeg du projet.

```bash
npm install                                   # une fois
node build.mjs --new securiser-usine          # (re)part du gabarit : vide le dossier du film
node build.mjs securiser-usine                # recopie le système dans le film
(cd securiser-usine && sh ../hf.sh check)     # lint, runtime, mise en page
(cd securiser-usine && sh ../hf.sh snapshot --at 5,10,15 -o D:/Temp/hyperframes/securiser-usine/snap)
sh render-all.sh securiser-usine              # rendu + encodage web + affiche, un film
sh render-all.sh                              # les cinq films
sh contact-sheet.sh securiser-usine           # planche de 16 images du MP4
```

`render-all.sh` passe les rendus un par un grâce à un verrou (`D:/Temp/hyperframes/render.lock`), retiré à la fin même en cas d'erreur. Masters dans `D:/Temp/hyperframes/masters`. Le CRF monte (20, 22, …) jusqu'au plafond : 6 Mo, 8 Mo pour `presentation-phaness`.

Sur macOS, le Chrome d'HyperFrames s'arrêtait par SIGABRT (voir `docs/JOURNAL.md`) : rendre sous Windows.

## Choix

- 2D vectoriel plus perspective CSS, sans WebGL : quatre sujets variés restent à portée d'une session, tout est net en 4K, et le rendu est plus rapide que la 3D.
- Muets : pas de musique à licence claire sans compte, et le brief l'autorise.
- Dépendances locales (`node_modules/`) : `hyperframes`, `gsap`, `geist` (OFL), `ffmpeg-static`, `ffprobe-static` ; `three` et `esbuild` ne servent plus qu'à relire la V2.
