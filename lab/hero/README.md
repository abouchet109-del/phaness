# Héros 3D — note d'intégration (étape 4)

**Prototype archivé depuis la révision verte du 2026-10-29.** Le site ne charge plus ce héros ni son œuf : son accueil attend la vidéo de présentation fournie par l'équipe. Cette note documente le prototype conservé pour l'historique, pas le héros actuel.

Œuf lumineux dans une mer de nuages : un seul fragment shader WebGL1, sans bibliothèque. `hero.js` est un module ES de 12,4 Ko non compressé.

## API
`mountHero(canvas, options)` renvoie `{ webgl, destroy() }` : `webgl` vaut `false` en mode repli, `destroy()` arrête la boucle et retire les écouteurs.

| Option | Défaut | Rôle |
|---|---|---|
| `dpr` | `1.5` | densité de pixels maximale |
| `quality` / `minQuality` | `1` / `0.5` | échelle de résolution de départ / plancher de l'adaptation automatique |
| `layout` | `'auto'` | `'side'` (œuf à droite), `'top'` (œuf en haut) ; `auto` = `side` si largeur ≥ 768 px et paysage |
| `time` | `0` | temps de départ (s) ; aussi l'image figée si mouvement réduit (sinon 4.2) |
| `staticFrame` / `forceFallback` | `false` | force l'image fixe / le dégradé CSS |
| `onStats` | — | `({ fps, quality, width, height })`, appelé environ toutes les secondes |

## Intégration dans le thème
- Copier `hero.js` dans `theme/assets/js/` et le charger en module : `<script type="module">import { mountHero } from '…/hero.js'; mountHero(document.querySelector('.hero canvas'));</script>`. Ajouter `wp_enqueue_script_module` ou `type="module"` via le filtre `script_loader_tag`.
- Mettre un `<canvas aria-hidden="true">` comme premier enfant de la section du héros, avec `position: relative; overflow: hidden; min-height: 100svh` sur la section.
- CSS du canvas : `position: absolute; inset: 0; width: 100%; height: 100%; display: block;`. Le texte passe au-dessus (`position: relative; z-index: 1`).
- La taille suit le canvas (ResizeObserver) : il n'y a rien à appeler au redimensionnement.

## Repli et accessibilité
- Sans WebGL, si le shader échoue ou si le contexte est perdu, un dégradé radial (coque, reflet, lueur, banc de nuages) est posé sur `canvas.style.background`. Le canvas est transparent, donc ce dégradé reste visible.
- `prefers-reduced-motion` : une seule image fixe, réévaluée si la préférence change.
- Pause hors écran (IntersectionObserver) et quand l'onglet est caché (`visibilitychange`).

## Contraintes de mise en page
- Le bas du rendu se fond dans `#F5F7FB` : la section qui suit le héros doit avoir ce fond, ou un dégradé de raccord.
- Ordinateur : l'œuf est centré à 69 % de la largeur. Gardez le texte dans les 45 % de gauche, une zone que le shader garde calme.
- Mobile (`top`) : l'œuf occupe environ le tiers supérieur (centre à 29 % depuis le haut). Placez le texte dans la moitié basse, elle aussi calmée.
- Le header reste au-dessus du canvas, avec un fond transparent.

## Limites
- 60 images/s mesurées sur Intel HD 630 (jusqu'à 1899×917 en densité 1.5). Aucun test sur un vrai téléphone.
- L'adaptation automatique ne fait que baisser la résolution, jamais la remonter.
- Démo : `index.html` (paramètres `?debug`, `?static`, `?fallback`, `?t=`, `?ptr=x,y`). Captures dans `screenshots/`.
