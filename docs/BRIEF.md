# Phaness — Brief du site

> Source de vérité pour toutes les sessions. Toute décision qui change ce brief s'écrit ici.

## Le projet

- Studio B2B de vidéos explicatives et tutoriels en motion design (style 3D).
- Site **vitrine one-page**, en **français**, sur **phaness.fr** (domaine et hébergement chez IONOS).
- Entreprise réelle : portée juridiquement par l'entreprise existante d'un associé (nom différent de Phaness). Les mentions légales seront à son nom.
- Les modifications après livraison se font par l'équipe, avec Claude Code : le code est la source, pas l'interface WordPress.

## Positionnement et ton

- Accroche : **« Donnez vie à vos idées en vidéo »**
- Promesse : rendre la production de vidéos explicatives accessible et facile à renouveler. Pas « des vidéos moins chères ».
- Trois piliers : **Clarté** (rendre compréhensible ce qui est complexe), **Accessibilité** (vidéos pro sans les coûts d'une production audiovisuelle classique), **Standardisation** (structures et méthodes réutilisées pour livrer plus vite).
- Quatre offres : **Former** (capsules pédagogiques), **Sécuriser** (procédures, modes opératoires, sensibilisation sécurité / HSE), **Expliquer et vendre** (produits et solutions techniques), **Accompagner** (tutoriels d'installation, d'utilisation, d'entretien).
- Différence : formats standardisés, logique de catalogue (5, 10, 20 vidéos par client), processus simplifié (brief, supports, script, production, retours limités, livraison).
- Ton : vouvoiement, professionnel, rassurant, sans jargon.
- Pas de tarifs affichés : « Devis personnalisé selon vos besoins ». Les tarifs viendront plus tard.
- Ni clients, ni témoignages, ni page À propos, ni blog, ni vente en ligne.

## Le nom

Phanès est le dieu primordial de la cosmogonie orphique. Il naît de l'œuf cosmique et sa lumière rend le monde visible. Son nom vient du grec *phainô* / *phainein* : « faire apparaître, mettre en lumière, révéler ». On l'appelle aussi *Protogonos*, « le premier-né ».

Lien avec la marque : Phaness fait apparaître et rend visible ce qui était complexe ou caché (un produit, une procédure, un savoir-faire).

Décision du 2026-10-29 : le mythe reste une origine du nom interne. L'œuf et la section « Pourquoi Phaness ? » sont retirés du site ; le héros est réservé à la vidéo de présentation de l'équipe.

## Direction artistique

- **Fond clair, palette verte** (demande utilisateur du 2026-10-29). Texte vert très sombre, neutres gris et fonds légèrement teintés ; accents vert forêt.

  | Token | Valeur | Usage |
  |---|---|---|
  | `night` | `#14251D` | texte principal |
  | `night-soft` | `#52615A` | texte secondaire |
  | `cloud` | `#F5F7F4` | fond de page |
  | `white` | `#FFFFFF` | cartes et surfaces |
  | `mist` | `#DDE5DF` | bordures |
  | `accent` | `#247855` | accents verts, contraste 5,39:1 sur blanc |
  | `accent-deep` | `#176447` | boutons et liens, contraste 7,12:1 sur blanc |

- **Typographie :** Geist (licence OFL), auto-hébergée. Le logo est simplement le mot « phaness » écrit dans la police du site, en minuscules (validé).
- **Style :** sobre et clair, grands arrondis, ombres douces, beaucoup d'espace. Le héros présente le texte à gauche et un cadre vidéo à droite, empilés sur mobile.
- **Motion :** apparitions au défilement et micro-interactions conservées. Le shader WebGL n'est plus chargé. Vidéo de présentation avec commandes natives, sans lecture automatique ; respect de `prefers-reduced-motion`.

## Structure de la one-page

1. **En-tête fixe :** « phaness », ancres vers les sections, bouton « Prendre rendez-vous ».
2. **Héros :** surtitre gris « Studio vidéo pour les entreprises » en majuscules, titre gras « Donnez vie à vos idées en vidéo », sous-titre fourni par l'utilisateur, deux appels à l'action et emplacement de la vidéo de présentation.
3. **Promesse :** les trois piliers.
4. **Nos vidéos :** les quatre offres, chacune avec un exemple concret.
5. **Secteurs :** onglets Formation · BTP et industrie (sécurité, HSE) · Énergie et rénovation (chauffe-eau, pompes à chaleur, solaire) · Fabricants et installateurs. Un message propre à chaque cible.
6. **Réalisations :** quatre vidéos de démonstration, une par offre, produites avec HyperFrames (étape V2). Leur but est de montrer le niveau technique du studio en motion design : mouvements de caméra, 3D, rotations, zooms, une DA poussée. Ce ne sont pas des diapositives animées.
   - `expliquer-pac` : le fonctionnement, l'installation et les réglages d'une pompe à chaleur.
   - `securiser-usine` : les consignes de sécurité d'une usine, pour l'accueil d'un nouvel arrivant.
   - `accompagner-solaire` : un tutoriel de réglage et d'utilisation d'une installation solaire.
   - `former-electricite` : une capsule de formation sur la tension, l'intensité et la puissance.

   La première version (V1, à plat, trop de texte) a été rejetée le 2026-10-29.
7. **Contact :** prise de rendez-vous, email, téléphone. La zone d'intervention est supprimée. Les coordonnées seront fournies par l'équipe à la fin : `[À FOURNIR]` d'ici là.
8. **Pied de page :** mentions légales et politique de confidentialité. Informations légales `[À FOURNIR]`.

Pas de FAQ (décision du 2026-10-29).

Décisions issues des étapes 1 à 3 :
- Le menu a quatre ancres : `#videos`, `#secteurs`, `#realisations`, `#contact`. Le lien Méthode est supprimé avec sa section.
- Les pages légales sont à `/mentions-legales/` et `/politique-de-confidentialite/`.
- Les exemples des quatre offres renvoient aux quatre démonstrations de Réalisations.
- Aucun délai de production n'est annoncé.
- Le héros et la promesse partagent le fond `#F5F7F4`.
- En local, WordPress tourne sur http://127.0.0.1:9400 (`npm run dev`, voir `CLAUDE.md`). Le dépôt est https://github.com/abouchet109-del/phaness (privé).

## Stack

- **WordPress** avec un **thème bloc sur mesure** (`phaness`). Pas de constructeur de page ni d'extension obligatoire. Tout est gratuit.
- **Le contenu de la one-page vit dans le thème** (`templates/front-page.html` et des patterns). Mettre en ligne revient donc à téléverser un zip du thème, sans base de données à migrer.
- `theme.json` porte les tokens (couleurs, typo, espacements).
- CSS et JavaScript natifs (modules ES), sans bundler au départ.
- **Héros :** lecteur vidéo HTML natif configuré par `PHANESS_PRESENTATION_VIDEO_URL` et, éventuellement, `PHANESS_PRESENTATION_POSTER_URL`. En leur absence, un cadre de présentation est affiché. Le prototype WebGL est conservé en archive mais n'est plus chargé par le site.
- **Vidéos de démonstration :** sources HyperFrames (HTML) dans `videos/`, rendus MP4 optimisés pour le web dans `videos/out/`, non versionnés : on les régénère à partir des sources.
- **Animations :** IntersectionObserver et transitions CSS. GSAP (gratuit) seulement si une section le justifie.
- **Prise de rendez-vous :** Cal.com (offre gratuite), chargé au clic, donc aucun cookie tiers avant une action du visiteur.
- **Aucun outil de mesure d'audience,** donc pas de bandeau cookies. Polices auto-hébergées (RGPD).
- **Local :** WordPress Playground CLI (Node ≥ 20.18, sans PHP, MySQL ni Docker), tout sur D:.
- **Versionnement :** Git et dépôt GitHub privé.

## Objectifs qualité

Périmètre confirmé le 2026-10-29 : terminer et vérifier le site sans créer, modifier ou rendre les vidéos sur ce Mac. Les rendus V2 sont produits sur un autre PC. Les mesures locales sans médias doivent être refaites avec les films et sur IONOS avant publication.

- Lighthouse mobile ≥ 95 en performance, accessibilité, bonnes pratiques et SEO.
- JavaScript du thème < 30 Ko compressé (hors widget Cal.com). LCP < 2 s en 4G.
- Responsive de 360 px à 1920 px. Navigation au clavier. WCAG AA.
- SEO de base : titre, meta description, Open Graph, données structurées `Organization`.
