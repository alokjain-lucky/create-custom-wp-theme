import { useBlockProps } from '@wordpress/block-editor';
import './style.scss';

export default function Edit() {
    return (
        <div {...useBlockProps()}>
            <p>{{ block_title }} – hello from the editor!</p>
        </div>
    );
}
