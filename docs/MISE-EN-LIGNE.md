# Mise en ligne de Phaness chez IONOS

Ce guide concerne une installation WordPress administrée par l'équipe. Les écrans IONOS peuvent différer selon le contrat et la variante WordPress.

## Avant de commencer

- Avoir un domaine et une offre d'hébergement IONOS compatible avec WordPress.
- Faire renseigner les coordonnées de contact, le lien Cal.com et les champs légaux `[À FOURNIR]` dans la configuration du thème.
- Avoir rendu les quatre vidéos V2. Le paquetage s'arrête avec une liste des MP4 ou affiches manquants ; ne téléversez pas un ZIP incomplet.
- Garder une sauvegarde de la base de données et des fichiers du site existant avant de remplacer le thème actif.

## 1. Installer WordPress chez IONOS

Pour l'hébergement Web, la procédure Click & Build actuelle passe par le compte IONOS : **Menu → Projets Web → Créer un site Web ou une boutique → Solutions open-source populaires → WordPress → Installer**. Choisissez **Gérer WordPress soi-même**, nommez le projet, définissez le compte administrateur, associez le domaine, puis lancez l'installation. IONOS configure alors les fichiers WordPress et la base de données. [Guide Click & Build d'IONOS](https://www.ionos.fr/assistance/hebergement/click-build-applications/installer-wordpress/)

Si le contrat utilise l'hébergement WordPress managé, suivez le parcours propre à ce produit dans le compte IONOS. Les consignes diffèrent selon la variante WordPress. [Identifier la variante WordPress IONOS](https://www.ionos.fr/assistance/wordpress/wordpress-bei-ionos/determiner-la-variante-ionos-wordpress/)

## 2. Activer HTTPS

Dans **Domaines & SSL**, associez un certificat au domaine et attendez son activation. Vérifiez ensuite que l'adresse du site WordPress commence par `https://` et qu'une visite en `http://` est redirigée vers la version sécurisée. Pour une installation WordPress non managée, appliquez la procédure IONOS correspondant à WordPress ; n'ajoutez pas une redirection générique `.htaccess` sans vérifier le type d'hébergement. [Sécuriser un site avec SSL](https://www.ionos.fr/assistance/certificats-ssl/conseils-dinstallation-et-dutilisation/securiser-un-site-web-avec-ssl/) · [Forcer HTTPS sur un site](https://www.ionos.fr/assistance/certificats-ssl/conseils-dinstallation-et-dutilisation/forcer-https-ssl-pour-un-site-web/)

## 3. Construire l'archive du thème

Dans le projet local, avec Node.js installé :

```bash
npm run build:zip
```

Le fichier est créé dans `dist/phaness.zip`. Le script synchronise les rendus depuis `videos/out/`, vérifie les quatre MP4 et leurs affiches, puis crée une archive qui contient le dossier racine `phaness/`. Il refuse maintenant de créer l'archive si un rendu manque.

## 4. Installer et activer le thème

Connectez-vous à `/wp-admin/`, puis ouvrez **Apparence → Thèmes → Ajouter un thème → Téléverser un thème**. Sélectionnez `dist/phaness.zip`, lancez l'installation et activez **Phaness**. WordPress permet d'installer un thème depuis une archive ZIP avec ce parcours. [Documentation WordPress sur les thèmes](https://wordpress.org/documentation/article/work-with-themes/)

Le modèle `front-page.html` du thème construit la page d'accueil. Après activation, vérifiez la page racine du domaine. Les pages Mentions légales et Politique de confidentialité sont créées automatiquement si elles n'existent pas déjà.

## 5. Vérifications avant d'annoncer le site

- Ouvrir la page d'accueil sur ordinateur et téléphone, puis suivre les quatre liens de démonstration et lancer chaque vidéo.
- Vérifier les pages Mentions légales et Politique de confidentialité, et remplacer chaque `[À FOURNIR]` par les informations validées.
- Cliquer sur l'adresse email, le téléphone et les boutons de rendez-vous ; vérifier le chargement Cal.com seulement après le clic.
- Vérifier les liens du pied de page, l'aperçu Open Graph et le cadenas HTTPS.
- Dans **Extensions**, garder les extensions nécessaires à l'hébergement, à la sécurité et aux sauvegardes. Désactiver seulement celles qui sont inutilisées ou ajoutent des fonctions redondantes, après vérification de leur rôle.

Les identifiants IONOS et WordPress, les choix de contrat et l'acceptation des conditions restent à saisir par le propriétaire dans ses propres comptes.
