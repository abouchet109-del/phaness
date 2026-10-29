<?php
/**
 * Title: Footer
 * Slug: phaness/footer
 * Categories: phaness
 * Inserter: no
 */
$phaness_home = esc_url( home_url( '/' ) );
?>
<!-- wp:html -->
<div class="ph-footer">
	<div class="ph-container ph-footer__inner">
		<div class="ph-footer__brand">
			<a class="ph-logo" href="<?php echo $phaness_home; ?>#top">phaness</a>
			<p>Donnez vie à vos idées en vidéo</p>
		</div>
		<nav class="ph-footer__nav" aria-label="Liens du pied de page">
			<ul role="list">
				<li><a href="<?php echo esc_url( home_url( '/mentions-legales/' ) ); ?>">Mentions légales</a></li>
				<li><a href="<?php echo esc_url( home_url( '/politique-de-confidentialite/' ) ); ?>">Politique de confidentialité</a></li>
				<li><a href="<?php echo esc_url( phaness_booking_href() ); ?>"<?php echo phaness_booking_attributes(); ?>>Prendre rendez-vous</a></li>
			</ul>
		</nav>
	</div>
	<div class="ph-container">
		<p class="ph-footer__legal">© 2026 Phaness. Phaness est une marque de [À FOURNIR : raison sociale de l'entreprise porteuse].</p>
	</div>
</div>
<!-- /wp:html -->
