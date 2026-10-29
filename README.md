# Phaness

Site vitrine one-page de **Phaness**, studio B2B de vidéos explicatives en motion design 3D (formation, sécurité industrielle, énergie, tutoriels produit).
Accroche : « Des vidéos explicatives professionnelles, simplement. » Mise en ligne prévue sur **phaness.fr** (IONOS).

## Stack
- WordPress avec un thème bloc sur mesure (`theme/`), sans constructeur de page ni extension obligatoire.
- Tout le contenu de la page est dans le thème : la mise en ligne se fait en téléversant un zip.
- CSS et JavaScript natifs. Héros en WebGL natif (`theme/assets/js/hero.js`).
- Vidéos de démonstration produites avec HyperFrames (`videos/`).
- En local : WordPress Playground CLI, avec Node 20.18 ou plus récent.

## Démarrer
```bash
npm install
npm run dev          # WordPress local sur http://127.0.0.1:9400 (voir CLAUDE.md pour garder le cache sur D:)
npm run sync-videos  # copie videos/out/*.mp4|webp dans theme/assets/video/
npm run build:zip    # produit dist/phaness.zip (en cours, voir docs/REPRISE.md)
```

## Arborescence
| Dossier | Contenu |
|---|---|
| `theme/` | thème WordPress `phaness` : `theme.json`, `patterns/` (une section par fichier), `inc/` (pages légales, SEO, allègement), `assets/` |
| `lab/hero/` | prototype autonome du héros WebGL et sa note d'intégration |
| `videos/` | sources HyperFrames des vidéos de démo (rendus dans `videos/out/`, non versionnés) |
| `scripts/` | synchronisation des vidéos, construction du zip |
| `dev/` | blueprint de Playground |
| `docs/` | brief, plan, textes, journal, reprise, captures |

## Documentation
- [`docs/BRIEF.md`](docs/BRIEF.md) : positionnement, direction artistique, structure, stack. C'est la source de vérité.
- [`docs/PLAN.md`](docs/PLAN.md) : les étapes, avec le modèle et l'effort de chacune, et leur statut.
- [`docs/CONTENU.md`](docs/CONTENU.md) : tous les textes du site.
- [`docs/JOURNAL.md`](docs/JOURNAL.md) : ce qui a été fait, et quand.
- [`docs/REPRISE.md`](docs/REPRISE.md) : où en est le projet et ce qu'il reste à faire.
- [`CLAUDE.md`](CLAUDE.md) : les consignes pour Claude Code.

## État
Étapes 1 à 5 faites. Étapes 6 et 7 partielles. Vidéos V2 en pause : elles bloquent la mise en ligne. Détail dans [`docs/REPRISE.md`](docs/REPRISE.md).
