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
		'title'   => 'Protéger, alerter, secourir',
		'caption' => 'Une capsule e-learning sur les trois réflexes du sauveteur, du danger à l\'arrivée des secours.',
	),
	array(
		'slug'    => 'securiser-usine',
		'offer'   => 'Sécuriser',
		'title'   => 'Les EPI sur un chantier',
		'caption' => 'Casque, lunettes, gants, chaussures, gilet : chaque équipement et son rôle, en un coup d\'œil.',
	),
	array(
		'slug'    => 'expliquer-pac',
		'offer'   => 'Expliquer et vendre',
		'title'   => 'Comment fonctionne une pompe à chaleur air/eau',
		'caption' => 'Le parcours de la chaleur, de l\'air extérieur jusqu\'aux radiateurs, montré en 3D.',
	),
	array(
		'slug'    => 'accompagner-solaire',
		'offer'   => 'Accompagner',
		'title'   => 'Purger un radiateur',
		'caption' => 'Un tutoriel en étapes numérotées, à suivre pas à pas.',
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
