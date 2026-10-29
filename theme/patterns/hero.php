<?php
/**
 * Title: Hero
 * Slug: phaness/hero
 * Categories: phaness
 * Inserter: no
 */
?>
<!-- wp:html -->
<section class="ph-hero" id="top" aria-labelledby="ph-hero-title">
	<canvas class="ph-hero__canvas" aria-hidden="true" data-hero></canvas>
	<div class="ph-container ph-hero__inner">
		<div class="ph-hero__content">
			<h1 class="ph-hero__title" id="ph-hero-title">Des vidéos explicatives professionnelles, simplement.</h1>
			<p class="ph-hero__lead">Formations, procédures, produits techniques : nous en faisons des vidéos animées claires, faciles à produire et à renouveler.</p>
			<div class="ph-actions">
				<a class="ph-btn ph-btn--primary ph-btn--lg" href="<?php echo esc_url( phaness_booking_href() ); ?>"<?php echo phaness_booking_attributes(); ?>>Prendre rendez-vous</a>
				<a class="ph-btn ph-btn--ghost ph-btn--lg" href="#realisations">Voir nos réalisations</a>
			</div>
		</div>
	</div>
</section>
<!-- /wp:html -->
