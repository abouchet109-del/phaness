<?php
/**
 * Title: Work (demo videos)
 * Slug: phaness/work
 * Categories: phaness
 * Inserter: no
 */
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
			phaness_video_card( 'former-pas', 'Former', 'Protéger, alerter, secourir', 'Une capsule e-learning sur les trois réflexes du sauveteur, du danger à l\'arrivée des secours.' );
			phaness_video_card( 'securiser-epi', 'Sécuriser', 'Les EPI sur un chantier', 'Casque, lunettes, gants, chaussures, gilet : chaque équipement et son rôle, en un coup d\'œil.' );
			phaness_video_card( 'expliquer-pac', 'Expliquer et vendre', 'Comment fonctionne une pompe à chaleur air/eau', 'Le parcours de la chaleur, de l\'air extérieur jusqu\'aux radiateurs, montré en 3D.' );
			phaness_video_card( 'accompagner-radiateur', 'Accompagner', 'Purger un radiateur', 'Un tutoriel en étapes numérotées, à suivre pas à pas.' );
			?>
		</div>
		<p class="ph-note ph-works__note">Vidéos sans son. Vos projets peuvent inclure une voix off ou des sous-titres [À CONFIRMER].</p>
	</div>
</section>
<!-- /wp:html -->
