<?php
/**
 * SEO: title, description, canonical, Open Graph, Twitter Card, JSON-LD Organization, favicon, lang.
 * Texts come from docs/CONTENU.md section 12.
 */

const PHANESS_SITE_NAME   = 'Phaness';
const PHANESS_SEO_TITLE   = 'Phaness – Vidéos explicatives et tutoriels pour entreprises';
const PHANESS_SEO_DESC    = 'Vidéos explicatives et tutoriels en motion design 3D pour la formation, le BTP, l\'industrie et l\'énergie. Clairs, faciles à renouveler. Devis sur mesure.';
const PHANESS_OG_TITLE    = 'Phaness – Des vidéos explicatives professionnelles, simplement.';
const PHANESS_OG_ALT      = 'Une lumière vermillon émerge d\'une forme organique dans les nuages.';
const PHANESS_ORG_DESC    = 'Studio de vidéos explicatives et de tutoriels en motion design 3D pour les entreprises.';
const PHANESS_LEGAL_DESCS = array(
	'mentions-legales'             => 'Mentions légales du site phaness.fr : éditeur, hébergeur et propriété intellectuelle.',
	'politique-de-confidentialite' => 'Politique de confidentialité de phaness.fr : données traitées, sous-traitants, cookies et vos droits.',
);

// The site is in French whatever the WordPress locale says.
add_filter( 'language_attributes', function ( $output ) {
	return preg_match( '/lang="[^"]*"/', $output ) ? preg_replace( '/lang="[^"]*"/', 'lang="fr"', $output ) : trim( $output . ' lang="fr"' );
} );

add_filter( 'pre_get_document_title', function ( $title ) {
	if ( is_front_page() ) {
		return PHANESS_SEO_TITLE;
	}
	if ( is_singular() ) {
		return single_post_title( '', false ) . ' – ' . PHANESS_SITE_NAME;
	}
	return $title;
} );

/**
 * Canonical URL of the current page.
 */
function phaness_canonical_url() {
	if ( is_front_page() ) {
		return home_url( '/' );
	}
	if ( is_singular() ) {
		return get_permalink();
	}
	return '';
}

function phaness_meta_description() {
	if ( is_front_page() ) {
		return PHANESS_SEO_DESC;
	}
	if ( is_singular() ) {
		$slug = get_post_field( 'post_name', get_queried_object_id() );
		return PHANESS_LEGAL_DESCS[ $slug ] ?? '';
	}
	return '';
}

// Core prints its own canonical on singular pages: replace it with ours so there is only one.
add_action( 'wp', function () {
	remove_action( 'wp_head', 'rel_canonical' );
} );

add_action( 'wp_head', function () {
	$canonical   = phaness_canonical_url();
	$description = phaness_meta_description();
	$is_front    = is_front_page();
	$title       = $is_front ? PHANESS_OG_TITLE : wp_get_document_title();
	$image       = get_theme_file_uri( 'assets/img/og.png' );

	echo "\n<!-- Phaness SEO -->\n";
	if ( '' !== $description ) {
		echo '<meta name="description" content="' . esc_attr( $description ) . "\">\n";
	}
	if ( '' !== $canonical ) {
		echo '<link rel="canonical" href="' . esc_url( $canonical ) . "\">\n";
	}

	$og = array(
		'og:locale'       => 'fr_FR',
		'og:type'         => 'website',
		'og:site_name'    => PHANESS_SITE_NAME,
		'og:title'        => $title,
		'og:description'  => $description,
		'og:url'          => $canonical,
		'og:image'        => $image,
		'og:image:type'   => 'image/png',
		'og:image:width'  => '1200',
		'og:image:height' => '630',
		'og:image:alt'    => PHANESS_OG_ALT,
	);
	foreach ( $og as $property => $content ) {
		if ( '' !== $content ) {
			echo '<meta property="' . esc_attr( $property ) . '" content="' . esc_attr( $content ) . "\">\n";
		}
	}
	$twitter = array(
		'twitter:card'        => 'summary_large_image',
		'twitter:title'       => $title,
		'twitter:description' => $description,
		'twitter:image'       => $image,
		'twitter:image:alt'   => PHANESS_OG_ALT,
	);
	foreach ( $twitter as $name => $content ) {
		if ( '' !== $content ) {
			echo '<meta name="' . esc_attr( $name ) . '" content="' . esc_attr( $content ) . "\">\n";
		}
	}

	echo '<link rel="icon" type="image/svg+xml" href="' . esc_url( get_theme_file_uri( 'assets/img/favicon.svg' ) ) . "\">\n";
	echo '<meta name="theme-color" content="#F5F7FB">' . "\n";

	if ( $is_front ) {
		$org = array(
			'@context'    => 'https://schema.org',
			'@type'       => 'Organization',
			'name'        => PHANESS_SITE_NAME,
			'url'         => 'https://phaness.fr',
			'logo'        => get_theme_file_uri( 'assets/img/favicon.svg' ),
			'description' => PHANESS_ORG_DESC,
			'legalName'   => trim( PHANESS_LEGAL_NAME ),
			'email'       => is_email( trim( PHANESS_CONTACT_EMAIL ) ) ? trim( PHANESS_CONTACT_EMAIL ) : '',
			'telephone'   => trim( PHANESS_CONTACT_PHONE ),
		);
		// Empty values ([À FOURNIR]) are left out rather than published blank.
		$org = array_filter( $org, function ( $value ) {
			return '' !== $value;
		} );
		echo '<script type="application/ld+json">' . wp_json_encode( $org, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT ) . "</script>\n";
	}
	echo "<!-- /Phaness SEO -->\n";
}, 5 );
