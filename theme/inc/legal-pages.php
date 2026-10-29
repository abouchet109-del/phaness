<?php
/**
 * Legal pages (mentions légales, politique de confidentialité).
 * Created once when the theme is activated. The text lives in patterns/legal-*.php, so editing the
 * theme files is enough to change it: each page only holds a reference to its pattern.
 */

/**
 * Slug => title and pattern of each legal page.
 */
function phaness_legal_pages() {
	return array(
		'mentions-legales'             => array(
			'title'   => 'Mentions légales',
			'pattern' => 'phaness/legal-mentions',
		),
		'politique-de-confidentialite' => array(
			'title'   => 'Politique de confidentialité',
			'pattern' => 'phaness/legal-privacy',
		),
	);
}

/**
 * Create the legal pages that do not exist yet. Safe to run any number of times.
 */
function phaness_ensure_legal_pages() {
	foreach ( phaness_legal_pages() as $slug => $page ) {
		$existing = get_posts(
			array(
				'name'           => $slug,
				'post_type'      => 'page',
				'post_status'    => array( 'publish', 'draft', 'pending', 'private', 'future' ),
				'posts_per_page' => 1,
				'fields'         => 'ids',
			)
		);
		if ( ! empty( $existing ) ) {
			continue;
		}
		wp_insert_post(
			array(
				'post_type'      => 'page',
				'post_status'    => 'publish',
				'post_name'      => $slug,
				'post_title'     => $page['title'],
				'post_content'   => '<!-- wp:pattern {"slug":"' . $page['pattern'] . '"} /-->',
				'comment_status' => 'closed',
				'ping_status'    => 'closed',
			)
		);
	}
	update_option( 'phaness_legal_pages_created', 1, false );
}

// On activation of the theme.
add_action( 'after_switch_theme', 'phaness_ensure_legal_pages' );

// Safety net for a theme that was already active (or mounted) before this code existed: runs once.
add_action( 'init', function () {
	if ( ! get_option( 'phaness_legal_pages_created' ) ) {
		phaness_ensure_legal_pages();
	}
}, 20 );
