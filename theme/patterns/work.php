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
		'title'   => 'Tension, intensité et puissance',
		'caption' => 'Un exemple de capsule à intégrer dans un parcours de formation.',
	),
	array(
		'slug'    => 'securiser-usine',
		'offer'   => 'Sécuriser',
		'title'   => 'Les consignes de sécurité en usine',
		'caption' => 'Un support d\'accueil pour présenter les règles aux nouveaux arrivants.',
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
		'title'   => 'Régler une installation solaire',
		'caption' => 'Un tutoriel à suivre pour prendre en main son équipement.',
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
