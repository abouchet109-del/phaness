# Vidéos V3 : scripts et règles communes

Demande utilisateur du 2026-11-02. Ces cinq films remplacent les vidéos V2 (bleu nuit, vermillon, nuages, œuf), qui restent dans l'historique Git. Les scripts sont volontairement courts : le découpage par scène revient à la session de chaque film.

## Direction commune

- **Simple, sobre et pro.** Chaque film correspond à son script et pourrait être vendu tel quel à une entreprise. On veut un vrai niveau de motion design, sans démonstration gratuite : composition exigeante, animation fluide, transitions construites, détails graphiques cohérents.
- **Plus de nuages ni d'œuf,** ni aucun rappel du mythe de Phanès. Une seule DA pour les cinq films.
- **Palette du site** (`theme/theme.json`) : `#14251D` texte, `#52615A` secondaire, `#F5F7F4` fond, `#FFFFFF` surfaces, `#DDE5DF` bordures, `#247855` accent, `#176447` accent foncé. Des couleurs fonctionnelles peuvent s'y ajouter avec retenue quand le sujet l'exige (signalisation de chantier, par exemple). Police Geist. Logo : le mot « phaness » en minuscules.
- **Inspirations :** `docs/INSPIRATIONS-VIDEO.md`. Reprendre la construction par plans, les mouvements de caméra et l'enchaînement. Ne pas reprendre « couleur forte, gros texte partout » : la retenue demandée ici prime. Ne rien copier.
- **Textes à l'écran :** en français, peu nombreux, vouvoiement, passés au skill `avoid-ai-writing`. Aucun chiffre, client, marque réelle ou promesse inventés.

## Format

- **Validation en 1080p :** 1920×1080, 25 i/s, muet. Le rendu 4K viendra après coup, si le budget le permet : ne rien coder qui en empêche le passage (pas de tailles en pixels figées dans des images matricielles).
- Livraison web : MP4 H.264 par `videos/render-all.sh`, plus une affiche WebP.

## Organisation

- Le film de marque crée le système commun dans `videos/_system/`. Les quatre autres films s'appuient dessus et ne le modifient pas : un besoin commun se signale à la session coordinatrice.
- Chaque session ne touche qu'au dossier de son film et ne rend qu'avec `render-all.sh`, qui passe les rendus un par un.
- Commits locaux de ses seuls fichiers. **Ni pull ni push :** la session coordinatrice s'en charge et tient `docs/BRIEF.md`, `docs/PLAN.md`, `docs/JOURNAL.md`, `docs/REPRISE.md` et les branchements dans `theme/`.
- Le périmètre « ne pas produire de vidéos sur ce Mac » de `CLAUDE.md` ne concerne pas ce PC Windows, qui est le poste de rendu.

## Les cinq films

| Dossier | Durée | Emplacement sur le site | Titre affiché |
|---|---|---|---|
| `presentation-phaness` | 40 s | héros | Phaness en vidéo |
| `former-electricite` | 30 s | Former | Introduction à l'intelligence artificielle |
| `securiser-usine` | 30 s | Sécuriser | Les équipements de protection individuelle sur un chantier |
| `expliquer-pac` | 30 s | Expliquer et vendre | Comprendre la rénovation énergétique |
| `accompagner-solaire` | 30 s | Accompagner | Utiliser une pompe à chaleur |

Les noms de dossier des quatre films métier sont hérités : ils restent pour ne pas toucher au code du site, même si le sujet a changé. Leur contenu V2 est à remplacer entièrement.

### `presentation-phaness` : film de marque, héros du site

Créer un film de marque de 40 secondes pour PHANESS, une agence de motion design qui conçoit des vidéos pour former, sécuriser, expliquer et vendre, accompagner.

Le film doit démontrer le savoir-faire de l'agence à travers sa propre réalisation : narration immédiatement compréhensible, direction artistique originale, animation précise, typographie soignée, détails de matières et transitions construites.

L'objectif est qu'un visiteur du site comprenne ce que fait PHANESS et se projette dans une collaboration.

### `former-electricite` : formation à l'intelligence artificielle

Réaliser une vidéo de motion design de 30 secondes présentant une formation pratique à l'intelligence artificielle. Le spectateur doit comprendre ce qu'il va apprendre : formuler une demande, produire des contenus, analyser des informations et vérifier les résultats.

La vidéo doit ressembler à une production originale de studio de motion design : composition exigeante, animation fluide, transitions construites et détails graphiques cohérents.

CONTRAINTES
— Format horizontal 16:9, cible 4K, 25 images par seconde.

### `securiser-usine` : sécurité sur un chantier

Réaliser une vidéo de motion design de 30 secondes sensibilisant aux bons réflexes de sécurité sur un chantier. Le ton est direct, professionnel et rassurant. La qualité doit venir du dessin, du rythme, des cadrages et de la précision des gestes.

CONTRAINTES
— Format horizontal 16:9, cible 4K, 25 images par seconde.
— Durée : 30 secondes.
— Aucun son, aucune voix, aucune musique, aucun bruitage.

### `expliquer-pac` : rénovation énergétique

Créer un film de motion design de 30 secondes qui explique une rénovation énergétique cohérente et donne envie d'engager un projet adapté à son logement.

L'histoire doit être simple : comprendre les besoins de la maison, réduire les pertes, renouveler l'air, adapter le chauffage et améliorer le confort. Le film valorise une démarche globale sans promettre un résultat chiffré.

CONTRAINTES
— Format horizontal 16:9, cible 4K, 25 images par seconde.

### `accompagner-solaire` : premiers réglages d'une pompe à chaleur

Créer un film de motion design de 30 secondes destiné à des personnes venant de recevoir une pompe à chaleur air-eau. Montrer les premiers réglages du confort depuis une commande d'ambiance : accéder au chauffage, régler une consigne, consulter une programmation et laisser la régulation fonctionner.

La pompe à chaleur est déjà installée et mise en service. Le film ne montre aucune installation ni intervention technique.

L'interface est fictive, conçue pour cette démonstration en marque blanche. Pour une diffusion liée à un appareil réel, ses écrans et ses gestes devront être adaptés à ce modèle.
