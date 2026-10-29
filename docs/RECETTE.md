# Recette locale — 2026-10-29

Contrôle manuel réalisé sur WordPress Playground frais, thème monté depuis le dépôt, port `9401`.

## Résultats

| Contrôle | Résultat | Détail |
|---|---|---|
| Largeurs 360, 390, 768, 1280, 1440 et 1920 px | Conforme | Aucun débordement horizontal (`documentElement.scrollWidth` égal à la largeur de fenêtre). |
| Onglets Secteurs au clavier | Conforme | `Flèche droite` sélectionne l'onglet suivant ; `aria-selected` et le panneau associé changent ensemble. |
| Pages légales | Conforme | Mentions légales et politique de confidentialité visibles ; les informations encore inconnues restent `[À FOURNIR]`. |
| Console navigateur | Conforme | Aucun message `error` ou `warning` relevé pendant ces parcours. |
| Coordonnées et réservation | En attente d'informations | Email, téléphone et URL Cal.com sont absents ; les liens restent des placeholders et aucun iframe tiers ne se charge. |
| Mouvement réduit | À compléter | Le CSS et le JavaScript tiennent compte de `prefers-reduced-motion`; l'émulation de cette préférence n'a pas pu être activée avec le navigateur de contrôle. |
| Lighthouse mobile et desktop | À compléter | Lighthouse n'est pas installé dans l'environnement. Aucun score n'est estimé ou simulé. |
| Navigation complète des liens | À compléter | Vérifier après réception des coordonnées et des quatre rendus vidéo. |

## Écarts à traiter

- **Bloquant avant publication — vidéos V2.** Les quatre MP4 et leurs affiches ne sont pas encore rendus. Le script de paquetage doit refuser de créer un ZIP incomplet.
- **À fournir — configuration de contact.** `PHANESS_CAL_URL`, `PHANESS_CONTACT_EMAIL`, `PHANESS_CONTACT_PHONE` et les informations légales doivent être renseignés avant la mise en ligne. Le parcours Cal.com ne peut être contrôlé sans une URL valide.
- **Audit restant — Lighthouse et mouvement réduit.** Relancer ces contrôles dans un environnement qui dispose de Lighthouse et de l'émulation `prefers-reduced-motion`, puis compléter ce rapport avant de déclarer l'étape 6a terminée.

## Étape 6b

Correctifs issus des vérifications effectuées : les anciens liens de rendez-vous vers `#rendez-vous` ont été remplacés par un lien de contact fonctionnel ; les coordonnées vides ne produisent plus de `mailto:` ou `tel:` cassé ; les pages légales affichent leur gabarit même sur une installation déjà active ; le libellé de l'offre Accompagner pointe vers la démonstration solaire courante.

La recette complète reste ouverte tant que Lighthouse, le mouvement réduit et les vidéos ne sont pas vérifiés.
