# Vidéos de démonstration Phaness (V2)

Quatre films HyperFrames, une par offre, tous sur le même moule : ouverture au-dessus des nuages, plongée vers le sujet en 3D (three.js), trois chapitres, fin sur l'œuf de lumière et le logo. Voir `SPEC.md`.

| Dossier | Offre | Sujet | Durée |
|---|---|---|---|
| `expliquer-pac/` | Expliquer et vendre | Pompe à chaleur air/eau : cycle, installation, réglages | 28 s |
| `securiser-usine/` | Sécuriser | Accueil sécurité d'un nouvel arrivant en usine | 26 s |
| `accompagner-solaire/` | Accompagner | Régler et suivre une installation solaire | 26 s |
| `former-electricite/` | Former | Tension, intensité, puissance | 26 s |

Rendus (non versionnés) : `out/<nom>.mp4` (H.264 High, yuv420p, faststart, muet, ≤ 6 Mo), `out/<nom>.webp` (affiche 1280×720) et `out/planche.webp` (planche contact).

## Structure

```
_system/
  src/engine.js       moteur 3D commun : matières, lumière, post-traitement, nuages, œuf, caméra, figurine
  src/film.js         colle entre l'horloge GSAP du film et la scène 3D
  assets/             Geist, GSAP, phaness.css (texte en surimpression), phaness-type.js (animations de texte)
<film>/
  index.html          racine : une seule scène, compositions/film.html
  compositions/film.html   textes (titre, chapitres, étiquettes, logo) et leur minutage GSAP
  src/scene.js        la scène 3D du film (modèles, minutage T, caméra)
  assets/             copiés depuis _system/ + assets/scene.js (bundle généré, versionné pour que le film s'ouvre sans build)
```

- Les textes se modifient dans `compositions/film.html`. Les étiquettes suivent un point 3D (`data-anchor`, défini dans `anchors` de `scene.js`).
- Le minutage `T` de `scene.js` et celui de `film.html` doivent rester alignés.
- Après une modification de `_system/` ou de `src/scene.js` : `node build.mjs [film]` recopie le système et régénère `assets/scene.js` (esbuild).

## Commandes (Windows, Git Bash, depuis `videos/`)

Node vient de `D:\Tools\nodejs` (`export PATH="/d/Tools/nodejs:$PATH"`). Toujours passer par `hf.sh`, qui garde les caches HyperFrames sur `D:\Tools\hyperframes-cache` et utilise le ffmpeg du projet.

```bash
npm install                                   # une fois
node build.mjs                                # bundle des 4 scènes
(cd securiser-usine && sh ../hf.sh check)     # lint, runtime, mise en page
(cd securiser-usine && sh ../hf.sh snapshot --at 5,10,15 -o D:/Temp/hyperframes/snap)
sh render-all.sh                              # build + rendu + encodage web + affiche, les 4 films
sh render-all.sh former-electricite           # un seul film
```

Un rendu prend environ 6 min par film sur ce PC (capture GPU, 2 workers). Les masters vont dans `D:/Temp/hyperframes/masters`. `render-all.sh` monte le CRF (20, 22, …) jusqu'à passer sous 6 Mo.

Sur macOS, le Chrome d'HyperFrames s'arrêtait par SIGABRT (voir `docs/JOURNAL.md`) : rendre sous Windows.

## Choix

- Muets : pas de musique à licence claire sans compte. Le brief l'autorise.
- 3D WebGL rendue image par image : chaque image est une fonction du temps, donc le rendu est déterministe.
- Dépendances locales (`node_modules/`) : `hyperframes`, `three`, `esbuild`, `gsap`, `geist` (OFL), `ffmpeg-static`, `ffprobe-static`.
