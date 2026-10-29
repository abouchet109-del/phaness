# Recette locale — 2026-10-29

## Nouvelle section bénéfices — thème 0.2.1

La section « La vidéo explicative, enfin accessible » est remplacée par le titre, l’introduction et les trois cartes de l’image fournie par l’utilisateur. Les illustrations sont trois SVG décoratifs avec texte alternatif vide : ampoule, pile de disques et engrenage. Leur présence est obligatoire dans le build. Les textes restent en HTML, sélectionnables et accessibles.

Contrôles à 1440, 768 et 390 px : textes exacts, trois illustrations chargées, aucun débordement horizontal, aucune erreur JavaScript ni ressource HTTP en erreur. PHP 8.3 : 17 fichiers valides ; `npm test` : 12 tests réussis. Captures de section [ordinateur](captures/pouvoir-video-2026-10-29/section-1440.png), [tablette](captures/pouvoir-video-2026-10-29/section-768.png), [mobile](captures/pouvoir-video-2026-10-29/section-390.png) et [résultats](captures/pouvoir-video-2026-10-29/checks.json). Les barres de navigation fixes sont masquées uniquement lors de la capture isolée de la section. Aucun nouvel audit Lighthouse ; les scores historiques plus bas ne concernent pas cette révision.

## Révision verte — thème 0.2.0

Nouvelle accroche, surtitre gris en majuscules, texte utilisateur, palette vert forêt et cadre de vidéo de présentation à la place du héros WebGL. Méthode, Notre différence et Pourquoi Phaness ? ne sont plus affichées ; le lien de menu Méthode et la zone d'intervention sont supprimés. Promesse, offres, secteurs et réalisations sont conservés.

Contrôle sur le serveur de développement `9400`, connecté à l'administration : captures [1440 px](captures/vert-2026-10-29/desktop-1440.png) et [390 px](captures/vert-2026-10-29/mobile-390.png), pas de débordement horizontal, menu mobile accessible au clavier, toutes les ancres restantes résolues, six titres de niveau 1/2 attendus, aucun canvas ni œuf, aucune erreur ou alerte dans la console. Les styles calculés confirment le bouton vert `#176447` et le fond `#F5F7F4`.

Contrastes calculés : texte principal/fond 14,86:1, secondaire/fond 6,06:1, bouton/blanc 7,12:1 et accent/blanc 5,39:1. Syntaxe PHP 8.3 des 17 fichiers vérifiée ; `npm test` : 12 tests réussis, dont les deux régressions du prototype WebGL archivé. Le site ne charge plus ce prototype. Favicon et Open Graph remplacés par une identité vidéo verte ; PNG de partage contrôlé à 1200 × 630.

La vraie vidéo de présentation reste à fournir. Le lecteur HTML natif est prêt via `PHANESS_PRESENTATION_VIDEO_URL`, avec affiche facultative, sans lecture automatique ni préchargement du film. Aucun fichier vidéo n'a été créé ou modifié. Lighthouse n'a pas été relancé pour cette révision : **tous les scores ci-dessous concernent la version antérieure** et restent des traces de contrôle historiques.

## Recette précédant la révision verte

Le périmètre sans vidéos est vérifié. Les rendus V2 sont gérés sur un autre PC, conformément à la demande de l'utilisateur. Aucun fichier de `videos/` n'a été modifié.

## Environnement et résultats Lighthouse

WordPress 7.1.4, PHP 8.3, Node 24.14.0, Chromium 136.0.7103.25 et Lighthouse 13.6.0. Instance Playground vierge sur le port `9401`, session anonyme, thème monté depuis le dépôt. Profil mobile Lighthouse par défaut ; profil ordinateur officiel `desktop-config`, viewport 1440 × 900. Les démonstrations utilisent les placeholders existants, sans MP4 ni affiche.

| Mesure | Mobile | Ordinateur |
|---|---:|---:|
| Performance | 98 | 100 |
| Accessibilité | 100 | 100 |
| Bonnes pratiques | 100 | 100 |
| SEO | 100 | 100 |
| FCP | 1,9 s | 0,5 s |
| LCP | 1,9 s | 0,5 s |
| Temps de blocage total | 40 ms | 0 ms |
| Décalage de mise en page (CLS) | 0 | 0,01 |

Le premier audit mobile donnait 72 en performance et 1 200 ms de blocage. La compilation asynchrone du shader, lorsque `KHR_parallel_shader_compile` est disponible, affiche le repli CSS pendant l'attente et ramène ce blocage à 40 ms. Le shader et la direction artistique sont conservés. Les deux modules JavaScript totalisent moins de 8 Ko gzip, pour un budget de 30 Ko.

Rapports détaillés : [mobile](audits/2026-10-29/lighthouse-mobile.html), [ordinateur](audits/2026-10-29/lighthouse-desktop.html). Résumés et paramètres : [mobile JSON](audits/2026-10-29/lighthouse-mobile.json), [ordinateur JSON](audits/2026-10-29/lighthouse-desktop.json).

Ces mesures locales ne certifient pas les performances sur IONOS. Refaire les audits sur le domaine HTTPS après ajout des médias, des coordonnées et du vrai lien Cal.com. La latence et la compression du serveur de développement diffèrent de celles de l'hébergement final. Le profil mobile est une simulation Lighthouse, pas une mesure terrain sur téléphone.

## Contrôles fonctionnels

| Contrôle | Résultat |
|---|---|
| Largeurs 360, 390, 768, 1024, 1280, 1440 et 1920 px | Aucun débordement horizontal après stabilisation de la mise en page. |
| Menu mobile | Entrée au clavier dans le premier lien, fermeture par Échap et retour au bouton ; fermeture après navigation ; focus préservé lors du passage ordinateur → mobile. |
| Onglets Secteurs | Flèches, Home et End ; retour circulaire ; un seul arrêt de tabulation ; panneau associé et aria-selected synchronisés. |
| Mouvement réduit | Émulation activée : défilement sans animation, sections visibles sans apparition ; test ciblé du héros sans boucle d'animation. |
| Replis | Contenu principal visible sans JavaScript ; menu et visuel CSS fonctionnels sans WebGL ni IntersectionObserver. |
| Pages légales | Deux pages visibles avec un canonical unique ; contenu lié au thème ; contenu personnalisé préservé. |
| Contact non renseigné | Placeholders conservés ; aucun lien mailto: ou tel: vide ; aucun iframe de réservation. |
| Réseau et console | Aucune ressource HTTP en erreur, aucune exception JavaScript, aucun service externe chargé pendant le parcours sans réservation. |
| Liens internes | Toutes les ancres de la page d'accueil résolues. |

Les [32 vérifications navigateur](audits/2026-10-29/browser-results.json) et les captures [1440 px](captures/recette-2026-10-29/desktop-1440.png) / [390 px](captures/recette-2026-10-29/mobile-390.png) sont conservées.

## Installation et réservation

Un ZIP de contrôle, créé uniquement dans un dossier temporaire sans médias, a été installé et activé sur une seconde instance WordPress vierge (`9402`). Il ne s'agit pas du paquet de livraison, et il n'est pas conservé dans `dist/`.

Les [12 contrôles de cette installation](audits/2026-10-29/installed-results.json) passent : accueil, création des pages légales, liens email/téléphone, dialogue Cal.com au clic, paramètres d'intégration, dimensions mobiles, fermeture et retour du focus. L'adresse de réservation de test a été interceptée par le navigateur et remplacée par une page locale ; aucun rendez-vous réel n'a été créé et aucun compte n'a été utilisé. Le vrai service et ses éventuelles restrictions d'intégration restent à tester avec l'URL de l'équipe.

## Code et paquetage

- Syntaxe PHP 8.3 : 17 fichiers valides. Syntaxe JavaScript et git diff --check : valides.
- Tests ciblés : absence de WebGL/IntersectionObserver, compilation GPU asynchrone, mouvement réduit, transitions menu/réservation, mise à jour des patterns légaux, migration exacte, préservation du contenu personnalisé et idempotence.
- `npm test` : 12 tests réussis, dont deux régressions du héros et les dix cas de paquetage.
- `npm run test:packaging` : 10 tests réussis, dans des copies temporaires du thème. Les octets synthétiques servent uniquement à vérifier copie et archive ; ils ne constituent pas des vidéos et ne sont jamais placés dans le projet.
- ZIP : fichiers obligatoires et médias non vides, catalogue des quatre films, erreurs de synchronisation et suppression d'archive périmée ; répertoire central, CRC, contenu et extraction vérifiés avec un lecteur indépendant.
- Le CRC32 du build n'utilise pas l'API récente de Node : le script conserve la compatibilité annoncée avec Node ≥ 20.18. Les tests de cette session ont été exécutés sous Node 24, pas sous Node 20.
- Le build réel échoue comme attendu en l'absence de `videos/out/`. Aucun ZIP final n'a été généré.

## Refaire les vérifications

```bash
npm run test:packaging
npm test
npm run dev:audit
```

Sur `http://127.0.0.1:9401/`, lancer Lighthouse avec les profils mobile et ordinateur, depuis une session anonyme. Le blueprint d'audit est distinct du serveur de développement connecté à l'administration. Refaire ensuite le parcours clavier, le contrôle à 390/1440 px et l'émulation du mouvement réduit.

## Restant avant publication

1. Recevoir les quatre MP4 et leurs affiches WebP, puis vérifier lecture, poids et contenu des films.
2. Renseigner email, téléphone, URL Cal.com et informations légales ; confirmer nombre de retours, voix off et sous-titres.
3. Construire le vrai ZIP, l'installer sur une instance vierge et contrôler les quatre films et la réservation réelle.
4. Installer sur IONOS, vérifier HTTPS et refaire les audits sur le site publié.
