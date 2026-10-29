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
9. **Réalisations :** quatre vidéos de démonstration, une par offre, produites avec HyperFrames (étape V2). Leur but est de montrer le niveau technique du studio en motion design : mouvements de caméra, 3D, rotations, zooms, une DA poussée. Ce ne sont pas des diapositives animées.
   - `expliquer-pac` : le fonctionnement, l'installation et les réglages d'une pompe à chaleur.
   - `securiser-usine` : les consignes de sécurité d'une usine, pour l'accueil d'un nouvel arrivant.
   - `accompagner-solaire` : un tutoriel de réglage et d'utilisation d'une installation solaire.
   - `former-electricite` : une capsule de formation sur la tension, l'intensité et la puissance.

   La première version (V1, à plat, trop de texte) a été rejetée le 2026-10-29.
   V2 (2026-10-29) : une scène 3D three.js par film, rendue par HyperFrames, 26 à 28 s, muette. Moule commun : mer de nuages avec une lumière vermillon sous une vallée, plongée à travers les nuages, trois chapitres d'un mot avec une à trois étiquettes, remontée, puis l'œuf de lumière qui sort des nuages et le logo « phaness » dessous. Ciel bleu vers bande chaude, sujets en argile bleu nuit, blanc et vermillon. Détail dans `videos/SPEC.md`.
10. **Contact :** prise de rendez-vous, email, téléphone. Les coordonnées seront fournies par l'équipe à la fin : `[À FOURNIR]` d'ici là.
11. **Pied de page :** mentions légales et politique de confidentialité. Informations légales `[À FOURNIR]`.

Pas de FAQ (décision du 2026-10-29).

Décisions issues des étapes 1 à 3 :
- Le menu a cinq ancres : `#videos`, `#secteurs`, `#methode`, `#realisations`, `#contact`. Promesse, Notre différence et Pourquoi Phaness ? n'ont pas d'ancre.
- Les pages légales sont à `/mentions-legales/` et `/politique-de-confidentialite/`.
- Les exemples des quatre offres renvoient aux quatre démonstrations de Réalisations.
- Aucun délai de production n'est annoncé.
- Le bas du héros se fond dans `#F5F7FB` : la section qui le suit doit avoir ce fond.
- En local, WordPress tourne sur http://127.0.0.1:9400 (`npm run dev`, voir `CLAUDE.md`). Le dépôt est https://github.com/abouchet109-del/phaness (privé).

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

Périmètre confirmé le 2026-10-29 : terminer et vérifier le site sans créer, modifier ou rendre les vidéos sur ce Mac. Les rendus V2 sont produits sur un autre PC. Les mesures locales sans médias doivent être refaites avec les films et sur IONOS avant publication.

- Lighthouse mobile ≥ 95 en performance, accessibilité, bonnes pratiques et SEO.
- JavaScript du thème < 30 Ko compressé (hors widget Cal.com). LCP < 2 s en 4G.
- Responsive de 360 px à 1920 px. Navigation au clavier. WCAG AA.
- SEO de base : titre, meta description, Open Graph, données structurées `Organization`.
