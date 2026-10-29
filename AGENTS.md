# Consignes pour les agents (Codex et autres)

Ce projet a été commencé avec Claude Code. Les règles sont les mêmes pour tout agent :
1. Lis `CLAUDE.md` (règles du projet), puis `docs/REPRISE.md` (où on en est, ce qu'il reste à faire), `docs/BRIEF.md` et `docs/PLAN.md`.
2. Reprends les étapes inachevées de `docs/REPRISE.md`, dans l'ordre : finir l'étape 5, finir les vidéos V2, finir l'étape 7, puis l'étape 6 (recette).
3. Suis la section « Méthode de travail » de `CLAUDE.md` : vérifier avant de dire « fini », commit et push après chaque étape, mise à jour de tous les documents du dépôt (liste de contrôle du principe 5), et commit `WIP` poussé avant tout arrêt.

## Différences avec Claude Code
- Dernière demande utilisateur (2026-10-29) : révision verte et nouvelle accroche ; retrait de Méthode, Notre différence, Pourquoi Phaness ? et de la zone d'intervention. Le héros affiche un emplacement de vidéo de présentation, sans œuf ni shader chargé. Les films sont gérés sur un autre PC : ne pas créer, modifier ou rendre les vidéos sur ce Mac ; leur intégration finale attend leur réception.
- Les skills HyperFrames de Claude ne sont pas disponibles. Le CLI est installé dans `videos/` (`cd videos && npm install`, puis `npx hyperframes --help`), et `videos/README.md` décrit la chaîne de rendu.
- Les chemins `D:\...` concernent le PC Windows de l'utilisateur. Dans un bac à sable cloud Linux, ignore-les et garde les caches dans le dossier du projet ou `/tmp`.
- Sur macOS, travailler dans la racine du clone actif et garder outils et dépendances dans le projet ou un dossier temporaire ; aucune installation globale.
- Les rendus vidéo (`videos/out/`) et `node_modules/` ne sont pas versionnés : régénère-les (`npm install`, rendu HyperFrames, `npm run sync-videos`).

## Écriture : pas de texte « IA »
Avant d'écrire ou de modifier un texte visible sur le site, lis et applique `.claude/skills/avoid-ai-writing/SKILL.md` (voix « professional »), en transposant ses motifs au français.
