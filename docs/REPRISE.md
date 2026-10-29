# Reprise du projet — 2026-10-29

Dernière mise à jour (thème 0.2.3) : les huit boutons de rendez-vous/contact utilisent le lien Calendly fourni : https://calendly.com/rafael-delbecq/appel-de-decouverte-phaness. Module réel vérifié sur ordinateur et mobile, chargement au clic uniquement, fermeture et retour du focus, lien d’ouverture séparée et fonctionnement sans JavaScript. Le service Cal.com a été remplacé par Calendly. Email corrigé : contact@phanes.fr.

Révision précédente (thème 0.2.2) : espacements réduits, titres et textes harmonisés, pictogrammes linéaires, ancres du menu rapprochées du contenu. Nouveau titre des offres : « Des vidéos pour vos équipes et vos clients ». « Nos réalisations » ne conserve que son titre et les films, avec les nouveaux sujets : introduction IA, EPI chantier, rénovation énergétique et utilisation d’une pompe à chaleur. Les coordonnées sont renseignées : contact@phanes.fr et 07 69 86 01 61.

La vidéo de présentation et les démonstrations restent à fournir depuis l’autre PC. Les clés de fichiers historiques sont conservées : voir le tableau de correspondance dans `docs/CONTENU.md` §9 avant livraison des nouveaux rendus.

À lire : `CLAUDE.md`, `docs/BRIEF.md`, `docs/PLAN.md`, puis `docs/RECETTE.md`.

## État par étape

| Étape | État | Restant |
|---|---|---|
| 1. Fondations | Fait | — |
| 2. Textes | Fait ; légendes corrigées | Intitulés et nouveaux sujets validés par la demande utilisateur ; aucune mention voix off/sous-titres ou nombre de retours affichée. |
| 3. Héros vidéo | Cadre prêt, film attendu | Définir PHANESS_PRESENTATION_VIDEO_URL et éventuellement PHANESS_PRESENTATION_POSTER_URL. Le prototype WebGL reste archivé, sans chargement sur le site. |
| 4. Mise en page | Fait | Captures de contrôle à 1440 et 390 px dans docs/captures/recette-2026-10-29/. |
| 5. Finitions | Code vérifié | Calendly réel affiché et huit liens vérifiés. Email et téléphone renseignés ; informations légales encore attendues. |
| V2. Vidéos | WIP sur le poste Windows, anciens rendus récupérés dans l’historique | Quatre anciens films sont rendus sur Windows, mais restent sur les anciens sujets et la DA bleu nuit/vermillon. Adapter aux nouveaux sujets et à la palette verte sur l’autre PC ; ne pas publier les anciens médias sous les nouveaux titres. Aucun rendu ou source vidéo modifié sur ce Mac. |
| 6a. Recette | Validée hors médias et données manquantes | Mesures antérieures à la révision verte : mobile 98/100/100/100, ordinateur 100/100/100/100. Révision contrôlée visuellement à 390 et 1440 px ; refaire Lighthouse avec les médias et sur IONOS. |
| 6b. Corrections | Fait pour le périmètre vérifié | Menu clavier, focus réservation, compilation du héros, pages légales et JSON-LD corrigés. |
| 7. Mise en ligne | Code et procédure prêts | 10 tests paquetage réussis ; ZIP de contrôle sans médias installé sur WordPress vierge. Vrai ZIP et installation finale attendent les médias et informations légales. |

## Informations à recevoir

- Calendly, email et téléphone sont déjà renseignés. La garantie de transfert applicable au contrat Calendly et les autres champs légaux restent à compléter par l’entreprise.
- Raison sociale, forme juridique, capital, siège, immatriculation/SIREN, TVA si applicable et responsable de publication.
- Informations propres au traitement des données à compléter dans les pages légales : contacts, durées et garanties applicables.
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
2. Renseigner les informations validées et vérifier le parcours Calendly sur le domaine final.
3. Exécuter synchronisation, tests et build ; tester le ZIP final dans un WordPress vierge.
4. Suivre le guide IONOS, puis refaire la recette sur le domaine HTTPS.

## État transmis par le poste vidéo

Le commit `5be9afb`, intégré par `a2dded9`, contient les quatre sources V2 et les documents vidéo. Les quatre MP4 et affiches sont non versionnés et restent sur Windows (PAC 5,14 Mo ; usine 4,70 Mo ; solaire 5,88 Mo ; électricité 5,55 Mo). Le poste vidéo signalait une correction du plan Suivi solaire encore à rendre, une planche contact à produire, le nettoyage V1, la synchronisation et le ZIP non faits. Ces tâches décrivent l’ancien lot : les derniers sujets IA/EPI/rénovation/PAC et la palette verte priment avant la livraison finale. Consulter `videos/REVIEW.md` pour le détail historique.

Les tests exécutés sur Windows signalaient 9/12 réussites, les trois échecs provenant de la création de liens symboliques sans droits (`EPERM`). Sur ce Mac, les 12 tests de la révision courante passent. Ne pas modifier la sécurité de Windows pour ce constat dans cette session.
