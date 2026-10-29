# Reprise du projet (état au 2026-10-29, après reprise locale)

Tout est poussé sur `main`. Les vidéos V2 sont à rendre sous Windows : HyperFrames plante sur Mac (Chrome SIGABRT).
À lire d'abord : `CLAUDE.md`, `docs/BRIEF.md`, `docs/PLAN.md`, `docs/CONTENU.md`.

## État par étape
| Étape | État | Reste à faire |
|---|---|---|
| 1. Fondations | fait | — |
| 2. Textes | fait | relecture par l'utilisateur ; 2 `[À CONFIRMER]` (nombre de retours, voix off et sous-titres) |
| 3. Héros WebGL | fait | — |
| 4. Mise en page | fait | captures dans `docs/captures/etape4/` |
| 5. Finitions | **Implémentée, contrôle partiel** | contrôles manuels documentés dans `docs/RECETTE.md`. Reste à tester Cal.com avec un lien réel et à émuler `prefers-reduced-motion`. Les placeholders de contact et de vie légale restent à fournir. |
| V2. Vidéos showreel | **WIP** | `expliquer-pac` est la seule source. Son lint statique indique 0 erreur, mais le contrôle runtime échoue car Chrome s'arrête par SIGABRT. Créer `securiser-usine`, `accompagner-solaire`, `former-electricite`, puis rendre et vérifier les quatre films. Supprimer les sources V1 seulement lorsque les V2 les remplacent. Brief dans `docs/BRIEF.md` §9 ; inspirations dans `docs/INSPIRATIONS-VIDEO.md`. |
| 6a. Recette | **Partielle** | `docs/RECETTE.md` consigne le contrôle local responsive/clavier/console. Lighthouse et l'émulation du mouvement réduit restent à faire ; n'utiliser aucun score estimé. |
| 6b. Corrections | **Partielle** | corrections manuelles appliquées et consignées dans `docs/RECETTE.md`; compléter après la recette Lighthouse. |
| 7. Mise en ligne | **Partielle** | guide IONOS dans `docs/MISE-EN-LIGNE.md`. `scripts/build-zip.mjs` refuse une archive sans quatre MP4 et quatre affiches. Le test du zip en port 9401 et le paquet final attendent les rendus V2. |

## Règle d'écriture
Tout texte du site passe par le skill `avoid-ai-writing` (`.claude/skills/avoid-ai-writing/`), voir `CLAUDE.md`.

## À fournir par l'utilisateur
Email et téléphone, lien Cal.com (compte à créer par l'utilisateur), mentions légales (société, forme, capital, SIRET, siège, responsable de publication).

## Commandes
`npm run dev` (voir `CLAUDE.md` pour garder le cache sur D:) ; `npm run sync-videos` ; `npm run build:zip`.

## Modèles conseillés
5 et 7 : Sonnet (high pour la 5, medium pour la 7). V2 : Opus high. 6 : Haiku low pour l'audit, Sonnet medium pour les corrections.

## Prochaine reprise

1. Résoudre l'arrêt Chrome d'HyperFrames sur macOS ou utiliser l'environnement Windows décrit par les scripts du projet.
2. Finir les trois films V2 et le rendu/contrôle des quatre MP4 et affiches.
3. Compléter Lighthouse et le test du mouvement réduit ; appliquer les corrections restantes.
4. Refaire `npm run build:zip`, contrôler le paquet dans un Playground vierge et finaliser le guide IONOS.
