# Phaness — consignes pour Claude

Site vitrine one-page de Phaness (studio de vidéos explicatives B2B), thème WordPress sur mesure, mis en ligne sur phaness.fr (IONOS).

Décisions actuelles (réservation Calendly, révision verte, structure) : `docs/BRIEF.md`.

## Avant de commencer
- Lis `docs/REPRISE.md` (où en est le projet) et `docs/BRIEF.md` (source de vérité). Les étapes de `docs/PLAN.md` sont toutes faites : ne l'ouvre que pour ajouter une nouvelle étape ou consulter « Plus tard ».

## Méthode de travail (grands principes)
1. **Demander avant de changer le brief.** Pour une décision qui change le brief (DA, structure, stack, contenu), pose la question à l'utilisateur. Pour le reste, choisis la solution par défaut la plus simple et dis-le.
2. **Une étape à la fois**, avec un critère « terminé quand » vérifiable.
3. **Vérifier avant de dire « fini ».** Lance le site, regarde-le dans le navigateur (1440 et 390 px), console sans erreur. Pour une vidéo, regarde des images extraites. Dis ce qui n'a pas été vérifié.
4. **Commit et push à la fin de chaque étape**, et à chaque étape intermédiaire stable. Le dépôt GitHub doit toujours permettre à un autre agent de reprendre.
5. **Tenir à jour les documents du dépôt après chaque étape**, dans le même commit que le travail : `docs/PLAN.md` (statut), `docs/JOURNAL.md` (entrée datée : fait, modèle, commit, non vérifié), `docs/REPRISE.md` (état, reste à faire, attendu de l'utilisateur), `docs/BRIEF.md` (toute décision), `README.md` (section « État », commandes, arborescence), les docs du dossier touché (`docs/CONTENU.md`, `videos/README.md` et `REVIEW.md`, `lab/hero/README.md`, `docs/MISE-EN-LIGNE.md`), `CLAUDE.md` et `AGENTS.md` si une règle change.
6. **Stopper proprement.** Si le contexte ou la limite d'usage approche, ou si tu dois t'arrêter, fais d'abord un commit `WIP` poussé, puis mets à jour `docs/REPRISE.md`.
7. **Sous-sessions et sous-agents** : modèle et effort fixés selon la tâche (règle globale). En parallèle, chaque session ne touche qu'à ses fichiers ; seule la coordinatrice tient `docs/BRIEF.md`, `PLAN.md`, `JOURNAL.md` et `REPRISE.md`. Seul, tu les tiens toi-même.
8. **Qualité visible** : premium et sobre, selon la DA de `docs/BRIEF.md`. Pour le site, nomme les styles par défaut à éviter plutôt qu'un rejet général de l'« AI slop » (par exemple fond crème, mots en italique dans les titres, numéros « 01/02/03 », étiquettes en monospace, boutons en pilule), et ajoute ceux qu'un rendu a pris. Les textes passent par le skill `avoid-ai-writing` (voir plus bas). Les vidéos visent un niveau showreel, pas un diaporama.

## Périmètre : le site, rien d'autre
- Les vidéos sont produites sur le PC Windows, d'après `videos/SCRIPTS.md` et `videos/SPEC.md`. Ne pas les rendre sur un autre poste sans demande de l'utilisateur. Voir `docs/REPRISE.md` pour l'état et les éléments attendus.
- Travaille uniquement dans `D:\Projets\Phaness` : rien ailleurs sur le PC (réglages système, variables globales, profil de shell, autres projets, désinstallations, paquets globaux).
- Dépendances uniquement dans le projet (`npm install` local, `npx`). Caches (navigateur, ffmpeg) vers `D:\Tools\<outil>-cache` par variable limitée à la commande.
- Ne supprime que des fichiers que ta session a créés.
- Ne crée aucun compte, ne saisis aucun identifiant, n'utilise aucun service ni API payants.
- Plusieurs sessions travaillent en parallèle dans ce dossier : ne touche qu'aux fichiers de ton étape (colonne « Fichiers touchés » du plan).

## Git
- Dépôt privé sur GitHub, branche `main`. Commit et push à la fin de chaque étape (principe 4). Messages en anglais, au format `Step N: …` ou `WIP …`.
- Ne commite que les fichiers de ton étape. Jamais de `push --force` ni de réécriture d'historique. Vérifie `git status` avant de dire qu'un travail est poussé.
- Les rendus vidéo (`videos/out/`) et `node_modules/` ne sont pas versionnés.

## Contenu
- Site et docs en français, ton pro et rassurant, vouvoiement. Code, noms de fichiers et commentaires en anglais.
- Les données manquantes (coordonnées, mentions légales, liens de rendez-vous) s'écrivent `[À FOURNIR]`. Les chiffres et promesses non validés s'écrivent `[À CONFIRMER]`. N'invente jamais ces informations.

## Gestion du contexte
- Lis des extraits ciblés (recherche, plages de lignes) plutôt que des fichiers entiers. Ne recopie pas de gros fichiers ou de longues sorties dans la conversation.
- Lance les commandes longues (serveur, rendu vidéo, Lighthouse) en arrière-plan.
- Confie les recherches larges à un sous-agent Haiku en effort low, qui ne renvoie que sa conclusion.
- Garde les décisions dans `docs/`, pas seulement dans la conversation.

## Commandes
- Node vient de `D:\Tools\nodejs` (≥ 20.18 requis). Si `npm` n'est pas reconnu, ajoute ce dossier au `PATH` de la session.
- `npm install` : installe les dépendances du projet (dont `@wp-playground/cli`).
- `npm run dev` : WordPress local (Playground CLI) sur http://127.0.0.1:9400, thème `theme/` monté en direct, admin connecté (`/wp-admin/`). Premier lancement : quelques minutes. Pour garder le cache (≈ 200 Mo) sur D: : `USERPROFILE=D:\Tools\playground-cache HOME=D:\Tools\playground-cache npm run dev`.
- `npm run dev:audit` : instance anonyme sur http://127.0.0.1:9401, pour Lighthouse et la recette.
- `npm test` : héros et paquetage ; `npm run test:packaging` : paquetage seul (fixtures temporaires). `npm run sync-videos` : après réception des rendus seulement. `npm run build:zip` : refuse médias ou fichiers requis manquants.
- Config : `dev/blueprint.json`, `dev/audit-blueprint.json`. Polices : `theme/assets/fonts/` (Geist, OFL).
- Dépôt : https://github.com/abouchet109-del/phaness (privé), branche `main`.

## Écriture : pas de texte « IA »
- Pour tout texte visible sur le site (`docs/CONTENU.md`, `theme/patterns/`, pages légales, textes des vidéos), applique le skill `avoid-ai-writing` (dans `.claude/skills/avoid-ai-writing/`), voix « professional ».
- Les motifs du skill sont surtout en anglais : transpose-les au français (pas de formules creuses, de superlatifs vides, de tirets en série, de « en somme », de triades systématiques).
