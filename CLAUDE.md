# Phaness — consignes pour Claude

Site vitrine one-page de Phaness (studio de vidéos explicatives B2B), thème WordPress sur mesure, mis en ligne sur phaness.fr (IONOS).

## Avant de commencer
- Lis `docs/BRIEF.md` (source de vérité), puis ton étape dans `docs/PLAN.md`.
- `docs/BRIEF.md` et `docs/PLAN.md` sont tenus par la session coordinatrice. Ne les modifie pas : mets tes décisions et écarts dans ton rapport final, elle les reportera.

## Périmètre : le site, rien d'autre
- Travaille uniquement dans `D:\Projets\Phaness`. Ne modifie rien ailleurs sur le PC : ni réglages système, ni variables d'environnement globales, ni profil de shell, ni autres projets, ni désinstallations, ni paquets globaux.
- Installe les dépendances uniquement dans le projet (`npm install` local, `npx`).
- Si un outil télécharge un navigateur, ffmpeg ou un cache, oriente-le vers `D:\Tools\<outil>-cache`, par une variable d'environnement limitée à la commande. Jamais sur C:. Préviens avant toute écriture de plus de 500 Mo.
- Ne supprime que des fichiers que ta session a créés.
- Ne crée aucun compte, ne saisis aucun identifiant, n'utilise aucun service ni API payants.
- Plusieurs sessions travaillent en parallèle dans ce dossier : ne touche qu'aux fichiers de ton étape (colonne « Fichiers touchés » du plan).

## Git
- Dépôt privé sur GitHub. Ne commite que les fichiers de ton étape. Jamais de `push --force` ni de réécriture d'historique.
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
- Pour que le cache de Playground reste sur D: : `USERPROFILE=D:\Tools\playground-cache HOME=D:\Tools\playground-cache npm run dev` (variables limitées à la commande).
- Config Playground : `dev/blueprint.json`. Polices : `theme/assets/fonts/` (Geist variable, licence OFL).
- Dépôt : https://github.com/abouchet109-del/phaness (privé), branche `main`.
