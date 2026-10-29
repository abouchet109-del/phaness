# Phaness — Plan de construction

Une session par étape, avec le modèle et l'effort fixés au lancement. Chaque session lit d'abord `CLAUDE.md`, puis `docs/BRIEF.md`.
Les étapes 1, 2, 3 et V sont indépendantes : elles tournent en parallèle, chacune ne touchant que ses propres fichiers.

| # | Étape | Modèle | Effort | Dépend de | Fichiers touchés | Statut |
|---|---|---|---|---|---|---|
| 0 | Cadrage : brief, stack, plan | Opus | medium | — | `docs/BRIEF.md`, `docs/PLAN.md`, `CLAUDE.md` | fait |
| 1 | Fondations : environnement local, squelette du thème, Git | Sonnet | medium | 0 | `theme/`, `package.json`, `.gitignore`, section Commandes de `CLAUDE.md` | fait |
| 2 | Rédaction de tous les textes | Opus | medium | 0 | `docs/CONTENU.md` | fait (relecture utilisateur à faire) |
| 3 | Héros 3D WebGL (prototype autonome) | Opus | high | 0 | `lab/hero/` | fait |
| V | Vidéos de démonstration (HyperFrames) | Opus | medium | 0 | `videos/` | en cours |
| 4 | Mise en page de la one-page dans le thème | Opus | medium | 1, 2, 3, V | `theme/` | à faire |
| 5 | Animations, prise de RDV, pages légales, SEO | Sonnet | high | 4 | `theme/` | à faire |
| 6a | Recette : audit Lighthouse, accessibilité, responsive | Haiku | low | 5 | `docs/RECETTE.md` | à faire |
| 6b | Corrections issues de la recette | Sonnet | medium | 6a | `theme/` | à faire |
| 7 | Mise en ligne sur IONOS | Sonnet | medium | 6b | `scripts/`, `docs/MISE-EN-LIGNE.md` | à faire |

## Détail

### 1. Fondations — Sonnet, medium
Spécification précise, code d'échafaudage.
- Vérifier Node ≥ 20.18 (`D:\Tools\nodejs`). Mettre en place WordPress Playground CLI comme dépendance de développement du projet, avec le thème monté, et un `npm run dev` qui ouvre le site en local.
- Créer le thème bloc `phaness` : `style.css`, `theme.json` avec les tokens du brief, `functions.php` minimal, `templates/front-page.html` vide, polices Geist auto-hébergées (fichiers woff2 sous licence OFL).
- `git init`, `.gitignore` (dont `node_modules/` et `videos/out/`), dépôt GitHub **privé** `phaness` sur le compte de l'utilisateur, premier commit et push.
- Compléter `CLAUDE.md` avec une section « Commandes ». Ne pas réécrire le reste du fichier.
- **Terminé quand** `npm run dev` affiche une page vide aux couleurs et dans la police Phaness, et que le premier commit est poussé.

### 2. Textes — Opus, medium
Rédaction B2B qui demande du jugement : un message différent par cible.
- Rédiger chaque section du brief dans `docs/CONTENU.md` : titres, sous-titres, textes, libellés des boutons, la section « Pourquoi Phaness ? », le titre et la meta description, les textes des pages légales sous forme de gabarits avec `[À FOURNIR]`.
- Pas de FAQ.
- Ton : vouvoiement, pro, rassurant, phrases courtes. Aucun chiffre, délai ni promesse non validés par l'équipe : les marquer `[À CONFIRMER]`.
- **Terminé quand** `CONTENU.md` couvre toutes les sections. La relecture par l'utilisateur se fera à son retour.

### 3. Héros 3D — Opus, high
Logique subtile (shader) et contraintes de performance.
- Prototype autonome dans `lab/hero/index.html` : forme organique lumineuse dans un champ de nuages (l'œuf de Phanès d'où naît la lumière), bleu nuit, blanc, lueur vermillon, réaction douce à la souris.
- WebGL natif, sans bibliothèque. Pause hors écran, résolution plafonnée, image de repli, version fixe si `prefers-reduced-motion`.
- **Terminé quand** le prototype tient 60 images/s sur un portable moyen, pèse moins de 15 Ko, et qu'une capture d'écran est jointe au rapport.

### V. Vidéos de démonstration — Opus, medium
Production créative avec HyperFrames (skill `hyperframes`).
- Quatre vidéos de 15 à 25 s, une par offre, en 16:9, dans la DA du brief (3D douce, nuages, bleu nuit, blanc, vermillon) :
  1. **Former** : capsule e-learning « Protéger, Alerter, Secourir », les trois réflexes du sauveteur.
  2. **Sécuriser** : les équipements de protection individuelle sur un chantier (casque, lunettes, gants, chaussures de sécurité, gilet haute visibilité).
  3. **Expliquer et vendre** : comment fonctionne une pompe à chaleur air/eau.
  4. **Accompagner** : tutoriel « Purger un radiateur » en étapes numérotées.
- Texte à l'écran, sans voix off. Aucune API ni service payant, aucun compte à créer.
- Sources dans `videos/<nom>/`, rendus dans `videos/out/<nom>.mp4` (H.264, ≤ 4 Mo chacun) avec une image d'affiche `videos/out/<nom>.webp`.
- **Terminé quand** les quatre MP4 sont rendus et vérifiés image par image.

### 4. Mise en page — Opus, medium
Jugement visuel.
- Construire toutes les sections dans le thème (patterns), avec les textes de l'étape 2, le héros de l'étape 3 et les vidéos de l'étape V.
- Ajuster les tokens si besoin et les reporter dans le brief.
- **Terminé quand** la page est complète en local, sur ordinateur et sur mobile, captures à l'appui.

### 5. Finitions fonctionnelles — Sonnet, high
Plusieurs fichiers et des cas limites.
- Apparitions au défilement, micro-interactions, onglets Secteurs accessibles au clavier.
- Embed Cal.com chargé au clic (lien `[À FOURNIR]`). Liens email et téléphone `[À FOURNIR]`.
- Pages Mentions légales et Confidentialité, créées automatiquement à l'activation du thème.
- Balises SEO, Open Graph, données structurées, favicon.
- **Terminé quand** tout fonctionne en local, sans erreur dans la console.

### 6a. Recette — Haiku, low
Lecture et mesures seulement.
- Lighthouse mobile et desktop, vérification à 360, 768, 1280 et 1920 px, navigation au clavier, `prefers-reduced-motion`, liens.
- Rapport dans `docs/RECETTE.md`, chaque écart classé par gravité.

### 6b. Corrections — Sonnet, medium
- Corriger les écarts de `RECETTE.md`, puis relancer les mesures.

### 7. Mise en ligne — Sonnet, medium
- Script `scripts/build-zip` qui produit le zip du thème, vidéos comprises.
- Guide pas à pas `docs/MISE-EN-LIGNE.md` : installer WordPress chez IONOS, activer HTTPS, téléverser et activer le thème, régler la page d'accueil, désactiver les extensions préinstallées inutiles, vérifier en ligne.
- L'utilisateur fait lui-même les actions dans l'interface IONOS (comptes, conditions d'utilisation, identifiants).

## Plus tard
- Remplacer les vidéos de démonstration par de vrais projets.
- Tarifs.
