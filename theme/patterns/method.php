<?php
/**
 * Title: Method (six steps)
 * Slug: phaness/method
 * Categories: phaness
 * Inserter: no
 */
$phaness_steps = array(
	array( 'Brief', 'Nous échangeons sur votre objectif, votre public et le message à faire passer.' ),
	array( 'Collecte des supports', 'Vous nous transmettez vos documents existants : notices, procédures, plans, photos.' ),
	array( 'Script', 'Nous rédigeons le script et le découpage, que vous validez avant toute animation.' ),
	array( 'Production', 'Nous réalisons l\'animation en motion design 3D, à partir de nos formats standardisés.' ),
	array( 'Retours', 'Vous regroupez vos remarques en [À CONFIRMER : nombre] séries de retours, fixées dès le devis.' ),
	array( 'Livraison', 'Vous recevez la vidéo finale, prête à diffuser sur vos supports.' ),
);
?>
<!-- wp:html -->
<section class="ph-section ph-method" id="methode" aria-labelledby="ph-method-title">
	<div class="ph-container">
		<header class="ph-head">
			<p class="ph-eyebrow">Méthode</p>
			<h2 class="ph-title" id="ph-method-title">Une méthode simple, en six étapes</h2>
			<p class="ph-lead">Vous savez à tout moment où en est votre vidéo.</p>
		</header>
		<ol class="ph-steps">
			<?php foreach ( $phaness_steps as $i => $step ) : ?>
			<li class="ph-step">
				<span class="ph-step__num" aria-hidden="true"><?php echo (int) ( $i + 1 ); ?></span>
				<h3 class="ph-step__name"><?php echo esc_html( $step[0] ); ?></h3>
				<p class="ph-step__text"><?php echo esc_html( $step[1] ); ?></p>
			</li>
			<?php endforeach; ?>
		</ol>
	</div>
</section>
<!-- /wp:html -->
