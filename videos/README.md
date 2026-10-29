# Vidéos de démonstration Phaness

Quatre vidéos HyperFrames (HTML rendu en vidéo), une par offre. Même système graphique pour les quatre : c'est la démonstration du « format standardisé ».

| Dossier | Offre | Sujet | Durée |
|---|---|---|---|
| `former-pas/` | Former | Capsule e-learning « Protéger, Alerter, Secourir » | 21,15 s |
| `securiser-epi/` | Sécuriser | Les EPI sur un chantier | 24,45 s |
| `expliquer-pac/` | Expliquer | Fonctionnement d'une pompe à chaleur air/eau | 24,15 s |
| `accompagner-radiateur/` | Accompagner | Tutoriel « Purger un radiateur » en 6 étapes | 24,55 s |

Rendus (non versionnés) : `out/<nom>.mp4` (H.264, yuv420p, faststart, muet, ≤ 4 Mo) et `out/<nom>.webp` (affiche 1280×720).

## Structure d'une vidéo

```
<nom>/
  index.html              racine : 4 scènes empilées (fond, intro, étapes, fin)
  compositions/
    sky.html              fond de ciel commun          (copié depuis _system/)
    intro.html            carton titre commun          (copié depuis _system/)
    outro.html            carton « phaness » commun    (copié depuis _system/)
    steps.html            les étapes, propre à chaque vidéo
  assets/                 Geist, GSAP, phaness.css     (copiés depuis _system/)
```

- Les textes de l'intro (format, titre sur deux lignes, sous-titre) se modifient dans `index.html`, attribut `data-variable-values` de la scène `intro`.
- Les textes des étapes sont écrits en clair dans `compositions/steps.html`.
- Le système commun (couleurs, typo, compteur, barre de progression, intro, fin) vit dans `_system/`. Après une modification : `node sync-system.mjs` le recopie dans les quatre vidéos.

## Commandes

Toujours passer par `hf.sh`, qui lance la CLI HyperFrames locale avec tous ses caches sur `D:\Tools\hyperframes-cache` et le ffmpeg du projet.

```bash
npm install                        # dans videos/, une fois
sh hf.sh check                     # depuis un dossier de vidéo : lint, mise en page, contraste
sh hf.sh preview                   # aperçu éditable dans le navigateur
sh render-all.sh                   # rendu des 4 vidéos + encodage web + affiches
sh render-all.sh expliquer-pac     # une seule vidéo
```

## Choix

- Muettes : pas de piste musicale à licence claire disponible sans compte ; le brief autorise le muet.
- Tout est dessiné en SVG/CSS (argile douce, dégradés radiaux, ombres portées floues), pas de 3D WebGL : rendu rapide et déterministe, fichiers légers.
- Dépendances locales uniquement (`node_modules/`) : `hyperframes`, `gsap`, `geist` (OFL, licence dans `_system/assets/fonts/`), `ffmpeg-static`, `ffprobe-static`.
