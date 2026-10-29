# Phaness — Brief du site

> Source de vérité pour toutes les sessions. Toute décision qui change ce brief s'écrit ici.

## Le projet

- Studio B2B de vidéos explicatives et tutoriels en motion design (style 3D).
- Site **vitrine one-page**, en **français**, sur **phaness.fr** (domaine et hébergement chez IONOS).
- Entreprise réelle : portée juridiquement par l'entreprise existante d'un associé (nom différent de Phaness). Les mentions légales seront à son nom.
- Les modifications après livraison se font par l'équipe, avec Claude Code : le code est la source, pas l'interface WordPress.

## Positionnement et ton

- Accroche : **« Donnez vie à vos idées en vidéo »**
- Promesse : « Le pouvoir de la vidéo, au service de votre entreprise. » Des vidéos conçues pour expliquer les produits, transmettre les savoir-faire et présenter les solutions.
- Trois bénéfices validés par l'image utilisateur du 2026-10-29 : **Comprendre en images**, **Un budget maîtrisé**, **Du sur-mesure, avec une méthode**. Pictogrammes linéaires verts et arrondis : ampoule, pièces de monnaie, réglages. Cartes blanches arrondies, titre et introduction centrés. Texte exact dans `docs/CONTENU.md` §3.
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
- **Style :** sobre et clair, grands arrondis et ombres douces. Espacements resserrés et échelle typographique commune : titres de section 52 px sur ordinateur / 32 px sur mobile, titres de cartes 24 / 22 px et texte courant 17 px. Les sections ont 72 px de padding vertical sur ordinateur et 48 px sur mobile. Le héros présente le texte à gauche et un cadre vidéo à droite, empilés sur mobile.
- **Motion :** apparitions au défilement et micro-interactions conservées. Le shader WebGL n'est plus chargé. Vidéo de présentation avec commandes natives, sans lecture automatique ; respect de `prefers-reduced-motion`.

## Structure de la one-page

1. **En-tête fixe :** « phaness », ancres vers les sections, bouton « Prendre rendez-vous ».
2. **Héros :** surtitre gris « Studio vidéo pour les entreprises » en majuscules, titre gras « Donnez vie à vos idées en vidéo », sous-titre fourni par l'utilisateur, deux appels à l'action et emplacement de la vidéo de présentation.
3. **Bénéfices :** « Le pouvoir de la vidéo, au service de votre entreprise. », introduction et trois cartes conformes à la référence utilisateur.
4. **Nos vidéos :** titre « Des vidéos pour vos équipes et vos clients », les quatre offres et les mêmes exemples que dans Nos réalisations.
5. **Secteurs :** onglets Formation · BTP et industrie (sécurité, HSE) · Énergie et rénovation · Fabricants et installateurs. L’onglet Énergie présente une vue d’ensemble du solaire et de la rénovation et leurs bénéfices pour le visiteur (consommation, budget, impact environnemental), avec des images simples. Il ne propose ni tutoriel ni explication détaillée des composants ou de leur fonctionnement. Bouton : « Parlons de vos solutions ».
6. **Nos réalisations :** titre seul, grille sans introduction, légendes descriptives ni texte sous la grille. Les films restent des démonstrations, identifiées comme telles. Derniers sujets demandés :
   - Former : introduction à l’intelligence artificielle (`former-electricite`).
   - Sécuriser : équipements de protection individuelle sur un chantier (`securiser-usine`).
   - Expliquer et vendre : rénovation énergétique (`expliquer-pac`).
   - Accompagner : utilisation d’une pompe à chaleur (`accompagner-solaire`).

   Les identifiants entre parenthèses sont les clés techniques historiques, conservées pour le poste de rendu. Les sujets précédents sont remplacés dans le brief : ne pas publier leurs anciens rendus sous les nouveaux titres. La création et l’adaptation des films restent réservées à l’autre PC.
   État du poste Windows récupéré dans `a2dded9` : quatre films 3D de 26 à 28 s ont été rendus avec HyperFrames/three.js sur les anciens sujets (électricité, usine, PAC explicative et solaire). Ils utilisent encore la DA bleu nuit/vermillon et un œuf final. Les détails historiques restent dans `videos/SPEC.md` et `videos/REVIEW.md`. Ces rendus ne doivent pas être livrés sous les nouveaux titres ; le poste vidéo devra adapter les sujets et la palette aux dernières demandes.
7. **Contact :** prise de rendez-vous, `contact@phanes.fr`, `07 69 86 01 61` (coordonnées fournies par l'utilisateur). La zone d'intervention est supprimée. Le lien de rendez-vous est https://calendly.com/rafael-delbecq/appel-de-decouverte-phaness.
8. **Pied de page :** mentions légales et politique de confidentialité. Informations légales `[À FOURNIR]`.

Pas de FAQ (décision du 2026-10-29).

Décisions issues des étapes 1 à 3 :
- Les liens de navigation alignent le début du contenu à environ 16 px sous le menu fixe, avec compensation de la barre WordPress.
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
- **Prise de rendez-vous :** Calendly, lien fourni par l’utilisateur : https://calendly.com/rafael-delbecq/appel-de-decouverte-phaness. Les huit boutons de rendez-vous/contact partagent ce lien. Fenêtre avec iframe chargée au clic, fermeture avec retour du focus et lien d’ouverture séparée. Sans JavaScript, navigation directe vers Calendly.
- **Aucun outil de mesure d’audience installé par Phaness.** Les choix de cookies Calendly restent disponibles dans son module, chargé après un clic. Polices auto-hébergées.
- **Local :** WordPress Playground CLI (Node ≥ 20.18, sans PHP, MySQL ni Docker), tout sur D:.
- **Versionnement :** Git et dépôt GitHub privé.

## Objectifs qualité

Périmètre confirmé le 2026-10-29 : terminer et vérifier le site sans créer, modifier ou rendre les vidéos sur ce Mac. Les rendus V2 sont produits sur un autre PC. Les mesures locales sans médias doivent être refaites avec les films et sur IONOS avant publication.

- Lighthouse mobile ≥ 95 en performance, accessibilité, bonnes pratiques et SEO.
- JavaScript du thème < 30 Ko compressé (hors service Calendly). LCP < 2 s en 4G.
- Responsive de 360 px à 1920 px. Navigation au clavier. WCAG AA.
- SEO de base : titre, meta description, Open Graph, données structurées `Organization`.
