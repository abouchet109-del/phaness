# Consignes pour les agents (Codex et autres)

Ce projet a été commencé avec Claude Code. Les règles sont les mêmes pour tout agent :
1. Lis `CLAUDE.md` (règles du projet), puis `docs/REPRISE.md` (où on en est, ce qu'il reste à faire), `docs/BRIEF.md` et `docs/PLAN.md`.
2. Reprends les étapes inachevées de `docs/REPRISE.md`, dans l'ordre : finir l'étape 5, finir les vidéos V2, finir l'étape 7, puis l'étape 6 (recette).
3. Après chaque étape : commit et push, puis mise à jour de `docs/PLAN.md`, `docs/JOURNAL.md` et `docs/REPRISE.md`.

## Différences avec Claude Code
- Les skills HyperFrames de Claude ne sont pas disponibles. Le CLI est installé dans `videos/` (`cd videos && npm install`, puis `npx hyperframes --help`), et `videos/README.md` décrit la chaîne de rendu.
- Les chemins `D:\...` concernent le PC Windows de l'utilisateur. Dans un bac à sable cloud Linux, ignore-les et garde les caches dans le dossier du projet ou `/tmp`.
- Les rendus vidéo (`videos/out/`) et `node_modules/` ne sont pas versionnés : régénère-les (`npm install`, rendu HyperFrames, `npm run sync-videos`).

## Écriture : pas de texte « IA »
Avant d'écrire ou de modifier un texte visible sur le site, lis et applique `.claude/skills/avoid-ai-writing/SKILL.md` (voix « professional »), en transposant ses motifs au français.
