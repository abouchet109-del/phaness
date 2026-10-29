<?php
/**
 * Lighter front end: drop what a one-page showcase never uses.
 * Everything here only removes output; none of it touches editor or admin features we rely on.
 */

// Emojis: detection script, inline styles, feeds and email conversions, editor plugin.
add_action( 'init', function () {
	remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
	remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
	remove_action( 'wp_print_styles', 'print_emoji_styles' );
	remove_action( 'admin_print_styles', 'print_emoji_styles' );
	remove_action( 'embed_head', 'print_emoji_detection_script' );
	remove_filter( 'the_content_feed', 'wp_staticize_emoji' );
	remove_filter( 'comment_text_rss', 'wp_staticize_emoji' );
	remove_filter( 'wp_mail', 'wp_staticize_emoji_for_email' );
	add_filter( 'emoji_svg_url', '__return_false' );
	add_filter( 'tiny_mce_plugins', function ( $plugins ) {
		return is_array( $plugins ) ? array_diff( $plugins, array( 'wpemoji' ) ) : $plugins;
	} );
} );

// oEmbed: discovery links, host script, REST route. The site embeds nothing.
add_action( 'init', function () {
	remove_action( 'wp_head', 'wp_oembed_add_discovery_links' );
	remove_action( 'wp_head', 'wp_oembed_add_host_js' );
	remove_action( 'rest_api_init', 'wp_oembed_register_route' );
	add_filter( 'embed_oembed_discover', '__return_false' );
}, 9999 );

// Head clutter: generator, RSD, Windows Live Writer, shortlink, feed links (no blog on this site).
add_action( 'init', function () {
	remove_action( 'wp_head', 'wp_generator' );
	remove_action( 'wp_head', 'rsd_link' );
	remove_action( 'wp_head', 'wlwmanifest_link' );
	remove_action( 'wp_head', 'wp_shortlink_wp_head' );
	remove_action( 'wp_head', 'feed_links', 2 );
	remove_action( 'wp_head', 'feed_links_extra', 3 );
} );
add_filter( 'the_generator', '__return_empty_string' );

// Styles the theme does not use: the classic-theme compatibility sheet and the block-library "theme" sheet.
// The block library sheet itself stays: core only loads the rules of blocks actually on the page.
add_action( 'wp_enqueue_scripts', function () {
	wp_dequeue_style( 'classic-theme-styles' );
	wp_dequeue_style( 'wp-block-library-theme' );
}, 100 );
