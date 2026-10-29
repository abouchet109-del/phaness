<?php
/**
 * Phaness theme setup. Keep this file minimal: content lives in templates and patterns.
 */

add_action( 'after_setup_theme', function () {
	add_theme_support( 'wp-block-styles' );
	add_theme_support( 'responsive-embeds' );
} );
