<?php
/**
 * Title: Work (demo videos)
 * Slug: phaness/work
 * Categories: phaness
 * Inserter: no
 */

// Keep file keys stable for the separate rendering workstation; display titles follow the current brief.
$phaness_works = array(
	array(
		'slug'    => 'former-electricite',
		'offer'   => 'Former',
		'title'   => 'Introduction à l’intelligence artificielle',
	),
	array(
		'slug'    => 'securiser-usine',
		'offer'   => 'Sécuriser',
		'title'   => 'Les équipements de protection individuelle sur un chantier',
	),
	array(
		'slug'    => 'expliquer-pac',
		'offer'   => 'Expliquer et vendre',
		'title'   => 'Comprendre la rénovation énergétique',
	),
	array(
		'slug'    => 'accompagner-solaire',
		'offer'   => 'Accompagner',
		'title'   => 'Utiliser une pompe à chaleur',
	),
);
?>
<!-- wp:html -->
<section class="ph-section ph-work-section" id="realisations" aria-labelledby="ph-work-title">
	<div class="ph-container">
		<header class="ph-head">
			<h2 class="ph-title" id="ph-work-title">Nos réalisations</h2>
		</header>
		<div class="ph-grid ph-grid--2 ph-works">
			<?php
			foreach ( $phaness_works as $work ) {
				phaness_video_card( $work['slug'], $work['offer'], $work['title'], '' );
			}
			?>
		</div>
	</div>
</section>
<!-- /wp:html -->
