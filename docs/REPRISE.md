# Reprise du projet (état au 2026-10-29, 14h)

Les sessions se sont arrêtées sur la limite d'usage. Tout le travail est poussé sur `main` ; les commits `WIP` sont inachevés.
À lire d'abord : `CLAUDE.md`, `docs/BRIEF.md`, `docs/PLAN.md`, `docs/CONTENU.md`.

## État par étape
| Étape | État | Reste à faire |
|---|---|---|
| 1. Fondations | fait | — |
| 2. Textes | fait | relecture par l'utilisateur ; 2 `[À CONFIRMER]` (nombre de retours, voix off et sous-titres) |
| 3. Héros WebGL | fait | — |
| 4. Mise en page | fait | captures dans `docs/captures/etape4/` |
| 5. Finitions | **WIP** (commit `19c65fd`) | vérifier ce qui existe déjà (`theme/inc/legal-pages.php`, `theme/inc/seo.php`, onglets, animations, Cal.com), finir, tester dans le navigateur (1440 et 390 px, clavier, mouvement réduit, console), mettre à jour les textes des vidéos V2 dans `CONTENU.md` et `theme/patterns/work.php` |
| V2. Vidéos showreel | **WIP** (commit `32cab5e`) | seule `expliquer-pac` est commencée (moteur 3D dans `videos/_system/src/`). Faire `securiser-usine`, `accompagner-solaire`, `former-electricite`, supprimer les dossiers V1 (`former-pas`, `securiser-epi`, `accompagner-radiateur`) et les rendus V1 de `videos/out/`. Brief complet dans `docs/BRIEF.md` §9 ; inspirations dans `docs/INSPIRATIONS-VIDEO.md` (clone dans `D:/Temp/phaness-refs/`, ne rien y exécuter) |
| 6. Recette | à faire | après 5 et V2 |
| 7. Mise en ligne | **WIP** (commit `80a4f06`) | `scripts/build-zip.mjs` à vérifier, tester le zip dans un Playground vierge (port 9401), écrire `docs/MISE-EN-LIGNE.md` (guide IONOS) |

## Règle d'écriture
Tout texte du site passe par le skill `avoid-ai-writing` (`.claude/skills/avoid-ai-writing/`), voir `CLAUDE.md`.

## À fournir par l'utilisateur
Email et téléphone, lien Cal.com (compte à créer par l'utilisateur), mentions légales (société, forme, capital, SIRET, siège, responsable de publication).

## Commandes
`npm run dev` (voir `CLAUDE.md` pour garder le cache sur D:) ; `npm run sync-videos` ; `npm run build:zip`.

## Modèles conseillés
5 et 7 : Sonnet (high pour la 5, medium pour la 7). V2 : Opus high. 6 : Haiku low pour l'audit, Sonnet medium pour les corrections.
