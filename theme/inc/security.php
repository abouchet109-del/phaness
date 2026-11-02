<?php
/**
 * Narrow protections for this showcase. Hosting and account security stay separate.
 * These filters apply only while this theme is active; they are not a firewall.
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Public document headers. Preserve policies already supplied by WordPress plugins.
 * No script/style restrictions: core's block styles and editor must keep working.
 */
function phaness_public_security_headers( $headers ) {
	if ( is_admin() || wp_doing_ajax() || wp_is_json_request() || is_customize_preview() ) {
		return $headers;
	}
	$defaults = array(
		'X-Content-Type-Options'  => 'nosniff',
		'Referrer-Policy'         => 'no-referrer',
		'X-Frame-Options'         => 'SAMEORIGIN',
		'Content-Security-Policy' => "base-uri 'self'; object-src 'none'; frame-ancestors 'self'; frame-src 'self' https://calendly.com",
		'Permissions-Policy'     => 'camera=(), microphone=(), geolocation=(), payment=()',
	);
	$existing = array_change_key_case( $headers, CASE_LOWER );
	foreach ( $defaults as $name => $value ) {
		if ( ! array_key_exists( strtolower( $name ), $existing ) ) {
			$headers[ $name ] = $value;
		}
	}
	foreach ( array_keys( $headers ) as $name ) {
		if ( 'x-pingback' === strtolower( $name ) ) {
			unset( $headers[ $name ] );
		}
	}
	return $headers;
}
add_filter( 'wp_headers', 'phaness_public_security_headers', 100 );

// No public discussion on the showcase, including on old or imported content.
add_filter( 'comments_open', '__return_false', 20 );
add_filter( 'pings_open', '__return_false', 20 );
add_filter( 'xmlrpc_methods', function ( $methods ) {
	unset( $methods['pingback.ping'], $methods['pingback.extensions.getPingbacks'] );
	return $methods;
} );

// Avoid third-party avatar requests, including those from the admin toolbar.
add_filter( 'pre_option_show_avatars', '__return_zero' );
