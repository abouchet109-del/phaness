# Sécurité et données personnelles — 2 novembre 2026

État : protections du thème implémentées et contrôles locaux consignés dans RECETTE. Aucun accès au compte IONOS, à la messagerie ou à Calendly ; leur configuration n’a pas été modifiée ni certifiée. Un texte juridique ne transfère pas la responsabilité d’une faille aux visiteurs et ne garantit pas l’absence de piratage.

La mise en ligne de 0.2.5 a été reçue via le commit 9d6db9d de l’autre session. Contrôle public limité : accueil HTTPS en 200 ; les nouveaux en-têtes de ce thème ne sont pas encore servis. La version 0.2.7 fusionnée est locale/Git, sans téléversement depuis ce Mac. Le ZIP du poste Windows doit être reconstruit après pull pour inclure ces changements ; ne pas confondre version poussée et version déployée.

## Informations confirmées et restant à fournir

L’utilisateur fournit Rafael DELBECQ ALMELA, entrepreneur individuel en micro-entreprise, SIREN 980 147 409, SIRET 980 147 409 00018, RCS Pontoise et inscription RNE. Adresse professionnelle fournie pour publication : 2 bis rue de Curzay, 95880 Enghien-les-Bains, France. Contact : contact@phaness.fr ; téléphone 07 69 86 01 61. Il confirme la TVA non facturée en réponse à la question sur la franchise en base, Calendly, IONOS pour la messagerie et Google Meet. La mention 293 B est retenue pour le projet daté du 2 novembre 2026 ; vérifier son actualité lors d’une publication ultérieure, la recodification fiscale étant annoncée pour 2027. Le numéro TVA de la capture n’est pas présenté comme numéro actif.

À compléter : type de compte Google (personnel ou Workspace), agenda éventuellement synchronisé, stockage des dossiers clients, accès de maintenance, entité IONOS du contrat, localisation des données, contrats de sous-traitance, garanties de transfert, durées effectives, sauvegardes, clientèle exclusivement professionnelle ou non. L’usage de Google Meet ne prouve pas qu’un contrat Workspace/DPA professionnel a été accepté.

## Protections incluses dans le thème 0.2.7

- Aucune collecte par formulaire local, aucun compte client, paiement ou dépôt de fichiers. Aucun traceur publicitaire ou statistique ajouté par le thème. Polices et médias du thème locaux ; avatars Gravatar désactivés.
- Réservation limitée à l’hôte exact calendly.com en HTTPS, sans identifiants dans l’URL ni port autre que 443. Le premier clic ouvre une information locale ; l’iframe ne reçoit une URL qu’après « Afficher les créneaux ». Le lien externe et les liens sans JavaScript ouvrent directement Calendly. Le choix n’est pas mémorisé et ne vaut pas consentement aux cookies facultatifs du prestataire. Les réglages du fournisseur ne sont pas masqués.
- Referrer-Policy no-referrer, y compris sur l’iframe ; empêche l’envoi du Referer par le document, sans masquer l’adresse IP ni contrôler les échanges internes de Calendly.
- X-Content-Type-Options nosniff, X-Frame-Options SAMEORIGIN ; CSP limitée à base-uri/object-src/frame-ancestors/frame-src, et Permissions-Policy interdisant caméra, microphone, géolocalisation et paiement dans le document. La CSP ne prétend pas bloquer tous les scripts injectés : les restrictions script/style ne sont pas ajoutées sans audit de WordPress et de ses extensions.
- Commentaires/pings fermés et deux méthodes XML-RPC de pingback retirées. Les intégrations d’administration et l’API REST sont conservées ; Gutenberg en dépend.

Ces protections dépendent du thème actif et ne couvrent pas les fichiers statiques, toutes les réponses WordPress ou une compromission du serveur. Les politiques déjà transmises par WordPress sont préservées ; vérifier les en-têtes réellement servis après passage par le cache/CDN/hébergeur. Installer les protections durables au niveau serveur ou plugin indispensable après validation de l’hébergement. Ne pas déployer le serveur Playground comme serveur de production.

## À réaliser dans les comptes avant publication

1. **Accès.** Activer la double authentification sur IONOS, WordPress, la messagerie, Calendly et GitHub ; enregistrer les codes de secours hors ligne. Comptes nominatifs, mots de passe uniques dans un gestionnaire, droits minimaux, suppression des accès inutiles. Ne pas envoyer les mots de passe dans le chat.
2. **Maintenance.** WordPress, PHP, thème et extensions maintenus ; mises à jour de sécurité automatiques lorsque compatibles avec le contrat. Tester après mise à jour. Retirer les extensions inutiles après vérification de leur rôle, sans désactiver au hasard celles de l’hébergeur. Activer la limitation des tentatives et les alertes de connexion disponibles dans l’offre ; ne pas masquer simplement wp-login en guise de protection.
3. **Configuration.** Après sauvegarde, définir dans wp-config.php `DISALLOW_FILE_EDIT` à true et `WP_DEBUG_DISPLAY` à false. Vérifier que les erreurs ne sont pas affichées au public. Ne pas activer DISALLOW_FILE_MODS si cela empêcherait les mises à jour de sécurité. Restreindre les accès aux fichiers de configuration et empêcher l’exécution PHP dans les téléversements selon la procédure adaptée à IONOS.
4. **HTTPS et serveur.** Certificat et redirection HTTP vers HTTPS, cookies d’authentification sécurisés, TLS maintenu par l’hébergeur. HSTS seulement après contrôle de tous les hôtes concernés ; pas de includeSubDomains/preload ajouté à l’aveugle. Vérifier que .git, .env, sauvegardes SQL/ZIP et journaux privés sont inaccessibles publiquement, et que l’indexation des répertoires est désactivée. Déployer le ZIP du thème, jamais le clone Git complet.
5. **Sauvegardes.** Sauvegarder base et fichiers, avec chiffrement et accès limités ; garder une copie indépendante du serveur. Définir fréquence et rotation adaptées au rythme du site, puis restaurer réellement une copie dans un environnement séparé. Une archive de thème seule ne sauvegarde pas la base, les comptes ou la configuration. Prévoir l’effacement des anciennes données lors d’une restauration.
6. **Messagerie et domaine.** Vérifier MFA, récupération de compte, SPF, DKIM et DMARC selon le fournisseur. Inventorier les expéditeurs avant de passer DMARC en rejet pour ne pas bloquer les messages légitimes. Aucun enregistrement DNS n’a été modifié dans cette session.
7. **Données clients.** N’envoyer que les informations nécessaires par email ; documents sensibles via un stockage professionnel avec accès nominatif, expiration des partages, chiffrement et revue des habilitations. Ne pas saisir des données clients dans des outils IA ou de production sans vérifier contrat, confidentialité, usage pour l’entraînement et base légale. Ne pas conserver des dossiers dans la médiathèque WordPress publique.

## Registre minimal et durées à adopter

Tenir un registre interne : finalité, catégories de personnes/données, base légale, prestataires/pays, habilitations, durée et suppression. Les durées ne sont pas toutes fixées par la loi ; la politique doit correspondre aux réglages réels.

Proposition à valider, pas un réglage effectué : clôturer les demandes sans suite et fixer un délai court pour leurs pièces ; si un suivi commercial est réellement prévu, une limite de trois ans après le dernier contact émanant du prospect constitue un repère CNIL pour la prospection, pas une obligation de tout garder trois ans. Fixer séparément les durées des rendez-vous Calendly/agenda, logs, demandes de droits et sauvegardes. Pour les dossiers clients, distinguer fichiers de production, preuve contractuelle et pièces comptables ; limiter les accès aux archives obligatoires. Supprimer dans tous les systèmes concernés, pas seulement dans la boîte de réception.

Pour Calendly, vérifier le contrat de traitement, les garanties applicables aux transferts et les intégrations activées ; limiter les questions du formulaire, les notifications et les partages d’agenda. Ne pas activer un enregistrement/transcription automatique de réunion sans information et analyse adaptées. Un clic d’affichage ne donne pas une autorisation générale pour la publicité ou la prospection.

## Si un piratage ou une fuite est suspecté

1. Noter heure, système touché et faits connus ; garder les journaux et preuves. Contacter immédiatement l’hébergeur et la personne chargée de la maintenance ; isoler le système compromis sans effacer les preuves.
2. Depuis un appareil sain, révoquer les sessions et accès touchés, renouveler les secrets et contrôler les autres comptes liés. Identifier l’origine et corriger avant de restaurer une sauvegarde saine ; rechercher les comptes ajoutés, portes dérobées et règles de transfert email.
3. Documenter toute violation de données dans un registre, y compris la décision de ne pas notifier. Évaluer confidentialité, intégrité, disponibilité, personnes et conséquences ; ne pas confondre incident technique et violation de données.
4. Si elle présente un risque pour les droits et libertés, notifier l’autorité compétente dans les meilleurs délais et, si possible, sous 72 h après en avoir pris connaissance. Ne pas attendre la fin de l’enquête : compléter ensuite et justifier un retard éventuel. En cas de risque élevé, informer aussi les personnes sans délai injustifié, sous réserve des exceptions légales.
5. Prévenir les clients responsables de traitement sans retard injustifié si Phaness est leur sous-traitant ; respecter les engagements contractuels. Déposer plainte si approprié et contacter l’assureur cyber/RC selon le contrat. Ne pas publier les données compromises ni tenter de contre-attaquer.

## Protection contractuelle des prestations

Les mentions du site ne remplacent pas des CGV/devis adaptés aux clients professionnels. Encadrer le périmètre, livrables et formats, validation du script et des informations techniques par le client, nombre de retours, changements de périmètre, paiement/acompte, suspension, cession/licence des droits, droits sur les supports reçus, confidentialité, recours aux prestataires, conservation/suppression des fichiers et autorisation distincte d’utiliser le projet en portfolio. Si Phaness traite des données pour un client, ajouter un accord de sous-traitance RGPD adapté. Toute limitation de responsabilité doit être proportionnée, négociable selon le contexte et compatible avec les règles impératives ; aucune clause ne neutralise toutes les conséquences d’un piratage ou la responsabilité RGPD. Vérifier les garanties RC professionnelle/cyber avec l’assureur.

## Sources officielles consultées le 2 novembre 2026

- [Information des personnes — CNIL](https://www.cnil.fr/fr/informer-les-personnes)
- [Durées de conservation — CNIL](https://www.cnil.fr/fr/passer-laction/les-durees-de-conservation-des-donnees)
- [RGPD, droits — CNIL](https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre3)
- [RGPD, sécurité et violations — CNIL](https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre4)
- [Notification d’une violation — CNIL](https://www.cnil.fr/fr/services-en-ligne/notifier-une-violation-de-donnees-personnelles)
- [Mentions obligatoires — Service Public](https://entreprendre.service-public.gouv.fr/vosdroits/F37351?lang=fr)
- [Sécuriser WordPress — documentation officielle](https://developer.wordpress.org/advanced-administration/security/hardening/)
- [Calendly : politique](https://calendly.com/legal/privacy-notice), [contrat de traitement](https://calendly.com/legal/data-processing-addendum)
- [IONOS : identité](https://www.ionos.fr/terms-gtc/terms-imprint/). Les coordonnées du propre hébergeur d’ionos.fr ne prouvent pas quel hébergeur figure sur le contrat de Phaness.
- [Google : confidentialité](https://policies.google.com/privacy?hl=fr), [accord Workspace/Cloud](https://workspace.google.com/terms/dpa_terms.html), à vérifier selon le compte.
- [Micro-entreprise et TVA — impots.gouv.fr](https://www.impots.gouv.fr/professionnel/questions/en-tant-que-micro-entrepreneur-puis-je-etre-redevable-de-la-tva)
- [Authentification multifacteur — CNIL](https://www.cnil.fr/fr/securite-utilisez-lauthentification-multifacteur-pour-vos-comptes-en-ligne)
