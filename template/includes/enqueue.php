<?php

function {{function_prefix}}_enqueue_assets() {
    // Note: We now look in the '/build' directory
    $asset_file = get_template_directory() . '/build/index.asset.php';

    if ( file_exists( $asset_file ) ) {
        $asset = include $asset_file;

        wp_enqueue_style(
            '{{theme_slug}}-main',
            get_template_directory_uri() . '/build/index.css',
            array(),
            $asset['version']
        );
        
        // This is where our JS will load
        wp_enqueue_script(
            '{{theme_slug}}-script',
            get_template_directory_uri() . '/build/index.js',
            $asset['dependencies'],
            $asset['version'],
            true
        );
    }
}
add_action( 'wp_enqueue_scripts', '{{function_prefix}}_enqueue_assets' );
