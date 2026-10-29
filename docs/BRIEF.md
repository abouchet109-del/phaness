# Phaness — Brief du site

> Source de vérité pour toutes les sessions. Toute décision qui change ce brief s'écrit ici.

## Le projet

- Studio B2B de vidéos explicatives et tutoriels en motion design (style 3D).
- Site **vitrine one-page**, en **français**, sur **phaness.fr** (domaine et hébergement chez IONOS).
- Entreprise réelle : portée juridiquement par l'entreprise existante d'un associé (nom différent de Phaness). Les mentions légales seront à son nom.
- Les modifications après livraison se font par l'équipe, avec Claude Code : le code est la source, pas l'interface WordPress.

## Positionnement et ton

- Accroche : **« Des vidéos explicatives professionnelles, simplement. »**
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

Usage sur le site : fil rouge visuel (une lumière qui émerge d'une forme organique dans les nuages) et une courte section « Pourquoi Phaness ? ».

## Direction artistique

- **Fond clair.** Bleu nuit pour le texte et les surfaces fortes, blanc « nuage » pour les fonds, accent **vermillon**.
- Tokens de départ (à valider à l'étape de mise en page) :

  | Token | Valeur | Usage |
  |---|---|---|
  | `night` | `#0B1633` | texte principal, surfaces sombres |
  | `night-soft` | `#4A5878` | texte secondaire |
  | `cloud` | `#F5F7FB` | fond de page |
  | `white` | `#FFFFFF` | cartes, surfaces |
  | `mist` | `#DCE3F0` | bordures, ombres douces |
  | `vermilion` | `#E34234` | accent décoratif, lumière (contraste 4,1:1 sur blanc : grands textes et éléments graphiques seulement) |
  | `vermilion-deep` | `#C8372A` | boutons et textes en vermillon (contraste 5,2:1 sur blanc, conforme AA) |

- **Typographie :** Geist (licence OFL), auto-hébergée. Le logo est simplement le mot « phaness » écrit dans la police du site, en minuscules (validé).
- **Style :** 3D organique, doux, « dans les nuages ». Formes sans arêtes, lumière diffuse, ombres très douces, grands arrondis, beaucoup d'espace.
- **Motion :** léger, mais il doit montrer le niveau technique. Un héros 3D en temps réel (WebGL), des apparitions au défilement, quelques micro-interactions. Respect de `prefers-reduced-motion`.

## Structure de la one-page

1. **En-tête fixe :** « phaness », ancres vers les sections, bouton « Prendre rendez-vous ».
2. **Héros :** accroche, sous-titre, appel à prendre rendez-vous, visuel 3D organique.
3. **Promesse :** les trois piliers.
4. **Nos vidéos :** les quatre offres, chacune avec un exemple concret.
5. **Secteurs :** onglets Formation · BTP et industrie (sécurité, HSE) · Énergie et rénovation (chauffe-eau, pompes à chaleur, solaire) · Fabricants et installateurs. Un message propre à chaque cible.
6. **Méthode :** les étapes de production, animées.
7. **Notre différence :** formats standardisés, logique de catalogue, processus simplifié, devis personnalisé.
8. **Pourquoi Phaness ?** Le mythe en trois phrases.
9. **Réalisations :** quatre vidéos de démonstration, une par offre, produites avec HyperFrames (étape V). L'équipe les remplacera ou les modifiera par la suite.
10. **Contact :** prise de rendez-vous, email, téléphone. Les coordonnées seront fournies par l'équipe à la fin : `[À FOURNIR]` d'ici là.
11. **Pied de page :** mentions légales et politique de confidentialité. Informations légales `[À FOURNIR]`.

Pas de FAQ (décision du 2026-10-29).

## Stack

- **WordPress** avec un **thème bloc sur mesure** (`phaness`). Pas de constructeur de page ni d'extension obligatoire. Tout est gratuit.
- **Le contenu de la one-page vit dans le thème** (`templates/front-page.html` et des patterns). Mettre en ligne revient donc à téléverser un zip du thème, sans base de données à migrer.
- `theme.json` porte les tokens (couleurs, typo, espacements).
- CSS et JavaScript natifs (modules ES), sans bundler au départ.
- **Héros :** shader WebGL natif, sans three.js, codé par nous (remplaçable plus tard par une boucle 3D de l'équipe). Image de repli, pause hors écran, résolution plafonnée.
- **Vidéos de démonstration :** sources HyperFrames (HTML) dans `videos/`, rendus MP4 optimisés pour le web dans `videos/out/`, non versionnés : on les régénère à partir des sources.
- **Animations :** IntersectionObserver et transitions CSS. GSAP (gratuit) seulement si une section le justifie.
- **Prise de rendez-vous :** Cal.com (offre gratuite), chargé au clic, donc aucun cookie tiers avant une action du visiteur.
- **Aucun outil de mesure d'audience,** donc pas de bandeau cookies. Polices auto-hébergées (RGPD).
- **Local :** WordPress Playground CLI (Node ≥ 20.18, sans PHP, MySQL ni Docker), tout sur D:.
- **Versionnement :** Git et dépôt GitHub privé.

## Objectifs qualité

- Lighthouse mobile ≥ 95 en performance, accessibilité, bonnes pratiques et SEO.
- JavaScript du thème < 30 Ko compressé (hors widget Cal.com). LCP < 2 s en 4G.
- Responsive de 360 px à 1920 px. Navigation au clavier. WCAG AA.
- SEO de base : titre, meta description, Open Graph, données structurées `Organization`.
