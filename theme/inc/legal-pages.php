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
			// Earlier WIP builds created pages with a pattern reference that was not
			// expanded by WordPress. Repair only those empty/theme-owned pages; never
			// replace copy that an editor has entered.
			$post = get_post( $existing[0] );
			if ( $post && ( '' === trim( $post->post_content ) || false !== strpos( $post->post_content, $page['pattern'] ) ) ) {
				$pattern = WP_Block_Patterns_Registry::get_instance()->get_registered( $page['pattern'] );
				if ( $pattern && ! empty( $pattern['content'] ) ) {
					wp_update_post(
						array(
							'ID'           => $post->ID,
							'post_content' => $pattern['content'],
						)
					);
				}
			}
			continue;
		}
		$pattern = WP_Block_Patterns_Registry::get_instance()->get_registered( $page['pattern'] );
		$content = $pattern && ! empty( $pattern['content'] ) ? $pattern['content'] : '<!-- wp:pattern {"slug":"' . $page['pattern'] . '"} /-->';
		wp_insert_post(
			array(
				'post_type'      => 'page',
				'post_status'    => 'publish',
				'post_name'      => $slug,
				'post_title'     => $page['title'],
				'post_content'   => $content,
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
	if ( 2 !== (int) get_option( 'phaness_legal_pages_version' ) ) {
		phaness_ensure_legal_pages();
		update_option( 'phaness_legal_pages_version', 2, false );
	}
}, 20 );

// A pattern reference is editor metadata, not a front-end block. Resolve old
// references at render time as well, so existing installations show the page
// while the one-time repair above updates their stored content.
add_filter( 'the_content', function ( $content ) {
	if ( ! is_page() ) {
		return $content;
	}
	$slug = get_post_field( 'post_name', get_queried_object_id() );
	$pages = phaness_legal_pages();
	if ( ! isset( $pages[ $slug ] ) || ( '' !== trim( $content ) && false === strpos( $content, $pages[ $slug ]['pattern'] ) ) ) {
		return $content;
	}
	$pattern = WP_Block_Patterns_Registry::get_instance()->get_registered( $pages[ $slug ]['pattern'] );
	return $pattern && ! empty( $pattern['content'] ) ? do_blocks( $pattern['content'] ) : $content;
}, 5 );
