<?php
/**
 * Title: Work (demo videos)
 * Slug: phaness/work
 * Categories: phaness
 * Inserter: no
 */

// One entry per demo video: file name in assets/video/ (from videos/out/), offer, title, caption.
$phaness_works = array(
	array(
		'slug'    => 'former-electricite',
		'offer'   => 'Former',
		'title'   => 'Tension, intensité, puissance',
		'caption' => 'Un circuit en 3D, de la pile à l\'ampoule, pour arriver à la formule P = U × I.',
	),
	array(
		'slug'    => 'securiser-usine',
		'offer'   => 'Sécuriser',
		'title'   => 'Premier jour à l\'usine',
		'caption' => 'Pour un nouvel arrivant : ses équipements, les allées piétonnes, l\'évacuation vers le point de rassemblement.',
	),
	array(
		'slug'    => 'expliquer-pac',
		'offer'   => 'Expliquer et vendre',
		'title'   => 'La pompe à chaleur air/eau',
		'caption' => 'Le cycle du fluide frigorigène vu de l\'intérieur, la pose de l\'unité extérieure, le réglage du thermostat.',
	),
	array(
		'slug'    => 'accompagner-solaire',
		'offer'   => 'Accompagner',
		'title'   => 'Votre installation solaire',
		'caption' => 'Orienter et incliner les panneaux, lire l\'onduleur, puis suivre la production du jour sur téléphone.',
	),
);
?>
<!-- wp:html -->
<section class="ph-section ph-work-section" id="realisations" aria-labelledby="ph-work-title">
	<div class="ph-container">
		<header class="ph-head">
			<p class="ph-eyebrow">Réalisations</p>
			<h2 class="ph-title" id="ph-work-title">Quatre démonstrations, une par offre</h2>
			<p class="ph-lead">Ces vidéos sont des démonstrations réalisées par nos soins pour illustrer chaque offre. Elles ne correspondent pas à des commandes de clients.</p>
		</header>
		<div class="ph-grid ph-grid--2 ph-works">
			<?php
			foreach ( $phaness_works as $work ) {
				phaness_video_card( $work['slug'], $work['offer'], $work['title'], $work['caption'] );
			}
			?>
		</div>
		<p class="ph-note ph-works__note">Vidéos sans son. Vos projets peuvent inclure une voix off ou des sous-titres [À CONFIRMER].</p>
	</div>
</section>
<!-- /wp:html -->
