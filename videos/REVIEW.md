# REVIEW — 4 vidéos de démonstration (étape V)

## Livrables (rendus le 29/10/2026)

| Vidéo | Durée | Poids MP4 | Affiche |
|---|---|---|---|
| `out/former-pas.mp4` | 21,17 s | 1,03 Mo | `out/former-pas.webp` (étape 3, Secourir) |
| `out/securiser-epi.mp4` | 24,47 s | 1,15 Mo | `out/securiser-epi.webp` (« Pas d'EPI, pas de chantier. ») |
| `out/expliquer-pac.mp4` | 24,17 s | 1,49 Mo | `out/expliquer-pac.webp` (cycle complet) |
| `out/accompagner-radiateur.mp4` | 24,57 s | 1,47 Mo | `out/accompagner-radiateur.webp` (manomètre) |

Tous : H.264 High, yuv420p, 1920×1080, 30 i/s, faststart (moov avant mdat), sans piste audio, CRF 20. Affiches 1280×720.

## Ce qui a été mesuré
- `hyperframes check` sur les 4 projets : 0 erreur. Avertissements gardés volontairement : `film_silent` (muet demandé faute de musique à licence claire), `content_overlap` pendant la montée des nuages de fin (le texte est en train d'être recouvert), `timeline_track_too_dense` (un bloc de texte par étape, voulu).
- ffprobe sur chaque MP4 (codec, format pixel, taille, cadence, durée) et position des atomes moov/mdat.
- Images décodées des MP4 finaux à chaque étape : textes complets, rien de coupé, rien hors cadre.

## Choix créatifs
- Un seul système : intro (format, titre, trait vermillon), compteur qui roule dans un disque d'argile, barre de progression segmentée, socle-nuage sous chaque objet, fin « phaness » sur un banc de nuages.
- Titres d'étape à l'impératif avec vouvoiement (PAS, radiateur) ou en nom d'équipement (EPI), schéma qui se construit pièce par pièce (PAC).
- Ajouts de texte hors brief, à valider : sous-titres des EPI (« Contre les chocs et les chutes d'objets », etc.), « Le détendeur abaisse la pression et relance le cycle », libellés « Urgences » pour le 112 et « Chauffage » sur le schéma, sous-titres d'intro.

## Points faibles, à reprendre avec plus de temps
- Radiateur : l'étape 1 (bouton tourné, chaleur qui disparaît) reste discrète ; le robinet thermostatique est stylisé.
- Le récipient sous la vis de purge flotte (pas de main qui le tient).
- Pas d'aperçu Studio ouvert : l'utilisateur était absent. `sh hf.sh preview` depuis un dossier de vidéo l'ouvre.
