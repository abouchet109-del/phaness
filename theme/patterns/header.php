<?php
/**
 * Title: Header
 * Slug: phaness/header
 * Categories: phaness
 * Inserter: no
 */
$phaness_home = esc_url( home_url( '/' ) );
?>
<!-- wp:html -->
<a class="ph-skip" href="#contenu">Aller au contenu</a>
<div class="ph-header" data-header>
	<div class="ph-header__inner">
		<a class="ph-logo" href="<?php echo $phaness_home; ?>#top" aria-label="phaness, retour en haut de page">phaness</a>
		<button class="ph-menu-toggle" type="button" aria-expanded="false" aria-controls="ph-nav" data-open-label="Menu" data-close-label="Fermer le menu">
			<span class="ph-menu-toggle__bars" aria-hidden="true"></span>
			<span class="ph-menu-toggle__label">Menu</span>
		</button>
		<nav class="ph-nav" id="ph-nav" aria-label="Navigation principale">
			<ul class="ph-nav__list">
				<li><a href="<?php echo $phaness_home; ?>#videos">Nos vidéos</a></li>
				<li><a href="<?php echo $phaness_home; ?>#secteurs">Secteurs</a></li>
				<li><a href="<?php echo $phaness_home; ?>#methode">Méthode</a></li>
				<li><a href="<?php echo $phaness_home; ?>#realisations">Réalisations</a></li>
				<li><a href="<?php echo $phaness_home; ?>#contact">Contact</a></li>
			</ul>
			<a class="ph-btn ph-btn--primary ph-nav__cta" href="<?php echo esc_url( phaness_booking_href() ); ?>"<?php echo phaness_booking_attributes(); ?>>Prendre rendez-vous</a>
		</nav>
	</div>
</div>
<!-- /wp:html -->
