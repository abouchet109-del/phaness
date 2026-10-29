# Reprise du projet — 2026-10-29

Dernière révision demandée : nouvelle accroche, palette verte, suppression de Méthode / Notre différence / Pourquoi Phaness ? et de la zone d'intervention. Le héros WebGL n'est plus chargé ; un cadre attend la vidéo de présentation de l'équipe. Le code hors vidéos est vérifié localement. Les résultats sont dans `docs/RECETTE.md`. Le prochain travail demandé par l'utilisateur sera une session de modifications ; la production vidéo est réservée à un autre PC.

À lire : `CLAUDE.md`, `docs/BRIEF.md`, `docs/PLAN.md`, puis `docs/RECETTE.md`.

## État par étape

| Étape | État | Restant |
|---|---|---|
| 1. Fondations | Fait | — |
| 2. Textes | Fait ; légendes corrigées | Voix off et sous-titres à confirmer. Le nombre de retours n'est plus affiché avec le retrait de la section Méthode. |
| 3. Héros vidéo | Cadre prêt, film attendu | Définir PHANESS_PRESENTATION_VIDEO_URL et éventuellement PHANESS_PRESENTATION_POSTER_URL. Le prototype WebGL reste archivé, sans chargement sur le site. |
| 4. Mise en page | Fait | Captures de contrôle à 1440 et 390 px dans docs/captures/recette-2026-10-29/. |
| 5. Finitions | Code vérifié | Réservation testée avec page simulée ; contrôle du vrai Cal.com après réception du lien. Coordonnées et informations légales encore absentes. |
| V2. Vidéos | Hors périmètre de cette session | Gérées sur l'autre PC. Ne pas créer, modifier ou rendre les vidéos sur ce Mac. |
| 6a. Recette | Validée hors médias et données manquantes | Mesures antérieures à la révision verte : mobile 98/100/100/100, ordinateur 100/100/100/100. Révision contrôlée visuellement à 390 et 1440 px ; refaire Lighthouse avec les médias et sur IONOS. |
| 6b. Corrections | Fait pour le périmètre vérifié | Menu clavier, focus réservation, compilation du héros, pages légales et JSON-LD corrigés. |
| 7. Mise en ligne | Code et procédure prêts | 10 tests paquetage réussis ; ZIP de contrôle sans médias installé sur WordPress vierge. Vrai ZIP et installation finale attendent les médias et coordonnées. |

## Informations à recevoir

- Email, téléphone et lien Cal.com.
- Raison sociale, forme juridique, capital, siège, immatriculation/SIREN, TVA si applicable et responsable de publication.
- Informations propres au traitement des données à compléter dans les pages légales : contacts, durées et garanties applicables.
- Disponibilité de la voix off et des sous-titres.
- Vidéo de présentation et, si souhaité, son affiche.
- Les quatre MP4 et quatre affiches WebP, aux noms attendus par `theme/patterns/work.php`.

Les valeurs absentes restent `[À FOURNIR]` ou `[À CONFIRMER]`. Ne pas les inventer. Voir `docs/MISE-EN-LIGNE.md` pour leur emplacement.

## Commandes

```bash
npm install
npm run dev             # http://127.0.0.1:9400, connecté à l'administration
npm run dev:audit       # http://127.0.0.1:9401, session anonyme
npm test               # régressions du héros et du paquetage
npm run test:packaging  # fixtures temporaires ; aucun rendu dans le projet
npm run sync-videos     # après réception des rendus seulement
npm run build:zip       # refuse médias ou fichiers requis manquants
```

Node ≥ 20.18. Session vérifiée sous Node 24.14.0, PHP 8.3 et WordPress 7.1.4. Les dépendances d'audit ont été installées uniquement dans un dossier temporaire, sans installation globale.

## Après réception des médias

1. Les placer dans `videos/out/`, sans recréer les films sur ce Mac.
2. Renseigner les informations validées et vérifier Cal.com réel.
3. Exécuter synchronisation, tests et build ; tester le ZIP final dans un WordPress vierge.
4. Suivre le guide IONOS, puis refaire la recette sur le domaine HTTPS.
