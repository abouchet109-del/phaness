<?php
/**
 * Title: Hero
 * Slug: phaness/hero
 * Categories: phaness
 * Inserter: no
 */
$phaness_presentation_url = esc_url( PHANESS_PRESENTATION_VIDEO_URL );
$phaness_presentation_poster = esc_url( PHANESS_PRESENTATION_POSTER_URL );
?>
<!-- wp:html -->
<section class="ph-hero" id="top" aria-labelledby="ph-hero-title">
	<div class="ph-container ph-hero__inner">
		<div class="ph-hero__content">
			<p class="ph-hero__eyebrow">Studio vidéo pour les entreprises</p>
			<h1 class="ph-hero__title" id="ph-hero-title">Donnez vie à vos idées en vidéo</h1>
			<p class="ph-hero__lead">Tutoriel, formation, procédure, présentation de produit : Nous réalisons des vidéos animées adaptées à vos besoins et à votre activité.</p>
			<div class="ph-actions">
				<a class="ph-btn ph-btn--primary ph-btn--lg" href="<?php echo esc_url( phaness_booking_href() ); ?>"<?php echo phaness_booking_attributes(); ?>>Prendre rendez-vous</a>
				<a class="ph-btn ph-btn--ghost ph-btn--lg" href="#realisations">Voir nos réalisations</a>
			</div>
		</div>
		<div class="ph-presentation">
			<?php if ( $phaness_presentation_url ) : ?>
				<video class="ph-presentation__video" src="<?php echo $phaness_presentation_url; ?>"<?php echo $phaness_presentation_poster ? ' poster="' . $phaness_presentation_poster . '"' : ''; ?> controls playsinline preload="none" aria-label="Vidéo de présentation de Phaness"></video>
			<?php else : ?>
				<div class="ph-presentation__placeholder" role="img" aria-label="Emplacement de la vidéo de présentation de Phaness">
					<span class="ph-presentation__play" aria-hidden="true"></span>
					<p>Phaness en vidéo</p>
				</div>
			<?php endif; ?>
		</div>
	</div>
</section>
<!-- /wp:html -->
