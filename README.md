# Phaness

Site vitrine one-page de **Phaness**, studio B2B de vidéos explicatives en motion design 3D (formation, sécurité industrielle, énergie, tutoriels produit).
Accroche : « Donnez vie à vos idées en vidéo » Mise en ligne prévue sur **phaness.fr** (IONOS).

## Stack
- WordPress avec un thème bloc sur mesure (`theme/`), sans constructeur de page ni extension obligatoire.
- Tout le contenu de la page est dans le thème : la mise en ligne se fait en téléversant un zip.
- CSS et JavaScript natifs. Accueil avec emplacement pour la vidéo de présentation ; ancien prototype WebGL conservé en archive. Palette vert forêt.
- Vidéos de démonstration produites avec HyperFrames (`videos/`).
- En local : WordPress Playground CLI, avec Node 20.18 ou plus récent.

## Démarrer
```bash
npm install
npm run dev          # WordPress local sur http://127.0.0.1:9400 (voir CLAUDE.md pour garder le cache sur D:)
npm run dev:audit    # WordPress anonyme sur http://127.0.0.1:9401, pour Lighthouse et la recette
npm test            # tests du héros WebGL et du paquetage
npm run test:packaging # contrôle le ZIP dans des fixtures temporaires, sans rendre de vidéo
npm run sync-videos  # copie videos/out/*.mp4|webp dans theme/assets/video/
npm run build:zip    # produit dist/phaness.zip ; refuse les fichiers ou rendus manquants
```

## Arborescence
| Dossier | Contenu |
|---|---|
| `theme/` | thème WordPress `phaness` : `theme.json`, `patterns/` (une section par fichier), `inc/` (pages légales, SEO, allègement), `assets/` |
| `lab/hero/` | prototype autonome du héros WebGL et sa note d'intégration |
| `videos/` | sources HyperFrames des vidéos de démo (rendus dans `videos/out/`, non versionnés) |
| `scripts/` | synchronisation des vidéos, construction du zip |
| `dev/` | blueprints Playground : développement connecté et audit anonyme |
| `docs/` | brief, plan, textes, journal, reprise, captures |

## Documentation
- [`docs/BRIEF.md`](docs/BRIEF.md) : positionnement, direction artistique, structure, stack. C'est la source de vérité.
- [`docs/PLAN.md`](docs/PLAN.md) : les étapes, avec le modèle et l'effort de chacune, et leur statut.
- [`docs/CONTENU.md`](docs/CONTENU.md) : tous les textes du site.
- [`docs/JOURNAL.md`](docs/JOURNAL.md) : ce qui a été fait, et quand.
- [`docs/RECETTE.md`](docs/RECETTE.md) : contrôles, mesures Lighthouse et limites de validation.
- [`docs/REPRISE.md`](docs/REPRISE.md) : où en est le projet et ce qu'il reste à faire.
- [`CLAUDE.md`](CLAUDE.md) : les consignes pour Claude Code.

## État
Révision visuelle du 2026-10-29 : nouvelle accroche, palette verte, retrait de Méthode / Notre différence / Pourquoi Phaness ? et de la zone d'intervention. L'œuf est remplacé par un cadre pour la vidéo de présentation de l'équipe, encore à fournir. Le thème est en version 0.2.3. Les huit boutons de rendez-vous/contact ouvrent le lien Calendly fourni, chargé au clic. Espacements et typographie harmonisés, icônes linéaires, nouveaux sujets vidéo et coordonnées renseignées (contact@phanes.fr, 07 69 86 01 61). La section « Le pouvoir de la vidéo, au service de votre entreprise. » reprend le titre, les textes et les trois cartes de la référence fournie par l'utilisateur.

Les scores Lighthouse ci-dessous concernent la version précédant cette révision ; les contrôles visuels actuels sont décrits dans `docs/RECETTE.md`.

Code et recette terminés dans le périmètre sans vidéos : Lighthouse mobile 98/100/100/100 et ordinateur 100/100/100/100. Paquetage couvert par 10 tests ; installation du thème et réservation simulée vérifiées sur WordPress vierge. La livraison finale attend les vidéos V2 produites sur l'autre PC, les informations légales. Le ZIP final et la mise en ligne IONOS restent à faire après réception de ces éléments. Détail dans [`docs/REPRISE.md`](docs/REPRISE.md).
