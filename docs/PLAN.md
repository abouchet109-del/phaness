# Phaness — Plan de construction

Une session par étape, avec le modèle et l'effort fixés au lancement. Chaque session lit d'abord `CLAUDE.md`, puis `docs/BRIEF.md`.
Les étapes 1, 2, 3 et V sont indépendantes : elles tournent en parallèle, chacune ne touchant que ses propres fichiers.

| # | Étape | Modèle | Effort | Dépend de | Fichiers touchés | Statut |
|---|---|---|---|---|---|---|
| 0 | Cadrage : brief, stack, plan | Opus | medium | — | `docs/BRIEF.md`, `docs/PLAN.md`, `CLAUDE.md` | fait |
| 1 | Fondations : environnement local, squelette du thème, Git | Sonnet | medium | 0 | `theme/`, `package.json`, `.gitignore`, section Commandes de `CLAUDE.md` | fait |
| 2 | Rédaction de tous les textes | Opus | medium | 0 | `docs/CONTENU.md` | fait (relecture utilisateur à faire) |
| 3 | Héros 3D WebGL (prototype autonome) | Opus | high | 0 | `lab/hero/` | fait |
| V | Vidéos de démonstration (HyperFrames + three.js) | Opus | high | 0 | `videos/` | V2 WIP sur Windows : anciens films rendus ; adapter aux nouveaux sujets IA/EPI/rénovation/PAC et à la palette verte avant livraison |
| 4 | Mise en page de la one-page dans le thème | Opus | medium | 1, 2, 3, V | `theme/` | fait |
| 5 | Animations, prise de RDV, pages légales, SEO | Sonnet | high | 4 | `theme/` | code vérifié ; vrai Cal.com et informations légales attendus |
| 6a | Recette : audit Lighthouse, accessibilité, responsive | Haiku | low | 5 | `docs/RECETTE.md` | validée sans vidéos : mobile 98/100/100/100, ordinateur 100/100/100/100 ; mouvement réduit vérifié |
| 6b | Corrections issues de la recette | Sonnet | medium | 6a | `theme/` | faites pour le périmètre hors vidéos ; voir RECETTE.md |
| 7 | Mise en ligne sur IONOS | Sonnet | medium | 6b | `scripts/`, `docs/MISE-EN-LIGNE.md` | paquetage testé et ZIP de contrôle installé ; livraison finale attend médias, Cal.com et informations légales |

## Révision visuelle du 2026-10-29

Demandée et implémentée : accroche « Donnez vie à vos idées en vidéo », surtitre gris, sous-titre utilisateur, palette verte, retrait des sections Méthode / Notre différence / Pourquoi Phaness ? et de la zone d'intervention. Le héros WebGL devient un emplacement de vidéo de présentation. La promesse, les quatre offres, les secteurs et les réalisations sont conservés. Les descriptions historiques des étapes ci-dessous documentent la construction initiale ; les décisions actuelles sont dans `BRIEF.md`.

Mise à jour suivante : la section Promesse est remplacée par « Le pouvoir de la vidéo, au service de votre entreprise. » et trois cartes (Comprendre en images, Un budget maîtrisé, Du sur-mesure, avec une méthode), conformément à la référence visuelle utilisateur. Contrôles responsive et syntaxe validés ; thème 0.2.1.

Révision suivante (thème 0.2.2) : espacement réduit, ancres à environ 16 px sous la navigation, typographie commune, pictogrammes linéaires. Offres et Nos réalisations affichent les nouveaux sujets (IA, EPI, rénovation énergétique, utilisation PAC). Email et téléphone renseignés ; lien Cal.com et informations légales attendus.

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

### V. Vidéos de démonstration — Opus, high (poste Windows)

Dernière consigne : préparer les quatre nouveaux sujets définis dans BRIEF et CONTENU §9, avec la palette verte. Les clés techniques restent inchangées. Les informations ci-dessous documentent le lot V2 déjà rendu sous Windows, avant cette demande ; elles ne valident pas la livraison des anciens films sous les nouveaux titres.
Production créative avec HyperFrames (skill `hyperframes`) et une scène three.js par film. La V1 (à plat, effet diaporama) a été rejetée le 2026-10-29.
- Quatre films de 26 à 28 s, une par offre, en 16:9, niveau showreel : vraie 3D, caméra en mouvement, très peu de texte, même moule (nuages, plongée, trois chapitres, œuf de lumière et logo). Détail dans `videos/SPEC.md`.
  1. **Former** (`former-electricite`) : tension, intensité, puissance.
  2. **Sécuriser** (`securiser-usine`) : accueil sécurité d'un nouvel arrivant en usine.
  3. **Expliquer et vendre** (`expliquer-pac`) : pompe à chaleur air/eau, cycle, installation, réglages.
  4. **Accompagner** (`accompagner-solaire`) : régler et suivre une installation solaire.
- Texte à l'écran, sans voix off. Aucune API ni service payant, aucun compte à créer.
- Sources dans `videos/<nom>/`, rendus dans `videos/out/<nom>.mp4` (H.264, faststart, ≤ 6 Mo chacun), affiche `videos/out/<nom>.webp` (1280×720) et planche `videos/out/planche.webp`.
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
