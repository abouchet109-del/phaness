# Mise en ligne de Phaness chez IONOS

Ce guide concerne une installation WordPress administrée par l'équipe. Les écrans IONOS peuvent différer selon le contrat et la variante WordPress.

## Avant de commencer

- Avoir un domaine et une offre d'hébergement IONOS compatible avec WordPress.
- Vérifier les coordonnées déjà renseignées, puis compléter les champs légaux `[À FOURNIR]` aux emplacements indiqués ci-dessous.
- Avoir rendu les quatre vidéos V2. Le paquetage s'arrête avec une liste des MP4 ou affiches manquants ; ne téléversez pas un ZIP incomplet.
- Garder une sauvegarde de la base de données et des fichiers du site existant avant de remplacer le thème actif.

## Renseigner les informations de l’équipe

Le lien Calendly fourni est configuré : https://calendly.com/rafael-delbecq/appel-de-decouverte-phaness. Les huit boutons de rendez-vous/contact l’utilisent. Le module s’ouvre au clic dans une fenêtre et propose un lien « Ouvrir Calendly » ; sans JavaScript, les liens mènent directement à la page de réservation.

Les constantes `PHANESS_BOOKING_URL`, `PHANESS_CONTACT_EMAIL`, `PHANESS_CONTACT_PHONE` et `PHANESS_LEGAL_NAME` sont configurées dans `theme/functions.php`. Email et téléphone : `contact@phanes.fr` et `07 69 86 01 61`. La raison sociale reste vide. Pour conserver la configuration lors des mises à jour, ces constantes peuvent être définies dans `wp-config.php` avant WordPress. L’ancienne constante `PHANESS_CAL_URL` est remplacée par `PHANESS_BOOKING_URL`.

L’iframe native suit la [documentation Calendly](https://calendly.com/help/how-to-embed-calendly-with-an-iframe), sans script externe ajouté au site. Les choix de cookies du service restent disponibles. Les mentions du fournisseur sont reprises de sa [politique de confidentialité](https://calendly.com/legal/privacy-notice) ; compléter les champs légaux et la garantie applicable au contrat de l’entreprise avant publication.

Les autres informations légales se trouvent dans `theme/patterns/legal-mentions.php` et `theme/patterns/legal-privacy.php`. La raison sociale du pied de page se trouve dans `theme/patterns/footer.php`. Ces textes ne sont pas tous alimentés par `PHANESS_LEGAL_NAME` : remplacer chaque champ avec les informations validées de l'entreprise, puis reporter les textes dans `docs/CONTENU.md`. Ne pas renseigner de durée, de garantie ou d'identifiant supposé.

Les pages créées par le thème restent liées à leurs patterns et reflètent leurs mises à jour. Une page dont le contenu a été personnalisé dans l'éditeur est conservée ; dans ce cas, vérifier et mettre à jour cette page séparément. La mention voix off/sous-titres a été retirée de la page. Le nombre de retours n'est plus affiché depuis le retrait de la section Méthode.

La vidéo de présentation du héros est indépendante des quatre démonstrations. Définir `PHANESS_PRESENTATION_VIDEO_URL` dans `wp-config.php` avec son URL et, si disponible, `PHANESS_PRESENTATION_POSTER_URL` pour son affiche. Le lecteur utilise les commandes natives, sans lecture automatique, et attend une action du visiteur pour charger le film. Ne pas placer ce fichier directement dans le dossier synchronisé du thème, dont le contenu est remplacé par `sync-videos`.

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

Le fichier est créé dans `dist/phaness.zip`. Le script synchronise les rendus depuis `videos/out/`, vérifie les quatre MP4 et leurs affiches, puis crée une archive qui contient le dossier racine `phaness/`. Les sujets demandés sont désormais introduction IA, EPI sur chantier, rénovation énergétique et utilisation d’une pompe à chaleur. Vérifier leur correspondance avec les rendus de l’autre PC ; les clés de fichiers historiques sont conservées et ne décrivent plus les sujets affichés. Les huit fichiers attendus sont `former-electricite`, `securiser-usine`, `expliquer-pac` et `accompagner-solaire`, chacun avec les extensions `.mp4` et `.webp`.

Les fichiers obligatoires du thème et les médias doivent être présents et non vides. Une synchronisation impossible ou un fichier manquant arrête le build. L'ancienne archive et les fichiers temporaires du build sont retirés pour éviter de livrer un ZIP périmé. Les liens symboliques ne sont pas acceptés dans le paquet. La taille, le décodage et la qualité des vidéos restent à contrôler après leur réception.

Avant de construire, `npm test` vérifie les régressions du héros et les cas de succès/échec du paquetage dans des copies temporaires. Aucun rendu n'est créé dans le projet par ces tests. Au 29 octobre 2026, l'installation du thème depuis un ZIP de contrôle sans médias a été vérifiée sur un WordPress vierge ; le paquet final avec médias reste à tester.

## 4. Installer et activer le thème

Connectez-vous à `/wp-admin/`, puis ouvrez **Apparence → Thèmes → Ajouter un thème → Téléverser un thème**. Sélectionnez `dist/phaness.zip`, lancez l'installation et activez **Phaness**. WordPress permet d'installer un thème depuis une archive ZIP avec ce parcours. [Documentation WordPress sur les thèmes](https://wordpress.org/documentation/article/work-with-themes/)

Le modèle `front-page.html` du thème construit la page d'accueil. Après activation, vérifiez la page racine du domaine. Les pages Mentions légales et Politique de confidentialité sont créées automatiquement si elles n'existent pas déjà.

## 5. Vérifications avant d'annoncer le site

- Ouvrir la page d'accueil sur ordinateur et téléphone, puis suivre les quatre liens de démonstration et lancer chaque vidéo.
- Vérifier les pages Mentions légales et Politique de confidentialité, et remplacer chaque `[À FOURNIR]` par les informations validées.
- Cliquer sur l'adresse email, le téléphone et les boutons de rendez-vous ; vérifier le chargement Calendly seulement après le clic.
- Vérifier les liens du pied de page, l'aperçu Open Graph et le cadenas HTTPS.
- Refaire Lighthouse mobile et ordinateur sur le domaine HTTPS, après ajout des vidéos. Les résultats locaux sans médias sont conservés dans `docs/RECETTE.md` ; ils ne remplacent pas le contrôle de l'hébergement final.
- Dans **Extensions**, garder les extensions nécessaires à l'hébergement, à la sécurité et aux sauvegardes. Désactiver seulement celles qui sont inutilisées ou ajoutent des fonctions redondantes, après vérification de leur rôle.

Les identifiants IONOS et WordPress, les choix de contrat et l'acceptation des conditions restent à saisir par le propriétaire dans ses propres comptes.
