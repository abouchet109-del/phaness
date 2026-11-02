# SPEC : système vidéo Phaness V3

Films HyperFrames, 1920×1080, 25 i/s, muets. Scripts et répartition : `SCRIPTS.md`. Exemple complet : `presentation-phaness/compositions/film.html` (à lire par extraits, pas en entier).

## La DA : « la table de storyboard »

Chaque film est **un seul plan-séquence** sur une table. Les plans sont des feuilles blanches posées dessus, en 2D vectoriel. Un **fil vert continu** les relie : il dessine, entoure, alimente, et la caméra le suit d'une feuille à l'autre. Il n'y a jamais de fondu ni de coupe entre deux feuilles. Le relief vient d'une vraie perspective CSS : caméra inclinée en vol, objets soulevés (téléphone, plaques) avec parallaxe et ombre portée.

| Règle | Valeur |
|---|---|
| Fond (table) | `--ground` `#F5F7F4`, croix de repérage (fournies par `.ph-table`) |
| Feuille | `.ph-sheet` `#FFF` ; `.ph-sheet.deep` `#176447` pour **une** feuille pleine couleur par film au maximum |
| Encre | `--ink` `#14251D`, secondaire `--ink-2` `#52615A`, aplat clair `--mist` `#DDE5DF` |
| Accent | `--green` `#247855` et `--green-deep` `#176447` : le fil et l'élément clé de chaque feuille, rien d'autre |
| Couleur fonctionnelle | `--signal` `#E6A817` : seulement pour une signalisation (chantier), sur moins de 5 % de l'image |
| Matière | hachures `.ph-hatch`, `.ph-hatch-ink`, bande `.ph-hazard`, ombres douces. Pas de dégradé décoratif, de néon, de verre dépoli ni de fond sombre sauf `.deep` |
| Dessin | formes pleines et traits ronds de 3 à 6 px. Personnage pictogramme : `_system/parts/figure.svg.html` (casque, gilet, chaussures animables) |
| Type | Geist. `.ph-h1` 100 px (un titre par feuille, 3 mots au plus), `.ph-body` 40 px (une phrase, couper les lignes avec `<br />` pour éviter un mot seul), `.ph-tag` 30 px. **Rien sous 30 px.** Interface dessinée : 30 px aussi |
| Marges | texte à 120 px du bord de la feuille |

**Interdit :** plan sans mouvement de plus de 3 s, élément qui se contente de monter et apparaître en fondu partout, carte après carte façon diapo, logo en coin, flottement ou pulsation en boucle, rebond sur l'interface, chiffres ou marques inventés, nuages, œuf, vermillon.

## Démarrer un film

Depuis `videos/`, dans Git Bash, avec Node dans le `PATH` (`export PATH="/d/Tools/nodejs:$PATH"`) :

```bash
node build.mjs --new former-electricite
```

Cette commande vide le dossier du film et le recrée depuis `_system/template/`, avec les `assets/` du système. Elle ne touche pas aux autres films. **`_system/` ne se modifie pas :** un besoin commun se signale à la coordinatrice. Le film a alors :

- `index.html` : mettre `data-duration` (2 lignes) à 30 ;
- `compositions/film.html` : tout le film, une seule composition (`data-duration="30"` à la racine aussi) ;
- à ajouter : `DECOUPAGE.md`, le découpage par plans en tranches de temps, écrit **avant** le code.

## Construire

**Disposition.** 4 ou 5 feuilles de 1920×1080 à 240 px d'écart, en S sur deux rangées, comme dans le film de marque : `const P = [[240,240],[2400,240],[4560,240],[4560,1680],[2400,1680]]`. Dans le gabarit, `<svg class="ph-layer">` doit être assez grand pour contenir le fil. Vue de repos : `{x: P[i][0]+960, y: P[i][1]+540, z: 0.93}`, qui laisse voir le bord de la feuille. `z: 1.005` remplit l'écran (feuille `.deep`).

**Couches.** Le contenu d'une `.ph-sheet` est plat. Ce qui doit se soulever est enfant direct de `#world`, avec `z` entre 40 et 80 et une ombre floue posée sur la feuille. Le fil (`translateZ(2px)`) passe au-dessus des feuilles et sous les objets soulevés.

**Fonctions de `PH`** (`_system/assets/phaness.js`), toutes en `(tl, sélecteur, temps, options)` sauf la caméra et le fil :

| Fonction | Usage |
|---|---|
| `cam = PH.camera(tl, vue)` | caméra. `cam.to(t, vue, durée, ease)` pour une mise au point lente ; `cam.travel(t, vue, durée, {via:{z,rx,ry,rz}, blur})` pour aller d'une feuille à l'autre (recul et inclinaison à mi-vol, flou au pic de vitesse) |
| `th = PH.thread(tl, {paths, head, segs})` | le fil. `segs` : `[["nom", "M x y L x y"], ...]` en coordonnées du monde. `th.show(t)`, `th.to(t, durée, "nom", {ease})` dessine jusqu'à la fin du segment (appels dans l'ordre chronologique), `th.hideHead(t)` |
| `PH.draw` | tracé d'un chemin SVG, comme s'il était dessiné |
| `PH.words`, `PH.ink`, `PH.letters`, `PH.rise` | entrées de texte : varier sur le film, une seule fois par élément |
| `PH.out` | sortie de texte |
| `PH.pop`, `PH.grow` | apparition avec dépassement contrôlé ; pousse depuis un bord (`dir`) |
| `PH.outro(tl, t, {x, y})` | fin commune : le vert s'ouvre depuis le point (x, y), logo, signature. 30 s : `t = 27.2`. Le balisage est dans le gabarit |

`PH.EASE` donne les courbes : `arrive` (`expo.out`, atterrissage), `land` (`power4.out`, objets lourds), `move` (`power3.inOut`, caméra et fil), `soft` (bosses), `exit` (`power3.in`), `spring` (`back.out(1.5)`, échelle et position seulement).

**Rythme** (30 s) : déplacement entre feuilles 1,2 à 1,4 s ; 4 à 5 s d'action par feuille. Le fil part avant la caméra et l'emmène. À l'arrivée, la caméra finit sa mise au point (`cam.to`, 2 à 5 s, faible inclinaison qui revient à 0) pendant que le sujet agit. Une transition au moins par film naît d'un objet (le film de marque : l'anneau se remplit et devient la feuille suivante). Un plan large de la table vers 24 s montre les feuilles reliées, puis retour sur une feuille ou fin directe. Le titre se pose et ne bouge plus par lui-même.

**Pistes pour les quatre films** (le découpage reste à vous) : IA, une demande qui se tape et des résultats à vérifier ; chantier, le personnage du système équipé, signalisation avec `--signal` ; maison, une coupe en aplats où le fil suit les pertes, l'air, le chauffage ; pompe à chaleur, une commande murale en objet soulevé, interface fictive en marque blanche.

## Pièges (déjà rencontrés)

- GSAP applique `rotation` **avant** `rotationX` : pour un objet isométrique, mettre l'inclinaison dans `.ph-iso` et animer `rotation` et `scale` sur `.ph-iso-z` (voir `#stack`). Plaques : `.ph-slab`, à animer en `z`, `x`, `y`.
- Un objet incliné passe en partie sous le plan de la feuille, qui le coupe net : `--lift` sur `.ph-iso` doit dépasser 0,83 × la demi-diagonale de l'objet à l'échelle (300 px par défaut). Ce relèvement grossit l'objet : baisser `scale` d'autant.
- Les planches réduites cachent ce genre de défaut : ouvrir au moins une image par feuille en pleine taille (`frame-*.png` à côté de la planche).
- `opacity` ou `filter` sur un élément `preserve-3d` l'aplatit : les réserver au contenu plat.
- `PH.words` & co découpent le texte : les appeler une seule fois par élément, et jamais avec `data-var-text`.
- `check` signale `film_silent` (voulu), `composition_file_too_large` (une composition par film, voulu) et `text_occluded` sur le plan final recouvert par `#end` (voulu).

## Contrôler et rendre

Toujours avec `hf.sh`, qui garde les caches sur D:. Temporaires dans `D:/Temp/hyperframes/<film>/`.

```bash
node build.mjs mon-film
cd mon-film && sh ../hf.sh check --json | grep -E '"code"|errorCount'
sh ../hf.sh snapshot --at 2,6,10,14 -o D:/Temp/hyperframes/mon-film/s1
```

Ouvrir `contact-sheet.jpg` dans le dossier de sortie, et viser **deux rendus complets au maximum** : tout contrôler d'abord sur images fixes, milieux de déplacement compris. À chaque feuille, se demander si un inconnu comprend l'image sans le texte.

```bash
sh render-all.sh mon-film
```

Le script attend son tour (verrou `D:/Temp/hyperframes/render.lock`), rend à 25 i/s, encode `out/<film>.mp4` en montant le CRF jusqu'à passer le plafond (6 Mo, 8 Mo pour le film de marque) et écrit l'affiche `out/<film>.webp`. Lancez-le en arrière-plan. Après un arrêt brutal seulement, si aucun rendu ne tourne : `rmdir D:/Temp/hyperframes/render.lock`.

Temps d'affiche : `poster_time` dans `render-all.sh` vaut 12 s pour les films métier. Ce fichier est commun : donnez le temps choisi à la coordinatrice, ou produisez votre affiche avec la même commande ffmpeg dans `out/`.

Après rendu, vérifier sur le MP4 :

```bash
sh contact-sheet.sh mon-film
```

Cette commande écrit `D:/Temp/hyperframes/mon-film/planche.jpg`, 16 images réparties sur le film. Consignez ensuite durée, poids, CRF, écarts dans `mon-film/REVIEW.md` et votre section de `videos/REVIEW.md`, si la coordinatrice ne s'en charge pas.

Passage en 4K : `sh render-4k.sh [film]` écrit `out-4k/`. Les plans à caméra inclinée y gagnent peu en netteté (voir `REVIEW.md`).
