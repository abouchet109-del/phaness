<?php
/**
 * Phaness theme setup. Keep this file minimal: content lives in templates and patterns.
 */

add_action( 'after_setup_theme', function () {
	add_theme_support( 'wp-block-styles' );
	add_theme_support( 'responsive-embeds' );
} );

add_action( 'wp_enqueue_scripts', function () {
	$version = wp_get_theme()->get( 'Version' );
	wp_enqueue_style( 'phaness-site', get_theme_file_uri( 'assets/css/site.css' ), array(), $version );
	wp_enqueue_script_module( 'phaness-site', get_theme_file_uri( 'assets/js/site.js' ), array(), $version );
} );

add_action( 'init', function () {
	register_block_pattern_category( 'phaness', array( 'label' => 'Phaness' ) );
} );

/**
 * Render one demo video card. Falls back to a placeholder poster when the render is not synced yet.
 *
 * @param string $slug  File name in assets/video/ (without extension).
 * @param string $offer Offer label.
 * @param string $title Video title.
 * @param string $text  Caption.
 */
function phaness_video_card( $slug, $offer, $title, $text ) {
	$dir     = 'assets/video/' . $slug;
	$has_mp4 = file_exists( get_theme_file_path( $dir . '.mp4' ) );
	$has_img = file_exists( get_theme_file_path( $dir . '.webp' ) );
	$label   = 'Vidéo de démonstration : ' . $title;
	?>
	<article class="ph-work" id="realisation-<?php echo esc_attr( $slug ); ?>">
		<div class="ph-work__media<?php echo $has_mp4 ? '' : ' is-pending'; ?>">
			<?php if ( $has_mp4 ) : ?>
				<video class="ph-work__video" muted loop playsinline preload="none" aria-label="<?php echo esc_attr( $label ); ?>"<?php echo $has_img ? ' poster="' . esc_url( get_theme_file_uri( $dir . '.webp' ) ) . '"' : ''; ?> width="1280" height="720">
					<source src="<?php echo esc_url( get_theme_file_uri( $dir . '.mp4' ) ); ?>" type="video/mp4">
				</video>
				<button class="ph-work__play" type="button" aria-label="<?php echo esc_attr( 'Lire la ' . lcfirst( $label ) ); ?>" aria-pressed="false">
					<span class="ph-work__play-icon" aria-hidden="true"></span>
				</button>
			<?php else : ?>
				<div class="ph-work__placeholder" role="img" aria-label="<?php echo esc_attr( $label ); ?>"><span class="ph-orb ph-orb--glow" aria-hidden="true"></span></div>
			<?php endif; ?>
			<span class="ph-badge">Démonstration</span>
		</div>
		<div class="ph-work__body">
			<p class="ph-work__offer"><?php echo esc_html( $offer ); ?></p>
			<h3 class="ph-work__title"><?php echo esc_html( $title ); ?></h3>
			<p class="ph-work__text"><?php echo esc_html( $text ); ?></p>
		</div>
	</article>
	<?php
}
