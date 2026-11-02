# Reprise du projet — 2026-10-29

**Le site est en ligne sur https://phaness.fr** (thème 0.2.5, activé le 2026-11-02 par l’autre session). La révision 0.2.7 fusionne les correctifs 0.2.6 (redirection HTTPS, adresse du lien Calendly) et les projets légaux/protections de cette session. Elle n’est pas encore déployée. Le ZIP Windows 0.2.6 est antérieur à ces protections : le reconstruire après pull, sans perdre les médias non versionnés.

Révision du 2 novembre 2026, thème 0.2.7 : les mentions légales et la politique de confidentialité sont rédigées en projets détaillés, visibles localement. Identité confirmée : Rafael DELBECQ ALMELA, entrepreneur individuel, SIREN 980 147 409, SIRET 980 147 409 00018, RCS Pontoise. Adresse fournie : 2 bis rue de Curzay, 95880 Enghien-les-Bains. Franchise de TVA retenue après réponse de l’utilisateur ; contact@phaness.fr, messagerie IONOS, réservation Calendly et Google Meet confirmés. Restent le type de compte Google/agenda, le contrat d’hébergement, les durées et pratiques réelles. Ne pas publier les champs incomplets.

Protections du thème : étape d’information avant chargement Calendly, URL restreinte au fournisseur, no-referrer, en-têtes HTTP ciblés, commentaires/pings fermés et avatars externes désactivés. L’API REST et les méthodes d’administration XML-RPC non liées aux pingbacks restent disponibles. Ces protections ne remplacent pas MFA, mises à jour, sauvegardes testées et configuration serveur ; rien n’a été changé dans les comptes externes. Voir SECURITE.md et RECETTE.md. Sur ce Mac, les MP4 et le vrai ZIP restent absents ; ne pas les rendre ici.

Dernière mise à jour (thème 0.2.5, 2026-11-02) : les films de Nos réalisations ont un bouton plein écran. Les cinq films V3 sont rendus en 1080p et branchés sur le site : le film de marque dans le héros, les quatre films métier dans Nos réalisations. Le ZIP de livraison se construit (24,3 Mo). Restent les informations légales, la relecture des films par l'utilisateur, le 4K si le budget le permet, puis la mise en ligne.

Révision précédente (thème 0.2.3) : les huit boutons de rendez-vous/contact utilisent le lien Calendly fourni : https://calendly.com/rafael-delbecq/appel-de-decouverte-phaness. Module réel vérifié sur ordinateur et mobile, chargement au clic uniquement, fermeture et retour du focus, lien d’ouverture séparée et fonctionnement sans JavaScript. Le service Cal.com a été remplacé par Calendly. Email corrigé : contact@phaness.fr.

Révision précédente (thème 0.2.2) : espacements réduits, titres et textes harmonisés, pictogrammes linéaires, ancres du menu rapprochées du contenu. Nouveau titre des offres : « Des vidéos pour vos équipes et vos clients ». « Nos réalisations » ne conserve que son titre et les films, avec les nouveaux sujets : introduction IA, EPI chantier, rénovation énergétique et utilisation d’une pompe à chaleur. Les coordonnées sont renseignées : contact@phaness.fr et 07 69 86 01 61.

Les MP4 ne sont pas versionnés : ils sont sur le PC Windows, dans `videos/out/` et dans `dist/phaness.zip`. Sur un autre poste, les récupérer à la main ou les refaire avec `sh videos/render-all.sh`.

À lire : `CLAUDE.md`, `docs/BRIEF.md`, `docs/PLAN.md`, puis `docs/RECETTE.md`.

## État par étape

| Étape | État | Restant |
|---|---|---|
| 1. Fondations | Fait | — |
| 2. Textes | Fait ; légendes corrigées | Intitulés et nouveaux sujets validés par la demande utilisateur ; aucune mention voix off/sous-titres ou nombre de retours affichée. |
| 3. Héros vidéo | Fait | Le film `presentation-phaness` du thème s'affiche ; `PHANESS_PRESENTATION_VIDEO_URL` reste possible pour en changer. Le prototype WebGL reste archivé, sans chargement sur le site. |
| 4. Mise en page | Fait | Captures de contrôle à 1440 et 390 px dans docs/captures/recette-2026-10-29/. |
| 5. Finitions | Code vérifié | Calendly réel affiché et huit liens vérifiés. Email et téléphone renseignés ; informations légales encore attendues. |
| V3. Vidéos | Validés par l'utilisateur | 1080p dans `videos/out/` pour le site, 4K dans `videos/out-4k/` (non versionnés, sur le PC Windows). Le 4K est partiel en netteté sur les plans à caméra inclinée : voir `videos/REVIEW.md`. |
| 6a. Recette | Validée hors médias et données manquantes | Mesures antérieures à la révision verte : mobile 98/100/100/100, ordinateur 100/100/100/100. Révision contrôlée visuellement à 390 et 1440 px ; refaire Lighthouse avec les médias et sur IONOS. |
| 6b. Corrections | Fait pour le périmètre vérifié | Menu clavier, focus réservation, compilation du héros, pages légales et JSON-LD corrigés. |
| 7. Mise en ligne | En ligne, thème 0.2.5 | Compléter les champs légaux restants, reconstruire le ZIP 0.2.7 sur le poste disposant des médias puis l’installer ; refaire Lighthouse (mesure 0.2.5 : mobile 90, ordinateur 98). Les anciens échecs Windows de liens symboliques sont documentés dans le journal. |

## Informations à recevoir

- Calendly, email et téléphone sont déjà renseignés. La garantie de transfert applicable au contrat Calendly et les autres champs légaux restent à compléter par l’entreprise.
- Identité EI, adresse, SIREN/SIRET/RCS, directeur de publication et TVA sont renseignés à partir des informations de l’utilisateur ; aucun capital n’est requis pour l’EI.
- Informations propres au traitement à compléter : type de compte Google/agenda, stockage et maintenance, durées, garanties et contrat d’hébergement.

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

## Avant la mise en ligne

1. Renseigner les informations légales validées.
2. Exécuter `npm run build:zip` ; tester le ZIP dans un WordPress vierge.
3. Suivre le guide IONOS, puis refaire la recette et Lighthouse sur le domaine HTTPS, avec les films.
