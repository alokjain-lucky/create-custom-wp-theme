import { useBlockProps } from '@wordpress/block-editor';

export default function save() {
    return (
        <div {...useBlockProps.save()}>
            <p>{{ block_title }} – hello from the saved content!</p>
        </div>
    );
}
