<?php
/**
 * Title: Contact
 * Slug: phaness/contact
 * Categories: phaness
 * Inserter: no
 */
?>
<!-- wp:html -->
<section class="ph-section ph-contact" id="contact" aria-labelledby="ph-contact-title">
	<div class="ph-container">
		<div class="ph-card ph-contact__card">
			<span class="ph-contact__glow" aria-hidden="true"></span>
			<div class="ph-contact__main">
				<p class="ph-eyebrow">Contact</p>
				<h2 class="ph-title" id="ph-contact-title">Parlons de votre projet</h2>
				<p class="ph-lead">Chaque projet est différent. Réservez un premier échange : nous établissons ensuite un devis personnalisé selon vos besoins.</p>
				<div class="ph-actions">
					<a class="ph-btn ph-btn--primary ph-btn--lg" href="<?php echo esc_url( phaness_booking_href() ); ?>"<?php echo phaness_booking_attributes(); ?>>Prendre rendez-vous</a>
				</div>
				<?php if ( phaness_cal_config() ) : ?>
					<p class="ph-note">Le module de réservation Cal.com se charge au clic. En savoir plus dans notre <a href="<?php echo esc_url( home_url( '/politique-de-confidentialite/' ) ); ?>">politique de confidentialité</a>.</p>
				<?php else : ?>
					<p class="ph-note">Lien Cal.com : <span class="ph-todo">[À FOURNIR]</span></p>
				<?php endif; ?>
			</div>
			<dl class="ph-contact__details" id="contact-details">
				<div>
					<dt>Email</dt>
					<dd><?php echo phaness_contact_link( 'email' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></dd>
				</div>
				<div>
					<dt>Téléphone</dt>
					<dd><?php echo phaness_contact_link( 'tel' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></dd>
				</div>
				<div>
					<dt>Zone d'intervention</dt>
					<dd>[À FOURNIR]</dd>
				</div>
			</dl>
		</div>
	</div>
</section>
<!-- /wp:html -->
