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
 * Match a complete theme pattern reference, never an editor's surrounding copy.
 */
function phaness_is_legal_reference( $content, $pattern ) {
	$blocks = parse_blocks( trim( $content ) );
	return 1 === count( $blocks )
		&& 'core/pattern' === $blocks[0]['blockName']
		&& $pattern === ( $blocks[0]['attrs']['slug'] ?? '' )
		&& empty( $blocks[0]['innerBlocks'] )
		&& '' === trim( $blocks[0]['innerHTML'] );
}

/**
 * Create the legal pages that do not exist yet. Safe to run any number of times.
 */
function phaness_ensure_legal_pages() {
	foreach ( phaness_legal_pages() as $slug => $page ) {
		$reference = '<!-- wp:pattern {"slug":"' . $page['pattern'] . '"} /-->';
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
			// Keep generated pages linked to the theme. Only migrate exact snapshots
			// of the current pattern; an editor's custom content must remain intact.
			$post = get_post( $existing[0] );
			$pattern = WP_Block_Patterns_Registry::get_instance()->get_registered( $page['pattern'] );
			if ( $post && ( '' === trim( $post->post_content ) || ( $pattern && trim( $post->post_content ) === trim( $pattern['content'] ) ) ) ) {
				wp_update_post(
					array(
						'ID'           => $post->ID,
						'post_content' => $reference,
					)
				);
			}
			continue;
		}
		wp_insert_post(
			array(
				'post_type'      => 'page',
				'post_status'    => 'publish',
				'post_name'      => $slug,
				'post_title'     => $page['title'],
				'post_content'   => $reference,
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
	if ( 3 !== (int) get_option( 'phaness_legal_pages_version' ) ) {
		phaness_ensure_legal_pages();
		update_option( 'phaness_legal_pages_version', 3, false );
	}
}, 20 );

// Resolve theme-owned references before core renders the content. This keeps
// the legal pages in sync with the theme without overwriting editor changes.
add_filter( 'the_content', function ( $content ) {
	if ( ! is_page() ) {
		return $content;
	}
	$slug = get_post_field( 'post_name', get_queried_object_id() );
	$pages = phaness_legal_pages();
	if ( ! isset( $pages[ $slug ] ) || ( '' !== trim( $content ) && ! phaness_is_legal_reference( $content, $pages[ $slug ]['pattern'] ) ) ) {
		return $content;
	}
	$pattern = WP_Block_Patterns_Registry::get_instance()->get_registered( $pages[ $slug ]['pattern'] );
	return $pattern && ! empty( $pattern['content'] ) ? do_blocks( $pattern['content'] ) : $content;
}, 5 );
