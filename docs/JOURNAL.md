# Journal

## 2026-10-29
- **Cadrage (étape 0, Opus).** Questions sur le projet. Rédaction du brief (positionnement, DA bleu nuit / blanc / vermillon, 3D « dans les nuages », nom tiré du dieu Phanès), du plan par étapes et de `CLAUDE.md`. Décisions : one-page, aucun tarif, aucune FAQ, aucune page À propos, tout gratuit, contenu dans le thème.
- **Fondations (étape 1, Sonnet / medium).** Playground CLI (`npm run dev`), thème bloc `phaness`, polices Geist auto-hébergées, dépôt GitHub privé `abouchet109-del/phaness`. Commits `767224d`, `19cf38f`.
- **Textes (étape 2, Opus / medium).** `docs/CONTENU.md` : les 13 sections et les gabarits des pages légales. Commit `2f09be3`.
- **Héros WebGL (étape 3, Opus / high).** Un œuf nacré à lueur vermillon sur une mer de nuages, 12,4 Ko, 60 images/s sur Intel HD 630, avec repli CSS et mode mouvement réduit. Commit `a736b6a`.
- **Vidéos V1 (étape V, Opus / medium).** 4 démos HyperFrames de 21 à 25 s (Protéger-Alerter-Secourir, EPI, pompe à chaleur, radiateur). L'utilisateur les a rejetées : trop plates, effet diaporama. Sources gardées dans l'historique (`127fe61`).
- **Mise en page (étape 4, Opus / medium).** Toutes les sections en patterns, cartes Réalisations aux noms des vidéos V2. Commits jusqu'à `e2344a1`.
- **Vidéos V2 lancées (Opus / high).** 4 démos niveau showreel (`expliquer-pac`, `securiser-usine`, `accompagner-solaire`, `former-electricite`). Inspirations tirées de `yihui-dev/awesome-opus5-5-videos` (Haiku / low) dans `docs/INSPIRATIONS-VIDEO.md`.
- **Étapes 5 et 7 lancées** (Sonnet), en parallèle.
- **Arrêt sur la limite d'usage vers 14h.** Le travail inachevé est poussé en commits WIP (`19c65fd` pour l'étape 5, `80a4f06` pour l'étape 7, `32cab5e` pour les vidéos V2). La reprise est décrite dans `docs/REPRISE.md`.
- **Reprise locale (29/10/2026).** Avance rapide de `main` jusqu'au push `6a41035`. Lecture de `CLAUDE.md`, `AGENTS.md`, du brief, du plan et des documents de reprise/contenu/vidéos. Clones `avoid-ai-writing` et `awesome-opus5-5-videos` présents à côté du dépôt ; synthèse motion ajoutée auparavant dans `docs/INSPIRATIONS-VIDEO.md`.
- **Finitions (étape 5).** Onglets accessibles au clavier, apparitions au défilement et mouvement réduit, ouverture Cal.com uniquement au clic, liens de contact conditionnels, pages légales et métadonnées SEO/OG. Corrigé le lien d'offre Accompagner. Le visuel Open Graph reprend maintenant le titre du site au lieu du texte de prototype. Contrôle sur Playground frais (`9401`) : pages légales, onglets clavier, console et absence de débordement à 360/390/768/1280/1440/1920 px. Cal.com et mouvement réduit restent à valider avec l'URL et un navigateur d'émulation.
- **Recette (étape 6a/6b).** Rapport manuel dans `docs/RECETTE.md`. Lighthouse n'est pas disponible, donc l'étape 6a n'est pas déclarée terminée. Correctifs issus du contrôle appliqués ; recette complète encore ouverte.
- **Mise en ligne (étape 7).** Guide IONOS ajouté dans `docs/MISE-EN-LIGNE.md`. `scripts/build-zip.mjs` vérifié ; il refuse désormais une archive sans les quatre MP4 et affiches. Les rendus V2 manquent encore.
- **HyperFrames V2.** Dépendances locales installées dans `videos/`. Le contrôle HyperFrames du PAC passe le lint statique (0 erreur), mais le runtime n'a pas pu lancer Chrome : arrêt SIGABRT. Les trois autres films et les quatre rendus restent à produire et à vérifier.
