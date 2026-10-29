<?php
/**
 * Title: Offers (our videos)
 * Slug: phaness/offers
 * Categories: phaness
 * Inserter: no
 */
$phaness_offers = array(
	array( 'Former', 'Capsules pédagogiques', 'Des modules courts pour transmettre un savoir et le faire retenir.', 'Introduction à l’intelligence artificielle', 'former-electricite' ),
	array( 'Sécuriser', 'Procédures et sécurité', 'Modes opératoires, consignes HSE, sensibilisation : les bons gestes, montrés pas à pas.', 'Les équipements de protection individuelle sur un chantier', 'securiser-usine' ),
	array( 'Expliquer et vendre', 'Produits et solutions techniques', 'Montrer ce qui ne se voit pas : le fonctionnement d\'un produit et ce qu\'il apporte.', 'Comprendre la rénovation énergétique', 'expliquer-pac' ),
	array( 'Accompagner', 'Tutoriels', 'Installation, utilisation, entretien : des tutoriels que vos clients revoient quand ils en ont besoin.', 'Utiliser une pompe à chaleur', 'accompagner-solaire' ),
);
?>
<!-- wp:html -->
<section class="ph-section ph-offers" id="videos" aria-labelledby="ph-offers-title">
	<div class="ph-container">
		<header class="ph-head">
			<p class="ph-eyebrow">Nos vidéos</p>
			<h2 class="ph-title" id="ph-offers-title">Des vidéos pour vos équipes et vos clients</h2>
			<p class="ph-lead">Tutoriels et vidéos explicatives en motion design 3D, pensés pour vos équipes, vos apprenants et vos clients.</p>
		</header>
		<ul class="ph-grid ph-grid--2 ph-offer-list" role="list">
			<?php foreach ( $phaness_offers as $i => $offer ) : ?>
			<li class="ph-card ph-offer">
				<span class="ph-offer__num" aria-hidden="true"><?php echo esc_html( sprintf( '%02d', $i + 1 ) ); ?></span>
				<h3 class="ph-offer__name"><?php echo esc_html( $offer[0] ); ?></h3>
				<p class="ph-offer__sub"><?php echo esc_html( $offer[1] ); ?></p>
				<p class="ph-offer__text"><?php echo esc_html( $offer[2] ); ?></p>
				<p class="ph-offer__example"><span>Exemple :</span> <a href="#realisation-<?php echo esc_attr( $offer[4] ); ?>"><?php echo esc_html( $offer[3] ); ?></a></p>
			</li>
			<?php endforeach; ?>
		</ul>
	</div>
</section>
<!-- /wp:html -->
