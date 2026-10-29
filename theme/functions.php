<?php
/**
 * Phaness theme setup. Keep this file minimal: content lives in templates and patterns.
 */

/**
 * Site settings to fill in before going live. Empty means "[À FOURNIR]": the theme shows a clean fallback.
 * Each one can also be defined earlier (wp-config.php) to override the value here.
 */
if ( ! defined( 'PHANESS_CAL_URL' ) ) {
	// Cal.com booking page, e.g. https://cal.com/your-name/30min. Nothing is loaded from Cal.com before a visitor clicks.
	define( 'PHANESS_CAL_URL', '' );
}
if ( ! defined( 'PHANESS_CONTACT_EMAIL' ) ) {
	define( 'PHANESS_CONTACT_EMAIL', 'contact@phanes.fr' );
}
if ( ! defined( 'PHANESS_CONTACT_PHONE' ) ) {
	define( 'PHANESS_CONTACT_PHONE', '07 69 86 01 61' );
}
if ( ! defined( 'PHANESS_LEGAL_NAME' ) ) {
	define( 'PHANESS_LEGAL_NAME', '' );
}
// The team supplies the introduction film separately. Keep its player unloaded until requested.
if ( ! defined( 'PHANESS_PRESENTATION_VIDEO_URL' ) ) {
	define( 'PHANESS_PRESENTATION_VIDEO_URL', '' );
}
if ( ! defined( 'PHANESS_PRESENTATION_POSTER_URL' ) ) {
	define( 'PHANESS_PRESENTATION_POSTER_URL', '' );
}

add_action( 'after_setup_theme', function () {
	add_theme_support( 'wp-block-styles' );
	add_theme_support( 'responsive-embeds' );
	add_theme_support( 'title-tag' );
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
 * @param string $text  Optional caption.
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
			<?php if ( '' !== $text ) : ?>
				<p class="ph-work__text"><?php echo esc_html( $text ); ?></p>
			<?php endif; ?>
		</div>
	</article>
	<?php
}

require_once get_theme_file_path( 'inc/cleanup.php' );
require_once get_theme_file_path( 'inc/legal-pages.php' );
require_once get_theme_file_path( 'inc/seo.php' );

/**
 * Contact value or the "[À FOURNIR]" placeholder, as safe HTML. $kind is 'email' or 'tel'.
 */
function phaness_contact_link( $kind ) {
	if ( 'email' === $kind ) {
		$value = trim( PHANESS_CONTACT_EMAIL );
		if ( is_email( $value ) ) {
			return '<a href="' . esc_url( 'mailto:' . $value ) . '">' . esc_html( $value ) . '</a>';
		}
	} else {
		$value = trim( PHANESS_CONTACT_PHONE );
		$dial  = preg_replace( '/[^\d+]/', '', $value );
		if ( '' !== $dial ) {
			return '<a href="' . esc_url( 'tel:' . $dial ) . '">' . esc_html( $value ) . '</a>';
		}
	}
	return '<span class="ph-todo">[À FOURNIR]</span>';
}

/**
 * Cal.com booking settings for the front end, or null while PHANESS_CAL_URL is empty.
 * Accepts https://cal.com/name/event (or a self-hosted https://host/name/event).
 */
function phaness_cal_config() {
	$url = trim( PHANESS_CAL_URL );
	if ( '' === $url ) {
		return null;
	}
	$parts = wp_parse_url( $url );
	if ( empty( $parts['host'] ) || empty( $parts['path'] ) || 'https' !== ( $parts['scheme'] ?? '' ) ) {
		return null;
	}
	$link = trim( $parts['path'], '/' );
	if ( '' === $link ) {
		return null;
	}
	$host = $parts['host'];
	return array(
		'url'    => esc_url_raw( $url ),
		'link'   => $link,
		'origin' => in_array( $host, array( 'cal.com', 'www.cal.com', 'app.cal.com' ), true ) ? 'https://app.cal.com' : 'https://' . $host,
	);
}

/**
 * Booking destination. Until the team supplies its Cal.com URL, send visitors to the contact details.
 */
function phaness_booking_href() {
	$config = phaness_cal_config();
	return $config ? $config['url'] : home_url( '/#contact-details' );
}

/**
 * Mark links that can open the Cal.com dialog. No third-party content loads before a click.
 */
function phaness_booking_attributes() {
	return phaness_cal_config() ? ' data-booking' : '';
}

// Front page vs inner pages: inner pages keep the header on its solid background from the start.
add_filter( 'body_class', function ( $classes ) {
	$classes[] = is_front_page() ? 'ph-front' : 'ph-subpage';
	return $classes;
} );
