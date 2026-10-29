<?php
/**
 * Title: Sectors (tabs)
 * Slug: phaness/sectors
 * Categories: phaness
 * Inserter: no
 */
$phaness_sectors = array(
	array(
		'slug'     => 'formation',
		'tab'      => 'Formation',
		'title'    => 'Des capsules pédagogiques qui se retiennent',
		'issue'    => 'Vos contenus de formation sont denses. Les supports écrits sont peu lus, et l\'attention baisse vite, surtout à distance.',
		'do'       => 'Nous découpons votre programme en capsules courtes, une notion par vidéo. Schémas animés, rythme posé, messages clés répétés : l\'apprenant comprend, puis retient. Vous les diffusez dans vos parcours en ligne ou en salle.',
		'examples' => array( 'Protéger, alerter, secourir : les gestes de premiers secours', 'L\'accueil d\'un nouveau collaborateur', 'Les bons réflexes pour protéger les données personnelles' ),
		'cta'      => 'Parlons de votre formation',
	),
	array(
		'slug'     => 'btp',
		'tab'      => 'BTP et industrie',
		'title'    => 'Des procédures comprises par tous, sur le terrain',
		'issue'    => 'Vos modes opératoires existent, mais restent dans un classeur. Les équipes changent, les intérimaires arrivent, et les consignes de sécurité doivent être comprises dès le premier jour.',
		'do'       => 'Nous transformons vos procédures et vos consignes HSE en vidéos visuelles, avec peu de texte. Chaque étape est montrée, chaque risque est signalé. Vous les utilisez en accueil sécurité, en quart d\'heure sécurité ou au poste de travail.',
		'examples' => array( 'Le port des EPI sur un chantier', 'La consignation d\'une machine avant intervention', 'Le travail en hauteur : les règles à respecter' ),
		'cta'      => 'Présentez-nous vos procédures',
	),
	array(
		'slug'     => 'energie',
		'tab'      => 'Énergie et rénovation',
		'title'    => 'Faire comprendre vos équipements à vos clients',
		'issue'    => 'Pompe à chaleur, chauffe-eau thermodynamique, panneaux solaires : vos produits sont techniques. Vos clients hésitent souvent parce qu\'ils ne voient pas comment ils fonctionnent.',
		'do'       => 'Nous montrons l\'intérieur de vos équipements en 3D : les composants, les flux, le fonctionnement selon les saisons. Vos commerciaux et vos installateurs disposent d\'un support clair pour expliquer et rassurer.',
		'examples' => array( 'Comment fonctionne une pompe à chaleur air/eau', 'Le chauffe-eau thermodynamique, expliqué simplement', 'Du toit à la prise : le parcours de l\'électricité solaire' ),
		'cta'      => 'Faites comprendre vos produits',
	),
	array(
		'slug'     => 'fabricants',
		'tab'      => 'Fabricants et installateurs',
		'title'    => 'Accompagner vos clients après l\'installation',
		'issue'    => 'Une fois l\'installation terminée, vos clients se retrouvent seuls face à l\'équipement. Les mêmes questions reviennent, et chaque appel au support prend du temps à vos équipes.',
		'do'       => 'Nous réalisons des tutoriels courts, en étapes numérotées : mise en route, réglages, entretien courant. Vos clients les retrouvent depuis votre site, la notice ou un QR code collé sur l\'appareil.',
		'examples' => array( 'Purger un radiateur', 'Régler la programmation d\'un thermostat', 'Nettoyer le filtre d\'une ventilation' ),
		'cta'      => 'Parlons de vos tutoriels',
	),
);
?>
<!-- wp:html -->
<section class="ph-section ph-sectors" id="secteurs" aria-labelledby="ph-sectors-title">
	<div class="ph-container">
		<header class="ph-head ph-head--center">
			<p class="ph-eyebrow">Secteurs</p>
			<h2 class="ph-title" id="ph-sectors-title">Un message adapté à votre métier</h2>
			<p class="ph-lead">Chaque secteur a ses contraintes. Choisissez le vôtre.</p>
		</header>
		<div class="ph-tabs" data-tabs>
			<div class="ph-tabs__list" role="tablist" aria-label="Choisir un secteur">
				<?php foreach ( $phaness_sectors as $i => $s ) : ?>
				<button class="ph-tabs__tab" type="button" role="tab" id="tab-<?php echo esc_attr( $s['slug'] ); ?>" aria-controls="panel-<?php echo esc_attr( $s['slug'] ); ?>" aria-selected="<?php echo 0 === $i ? 'true' : 'false'; ?>"<?php echo 0 === $i ? '' : ' tabindex="-1"'; ?>><?php echo esc_html( $s['tab'] ); ?></button>
				<?php endforeach; ?>
			</div>
			<?php foreach ( $phaness_sectors as $i => $s ) : ?>
			<div class="ph-tabs__panel ph-card" role="tabpanel" id="panel-<?php echo esc_attr( $s['slug'] ); ?>" aria-labelledby="tab-<?php echo esc_attr( $s['slug'] ); ?>" tabindex="0"<?php echo 0 === $i ? '' : ' hidden'; ?>>
				<h3 class="ph-panel__title"><?php echo esc_html( $s['title'] ); ?></h3>
				<div class="ph-panel__cols">
					<div>
						<h4 class="ph-panel__label">Votre enjeu</h4>
						<p><?php echo esc_html( $s['issue'] ); ?></p>
					</div>
					<div>
						<h4 class="ph-panel__label">Ce que nous faisons</h4>
						<p><?php echo esc_html( $s['do'] ); ?></p>
					</div>
				</div>
				<div class="ph-panel__foot">
					<div class="ph-panel__examples">
						<h4 class="ph-panel__label">Exemples de vidéos</h4>
						<ul class="ph-chips" role="list">
							<?php foreach ( $s['examples'] as $ex ) : ?>
							<li><?php echo esc_html( $ex ); ?></li>
							<?php endforeach; ?>
						</ul>
					</div>
					<a class="ph-btn ph-btn--primary" href="#rendez-vous"><?php echo esc_html( $s['cta'] ); ?></a>
				</div>
			</div>
			<?php endforeach; ?>
		</div>
	</div>
</section>
<!-- /wp:html -->
