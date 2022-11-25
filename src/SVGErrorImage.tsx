import type {SVGImageProps} from './types';
import {xmlns} from '../lib/xmlns';

export const SVGErrorImage = ({src, alt, nonce, onDataError, ...props}: SVGImageProps) => (
    <svg xmlns={xmlns} {...props} ref={element => element && onDataError?.()}>
        {alt && <title>{alt}</title>}
    </svg>
);
