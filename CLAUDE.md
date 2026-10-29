# Phaness — consignes pour Claude

Site vitrine one-page de Phaness (studio de vidéos explicatives B2B), thème WordPress sur mesure, mis en ligne sur phaness.fr (IONOS).

Révision courante : identité verte, accroche « Donnez vie à vos idées en vidéo », héros réservé à la présentation vidéo de l'équipe. Méthode, Notre différence et Pourquoi Phaness ? sont retirées de la page ; le prototype WebGL est archivé et ne se charge plus. Les décisions actuelles sont dans `docs/BRIEF.md`.

## Avant de commencer
- Lis `docs/REPRISE.md` (où en est le projet), `docs/BRIEF.md` (source de vérité), puis ton étape dans `docs/PLAN.md`.

## Méthode de travail (grands principes)
1. **Réfléchir avant de coder.** Pour une décision qui change le brief (DA, structure, stack, contenu), pose la question à l'utilisateur. Pour le reste, choisis la solution par défaut la plus simple et dis-le.
2. **Une étape à la fois**, avec un critère « terminé quand » vérifiable (voir `docs/PLAN.md`).
3. **Vérifier avant de dire « fini ».** Lance le site, regarde-le dans le navigateur (1440 et 390 px), console sans erreur. Pour une vidéo, regarde des images extraites. Dis ce qui n'a pas été vérifié.
4. **Commit et push à la fin de chaque étape**, et à chaque étape intermédiaire stable. Le dépôt GitHub doit toujours permettre à un autre agent de reprendre.
5. **Tenir à jour tous les documents du dépôt après chaque étape**, dans le même commit que le travail. Le dépôt doit toujours refléter l'avancée réelle du projet. Liste de contrôle :
   - `docs/PLAN.md` : le statut de l'étape (fait, WIP, à faire) ;
   - `docs/JOURNAL.md` : une entrée datée avec ce qui a été fait, le modèle utilisé, le commit, et ce qui n'a pas été vérifié ;
   - `docs/REPRISE.md` : l'état par étape, ce qu'il reste à faire, ce que l'utilisateur doit fournir ;
   - `docs/BRIEF.md` : toute décision prise (DA, structure, contenu, stack) ;
   - `README.md` : la section « État », plus les commandes et l'arborescence si elles changent ;
   - les docs du dossier touché, s'il en a : `docs/CONTENU.md` pour les textes, `videos/README.md` et `videos/REVIEW.md` pour les vidéos, `lab/hero/README.md` pour le héros, `docs/MISE-EN-LIGNE.md` pour la mise en ligne ;
   - `CLAUDE.md` et `AGENTS.md`, si une règle ou une commande change.
6. **Stopper proprement.** Si le contexte ou la limite d'usage approche, ou si tu dois t'arrêter, fais d'abord un commit `WIP` poussé, puis mets à jour `docs/REPRISE.md`.
7. **Sous-sessions et sous-agents** : fixe toujours le modèle et l'effort selon la tâche, au plus économique sans perte de qualité. Haiku pour la lecture et les tests, Sonnet pour le code bien spécifié, Opus pour le jugement, la DA et la 3D. En parallèle, chaque session ne touche qu'à ses fichiers, et une seule session (la coordinatrice) tient `docs/BRIEF.md`, `docs/PLAN.md`, `docs/JOURNAL.md` et `docs/REPRISE.md`. Seule, tu les tiens toi-même.
8. **Qualité visible** : premium et sobre, pas de « AI slop ». Les textes passent par le skill `avoid-ai-writing` (voir plus bas). Les vidéos visent un niveau showreel, pas un diaporama.

## Périmètre : le site, rien d'autre
- Demande utilisateur du 2026-10-29 : finir le site hors vidéos. Les films V2 sont gérés sur un autre PC ; ne pas les produire ni les modifier sur ce Mac. Voir `docs/REPRISE.md` pour le périmètre déjà vérifié et les éléments attendus.
- Hors Windows, le périmètre de travail est la racine du clone actif. Les outils restent locaux au projet ou dans un dossier temporaire, sans installation globale.
- Travaille uniquement dans `D:\Projets\Phaness`. Ne modifie rien ailleurs sur le PC : ni réglages système, ni variables d'environnement globales, ni profil de shell, ni autres projets, ni désinstallations, ni paquets globaux.
- Installe les dépendances uniquement dans le projet (`npm install` local, `npx`).
- Si un outil télécharge un navigateur, ffmpeg ou un cache, oriente-le vers `D:\Tools\<outil>-cache`, par une variable d'environnement limitée à la commande. Jamais sur C:. Préviens avant toute écriture de plus de 500 Mo.
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
- `npm run dev` : lance WordPress en local (Playground CLI) sur http://127.0.0.1:9400, thème `theme/` monté en direct et activé, connexion admin automatique (admin : `/wp-admin/`). Les modifications de `theme/` s'appliquent au rechargement de la page. Premier lancement : téléchargement de WordPress, comptez quelques minutes.
- Pour que le cache et le site temporaire de Playground (≈ 200 Mo) restent sur D: : `USERPROFILE=D:\Tools\playground-cache HOME=D:\Tools\playground-cache npm run dev` (variables limitées à la commande).
- Config Playground : `dev/blueprint.json`. Polices : `theme/assets/fonts/` (Geist variable, licence OFL).
- `npm run dev:audit` : instance anonyme sur http://127.0.0.1:9401 (`dev/audit-blueprint.json`), pour Lighthouse et la recette sans barre d'administration.
- `npm test` : tests du héros et du paquetage. `npm run test:packaging` : paquetage seul, dans des fixtures temporaires ; aucun média créé dans le projet. Le build retire l'ancien ZIP avant sa tentative et refuse les fichiers requis ou médias manquants.
- Dépôt : https://github.com/abouchet109-del/phaness (privé), branche `main`.

## Écriture : pas de texte « IA »
- Pour tout texte visible sur le site (`docs/CONTENU.md`, `theme/patterns/`, pages légales, textes des vidéos), applique le skill `avoid-ai-writing` (dans `.claude/skills/avoid-ai-writing/`), voix « professional ».
- Les motifs du skill sont surtout en anglais : transpose-les au français (pas de formules creuses, de superlatifs vides, de tirets en série, de « en somme », de triades systématiques).
